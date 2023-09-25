export default {
	template: `
	<div>
		<h4>NEW LIST</h4>
		
		List Name:
		<input type="text" placeholder="name" v-model="formData.list_name">
		<br><br>
		<button @click="$emit('addList', formData)"> Create List </button>
		<br><br>
	</div>
	`,
	data(){
		return {
			formData:{
				list_name:null,
			}
		}
	},
}