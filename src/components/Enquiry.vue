<template>
  <div class="h-20 mt-2 w-screen grid grid-cols-12  px-2">

  
    <div class="h-full col-span-5">
      <div class="bg-secondary h-full flex" :class="GetTheme">
        <h1 class="text-default pl-4 my-auto flex" :class="GetTheme" >{{trim(Title)}}</h1>
      </div>
    </div>

    <div class=" h-full col-span-3 " :class="GetTheme" v-if="GetTheme == 'theme-light'"> 
      <div class="h-full flex bg-secondary" :class="GetTheme" @click="this.Toggle = true">
        <img :src="images.edit" class="w-12 h-12 editIconLight mx-auto " @click="this.Toggle = true" >
      </div>
    </div>

    <div class=" h-full col-span-3 " :class="GetTheme" v-if="GetTheme == 'theme-dark'"> 
      <div class="h-full flex bg-secondary" :class="GetTheme" @click="this.Toggle = true">
        <img :src="images.edit" class="w-12 h-12 editIconDark mx-auto " @click="this.Toggle = true" >
      </div>
    </div>

    <div class="bg-secondary h-full col-span-4  flex items-center" :class="GetTheme"> 
      <h1 class="text-default mx-auto p-2 bg-tertiary rounded-lg" v-if="Status" :class="GetStatusColor">Solved</h1>
      <h1 class="text-default mx-auto p-2 bg-tertiary rounded-lg" v-if="!Status" :class="GetStatusColor">Unsolved</h1>
    </div>




  </div>

<transition name="fade">
    <div v-if="Toggle" class="absolute top-0 left-0 bg-smoke" style="z-index: 1">
    <div class="flex justify-center items-center h-screen w-screen ">
      <div class="w-5/6 bg-secondary shadow-lg rounded p-4 justify-items-center"  :class="GetTheme">
        <form class="flex flex-col bg-secondary" @submit.prevent="checkEdit"  :class="GetTheme">
          <label class="text-center flex flex-col pb-2">Title</label>
          <input v-model="Title" v-if="Status" disabled class="w-100 mx-auto w-full h-10 px-2 bg-gray-800" :class="GetTheme">
          <input v-model="Title" v-if="!Status" class="w-100 mx-auto w-full h-10 px-2 bg-primary" :class="GetTheme">
          <label class="text-center flex flex-col pb-2 pt-2 ">Description</label>
          <textarea v-model="Description" v-if="Status" disabled class="mx-auto w-full h-20 px-2 hover:bg-gray-800 hover:border-gray-100 border-gray-200 " :class="GetTheme"></textarea>
          <textarea v-model="Description" v-if="!Status" class="mx-auto w-full h-20 bg-primary px-2 hover:bg-gray-300 hover:border-gray-300 border-gray-200 " :class="GetTheme"></textarea>
              <div v-for="(errorObject,k) in errors" :key="k">
                  <div v-for="(ErrorMessage,k1) in errorObject" :key="k1" class="py-2 my-2 bg-btnDelete rounded-lg font-bold px-2">
                      <transition name="bounce">
                        {{ErrorMessage}}
                      </transition>
                  </div>     
              </div>
          <div v-if="successMsg" class="py-2 my-2 bg-btnSubmit rounded-lg font-bold px-2">
            {{successMsg}}
          </div>
          <div class="flex justify-evenly my-5 ">
            <button type="button" class="p-3 bg-btnClose flex hover:bg-gray-700 font-bold" @click="this.Toggle = false"> close </button>
            <button type="button" class="p-3 bg-btnDelete flex hover:bg-gray-700 font-bold" @click="submitDelete"> Delete </button>
            <button type="submit" v-if="!Status" name="button" class="bg-btnSubmit hover:bg-gray-700 font-bold p-3">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</transition>




</template>

