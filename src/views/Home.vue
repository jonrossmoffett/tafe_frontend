<template>
  <div >

    <div class="p-4 text-default" :class="getTheme">
      <h1>Welcome to the Aquarama enquiries app.</h1>
      <br>
      <h1>This app was designed to process enquiries for customers who had questions for a retail outlet</h1>
       <br>
      <h1>The app can be installed as a PWA, allowing for the customer to make new enquiries if they are offline</h1>
      <br>
      <h1>Customers may also edit and delete existing enquiries whilest offline</h1>
      <br>
      <h1>once the customer is back online, they may refresh the page, at which point the app will add , update or delete enquiries</h1>
      <br>
      <h1>The app has full functionality offline, however if the user loggs out whilest offline, they will not have any access to this functionality untill they login again.</h1>
      <br>
      <h1>Once an enquiry is set to be solved, the user can only view and delete the enquiry but is unable to edit it</h1>
      <br>
      <h1>The backend is a web service written in php</h1>
      <br>
      <h1>The user is promted with an install banner, if they agree the app will be installed. if not the banner will be hidden unless they clear the local storage in the settings panel</h1>
      <br>
      <h1>The app also allows the user to Undo any of their offline edits before they come back online in the settings panel</h1>
      <br>
      <h1>If the user closes the app, they can still open it at a later point in time and use it offline, so long as they do not logout</h1>
      <br>
      <h1>The app also allows the user to Undo any of their offline edits before they come back online in the settings panel</h1>
      <br>
      <h1>The user can also change the theme of the app</h1>
      <br>
      <h1>the offline edits are stored in an indexDB database</h1>
      <br>
      <h1>the app uses vuex and JWT tokens for the authentication functionality, all requests are validated on the server side, if the token is invalid or expired a 401 status code will be returned, then an axios interceptor will call a vuex function to then log the user out</h1>
      <br>
    </div>
    

  </div>
</template>



<script>
// @ is an alias to /src

import axios from "axios"
import {authComputed} from '../vuex/helpers.js'


export default {
  name: 'Home',
  components: {
  },
  data(){
    return {
      
    }
  },
  computed: {
        ...authComputed,
            GetTheme(){
      return this.$store.state.theme
    }
  },
  created(){

  },
  mounted(){
    
  },methods :{
    logout(){
      this.$store.dispatch('logout')
    }
  }
}

</script>
