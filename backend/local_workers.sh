# use to run the workers

celery -A app.celery worker -l info

# start the workers, usually number of workers = number of available CPU