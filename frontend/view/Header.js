import CustomFetch from '../CustomFetch.js'

export default {
	template: `
		<div style="font-size:22px;">
			<span class="welcome" style="float:left; margin-left:20px">

				<strong> Welcome "{{user.username}}" !! </strong> &ensp; &ensp; 
				
			</span>
			
			<span class="nav" style="float:right;width:40%">
				<button v-if='flag_goBack==true' @click='goBack_toSummary'> Go Back </button> &ensp; &ensp; 
				<router-link @click='check' to="/profile" > Profile </router-link>&ensp;
				<router-link @click='check' to="/summary" > Summary </router-link>&ensp;

				<span @click='logOut' :style="style" onmouseover="this.style.color='#0F0'" onmouseout="this.style.color='#00F'"> 
 															Log Out </span>
 				
 			</span>

		</div>`,

	beforeCreate() {
		if (!localStorage.getItem('auth-token')) this.$router.push({name:'login_signup'}); 
	},

	computed: {
		user: function(){
			return this.$store.state.user
		},

		flag_goBack: function(){
			return this.$store.state.flag_goBack
		},
		style: function(){
			return {'color':'blue','text-decoration':'underline'}
		},

		//second method
	},

	methods: {
		check(){
			alert("CHECKING")
		},
		logOut(){
			localStorage.removeItem('auth-token')
			this.$router.push({'name':'login_signup'})
		},

		goBack_toSummary(){
			this.$router.push({name:'main'})
			this.$store.state.flag_goBack=false;
		},
		//second method

	},

	mounted() {
		if (!(this.user)) this.$store.dispatch('fetchUserDetails')
	},

}