import CustomFetch from '../CustomFetch.js'

export default {
	template:`
			<div>
				<canvas id="myChart" ref="chart" style="width:100%; max-width:400px; height:80px;"></canvas>
				<span v-if='flag_divide_task'>
	<p style="color:grey"> fig -> Overall Distribution "Including All List" </p>
				</span>
				<span v-else>
					<h4 style="color:red">No Task Created Yet. </h4>
				</span>

			</div>`,

	data() {
      			return {
      				divided_task:[],
      				flag_divide_task:false,
      				plot_data: {
								        labels: ['Progress', 'Completed', "Deadline-Crossed"],
								        datasets: [{
										            label: "Including All List",
										             axis: 'y',
										            data: [1,1,1],
										            backgroundColor: "rgb(100,100,100)",
										            borderWidth: 2,
										          },],
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
									indexAxis: 'y',
									scales: {
											y:{beginAtZero: true},

						            		 }
					          			},
					        		}
					      	},
    
     },


	methods: {
		async fetchTaskSeparation(){
			CustomFetch(`http://localhost:5000/api/list-task/separation`,{
				method:"GET",
				headers:{
					'Authentication-Token':localStorage.getItem('auth-token')
				}
			})
			.then((data)=>{
				this.divided_task=data
			})
			.catch((err)=> {
				this.error= err.message
				alert("Error in fetchtask separation in bar graph")
			})
		},
		//second method
	},

	watch:{
		divided_task(newValue){
						let progress = newValue.progressTask
						let completed = newValue.completedTask
						let deadline_task = newValue.deadlineCrossTask			
						if (progress.length>0 || completed.length>0 || deadline_task.length>0){
							this.flag_divide_task=true
							this.plot_data.datasets[0].data = [progress.length, completed.length, deadline_task.length]							
							new Chart(this.$refs.chart, this.config)	
						}
						else {
							this.flag_divide_task =false
						}
			}
	},


	mounted(){
		this.fetchTaskSeparation()
	}
}