from flask_security import Security, SQLAlchemySessionUserDatastore
from .models import db, User, Role

user_datastore = SQLAlchemySessionUserDatastore(db.session, User, Role)
sec = Security()
