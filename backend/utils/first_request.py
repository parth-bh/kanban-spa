from flask import current_app as app
from application.security import user_datastore, sec
from flask_security import hash_password
from application.models import db, User as user_model


@app.before_first_request
def create_db():
    db.create_all()
    if not user_datastore.find_user(email="pb@gmail.com"):
        user_datastore.create_user(
            username="pb17", email="pb@gmail.com", password=hash_password("password"), report_format="html")
        db.session.commit()

    if not user_datastore.find_role('admin'):
        user_datastore.create_role(
            name='Admin', description='Admin Related Role')
        db.session.commit()


