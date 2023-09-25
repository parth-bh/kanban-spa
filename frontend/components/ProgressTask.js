import CustomFetch from '../CustomFetch.js'
import EditTask from './EditTask.js'
export default {
	template: `
		<div>
			<h3> Work In Progress ( {{progress_tasks_len}}/{{tasks_len}} )</h3>

			<EditTask v-if='flag_edit_task==true' :task_data='sendEditTask' 
						@editTask='updateTask'	@closeEdit='editToggle'/>
			<span v-if='is_progress_tasks'>

			<ol>
				<li v-for="(task, index) in progressTask" :style="style">

					Title : {{task.title}}<br>
					Content : {{task.content}}<br>
					Deadline : {{task.deadline}}<br>
					Task Creation Date : {{task.start_date}}<br>
					Completion Status : {{task.mark_as_complete}}<br>
					Task Completion Date : {{task.completion_date}}<br>
					<br>
					<button @click="editToggle(task)"> <i class='fa fa-edit' style='font-size:18px'></i> </button>
		&ensp;			<button @click="delTask(task.task_id, index)"> <i class="fa fa-trash-o" style="font-size:18px"></i> </button>
					
					<br>
				</li>
			</ol>
			</span>
			<span v-else  style="color:red">
				No Task in progress, please create. <br>
				------
			</span>
		</div>
	`,
	data(){
		return { flag_edit_task:false,
			sendEditTask:{"task_id":"","title":"", "content":"", 
			"deadline":"", "mark_as_complete":""},            
		}
	},
	
	beforeCreate() {
		if (!localStorage.getItem('auth-token')) this.$router.push({name:'login_signup'}); 
	},

	components: {
		EditTask,
	},

	computed : {
		is_progress_tasks: function() {
			if (this.$store.state.progressTask.length>0) return true;
			return false;
		},

		progressTask: function() {
			return this.$store.state.progressTask;
		},
		tasks_len: function() {
			let tasks = this.$store.state.task
			if (tasks.length>0) return tasks.length
			return 0
		},
		progress_tasks_len: function() {
			let progressTask = this.$store.state.progressTask
			if (progressTask.length>0) return progressTask.length;
			return 0
		},
		style() {
			return this.$store.state.style_cards 
		},

	//second method
	},

	methods: {
		delTask(id, index){
			CustomFetch(`http://localhost:5000/api/task/${id}`,{
				method:"DELETE",
				headers:{
					'Authentication-Token':localStorage.getItem('auth-token')
				}
				}).then(()=>{ 
					this.$store.state.progressTask.splice(index,1)
					this.deleteFromTask(id)
					// alert("Task Deleted")
				}).catch((err)=>{
					alert("error in deleting task in progressTask file")
				})
			},

		deleteFromTask(task_id){
			let list = this.$store.state.task
			let index=0
			for (let index_card in list){
				if (list[index_card].task_id==task_id){
					index=index_card
					break
				}
			}
			this.$store.state.task.splice(index,1)
			return true
		},

		editToggle(task=undefined){
			if (task) this.sendEditTask=task
			if (this.flag_edit_task==false) this.flag_edit_task=true;
			else if (this.flag_edit_task==true) this.flag_edit_task=false;
		},

		updateTask(task_data, list_name){
			if (task_data.title.length==0 || task_data.content.length==0 || task_data.deadline.length==0){
				alert("Form Data must not be empty.")
			}
			else {
				let list_details = this.$store.state.list
				for (let list_data of list_details){
					if (list_data.list_name==list_name) task_data.list_id = list_data.list_id
					}

				CustomFetch(`http://localhost:5000/api/task/${task_data.task_id}`, {
					method:"PUT",
					headers:{
						'Content-Type':'application/json',
						'Authentication-Token':localStorage.getItem('auth-token')
						},
					body: JSON.stringify(task_data),
					}).then((data)=> {
						// alert('Task Updated.')
						this.$store.dispatch('fetchTaskSeparationListWise', this.$store.state.current_list_id)						
						// this.$store.commit('update_current_list_id', task_data.list_id)
						// this.$store.commit('update_current_list_name', task_data.list_id)
						this.editToggle()
					}).catch((e)=> {
						alert(e.message)
					})
			}	
		},
		//second method 

	},

}

