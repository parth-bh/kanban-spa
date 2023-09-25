export default async function CustomFetch(url, init_obj){
	let res = null; // storing the response of an API.
	let data = null; // store the JSON data.
	try {
		res = await fetch(url, init_obj)
	} catch{
		throw new Error('Netork connection failed')
	}
	// if fetch fails, it is either by network connection or base URL spelling wrong.
	try{
		data = await res.json()
	} catch{
		throw new Error("Response body can't be serializabale or JSON")
	}
	if (res.ok){ //res.ok is true only if response is between 200 to 299
		return data
	} else {
		throw new Error(data.message) // messgae could be anything that is came when fetch from API
	}
}

// CustomFetch('http://localhost:5000/api/list-task/12')
// .then(data=> console.log(data))
// .catch(e=> console.log(e.message))


// CustomFetch('http://localhost:5000/api/list-task/3', {
// 	method:"POST",
// 	headers:{
// 		'Content-Type':'application/json',
// 	},
// 	body: JSON.stringify({
// 		"title": "title for list3",
// 		"content": "chfhfhfhfjfjfj",
// 		"deadline": "2022-10-15",
// 		"mark_as_complete": false,
// 		"list_id": "3",
// 		"user_name": "pb17"
// 	}),
// })
// .then(data=> console.log(data))
// .catch(e=> console.log(e.message))































