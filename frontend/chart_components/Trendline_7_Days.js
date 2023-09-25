export default {
	  template:`
      <div>
      <canvas id="myChart" ref="chart" style="width:100%; max-width:300px; height:50px;"></canvas>
      
      <input type="hidden" v-bind='task.task_id'/> 
      </div>`,

    props: ['task', 'label', 'belongs_to'],

    data() {
      return {plot_data: {
        labels: [],
        datasets: [
          {
            label: 'this.label',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: "",
            num:0,
          },
        ],
      },}
    },
  
  beforeMount() {
    if (!localStorage.getItem('auth-token')) this.$router.push({name:'login_signup'}); 
  },

    computed: {

      config() {
        this.num+=1
        return {
          type: 'line',
          data: this.plot_data,
          options: {},
        }
      },
    
    },

    methods: {
      
      formatDate(date){
        return date.getDate() + "-" + `${date.getMonth()+1}`+"-" + `${date.getFullYear()}`
      },

    computeLast_7_Days(data, belongs){
        let today = new Date()
        let date_list = []
        let list_values = []
        for (let i=1;i<8;i++){
          let some_date= new Date()
          some_date = some_date.setDate(some_date.getDate() -i);
          let result = new Date(some_date)
          date_list.push(this.formatDate(result))
          list_values.push(0)
        }
        for(let index in date_list){
          for (let elem of data){
            if (belongs=="deadline") {
              var date = new Date(elem.deadline)
            }
            if (belongs=="complete") {
              var date = new Date(elem.completion_date)
            }
            if (belongs=="created") {
              var date = new Date(elem.start_date)
            }
            date = this.formatDate(date)
            if (date==date_list[index]) list_values[index]+=1
          }
        }

        return [date_list, list_values]
      },

      click(){
      new Chart(this.$refs.chart, this.config)
      },
        
        //second method
    },

    // watch: {
    //   num(newValue){
    //     this.
    //   }
    // },

    updated(){
      let result = this.computeLast_7_Days(this.task, this.belongs_to)
      this.plot_data.labels = result[0]
      this.plot_data.datasets[0].data = result[1]
      this.plot_data.datasets[0].label = this.label

      new Chart(this.$refs.chart, this.config)
    },


}

//