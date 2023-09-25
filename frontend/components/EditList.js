export default {
	template: `
	<div>

		<h4> RENAME LIST </h4>
		List Name:
		<input type="text" placeholder="name" v-model="list_data.list_name">
		<br><br>
		<button @click="$emit('editList', list_data)"> Update </button>
		<button @click="$emit('cancelEdit')"> Cancel </button>
		<p style="color:red">
			Use 'Update' button for save in backend.
		</p>
	</div>`,

	props: ['list_data'],

}
