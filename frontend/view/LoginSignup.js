import Login from './Login.js'
import Signup from './Signup.js'


export default {
	template: `
			<div :style='style_main'>

			<h1> KANBAN &ensp; APP </h1>
			<div :style="style">
			
				<span @click="flag_loginToggle" style="font-size:20px;color:dark-blue;text-decoration:underline">  Login </span>  &ensp; &ensp; | &ensp; &ensp; 
				<span @click="flag_signupToggle" style="font-size:20px;color:dark-blue;text-decoration:underline"> Signup </span>
				
				<Login v-if="flag_login==true" />
				
				<Signup v-if="flag_signup==true" />
			</div>

			</div>`,

	data() {
		return {
			flag_login:true,
			flag_signup:false,
		}
	},

	components: {
		Login,
		Signup,
	},

	computed: {
		style() {
			return {
					// 'float':'right',
					'margin-top':'50px',
					'margin-left':'500px',
					'margin-bottom':'200px',
					'width': '30%',
					'border': 'groove',
					'border-radius':'25px',
					'padding': '30px',
					 'text-align': 'center',
					'background-color':'lightgrey',
					'font-size':'15px',
					}
		},

		style_main() {
			return {
				// "background-image":"url(https://cdn.wallpaperhub.app/cloudcache/c/3/b/e/9/e/c3be9e6e8950054edbfb0369725453fd55362150.jpg)",
				// 'background-color':'lightgrey'
				'margin-left':'100px',	
			}
		}

		//second method
	},

	methods: {
		flag_loginToggle(){
			this.flag_signup=false
			this.flag_login=true
		},
		flag_signupToggle(){
			this.flag_login=false
			this.flag_signup=true
		},
		//second method
	},
	
	beforeCreate() {
		if (localStorage.getItem('auth-token')) this.$router.push({name:'main'}); 
	},
}