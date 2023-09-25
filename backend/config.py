import os

class Config():
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CELERY_BROKER_URL = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/2"
    REDIS_URL = "redis://localhost:6379"
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database/test.db'
    DEBUG = True
    SECRET_KEY =  "thisissecret"
    SECURITY_PASSWORD_HASH = "bcrypt"    
    SECURITY_PASSWORD_SALT = "salt" # Read from ENV in your case
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    WTF_CSRF_ENABLED = False
    SECURITY_REGISTERABLE = True
    SECURITY_CONFIRMABLE = False
    SECURITY_SEND_REGISTER_EMAIL = False
    SECURITY_UNAUTHORIZED_VIEW = None    
    CELERY_BROKER_URL = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/2"
    REDIS_URL = "redis://localhost:6379"
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379