from flask import Flask, appcontext_popped
from flask_restful import Resource, Api, reqparse, abort, fields, marshal_with, inputs
from application.models import *
from datetime import date  
from flask_security import auth_required, current_user
from application.data_access import *
from flask import current_app as app
from datetime import datetime
from datetime import date

task_field= {
    'task_id': fields.Integer,
    'title': fields.String,
    'content': fields.String,
    'deadline': fields.String,
    'start_date': fields.String,
    'completion_date': fields.String,
    'mark_as_complete': fields.String,
    'list_id': fields.String,
    'user_id': fields.Integer
}

def check_deadline(deadline):
  x = str(deadline).split("-")
  deadline_date = datetime(int(x[0]), int(x[1]), int(x[2]))
  deadline_date = deadline_date.date()
  today = date.today()
  days = (deadline_date-today).days
  return True if(days>=0) else False

def check_completion(deadline, completion_date):
	x = str(deadline).split("-")
	deadline_date = datetime(int(x[0]), int(x[1]), int(x[2]))
	deadline_date = deadline_date.date()
	x = str(completion_date).split("-")
	comp_date = datetime(int(x[0]), int(x[1]), int(x[2]))
	comp_date = comp_date.date()
	days = (deadline_date-comp_date).days
	return True if(days>=0) else False

  
def checkProgressCompletedDeadlineCrossed(data):
	if (data.mark_as_complete==False and check_deadline(data.deadline)):
		return "progress"	
	if ((data.mark_as_complete==True) and check_deadline(data.deadline)):
			return "complete"
	if ((data.mark_as_complete==True) and check_completion(data.deadline, data.completion_date)):
			return "complete"
	return "deadline_cross"


@marshal_with(task_field)
def formatChange(card):
	return card

class ListTaskSeparation(Resource):

	method_decorators = {
		'get': [auth_required('token')],
	}

	def get(self, list_id=None):
		if not list_id:
			# list_of_card = MainData.query.filter_by(user_id=current_user.id).all()
			list_of_card = get_task_by_userID(current_user.id)
		else:
			# list_of_card = MainData.query.filter_by(list_id=list_id, user_id=current_user.id).all()
			list_of_card = get_task_by_listID(current_user.id, list_id)

		result = {}
		result['progressTask'] = []
		result['completedTask'] = []
		result['deadlineCrossTask'] = []
		for card in list_of_card:
			if checkProgressCompletedDeadlineCrossed(card)=="complete":
				result['completedTask'].append(formatChange(card))
			elif checkProgressCompletedDeadlineCrossed(card)=="progress":
				result['progressTask'].append(formatChange(card))
			elif checkProgressCompletedDeadlineCrossed(card)=="deadline_cross":
				result['deadlineCrossTask'].append(formatChange(card))
		return result, 200



# ---------------------------------------------------------------LIST WISE SUMMARY API-----


# this is for summary page

def find_list_dict(list_details):
	temp_dict = {}
	for elem in list_details:
		temp_dict[elem.list_id] = elem.list_name
	return temp_dict

def format_list_dict(list_dict):
	temp_dict={}
	for id in list_dict:
		temp_dict[id] = {'list_id':id,"list_name":list_dict[id], 'progressTask':0, 'completedTask':0, 'deadlineCrossTask':0}
	return temp_dict

def method_list_summary_dict(summary_dict, data):
	progressTaskData = data[0]['progressTask']
	completedTaskData = data[0]['completedTask']
	deadlineCrossTaskData = data[0]['deadlineCrossTask']
	if progressTaskData:
		for card in progressTaskData:
			key = card['list_id']
			summary_dict[int(key)]['progressTask']+=1
	
	if completedTaskData:
		for card in completedTaskData:
			key = card['list_id']
			summary_dict[int(key)]['completedTask']+=1

	if deadlineCrossTaskData:
		for card in deadlineCrossTaskData:
			key = card['list_id']
			summary_dict[int(key)]['deadlineCrossTask']+=1
	return summary_dict

def filter_zero_list(summary_dict):
	zero_task_list = []
	task_list = []
	for key in summary_dict:
		sum = summary_dict[key]['progressTask']+summary_dict[key]['completedTask']+summary_dict[key]['deadlineCrossTask']
		if (sum==0):
			zero_task_list.append(summary_dict[key])
		else:
			task_list.append(summary_dict[key])		
	return zero_task_list, task_list





class ListWiseSummary(Resource):
	method_decorators = {
		'get': [auth_required('token')],
	}

	def get(self, list_id=None):
		# list_details = ListDetails.query.filter_by(user_id=current_user.id)
		list_details = get_all_list(current_user.id)
		list_dict = find_list_dict(list_details)
		list_wise_summary_dict = format_list_dict(list_dict)
		job = ListTaskSeparation()
		data = job.get()
		list_wise_summary_dict = method_list_summary_dict(list_wise_summary_dict, data)
		zero_task_list, task_list = filter_zero_list(list_wise_summary_dict)
		return [zero_task_list, task_list], 200





