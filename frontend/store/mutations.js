export default {
		
	setUserDetails(state, data){
		state.user = data
	},

	setList(state, data){
		state.list = data
	},

	deleteList_index(state, index){
		state.list.splice(index,1)
	},

	update_current_list_id(state, list_id){
		state.current_list_id = list_id
	},

	update_current_list_name(state, list_id){
		let list_data = ""
		for (list_data of state.list){
			if (list_data.list_id==list_id) state.current_list_name = list_data.list_name;
		}
	},	

	setTask(state, data){
		state.task = data
	},


	setAllTask(state, data){
		state.allTask = data
	},

	setTaskSeparationListWise(state, data){
		if (data.progressTask) state.progressTask=data.progressTask
		else state.progressTask=data.progressTask=[]
		if (data.completedTask) state.completedTask=data.completedTask
		else state.completedTask=[]
		if (data.deadlineCrossTask) state.deadlineCrossTask=data.deadlineCrossTask
		else state.deadlineCrossTask=[]
		state.task=[...data.progressTask, ...data.completedTask, ...data.deadlineCrossTask]
	}
	

}