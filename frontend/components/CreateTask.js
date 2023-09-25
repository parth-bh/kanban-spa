export default {
	template: `
	<div>
		
		<h4>NEW TASK</h4>
		Title:
		<input type="text" placeholder="Task Title" v-model="formData.title">
		Deadline:
		<input type="date" v-model="formData.deadline">
		<input type="checkbox" v-model="formData.mark_as_complete"> Complete <br><br>
		Content: 
		<textarea rows="4" cols="90" placeholder="Content" v-model="formData.content"></textarea><br><br>
		<br>
		<button @click="$emit('addTask', formData)"> Create Task </button>
		<button @click="$emit('closeEdit')"> Cancel </button>
		
		<br><br>
	
	</div>
	`,

	data(){
		return {
		}
	},

	props: ['current_list_id'],

	computed : {
		formData : function() {
			return {
				title:null,
				content:null,
				deadline:null,
				mark_as_complete:false,
				list_id:this.current_list_id,
			}
		}
	}

}