<template>
  <div class="bg-tertiary w-full h-auto" :class="GetTheme">
    <div class="bg-secondary h-full m-2 p-2 rounded " :class="GetTheme">
    <div class="flex">
        <h1 class="text-default p-2" :class="GetTheme">Theme:</h1>
        <button class="ml-2 p-2 text-default border-tertiary border-solid border-2 rounded-lg" @click="this.$store.dispatch('setTheme','theme-light')" :class="GetTheme"> Light</button>
        <button class="ml-2 p-2 text-default border-tertiary border-solid border-2 rounded-lg" @click="this.$store.dispatch('setTheme','theme-dark')" :class="GetTheme"> Dark</button>
    </div>

    </div>


        <div class="bg-secondary h-full m-2 p-2 rounded " :class="GetTheme">
    <div class="flex">
      <div>
          <button class="ml-2 p-2 border-tertiary border-solid border-2 rounded-lg text-default" :class="GetTheme" @click="logout">Logout</button>
      </div>
    </div>
      <p class="m-2 p-2 text-default" :class="GetTheme">Note, you will not be able to use the app offline or online if you logout</p>
    </div>

    <div class="bg-secondary h-full m-2 p-2 rounded " :class="GetTheme">
    <div class="flex">
      <div>
          <button class="ml-2 p-2 border-tertiary border-solid border-2 rounded-lg text-default" :class="GetTheme" @click="clearLocalStorage">Clear Localstorage</button>
      </div>
    </div>
      <p class="m-2 p-2 text-default" :class="GetTheme">Resets Theme</p>
      <p class="m-2 p-2 text-default" :class="GetTheme">Resets install banner prompt</p>
    </div>

    <div class="bg-secondary h-full m-2 p-2 rounded-l " :class="GetTheme">
    <div class="flex">
      <div>
          <button class="ml-2 p-2 text-default border-tertiary border-solid border-2 rounded-lg" @click="clearOfflineEdits">Clear OfflineEdits</button>
      </div>
    </div>
    <p class="m-2 p-2 text-default" :class="GetTheme">Clears any edits that were made offline</p>
    </div>

  </div>
</template>

<script>
import Localbase from 'localbase';
let db = new Localbase('db');

export default {
    name: 'settings',
    data(){
      return {

      }
    },
    computed : {
        GetTheme (){
            this.$store.state.theme
        }
    },
    created(){

    },
    methods :{
      clearOfflineEdits(){
      db.collection('failed-posts').set([]);
      db.collection('edit').set([]);
      db.collection('delete').set([]);
      },

      clearLocalStorage(){
        localStorage.removeItem('theme');
        localStorage.removeItem('showBanner');
        localStorage.removeItem('installed');
        localStorage.removeItem('theme');
      },

    logout(){
      this.$store.dispatch('logout');
      this.$router.go(this.$router.currentRoute);
    }


    }

}
</script>