<template>



<div class="bg-tertiary w-screen min-h-screen flex flex-col" :class="GetTheme">
  
  <div id="nav" class="bg-secondary w-screen flex " :class="GetTheme">

    <div class="p-3 flex-auto text-center text-default" :class="GetTheme">
          <router-link to="/">Home</router-link> 
    </div>

    <div v-if="!loggedIn" class="p-3 flex-auto text-center text-default" :class="GetTheme">
            <router-link to="/register"><h1>register</h1></router-link>
    </div>

    <div v-if="!loggedIn" class="p-3 flex-auto text-center text-default" :class="GetTheme">
            <router-link to="/login"><h1>login</h1></router-link>
    </div>

    <div v-if="loggedIn" class="p-3 flex-auto text-center text-default" :class="GetTheme">
    <router-link to="/posts"><h1>posts</h1></router-link>
    </div>
    

    <div v-if="loggedIn" class="p-3 flex-auto text-center text-default" :class="GetTheme">
            <router-link to="/settings" class="w-12">
            
              
                <h1>Settings</h1>
           
            
            </router-link>
    </div>

  </div>

      <div id="bottom" class="bg-btnDelete w-screen flex flex-row flex-wrap py-2" :class="GetTheme" v-if="Offline">

    <div class="p-3 flex-auto text-center text-default bg-btnDelete" :class="GetTheme">
          You are currently offline
    </div>

    <div class=" p-2 rounded-lg" style="cursor:pointer"  @click="refreshPage">
      <svg class="w-6 rounded-sm bg-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="refresh"><rect width="24" height="24" opacity="0"/><path d="M20.3 13.43a1 1 0 0 0-1.25.65A7.14 7.14 0 0 1 12.18 19 7.1 7.1 0 0 1 5 12a7.1 7.1 0 0 1 7.18-7 7.26 7.26 0 0 1 4.65 1.67l-2.17-.36a1 1 0 0 0-1.15.83 1 1 0 0 0 .83 1.15l4.24.7h.17a1 1 0 0 0 .34-.06.33.33 0 0 0 .1-.06.78.78 0 0 0 .2-.11l.09-.11c0-.05.09-.09.13-.15s0-.1.05-.14a1.34 1.34 0 0 0 .07-.18l.75-4a1 1 0 0 0-2-.38l-.27 1.45A9.21 9.21 0 0 0 12.18 3 9.1 9.1 0 0 0 3 12a9.1 9.1 0 0 0 9.18 9A9.12 9.12 0 0 0 21 14.68a1 1 0 0 0-.7-1.25z"/></g></g></svg>
    </div>

  </div>

<router-view/>

  <div class=" flex flex-grow">
  

  </div>

    <div id="bottom" class="bg-secondary w-screen flex flex-row flex-wrap py-2" :class="GetTheme" v-if="installBtn" >

    <div class="p-3 flex-auto text-center text-default" :class="GetTheme">
          install app ?
    </div>

    <div class=" p-2 rounded-lg" style="cursor:pointer"  @click="installer()">
      <svg class="w-6 rounded-sm bg-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="download"><rect width="24" height="24" opacity="0"/><rect x="4" y="18" width="16" height="2" rx="1" ry="1"/><rect x="3" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 5 18)"/><rect x="17" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 19 18)"/><path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"/><path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"/></g></g></svg>
    </div>

    <div class=" p-2 rounded-lg" style="cursor:pointer"  @click="closeBanner">
      <svg class="w-6 rounded-sm bg-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg>
    </div>

  </div>





  </div>





</template>



<script>

import axios from "axios"
import { computed } from 'vue';
import {authComputed} from './vuex/helpers.js'
//import Vlf from 'vlf'
//import localforage from 'localforage'
import Localbase from 'localbase'
import VueOffline from 'vue-offline'


export default {
  data() {
    return {
      installBtn: true,
      installer: undefined,
      showBanner: true,
      CurrentStatus : '',
      Offline: false,
    };
  },
  computed: {
    ...authComputed,
    GetTheme(){
      return this.$store.state.theme
    },
  },
  created() {
    let db = new Localbase('db')

    if (!navigator.onLine){
      this.Offline = true
    }

    const userString = localStorage.getItem('user');
    if(userString){
      const userData = JSON.parse(userString)
      this.$store.commit('SET_USER_DATA',userData)
    }

    axios.interceptors.response.use(
      response => response,
      error => {
        if(error.response.status === 401){
          this.$store.dispatch('logout')
        }
        return Promise.reject(error)
      }
    )

    let installPrompt;
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      installPrompt = e;
      this.installBtn = true;
    });
    this.installer = () => {
      this.installBtn = false;
      installPrompt.prompt();
      installPrompt.userChoice.then(result => {
        if (result.outcome === "accepted") {
          localStorage.setItem('installed','yes');
        } else {
          localStorage.setItem('installed','no');
        }
      });
    };

    

  },
  mounted(){

    if (localStorage.getItem("theme") === null) {
      this.setTheme('theme-light');
    }else{
      this.setTheme(JSON.parse(localStorage.getItem('theme')));
    }

    this.getInstalled();


  },
  methods : {
      logout(){
      this.$store.dispatch('logout');
    },
    setTheme(theme){
      this.$store.dispatch('setTheme',theme)
    },
    closeBanner(){
      this.installBtn = false;
      localStorage.setItem('installed','yes');
    },
    refreshPage(){
      this.$router.go()
    },
    getInstalled(){
      this.CurrentStatus = localStorage.getItem('installed');
      if(this.CurrentStatus == 'yes'){
        this.installBtn = false;
      }else if(this.CurrentStatus == 'no'){
        this.installBtn = true;
      }
    }
  },

};
</script>



<style src="./assets/css/style.css"></style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap' );


body{
  font-family: 'Poppins', sans-serif;
}

</style>