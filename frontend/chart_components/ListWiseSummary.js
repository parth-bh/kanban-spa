import CustomFetch from '../CustomFetch.js'

export default {
	template : `
			<div>
				<h3 style="text-align: center">List Wise Summary</h3>
				<br><br>
				<canvas id="myChart" ref="list_summary_chart" style="width:100%; max-width:600px; height:80px;"></canvas>


				<span v-if='flag_task_list'> 
	<p style="color:grey"> fig -> List Wise Summary </p>
	<br> <br> <br>
<table style="border:1px solid black;padding:10px">
  <tr style="border-style:solid;">
  	<th style="text-align: left;">List Name</th>
    <th style="text-align:center">Progress</th>
    <th>Completed</th>
    <th>Deadline-Crossed</th>
  </tr>
  <tr v-for='(data, index) in all_list'>
    <td style="text-align: left; width:20%">{{data.list_name}}</td>
    <td style="text-align: center; width:20%">{{data.progressTask}}</td>
    <td style="text-align: center;width:20%">{{data.completedTask}}</td>
    <td style="text-align: center;width:20%">{{data.deadlineCrossTask}}</td>
  </tr>
</table>			<br>
						Table -> Shows the distribution of tasks in each list.
					<br> 
				</span>
				
				<span v-else style="color:blue"> 
				<h4> Nothing to show as "List Wise Summary" because No task is created yet.</h4> <br>
				</span>
				
				<span v-if='flag_zero_task_list'>
				<br>
				<h4 style="color:blue">=> Following are the List Names in which tasks are not created yet.</h4>
					<ol>
					<li v-for='(list, index) in zero_task_list'>
						{{list.list_name}}
					</li>
					</ol>
				</span>
			</div>`,
	
	data() {
		return{
			zero_task_list: [],
			task_list : [],
			all_list: [],
			plot_data: {
					        labels: ['Progress', 'Completed', "Deadline-Crossed"],
					        datasets: [{
							            label: "BAR GRAPH",
							            data: [10,20,30],
							          },
							          ],
				      	},
		}
	},

	beforeMount() {
		if (!localStorage.getItem('auth-token')) this.$router.push({name:'login_signup'}); 
	},
	
    computed: {

      config: function(){
        return {
			type: 'bar',
			data: this.plot_data,
			options: {
				scales: {
						y:{beginAtZero: true}
	                 	}
          			},
        		}
      	},

      flag_task_list: function(){
      	if (this.task_list.length==0) return false
      	return true
      },

      flag_zero_task_list: function(){
      	if (this.zero_task_list.length==0) return false
      	return true
      },
    
    },

	methods: {
		async fetchListWiseSummary(){
			CustomFetch(`http://localhost:5000/api/list-wise-summary`,{
				method:"GET",
				headers:{
					'Authentication-Token':localStorage.getItem('auth-token')
				}
			})
			.then((data)=>{
				this.zero_task_list=data[0]
				this.task_list=data[1]
				this.all_list= [...data[1], ...data[0]]
			})
			.catch((err)=> {
				this.error= err.message
				alert("Error in fetchtask in listWiseSummary")
			})
		},
		//second method
	},

	watch: {
		task_list(newValue){
						if (newValue){
							let datasets=[]
							for (let task of newValue){
								var data= [task['progressTask'], task.completedTask, task.deadlineCrossTask]
								var label= [task.list_name]
								var temp_dict = {"data":data, "label":label}
								datasets.push({"data":data, "label":label})
							}
							this.plot_data.labels= ['Progress', 'Completed', 'Deadline-Crossed']
							this.plot_data.datasets = datasets
							new Chart(this.$refs.list_summary_chart, this.config)	
							}
						},

	},

	mounted(){
		this.fetchListWiseSummary();	
		
	},

}