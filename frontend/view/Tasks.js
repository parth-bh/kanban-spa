import CustomFetch from '../CustomFetch.js'
import CreateTask from '../components/CreateTask.js'
import ProgressTask from '../components/ProgressTask.js'
import CompletedTask from '../components/CompletedTask.js'
import DeadlineCrossTask from '../components/DeadlineCrossTask.js'

export default {
	template:`
	<div>
		<span v-if='current_list_id'>
			Current List Name : <b>{{current_list_name}}</b>
		
			<span id="export" style="float:right;width:30%"> 
			
				<button @click='exportOptions'> <i class="fa fa-download" style="font-size:18px"></i> </button> &ensp; &ensp; &ensp; &ensp; 
				<button v-if="flag_export==true" @click='exportData_Download'> download </button> &ensp; 
				<button v-if="flag_export==true" @click='fetchSendMail'> send mail  </button>
			</span>

			<br><br>
			
			<button v-if='flag_add_task==false' @click="flag_addTask"> Add Task </button>
			<CreateTask v-if='flag_add_task==true' @closeEdit='flag_addTask' @addTask='createTask' :current_list_id=current_list_id />
			
			<br><br>

			<span v-if='flag_showList==true'>
				<ProgressTask />
				<CompletedTask />
				<DeadlineCrossTask />
			</span>
			<span v-if='flag_showList==false'>
				<ProgressTask style="float:left;width:33%""/>
				<CompletedTask style="float:left;width:33%""/>
				<DeadlineCrossTask style="float:left;width:33%""/>
			</span>
		
		</span>

		<span style="color:red" v-else>
			Please select list
		</span>

	</div>`,


	components: {
		ProgressTask,
		CompletedTask,
		DeadlineCrossTask,
		CreateTask,
	},
		
	data(){
		return{
			error: false,
			flag_fetch:false,
			flag_edit:false,
			index_editCard:null,
			flag_add_task:false,
			flag_export:false,
		}
	},


	beforeCreate() {
		if (!localStorage.getItem('auth-token')) this.$router.push({name:'login_signup'}); 
	},
	

	computed : {

		tasks: function(){
			return this.$store.state.task;
		},

		current_list_id: function() {
			return this.$store.state.current_list_id
		},
		current_list_name: function() {
			return this.$store.state.current_list_name
		},
		flag_showList() {
			return this.$store.state.flag_showList
		},
		//second method
	},

	watch:{

		current_list_id(newValue) {
			this.$store.dispatch('fetchTaskSeparationListWise', newValue)
		},
		//seconde method
	},

	methods: {
		
		exportOptions(){
			if(this.flag_export==true) this.flag_export=false
			else if(this.flag_export==false) this.flag_export=true
		},

		createTask(formData){
			if (formData.title==null || formData.content==null || formData.deadline==null){
				alert("Form Data must not be empty.")
			} else {
			
			CustomFetch(`http://localhost:5000/api/list-task/${this.current_list_id}`, {
				method:"POST",
				headers:{
					'Content-Type':'application/json',
					'Authentication-Token':localStorage.getItem('auth-token')
				},
				body: JSON.stringify(formData),
				}).then((data)=> {
					formData.title=""
					formData.content=""
					formData.deadline=""
					formData.mark_as_complete=""
					this.$store.dispatch('fetchTaskSeparationListWise', this.current_list_id)
					this.flag_add_task=false;
					// alert('Task Created.')
				}).catch((e)=> {
					alert(e.message)
				})
			}	
		},

		flag_addTask(){
			if(this.flag_add_task==true) this.flag_add_task = false
			else this.flag_add_task= true
		},

		fetchSendMail(){
			CustomFetch(`http://localhost:5000/api/export-data/${this.current_list_id}`,{
				method:"GET",
				headers:{
					'Authentication-Token':localStorage.getItem('auth-token')
				}
			})
			.then((data)=>{
				let message = "Data for 'List: "+ this.current_list_name +"' will send to your mail id.."
				alert(message)
				this.flag_export=false
			})
			.catch((err)=> {
				alert("error in headers while sending mail.")
				console.log(err)
			})
		},

		downloadBlob(data, filename, contentType) {
			// Create a blob
			var blob = new Blob([data], { type: contentType });
			var url = URL.createObjectURL(blob);
			// Create a link to download it
			var pom = document.createElement('a');
			pom.href = url;
			pom.setAttribute('download', filename);
			pom.click();
		}, 

		convertToCSV(json_object) {
			const key_arr = Object.keys(json_object[0])
			let text = key_arr.join()
			for (let i in json_object){
				text += "\n"  
				for (let j in key_arr){
					if (Object.values(json_object[i])[j]) text += Object.values(json_object[i])[j] +",";
					else text += "." +",";
				}
			}
			return text
		},

		exportData_Download(){
			if (this.tasks){
				let data = this.convertToCSV(this.tasks)
				alert("Downloading....")
				this.downloadBlob(data, 'user_data.csv', 'text/csv;charset=utf-8;')
				this.flag_export=false
			}
			else{
				alert("No data yet for download")
			}
		},
		// second method 
	},

}