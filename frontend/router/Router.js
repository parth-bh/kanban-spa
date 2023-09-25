import Login from '../view/Login.js'
import LoginSignup from '../view/LoginSignup.js'

import Signup from '../view/Signup.js'
import Tasks from '../view/Tasks.js'
import List from '../view/List.js'
import Main from '../view/Main.js'
import Profile from '../view/Profile.js'

import Summary from '../view/Summary.js'
import Error from '../components/Error.js'
import ListWiseSummary from '../chart_components/ListWiseSummary.js'

export const router = new VueRouter({
	routes : [
		// {path:'/login', component: Login, name:'login'},
		{path:'/', component: LoginSignup, name:'login_signup'},
		{path:'/main', component: Main, name:'main'},
		{path:'/signup', component: Signup, name:'signup'},
		// {path:'/list', component: List, name:'list'},
		// {path:'/tasks', component: Tasks, name:'tasks'},
		{path:'/summary', component: Summary, name:'summary'},
		{path:'/profile', component: Profile, name:'profile'},
		// {path:'/*', component: Error, name:'error', props:{url_error:'Not Found URL'}},
		 { path: '/*', component: Error, name:'error', props: { url_error: 'Robert' } },

	],
})