<script>
import axios from "axios"
import { openDB, deleteDB, wrap, unwrap } from 'idb';
import Vlf from 'vlf'
import localforage from 'localforage'
import Localbase from 'localbase'
let db = new Localbase('db')


export default {
  name: 'Enquiry',
  components: {
 
  },
  props: {
    Title : String,
    Description : String,
    id: Number,
    offline: Boolean,
    Status: Boolean
  },
  data(){
    return{
      Toggle: false,
      errors : [],
      successMsg : '',
      images: {
        edit: require('../assets/icons/icons.svg')
      }
    }
  },
  computed: {
    GetTheme () {
      return this.$store.state.theme
    },
    GetStatusColor(){
      if(this.Status == false){
        return 'bg-btnDelete'
      }
      if(this.Status == true){
        return 'bg-btnSubmit'
      }
    }
  },
  methods : {

     trim(s,len) {
			if(!len) len = 15;
			if(s.length < len) return s;
			return s.substring(0,len-3) + '...';
		},

    ToggleModal(){
    if(this.Toggle == true){
      this.successMsg = '';
      this.Toggle = false
    }else{
      this.successMsg = '';
      this.Toggle = true
    }
    //this.Title = '',
    //this.Description = ''
    },

    submitDelete(){
      axios.delete(`https://phpwebservice.herokuapp.com/api/deletePost.php?postId=${this.id}`,{ }).then(response => {
        this.$router.go(this.$router.currentRoute);
      }).catch(error => {
        console.log(error)

        if(!navigator.onLine){

              this.errors.push(['Your post will be deleted when you come back online']);

             if(this.offline){
               db.collection('failed-posts').doc({ id: this.id }).delete()

              setTimeout(() => {
                this.ToggleModal();
              }, 2000);

               
             }else{
               db.collection('edit').doc({ id: this.id }).delete();
               db.collection('delete').doc({ id: this.id }).add({
                id : this.id,
                sent: false
                });

              setTimeout(() => {
                this.ToggleModal();
                this.$router.go(this.$router.currentRoute);
              }, 2000);
              
             }

            
        }
       
       
      })
    
  
  
  },

  checkEdit(){
    this.errors = [];

    if (this.Title.length < 5) {
        this.errors.push(['Title needs to be atleast 5 characters long']);
    }
    if (this.Title.length > 20) {
        this.errors.push(['Title needs to be atleast 5 characters long']);
    }

    else if (this.Description.length < 20) {
        this.errors.push(['Description needs to be atleast 20 characters long']);
    }
    else if (this.Description.length > 199) {
        this.errors.push(['Description needs to be less than 200 characters long']);
    }

    if (!this.errors.length) {
        this.submitEdit();
    }
  },

    submitEdit(){
      axios.post('https://phpwebservice.herokuapp.com/api/updatePost.php', {
        postId : this.id,
        title : this.Title,
        description: this.Description
      }).then(response => {
        this.errors = [];
        this.successMsg = 'Post Edited';

        setTimeout(() => {
        this.ToggleModal();
        }, 2000);


      }).catch(error => {

        if(!navigator.onLine){
        this.errors = [{
          "errors" : [
            "your enquiry will be modified when you come back online"
          ]
        }]

        if(this.offline){
          db.collection('failed-posts').set([
          {
            Title: this.Title,
            Description: this.Description,
            Status: false,
            _key: this.id
          }
          ], { keys: true })
          
          }
          else
          {
            db.collection('edit').doc({ id: this.id }).delete()
            db.collection('edit').add({
            id: this.id,
            Title: this.Title,
            Description: this.Description,
            Sent : false
            });
        }
        
        setTimeout(() => {
        this.ToggleModal();
        this.$router.go(this.$router.currentRoute);
        }, 2000);

        

      }else{
        this.errors = error.response.data; //user is online but has a validation error
      }



      })//end of catch
    }
  }
}

</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

  .bg-smoke{
  background-color:rgba(0,0,0,.8);
}


</style>

