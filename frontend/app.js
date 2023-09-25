
import Tasks from './view/Tasks.js'
import {router} from './router/Router.js'
import {store} from './store/store.js'
new Vue({
	el:'#app',
	template:`
	<div> 
		<!-- <Tasks /> -->
		<router-view /> 
	</div>`,

	router,

	store,
	
	components :{
		Tasks,
	}
})