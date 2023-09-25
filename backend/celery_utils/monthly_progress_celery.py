from .workers import celery
from application.models import *
from flask import jsonify
from datetime import datetime, timedelta
from datetime import date
from .send_emails import *
import os
from flask_restful import Resource, Api, reqparse, abort, fields, marshal_with, inputs
from .send_emails import *
from resources.task_separate_api import * 
import calendar
from matplotlib import pyplot as plt
from flask import Flask, render_template
import warnings
import base64
from application.data_access import *


# ----------------------------Functions helpful to create the data for sending mails---------

def find_startLastDate_prevMonth():
	today = datetime.now().date()
	#replace day number with 1
	dt = today.replace(day=1)
	# go back to previous month i.e. last date of previous month
	last_date_prevMonth = dt - timedelta(days=1)
	start_date_prevMonth = last_date_prevMonth.replace(day=1)
	return start_date_prevMonth, last_date_prevMonth

def filter_lastMonth_data(card):
	start_date_prevMonth, last_date_prevMonth	= find_startLastDate_prevMonth()
	x = str(card.start_date).split("-")
	card_date = datetime(int(x[0]), int(x[1]), int(x[2]))
	card_date = card_date.date()
	if ((card_date>start_date_prevMonth) and (card_date<last_date_prevMonth)):
		return True
	return False

def findUserData__forMonthlyProgress(username, user_id, email, mode):
	result = {}
	result['user'] = username
	result['user_id'] = user_id
	result['email'] = email
	result['mode'] = mode
	list_of_card = get_task_by_userID(user_id)
	result['completedTask'] = []
	result['progressTask'] = []
	result['deadlineCrossTask'] = []
	result['progressTask_count'] = 0
	result['completedTask_count'] = 0
	result['deadlineCrossTask_count'] = 0
	for card in list_of_card:
		if filter_lastMonth_data(card):
			if checkProgressCompletedDeadlineCrossed(card)=="complete":
				result['completedTask'].append(formatChange(card))
				result['completedTask_count']+=1
			elif checkProgressCompletedDeadlineCrossed(card)=="progress":
				result['progressTask'].append(formatChange(card))
				result['progressTask_count']+=1
			elif checkProgressCompletedDeadlineCrossed(card)=="deadline_cross":
				result['deadlineCrossTask'].append(formatChange(card))
				result['deadlineCrossTask_count']+=1
		else:
			pass
	result['total_task']=result['progressTask_count']+result['completedTask_count']+result['deadlineCrossTask_count']
	if (result['total_task']>0):
		result['progress_percent']= round(result['progressTask_count']/result['total_task']*100,2)
		result['completed_percent']= round(result['completedTask_count']/result['total_task']*100, 2)
		result['deadline_percent']= round(result['deadlineCrossTask_count']/result['total_task']*100, 2)
	else:
		result['progress_percent']= 0
		result['completed_percent']= 0
		result['deadline_percent']= 0		
	return result


#-----------------------------------------Creating PIE chart-------------------------------

def create_pie_chart(data, labels, month):
	warnings.filterwarnings("ignore")
	plt.pie(data, labels=labels, autopct='%1.1f%%')
	plt.title(f"Task Distribution in {month}")
	# plt.tight_layout()
	file_path = os.getcwd() + "/static/"+"pie_chart.png"
	plt.savefig(file_path)


# ---------------------------------------------Sending Mails------------------------

def send_monthly_progress(data):	
	data_for_pieChart = [data['completedTask_count'], data['progressTask_count'], data['deadlineCrossTask_count']]
	labels_for_pieChart = ['completed', 'pending', 'overdue']
	month_for_pieChart = data['month']
	if (sum(data_for_pieChart)>0):
		create_pie_chart(data_for_pieChart, labels_for_pieChart, month_for_pieChart)			
	
	image_path = os.getcwd() + "/static/"+"pie_chart.png"

	# convert image to base64 string
	with open(image_path, "rb") as img_file:
		image_string = base64.b64encode(img_file.read())
		data["image_string"] = str(image_string)[2:-1]
	data['image_path']=image_path	

	if (data['mode']=="pdf"):
		message = sendEmail().format_message('pdf_progress_report.html', data)
		#  create pdf will render the progress report html and pdf_progress_report is used to show as a email.	
		file_path, file_name = sendEmail().create_pdf_report(data, 'progress_report.html')
		status = sendEmail().send_email(
			data["email"], 
			subject=data['month']+" Progress Report", 
			message=message, content="html",
			attachment_file=file_path,
			file_name=file_name
			)
		return status
	# else if mode is html.
	message = sendEmail().format_message('progress_report.html', data)
	status = sendEmail().send_email(
			data["email"], 
			subject=data['month']+" Progress Report", 
			message=message, content="html"
			)
	return status


@celery.task()
def run_monthly_progress():	
	user_details = User.query.all()
	mailData = []
	for user in user_details:
		data= findUserData__forMonthlyProgress(user.username, user.id, user.email, user.report_format)
		start_date_prevMonth, last_date_prevMonth	= find_startLastDate_prevMonth()
		data['start_date'] = str(start_date_prevMonth.day) + "-" + str(start_date_prevMonth.month) + "-" + str(start_date_prevMonth.year)
		data['last_date'] = str(last_date_prevMonth.day) + "-" + str(last_date_prevMonth.month) + "-" + str(last_date_prevMonth.year)
		data['month'] = calendar.month_name[start_date_prevMonth.month]
		mailData.append(data)
	status_mail_users = {}
	for each_user in mailData:	 
		status_mail_users[each_user['user']] = send_monthly_progress(each_user)
	print("--------------Monthly Progress Mail Sent------------------------------------------------")
	return status_mail_users





# -----------------------------------------Schedule Part ---------------------


from flask import current_app as app

@celery.on_after_finalize.connect
def setup_periodic_reminder(sender, **kwargs):
	sender.add_periodic_task(crontab(day=1, hour=10, minute=00), run_monthly_progress.s(), name="Sent Monthly Progress Report")

	# -- without crontab--
	# sender.add_periodic_task(10.0, run_monthly_progress.s(), name="Sent Monthly Progress Report")
