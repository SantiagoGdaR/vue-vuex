const store = new Vuex.Store({
    state: {
        count: 0,
        userName: 'The',
        userLastName: 'Rock'
    },
    getters: {
        revertName(state) {
            return !state.userName ? state.userName:  state.userName.split("").reverse().join("");
        }
    },
    //mutations are synchronous transactions
    mutations: {
        increment (state) {
            state.count++
        },
        changeName (state, payload) {
            state.userName = payload.userName;
        }
    },
    //instead of mutating the state, actions commit mutations.
    //actions can contain arbitrary asynchronous operations.
    actions: {
        increment (context) {
            return new Promise(function(resolve){
                setTimeout(function(){
                    context.commit('increment');                    
                    resolve(context.rootState.count);
                }, 1000)
            });
        }
    }
});
const UserNameInput = {
    template: `
        <div>
            <input type="text" v-model="userName"/>
            <button @click="add">Add to Counter</button>
        </div>
    `,  
    computed: {
        userName: {
            get () {
              return this.$store.state.userName
            },
            set (value) {
              this.$store.commit('changeName', { userName: value })
            }
        }
    },
    methods: {
        ...Vuex.mapActions({
            add: function(){
                this.$store.dispatch('increment').then(function(count){
                    console.log(count);
                });
            }
        })
    }
};

const UserName = {
    template: `
        <div><span>Reverse User Name: {{ revertName }} Full Name: {{ userFullName }}: </span></div>
    `,  
    //vuex helper to simplify state mapping 
    //in this case using an object as param
    //to map a component computed property 
    //to a couple of state values
    computed: Vuex.mapState({
        userFullName(state){
            return `${state.userName} ${state.userLastName}`;
        },
        //vuex helper to simplify the mapping 
        //of store getters. using spread (...) to add
        //computed properties that results from the map getters
        ...Vuex.mapGetters([
            'revertName'
            // ...
        ])
    })
};

const Counter = {
    template: `
        <div><userName></userName>{{ count }} - Date: {{date}}
        <userNameInput></userNameInput></div>
    `, 
    data: function(){
        return {
            date: new Date().toDateString()
        };
    },   
    components: { UserName, UserNameInput },
    //vuex function to simplify state mapping 
    //in this case using an array of strings
    //to map a component computed property 
    //to the same name of state property
    computed: Vuex.mapState([
        'count'
    ])
};

new Vue({
    el: '#app',
    store,
    components: { Counter },
    // view
    template: `<counter></counter>`
});
