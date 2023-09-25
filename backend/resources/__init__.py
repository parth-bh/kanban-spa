from .user_api import UserData
from .list_api import *
from .task_api import *
from .task_separate_api import *
from flask_restful import Api
from celery_utils.export_data_celery import *
api = Api(prefix='/api')

api.add_resource(ListTask, '/list-task/<int:list_id>', '/list-task')
api.add_resource(Task, '/task/<int:task_id>', '/task')
api.add_resource(List, '/list/<int:list_id>', '/list')
api.add_resource(ListTaskSeparation, '/list-task/separation/<int:list_id>', '/list-task/separation')
api.add_resource(ListWiseSummary, '/list-wise-summary')

api.add_resource(UserData, '/user')

api.add_resource(SendData, '/export-data', '/export-data/<int:list_id>' )

