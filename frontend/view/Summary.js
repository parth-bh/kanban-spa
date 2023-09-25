import CustomFetch from '../CustomFetch.js'
import Header from './Header.js'
import Trendline_7_Days from '../chart_components/Trendline_7_Days.js'
import OverallBarGraph from '../chart_components/OverallBarGraph.js'
import ListWiseSummary from '../chart_components/ListWiseSummary.js'

export default {
	template: `
		<div>
		<Header />  <br> <br> 

	<header  style="margin-left:200px">
		<br><br><br>
		<h2 style="text-align: center"> Summary </h2><br>
		<OverallBarGraph/> 

		<ListWiseSummary /> <br><br>
		
		<h3 style="text-align: center"> Trendlines </h3><br>
		
		<Trendline_7_Days :task='task_data' label="#tasks created"
							belongs_to="created" />		
		<p style="color:grey"> fig-> Number of tasks created in last 7 Days</p>
		
		<br>
		<Trendline_7_Days :task='deadlineCrossTask' label="#tasks deadline-crossed"
							belongs_to="deadline" />
		<p style="color:grey"> fig-> Number of tasks that crosses deadline in last 7 Days </p>
		
		<br>
		<Trendline_7_Days :task='completedTask' label="#tasks completed."
							belongs_to="complete" />
		<p style="color:grey"> fig-> Nomber of tasks completed in last 7 days</p>
		
	</header>
		</div>`,

	data() {
		return{
			progressTask:[],
			completedTask:[],
			deadlineCrossTask:[],
			error:'',
			task_data:[],
		}
	},

	components: {
		Header,
		Trendline_7_Days,
		OverallBarGraph,
		ListWiseSummary,
	},

	methods: {

		async fetchTaskSeparation(context){
			CustomFetch(`http://localhost:5000/api/list-task/separation`,{
				method:"GET",
				headers:{
					'Authentication-Token':localStorage.getItem('auth-token')
				}
			})
			.then((data)=>{
				this.progressTask=data.progressTask
				this.deadlineCrossTask=data.deadlineCrossTask
				this.completedTask=data.completedTask
				this.task_data= [...this.progressTask, ...this.completedTask, ...this.deadlineCrossTask]
			})
			.catch((err)=> {
				this.error= err.message
				alert("Error in fetchtask separation in summary")
			})
		},

	},
	

	mounted() {
		this.fetchTaskSeparation()
		this.$store.state.flag_goBack=true;
	},

	beforeCreate() {
		if (!localStorage.getItem('auth-token')) this.$router.push({name:'login_signup'}); 
	},

}