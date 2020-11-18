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

export default {
  data() {
    return {
      installBtn: true,
      installer: undefined,
      showBanner: true,
      CurrentStatus : ''
    };
  },
  computed: {
    ...authComputed,
    GetTheme(){
      return this.$store.state.theme
    }
  },
  created() {
    let db = new Localbase('db')

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