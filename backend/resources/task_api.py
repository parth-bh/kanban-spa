from flask import Flask, appcontext_popped
from flask_restful import Resource, Api, reqparse, abort, fields, marshal_with, inputs
from application.models import *
from datetime import date  
from flask_security import auth_required, current_user
from flask import current_app as app
from application.data_access import *
import datetime 

task_field = {
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

task_req_data = reqparse.RequestParser()
task_req_data.add_argument('title', required=True, help="title required")
task_req_data.add_argument('content')
task_req_data.add_argument('deadline')
task_req_data.add_argument('start_date')
task_req_data.add_argument('mark_as_complete', type=inputs.boolean,required=True)
task_req_data.add_argument('list_id')
task_req_data.add_argument('user_id')


class ListTask(Resource):
	
	method_decorators = {
		'get': [marshal_with(task_field), auth_required('token')],
		'post': [marshal_with(task_field), auth_required('token')],
		'put': [marshal_with(task_field), auth_required('token')],
		'delete': [auth_required('token')]
	}

	def get(self, list_id=None):
		if not list_id:
			abort(501, message="list_id is required")
		list_of_card = get_task_by_listID(current_user.id, list_id)
		return list_of_card, 200

	def post(self, list_id=None):
		if not list_id:
			abort(501, message="list_id is required for creating any task.")
		data = task_req_data.parse_args()
		today = date.today()
		completion_date = ""
		if data['mark_as_complete']: 
# if mark_as_complete = true, then completion date set to be today date
			completion_date = date.today()
		try:
			task = MainData(title=data['title'], content=data['content'], 
					deadline=data['deadline'], start_date=today, completion_date=completion_date,
					mark_as_complete=data['mark_as_complete'], list_id=list_id, user_id=current_user.id)
			db.session.add(task)
			db.session.commit()
			cache.delete_memoized(get_task_by_listID, int(current_user.id), int(list_id))
			cache.delete_memoized(get_task_by_userID, int(current_user.id))
			return task, 201
		except:
			db.session.rollback()
			abort(http_status_code=501, message="Post can't be proceed, Error while creating the task in MainData DB, pls check")

	def delete(self, list_id=None):
		if not list_id:
			abort(501, message="list_id is required for deleting task.")
		list_of_card = MainData.query.filter_by(list_id=list_id, user_id=current_user.id).all()
		try:
			if list_of_card:
				for card in list_of_card:
					db.session.delete(card)
			db.session.commit()
			cache.delete_memoized(get_task_by_listID, int(current_user.id), int(list_id))
			cache.delete_memoized(get_task_by_userID, int(current_user.id))
			return "", 200
		except:
			db.session.rollback()
			abort(501, message="Something is wrong, pls check")

	def put(self, list_id=None):
		abort(501, message="Put method not allowed.")


# ListTask is for manipulating the list and their task in the particular list ID.
# Task is for manipulating the each card.
	


class Task(Resource):
	
	method_decorators = {
		'get': [marshal_with(task_field), auth_required('token')],
		'post': [marshal_with(task_field), auth_required('token')],
		'put': [marshal_with(task_field), auth_required('token')],
		'delete': [auth_required('token')]
	}

	def get(self, task_id=None):
		if task_id:
# extract the particular task with task ID.
			card = MainData.query.filter_by(task_id=task_id).first()
			return card, 200
# if there is no task ID, then extract all the task that the particular user have.
		list_of_card = get_task_by_userID(current_user.id)
		return list_of_card, 200


	def put(self, task_id=None):
		if not task_id:
			abort(501, message="Task ID required.")
		data = task_req_data.parse_args()
		completion_date=""
		if data['mark_as_complete']:  
#  if mark_as_complete = true, then completion_date is set to be today date.
			completion_date = date.today()
		try:
			card = MainData.query.filter_by(task_id=task_id, user_id=current_user.id).first()
			list_id = card.list_id
			card.title = data['title']
			card.content = data['content']
			card.deadline = data['deadline']
			card.completion_date = completion_date
			card.mark_as_complete = data['mark_as_complete']
			if data['list_id']:
				# if user wwant to change the list id of the card, then we can change it also
				card.list_id = data['list_id']
				cache.delete_memoized(get_task_by_listID, int(current_user.id), int(data['list_id']))
			db.session.commit()
			cache.delete_memoized(get_task_by_listID, int(current_user.id), int(list_id))
			cache.delete_memoized(get_task_by_userID, int(current_user.id))
		
			return card, 201
		except:
			db.session.rollback()
			abort(http_status_code=501, message="Put can't be proceed, pls check")

	def delete(self, task_id=None):
		if not task_id:
			abort(501, message="Task ID is required.")
		card = MainData.query.filter_by(task_id=task_id, user_id=current_user.id).first()
		if not card:
			abort(501, message="No Task with given Task ID.")
		try:
			if card:
				list_id = card.list_id
				db.session.delete(card)
			db.session.commit()
			cache.delete_memoized(get_task_by_listID, int(current_user.id), int(list_id))
			cache.delete_memoized(get_task_by_userID, int(current_user.id))
			return "", 200
		except:
			db.session.rollback()
			abort(501, message="Something is wrong while deleting the task from MainData DB, pls check")

	def post(self, task_id=None):
		abort(501, message="pls use 'api/list-task/<list-id>' url for creating task")