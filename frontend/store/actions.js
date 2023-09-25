import CustomFetch from '../CustomFetch.js'

export default {

		async fetchUserDetails(context){
			CustomFetch(`http://localhost:5000/api/user`,{
				method:"GET",
				headers:{
					'Authentication-Token':localStorage.getItem('auth-token')
				}
			})
			.then((data)=>{
				// alert("fetchUserDetail")
				context.commit('setUserDetails', data)
			})
			.catch((err)=> {
				alert("Error in fetchUserDetails in actions")
			})
		},

		async fetchList(context){
			CustomFetch('http://localhost:5000/api/list',{
				method:"GET",
				headers:{
					'Authentication-Token':localStorage.getItem('auth-token')
				}
			})
			.then((data)=>{
				context.commit('setList', data)
			})
			.catch((err)=> {
				// this.error= err.message
				console.log(err)
			})
		},

		async fetchTask(context, id){
			CustomFetch(`http://localhost:5000/api/list-task/${id}`,{
				method:"GET",
				headers:{
					'Authentication-Token':localStorage.getItem('auth-token')
				}
			})
			.then((data)=>{
				context.commit('setTask', data)
			})
			.catch((err)=> {
				// this.error= err.message
				console.log(err)
			})
		},
		
		
		async fetchTaskSeparationListWise(context, id){
			CustomFetch(`http://127.0.0.1:5000/api/list-task/separation/${id}`,{
				method:"GET",
				headers:{
					'Authentication-Token':localStorage.getItem('auth-token')
				}
			})
			.then((data)=>{
				// alert("fetchAllTask")
				context.commit('setTaskSeparationListWise', data)
			})
			.catch((err)=> {
				this.error= err.message
				alert("Error in fetchAllTask in actions")
			})
		},

		//second function
}