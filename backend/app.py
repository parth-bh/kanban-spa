import resource
from flask import Flask, render_template
from jinja2 import Template
import os
from application.models import db, User as user_model
from application.security import user_datastore, sec
from flask_cors import CORS
from celery_utils import workers
from config import LocalDevelopmentConfig
from flask_restful import Api

app = None
celery = None

def create_app():
    app = Flask(__name__, template_folder="templates")
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    sec.init_app(app, user_datastore)
    CORS(app)   
    app.app_context().push() 

    #create celery   
    celery = workers.celery
    celery.conf.update(
        broker_url = app.config["CELERY_BROKER_URL"],
        result_backend = app.config["CELERY_RESULT_BACKEND"],
        timezone = "Asia/Calcutta",
        enable_utc = False
    )

    celery.Task = workers.ContextTask # replacing the name
    app.app_context().push()
    return app, celery

app, celery = create_app()


# from utils.first_request import *
# # used to create db.


from resources import api

api.init_app(app)
app.app_context().push()

from celery_utils import send_emails
from celery_utils import daily_reminder_celery
from celery_utils import export_data_celery
from celery_utils import monthly_progress_celery



if __name__ == "__main__":
    app.run(debug=True)

