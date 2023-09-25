from flask_restful import Resource, Api, reqparse, abort, fields, marshal_with, inputs
from application.models import *
from flask import current_app as app
from flask import Flask, appcontext_popped
import werkzeug
from flask_security import login_required, roles_accepted, roles_required, auth_token_required
from flask_security import auth_required, current_user
from application.data_access import *

list_field = {
    'list_id': fields.Integer,
    'list_name': fields.String,
    'user_id': fields.Integer,
}


list_req_data = reqparse.RequestParser()
list_req_data.add_argument('list_name', required=True, help="title required")
list_req_data.add_argument('user_id')


class List(Resource):
	
	method_decorators = {
		'get': [marshal_with(list_field), auth_required('token')],
		'post': [marshal_with(list_field), auth_required('token')],
		'put': [marshal_with(list_field), auth_required('token')],
		'delete': [auth_required('token')]
	}

	def get(self, list_id=None):
		if list_id:
			data = get_list_name(current_user.id, list_id)
			if not data:
				abort(501, message="No List")
			return data
		else:
			data = get_all_list(current_user.id)
			if not data:
				abort(501, message="No List")
			return data


	def put (self, list_id=None):
		if not list_id:
			abort(501, message="List id required.")
		data = list_req_data.parse_args()
		try:
			list_data = ListDetails.query.filter_by(list_id=list_id, user_id=current_user.id).first()
			list_data.list_name = data['list_name']
			db.session.commit()
			cache.delete_memoized(get_all_list, current_user.id)
			cache.delete_memoized(get_list_name, current_user.id, list_id)
			return list_data, 200
		except:
			db.session.rollback()
			abort(http_status_code=501, message="Put can't be proceed while updating in ListDetails DB, pls check")



	def delete(self, list_id=None):
		if not list_id:
			abort(501, message="list ID is required.")
# First Delete the data from MainData database, because list_id is foreign key 
		task_data = MainData.query.filter_by(list_id=list_id, user_id=current_user.id).all()
		try:
			if task_data:
				for card in task_data:
					db.session.delete(card)
			db.session.commit()
		except:
			db.session.rollback()
			abort(501, message="Something is wrong while deleting from MainData DB, pls check")
	
# Then Delete the data from ListDetails database.
		list_data = ListDetails.query.filter_by(list_id=list_id, user_id=current_user.id).first()
		try:
			if list_data:
				db.session.delete(list_data)
			db.session.commit()
			cache.delete_memoized(get_all_list, current_user.id)
			cache.delete_memoized(get_list_name, current_user.id, list_id)
			return "", 200
		except:
			db.session.rollback()
			abort(501, message="Something is wrong while deleting from ListDetails DB, pls check")


	def post (self, list_id=None):
		if list_id:
			abort(501, message="No need of list ID while creating the new list")
		data = list_req_data.parse_args()
		try:
			user_data = ListDetails(list_name=data['list_name'], user_id=current_user.id)
			db.session.add(user_data)
			db.session.commit()
			cache.delete_memoized(get_all_list, current_user.id)
			return user_data, 201
		except:
			db.session.rollback()
			abort(http_status_code=501, message="Post can't be proceed, Error while creating the list in ListDetails DB, pls check")

