import CustomFetch from '../CustomFetch.js'

export default {
	template:`
	<div>
		<h4 style="color:red" v-if="error"> X {{error}} </h4>
		<h4 style="color:blue" v-if="message"> &#x2713; {{message}} </h4>

		<h4> SignUp / Register </h4>
		Email : 
		<input type='text' v-model='form.email' placeholder="email"/> <br> <br>
		User Name : 
		<input type='text' v-model='form.username' placeholder="username"/> <br> <br>
		Password : 	
		<input :type='type' v-model='form.password' placeholder="password"/> <br> 
		<span @click='flag_passwordToggle'> <input type='checkbox' v-model='flag_password' /> 
			Show Password
		</span>
		<br><br>
		<button @click="register(form)"> Register </button>
		<br><br>
	</div>`, 

	data() {
		return {
			error:"",
			message:"",
			form: {"email":"", "username":"", "password":""},
			flag_password:false,
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
		register(formData){
			if (!(this.form.email)) alert("Email field is Mandatory")
			else if (!(this.form.username)) alert("User Name field is Mandatory")
			else if (!(this.form.password.length>=7)) alert("Password should contain at least 7 characters.")
			else {
				CustomFetch('http://localhost:5000/api/user', {
					method:"POST",
					headers:{
						'Content-Type':'application/json',
					},
					body: JSON.stringify(formData),
					})
				.then((data)=> {
					this.error=""
					this.message = 'Successfully Register, You can login now.'
					this.form.email=""
					this.form.username=""
					this.form.password=""

				})
				.catch((e)=> {
					this.message=""
					this.error= e.message
					this.form.email=""
					this.form.username=""
					this.form.password=""
				})
			}
		},
		flag_passwordToggle(){
			if (this.flag_password==true) this.flag_password=false
			else this.flag_password=true
		},

		//second method
	}

}