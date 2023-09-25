import Header from './Header.js'
import CustomFetch from '../CustomFetch.js'


export default {
	template : `
			<div>
				<Header /> <br> <br> <br> <br> <br>
				<span :style='style'> 
					User Name :  "{{ user['username'] }}" <br> <br>
					User Email :  "{{user['email']}}"  <br> <br>
					Progress Report Format: 

				<select style="font-size:15px" v-model='format'>
					<option value="html">html</option>
					<option value="pdf">pdf</option>
				</select> 
				&ensp; &ensp; 
				<button @click='fetch_updateReportFormat'> update </button>  

				</span> 
			</div>`,

	data() {
		return {
			format:"",
		}
	},

	components : {
		Header,
	},
	
	computed: {
		
		user: function(){
			this.format= this.$store.state.user['report_format']
			return this.$store.state.user
		},


		style() {
			return {
				"float":"left",
				 "width":"40%",
				 "margin-right":"200px",
				 "margin-left":"200px",
				 "margin-top":"50px",

				 "border" : "groove",
				 "border-radius": "10px",
				"padding":"40px",
			}
		},
		//second method
	},

	beforeCreate() {
		if (!localStorage.getItem('auth-token')) this.$router.push({name:'login_signup'}); 
	},

	mounted() {
		this.$store.state.flag_goBack=true;
	},

	methods: {
		fetch_updateReportFormat(context){
			this.user['report_format'] = this.format
			CustomFetch('http://localhost:5000/api/user', {
				method:"PUT",
				headers:{
					'Content-Type':'application/json',
					'Authentication-Token':localStorage.getItem('auth-token')
					},
				body: JSON.stringify(this.user),
				}).then((data)=> {
					alert("Updated !!")
					this.$store.state.user = data
				}).catch((e)=> {
					alert("error in fetch_updateReportFormat in profile.js")
				})
		},
		// second method

	},
}