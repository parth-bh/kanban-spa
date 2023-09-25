export default {
	template:`
	<div style="color:red">
		<p v-if='list_empty'> No List avilable, please create. </p>
		<br>
		<p v-if='error'> Error Message : {{error}} </p>
		<p v-if='url_error'> Error Message : {{error}} </p>

	</div>`,

	props:['error', 'list_empty', 'url_error'],

}