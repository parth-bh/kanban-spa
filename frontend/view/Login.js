import CustomFetch from '../CustomFetch.js'

export default {
	template : `
	<div>
		<div>
			<h3> Login </h3>
			Email:
			<input type="text" placeholder="email" v-model='loginData.email' /> <br><br>
			Password:
			<input :type="type" placeholder="password" v-model='loginData.password' /> <br>
			<span @click='flag_passwordToggle'> <input type='checkbox' v-model='flag_password'/> 
			Show Password
			</span>
	 		<br><br>
			<button @click='login'> Login </button>
	 		<br><br>
		</div>
	</div>`,

	data(){
		return {
			flag_password:false,
			loginData: {
				email: '',
				password: ''
			}
		}
	},


	computed: {
		type() {
			if (this.flag_password==false) return "password"
			else return "text"
		},
		//second method
	},

	methods: {

		login(){
			if (this.loginData.email==null || this.loginData.password==null){
				alert("Form Data must not be empty.")
			} else {
				CustomFetch('http://localhost:5000/login?include_auth_token', {
				method:"POST",
				headers:{
					'Content-Type':'application/json',
				},
				body: JSON.stringify(this.loginData),
				})
				.then((data)=> {
					localStorage.setItem('auth-token',data.response.user['authentication_token'])
					this.$router.push({name:'main'})
					// alert("Credentials Correct.")
					this.loginData.email= ""
					this.loginData.password= ""
					// pass the name or path in the router.push
				})
				.catch((e)=> {
					alert("Credentials Incorrect !! Please try again or contact admin.")
				})
			}	
		},
		flag_passwordToggle(){
			if (this.flag_password==true) this.flag_password=false
			else this.flag_password=true
		},

		// second methods
	},

	beforeCreate() {
		if (localStorage.getItem('auth-token')) this.$router.push({name:'main'}); 
	},
	

}