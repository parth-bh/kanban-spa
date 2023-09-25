import List from './List.js'
import Tasks from './Tasks.js'
import Header from './Header.js'
import ListWiseSummary from '../chart_components/ListWiseSummary.js'

export default {
	template : `
			<div>
				<Header />
				<br><br><br>
				<button @click="flag_showListToggle" class="btn"><i class="fa fa-bars"></i></button> 
				
				<span v-if='flag_showList==true'>
					<List style="float:left;width:22%;border-style: outset;"/>
					<Tasks style="float:right;width:75%;"/>
				</span>
				<span v-else>
					<Tasks style="margin-left:50px"/>
				</span>
			</div>
			`,
	
	computed: {
		flag_showList() {
			return this.$store.state.flag_showList
		},
		//second method
	},

	components : {
		List,
		Tasks,
		Header,
		ListWiseSummary,

	},


	beforeCreate() {
		if (!localStorage.getItem('auth-token')) this.$router.push({name:'login_signup'}); 
	},
	
	methods: {
		flag_showListToggle(){
			if (this.$store.state.flag_showList==true) this.$store.state.flag_showList = false;
			else this.$store.state.flag_showList = true;
		},	
		// second method
	},
}