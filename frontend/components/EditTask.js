export default {
	template: `
	<div>

		<h4 style="text-align:center"> EDIT TASK </h4>
		
		<span v-if='flag_showList==true'>
			Title:
			<input type="text" placeholder="Task Title" v-model="task_data.title">

			Deadline:
			<input type="date" v-model="task_data.deadline">

			List Name:
			<select style="font-size:18px" v-model='list_name'>
				<option v-for="(list_iter, index_list) in list_details">
					{{ list_iter.list_name }}
				</option>
			</select>

			<input type="checkbox" v-model="task_data.mark_as_complete"> Complete
			<br><br>
			
			Content: 
			<textarea rows="4" cols="90" v-model='task_data.content'>{{task_data.content}}</textarea>
			<br><br>
		</span>

		<span v-if='flag_showList==false'>
			Title:
			<input type="text" placeholder="Task Title" v-model="task_data.title"><br><br>

			Deadline:
			<input type="date" v-model="task_data.deadline"><br><br>

			List Name:
			<select style="font-size:18px" v-model='list_name'>
				<option v-for="(list_iter, index_list) in list_details">
					{{ list_iter.list_name }}
				</option>
			</select>

			<input type="checkbox" v-model="task_data.mark_as_complete"> Complete
			<br><br>
			
			Content: 
			<textarea rows="5" cols="30" v-model='task_data.content'>{{task_data.content}}</textarea>
			<br><br>
		</span>
		

		<button @click="$emit('editTask', task_data, list_name)"> Update Task </button>
		<button @click="$emit('closeEdit')"> Cancel </button>
		
		<p style="color:red">
		Use 'Update Task' button for successfully save in backend.
		</p>
	</div>`,
	
	data(){
		return{
			list_name:this.$store.state.current_list_name,
		}
	},

	props: ['task_data'],

	computed : {
		list_details: function(){
			return this.$store.state.list;
		},

		current_list_id: function(){
			return this.$store.state.current_list_id;
		},

		flag_showList() {
			return this.$store.state.flag_showList
		},
		//second method

	},
}
