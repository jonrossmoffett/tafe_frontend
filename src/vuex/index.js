import { createStore} from "vuex";
import axios from "axios";
import router from '../router/index.js'

export default createStore({

  state: {
    user: null,
    apiURL: 'https://phpwebservice.herokuapp.com',
    //apiURL: 'http://localhost:8000'
    theme: 'theme-dark'
  },
  mutations: {
    SET_USER_DATA(state, userData){
      state.user = userData
      localStorage.setItem('user',JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData}`
    },
    CLEAR_USER_DATA(){
      localStorage.removeItem('user')
      location.reload();
    },
    SET_THEME(state,newTheme){
      state.theme = newTheme;
      localStorage.removeItem('theme');
      localStorage.setItem('theme',JSON.stringify(newTheme));
    }
  },
  actions: {
    register({commit},credentials){
      return axios.post(`${this.state.apiURL}/api/register.php`,credentials).then(
        ({data}) => {
          commit('SET_USER_DATA',data)
          alert(data);
        }
      )
    },    
    login({commit},credentials){
      return axios.post(`${this.state.apiURL}/api/login.php`,credentials).then(
        ({data}) => {
          commit('SET_USER_DATA',data)
        }
      )
    },
    logout({commit}){
      commit('CLEAR_USER_DATA'); 
    },
    setTheme({commit},theme){
      commit('SET_THEME',theme)
    }
  },
  getters: {
    loggedIn(state){
      return !!state.user
    },
    getApiUrl(state){
      return state.apiURL
    },
    getTheme(state){
      return state.theme
    }
  },
  modules: {
  }
})
