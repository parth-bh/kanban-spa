from flask_caching import Cache
from flask import current_app as app

cache = Cache(app)
app.app_context().push() 
