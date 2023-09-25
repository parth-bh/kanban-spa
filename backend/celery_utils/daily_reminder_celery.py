from .workers import celery
from application.models import *
from flask import jsonify
from datetime import datetime
from datetime import date
from .send_emails import *
import os
from application.data_access import *

from celery.schedules import crontab


def check_pendingTask(deadline):
  x = str(deadline).split("-")
  deadline_date = datetime(int(x[0]), int(x[1]), int(x[2]))
  deadline_date = deadline_date.date()
  today = date.today()
  days = (deadline_date-today).days
  return True if(days>=0) else False


@celery.task()
def run_daily_reminder():
	user_details = User.query.all()
	mailData = []
	for user in user_details:
		data={}
		data['user'] = user.username
		data['user_id'] = user.id
		data['email'] = user.email
		task_details = get_task_by_userID(user.id)		
		data['pending_task'] = []
		for task in task_details:
			temp_dict = {}
			if (check_pendingTask(task.deadline)) and (task.mark_as_complete==False):
				temp_dict['title']=task.title
				temp_dict['content']=task.content
				temp_dict['deadline']=task.deadline
			if temp_dict:
				data['pending_task'].append(temp_dict)
		mailData.append(data)
	status_mail_users = {}
	for each_user in mailData:	
		if (len(each_user['pending_task'])>0): 
			status_mail_users[each_user['user']] = sendEmail().send_daily_reminder(each_user)
	print("--------------DAILY REMINDER SENT------------------------------------------------")
	return status_mail_users


from flask import current_app as app

@celery.on_after_finalize.connect
def setup_periodic_reminder(sender, **kwargs):
	sender.add_periodic_task(crontab(hour=17, minute=00), run_daily_reminder.s(), name="Sent Daily Reminder")

# 	# -- without crontab--
	# sender.add_periodic_task(10.0, run_daily_reminder.s(), name="Daily Reminder")




	