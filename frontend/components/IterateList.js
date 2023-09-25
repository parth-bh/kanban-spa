export default {
	template: `
			<div>
				<ul>
					<li v-for="(list_iter, index) in list" style="font-size:24px">
						<span @click="$emit('selectList', list_iter.list_id)" style="color:blue;background: white;"
															onmouseover="this.style.color='#0F0'"
 															onmouseout="this.style.color='#00F'">
   
							{{list_iter.list_name}}
						
						</span>
						<br>
						<button @click="$emit('flagEdit', list_iter.list_id, index)"> Rename </button>
						<button @click="$emit('deleteList', list_iter.list_id, index)"> Delete </button>
					<br><br>
					</li>
				</ul>
			</div>
			`,

	props: ['list']
}