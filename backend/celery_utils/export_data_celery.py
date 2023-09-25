from .workers import celery
from application.models import *
from .send_emails import *
import os
from .send_emails import *
from flask_restful import fields, marshal_with
import pandas as pd
from application.data_access import *

path = os.getcwd() + "/attachment/"	
# path to save the user data

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

list_field = {
    'list_id': fields.Integer,
    'list_name': fields.String,
    'user_id': fields.Integer
}

@marshal_with(task_field)
def formatChange_task_DB_to_JSON(db_data):
	return db_data

@marshal_with(list_field)
def formatChange_list_DB_to_JSON(db_data):
	return db_data

@celery.task()
def run_export_user_data(user_id, username, email, list_id=None):	
	if list_id:
		db_data = get_task_by_listID(user_id, list_id)
		file_name = 'user_data.csv'
		data= formatChange_task_DB_to_JSON(db_data)
	else:
		db_data = get_all_list(user_id)
		file_name = 'list_details.csv'
		data= formatChange_list_DB_to_JSON(db_data)
	data= pd.DataFrame(data)
	data = data.drop(['user_id'], axis=1)
	file_path = path+file_name
	data.to_csv(file_path)
	user = {"username":username, "email":email}
	status_user = {}
	status_user[user['username']] = sendEmail().send_user_data(user, file_path, file_name)
	print("STATUS OF SENDING DATA TO THE MAIL : ", status_user)
	return status_user


#-------------------------------------Creare API / END POINT URL-----

from flask_security import auth_required, current_user
from flask_restful import Resource

class SendData(Resource):
	@auth_required('token')
	def get(self, list_id=None):
		if list_id:
			result = run_export_user_data.delay(current_user.id, current_user.username, current_user.email, list_id)
		else:
			result = run_export_user_data.delay(current_user.id, current_user.username, current_user.email)
		return "Done", 200
