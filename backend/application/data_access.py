from .models import *

from utils.cache_setup import cache

@cache.memoize(3600)
def get_all_list(user_id):
	list_details = ListDetails.query.filter_by(user_id=user_id).all()
	return list_details


@cache.memoize(3600)
def get_list_name(user_id, list_id):
	list_details = ListDetails.query.filter_by(user_id=user_id, list_id=list_id).all()
	return list_details


@cache.memoize(3600)
def get_task_by_listID(user_id, list_id):
	list_of_card = MainData.query.filter_by(user_id=user_id, list_id=list_id).all()
	return list_of_card


@cache.memoize(3600)
def get_task_by_userID(user_id):
	list_of_card = MainData.query.filter_by(user_id=user_id).all()
	return list_of_card




