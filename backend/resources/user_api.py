from flask_restful import Resource, abort, fields, marshal
from flask_security import auth_required, current_user
from application.models import db, User 
from flask import current_app
from flask_restful import Resource, marshal_with, fields, reqparse
from werkzeug.exceptions import Conflict
from sqlalchemy.exc import IntegrityError
from flask_security import auth_required, hash_password
from application.security import user_datastore, sec

user_resourse_fields = {
    "username": fields.String,
    "email": fields.String,
    "report_format":fields.String
}

user_req = reqparse.RequestParser()
user_req.add_argument('email')
user_req.add_argument('username')
user_req.add_argument('password')
user_req.add_argument('report_format')


class UserData(Resource):

    method_decorators = {
        'get': [marshal_with(user_resourse_fields), auth_required('token')],
        'post': [marshal_with(user_resourse_fields)],
        'put': [marshal_with(user_resourse_fields), auth_required('token')],
        'delete': [auth_required('token')]
    }


    def post(self):
        data = user_req.parse_args()

        if not data['email']:
            abort(400, message="email required")
        if not data['password']:
            abort(400, message="password required")
        if not data['username']:
            abort(400, message="username required")

        if user_datastore.find_user(email=data['email']):
            abort(403, message="Email is alreay exist, please login if you are aleardy existing user, else create with another email ID.")
        try:
            user = user_datastore.create_user(
                username=data['username'], email=data['email'],
                password=hash_password(data['password']), report_format="html")
            db.session.commit()
            return user
        except IntegrityError:
            db.session.rollback()
            abort(405, message="Error during saving details in DB.")
    
    def get(self):
        if current_user.id:
            return marshal(current_user, user_resourse_fields)
        else:
            abort(400, message='You are not authorized to get the resource')

    def put(self):
        data = user_req.parse_args()
        if current_user.id:
            try:
                user_data = User.query.filter_by(id=current_user.id).first()
                user_data.report_format = data['report_format']
                db.session.commit()
                return user_data
            except:
                db.session.rollback()
                abort(501, message="error while updating of user report format in the database")
        abort(501, message="You are not authorized to get the resource")


    def delete(self):
        abort(501, message="Delete method not allowed")

