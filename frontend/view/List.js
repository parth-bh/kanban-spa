import CustomFetch from '../CustomFetch.js'
import CreateList from '../components/CreateList.js'
import IterateList from '../components/IterateList.js'
import EditList from '../components/EditList.js'
import Error from '../components/Error.js'

export default {
	template : `
			<div>
				<button @click='exportOptions'> <i class="fa fa-download" style="font-size:18px"></i> </button>&ensp; &ensp; &ensp; &ensp; 
				<button v-if="flag_export==true" @click='exportData_Download'> download </button>&ensp; 
				<button v-if="flag_export==true" @click='fetchSendMail'> send mail </button>

				<EditList :list_data='list[index_editList]' v-if='flag_edit' @cancelEdit='flagEdit'
							@editList='updateList'/>
				<CreateList @addList='createList' v-else/>
				<Error v-if='list_empty' :list_empty='list_empty'/>
				<IterateList :list='list' @selectList='selectListID' @deleteList='deleteList' 
							@flagEdit='flagEdit' />			
			</div>
			`,
	components: {
		CreateList,
		IterateList,
		EditList,
		Error,
	},

	data(){
		return{
			flag_edit:"",
			index_editList:null,
			flag_export:false,
		}
	},	

	beforeCreate() {
		if (!localStorage.getItem('auth-token')) this.$router.push({name:'login_signup'}); 
	},

	computed : {

		list : function(){
			return this.$store.state.list;
		},

		id: function() {
			return this.$store.state.current_list_id;
		},

		list_empty : function(){
			if (this.$store.state.list.length==0) return true
			return false;
		}
	},

	mounted() {
		this.$store.dispatch('fetchList')
	},

	methods: {

		createList(formData){
			if (formData.list_name==null){
				alert("Name must not be empty.")
			} else {
			CustomFetch('http://localhost:5000/api/list', {
				method:"POST",
				headers:{
					'Content-Type':'application/json',
					'Authentication-Token':localStorage.getItem('auth-token')
				},
				body: JSON.stringify(formData),
				}).then((data)=> {
					// alert('List Created.')
					this.$store.dispatch('fetchList')
					formData.list_name=""
				}).catch((e)=> {
					alert("error while creating list in List.js file")
				})
			}
		},

		selectListID(list_id){
			this.$store.commit('update_current_list_id', list_id)
			this.$store.commit('update_current_list_name', list_id)
		
		},
	
		deleteList(list_id, index){
			let list_name_for_deleting = ""
			for (let list_data of this.list){
				if (list_data.list_id==list_id) list_name_for_deleting = list_data.list_name;
			}
			let message ="Do you want to delete List : '" + list_name_for_deleting + "' ?"
			if (confirm(message) == true) {
				CustomFetch(`http://localhost:5000/api/list/${list_id}`,{
					method:"DELETE",
					headers:{
						'Authentication-Token':localStorage.getItem('auth-token')
					}
					})
				.then(()=>{ 
					this.$store.commit('deleteList_index', index)
					// alert("List Deleted")
					})
				.catch((err)=>{
					alert("Error while deleting list in List.js file")
				})
			} // no else part needed
		},

		flagEdit(id, index){
			if (this.flag_edit){
				this.flag_edit=false;
				this.index_editList=null;	
			} else {
				this.flag_edit=true;
				this.index_editList=index;
			}
		},

		updateList(list_data){
			if (list_data.list_name.length==0){
				alert("Data must not be empty.")
			} else {
			CustomFetch(`http://localhost:5000/api/list/${list_data.list_id}`, {
				method:"PUT",
				headers:{
					'Content-Type':'application/json',
					'Authentication-Token':localStorage.getItem('auth-token')
					},
				body: JSON.stringify(list_data),
				}).then((data)=> {
					this.flag_edit=false
					this.index_editList=null
					this.$store.dispatch('fetchList')
					// alert('Renaming Success.')
				}).catch((e)=> {
					alert(e.message)
				})
			}	
		},

		exportOptions(){
			if(this.flag_export==true) this.flag_export=false
			else if(this.flag_export==false) this.flag_export=true
		},

		fetchSendMail(){
			CustomFetch('http://localhost:5000/api/export-data',{
				method:"GET",
				headers:{
					'Authentication-Token':localStorage.getItem('auth-token')
				}
			})
			.then((data)=>{
				let message = "Done !! List Details will send to your mail id.."
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
			if (this.list){
				let data = this.convertToCSV(this.list)
				alert("Downloading....")
				this.downloadBlob(data, 'list_details.csv', 'text/csv;charset=utf-8;')
				this.flag_export=false
			}
			else{
				alert("No data yet for download")
			}
		},
		// Second method 

	},
}