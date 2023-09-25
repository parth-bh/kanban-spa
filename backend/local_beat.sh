# celery beat is used for scheduling jobs, or simply it is a timer
# and we have to start it separately.

celery -A app.celery beat --max-interval 1 -l info

# in this interval is set to 1 seconds.

