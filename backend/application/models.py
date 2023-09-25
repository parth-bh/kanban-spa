from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from flask_login import login_manager

db = SQLAlchemy()

roles_users = db.Table('roles_users',
                       db.Column('user_id', db.Integer(),
                                 db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(),
                                 db.ForeignKey('role.id')))


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=False)
    password = db.Column(db.String, nullable=False)
    report_format = db.Column(db.String)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean())
    main_data = db.relationship('MainData')
    list_details = db.relationship('ListDetails')
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


class ListDetails(db.Model):
    __tablename__ = "list_details"
    list_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    list_name = db.Column(db.String)  
    user_id = db.Column(db.String, db.ForeignKey('user.id'))
    main_data = db.relationship('MainData')

class MainData(db.Model):
    __tablename__ = 'main_data'
    task_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String, nullable=True)
    content = db.Column(db.String)
    deadline = db.Column(db.String)
    start_date = db.Column(db.String)
    completion_date = db.Column(db.String)
    mark_as_complete = db.Column(db.Boolean, nullable=False)
    user_id = db.Column(db.String, db.ForeignKey('user.id'))
    list_id = db.Column(db.String, db.ForeignKey('list_details.list_id'))    

# db.create_all()
