<template>

  <div class="h-screen">

      <div class="h-20  w-screen  flex justify-items-center">
      <button  @click="this.Toggle = true" class=" w-full flex mx-auto mt-2  mr-2 ml-2 rounded-lg">
        <div class="flex h-full w-full bg-secondary justify-items-center" :class="GetTheme">
          <h1 class="text-default flex my-auto mx-auto text-lg text-opacity-25" :class="GetTheme">Add Enquiry +</h1>
        </div>
      </button>

      </div>

<transition name="fade">
  <div v-if="Toggle" class="absolute top-0 left-0 bg-smoke" style="z-index:1;">
    <div class="flex justify-center items-center h-screen w-screen">
      <div class="w-5/6 bg-secondary shadow-lg rounded p-4 justify-items-center" :class="GetTheme">
        <form class="flex flex-col" @submit.prevent="checkEnquiry">
          <label class="text-center flex flex-col pb-2 text-default" :class="GetTheme">Title</label>
          <input v-model="Title" class="w-100 mx-auto w-full h-10 px-2 bg-primary text-default" :class="GetTheme">
          <label class="text-center flex flex-col pb-2 pt-2 text-default" :class="GetTheme">Description</label>
          <textarea v-model="Description" class="mx-auto w-full h-20 bg-primary px-2 hover:bg-gray-300 hover:border-gray-300 border-gray-200 text-default" :class="GetTheme"></textarea>
              <div v-for="(errorObject,k) in errors" :key="k">
                  <div v-for="(ErrorMessage,k1) in errorObject" :key="k1" class="py-2 my-2 bg-btnDelete rounded-lg font-bold px-2">
                      <transition name="bounce">
                        {{ErrorMessage}}
                      </transition>
                  </div>     
              </div>
          <div class="flex justify-evenly my-5 ">
            <button type="button" class="p-3 bg-btnClose flex hover:bg-gray-200 font-bold" @click="ToggleModal"> close </button>
            <button type="submit" name="button" class="bg-btnSubmit hover:bg-gray-200 font-bold p-3">Submit</button>
          </div>
          <transition name="bounce">
          <div v-if="successMsg">
              <h1 class="text-white bg-btnSubmit my-2 p-2">{{successMsg}}</h1>
          </div>
          </transition>
        </form>
      </div>
    </div>
  </div>
</transition>

  

    <half-circle-spinner
    v-if="loading && GetTheme == 'theme-light'"
    class="flex mt-48 mx-auto"
    :animation-duration="1000"
    :size="60"
    :color="'#648ddf'"/>

    <half-circle-spinner
    v-if="loading && GetTheme == 'theme-dark'"
    class="flex mt-48 mx-auto"
    :animation-duration="1000"
    :size="60"
    :color="'#FFFFFF'"/>
  

    <ul id="array-rendering" class="bg-primary" :class="GetTheme">
      <li v-for="post in posts" :key="post.status">
        <Enquiry :Title="post.title" :Description="post.description" :id="post.id" :offline="false" :Status="post.status"></Enquiry>
      </li>
    </ul>

    <ul id="array-rendering" class="bg-btnDelete" :class="GetTheme">
      <li v-for="post in offlinePosts" :key="post.id"  :class="GetTheme">
        <Enquiry  :Title="post.Title" :Description="post.Description" :id="post.key" :offline="true" :Status="post.Status"></Enquiry>
      </li>
    </ul>


  </div>

</template>

<script>

import Enquiry from '@/components/Enquiry.vue'
import axios from "axios"
import Localbase from 'localbase'
import {HalfCircleSpinner} from 'epic-spinners'
let db = new Localbase('db')
db.config.debug = false

export default {

  name: 'posts',
  components: {
  Enquiry,
  HalfCircleSpinner
  },

  data(){
    return{
      posts: [],
      Toggle: false,
      Title: '',
      Description: '',
      errors : [],
      successMsg : '',
      offlinePosts : [],
      loading : true
    }
  },

  computed :{
    GetTheme () {
      return this.$store.state.theme
    },
  },


  methods:{

  showOfflinePosts(){
      alert(this.offlinePosts)
  },

  checkEnquiry(e){

    this.errors = []

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
        this.createEnquiry();
        return true
    }
   

    e.preventDefault();

  },

  createEnquiry(){
    axios.post('https://phpwebservice.herokuapp.com/api/createPost.php',{
      title : this.Title,
      description: this.Description
    }).then( result => {
        this.notifySuccess();
        this.getPosts();
    }).catch(error => {

      if(!navigator.onLine){
        this.errors.push(['Enquiry will be added when you come back online']);
        db.collection('failed-posts').add({
            Title: this.Title,
            Description: this.Description,
            Status: false,
            Sent : false
        }).then(response => {
          console.log("successfully added post to offline")
          this.PopulateOfflinePosts();
        }).catch(error => {
          console.log("there was an error adding the post to offline db")
        })
        
        setTimeout(() => {
        this.ToggleModal();
        this.$router.go()
        }, 2000);

        
    }
    else{
      this.errors = error.response.data;
    }
    });
  },

  getPosts(){
/*   axios.get('https://phpwebservice.herokuapp.com/api/getPosts.php').then(response => {
    this.posts = response.data[0]

    }) */

      setTimeout(()=>{
      
    axios.get('https://phpwebservice.herokuapp.com/api/getPosts.php').then(response => {
      //this.posts = response.data

      this.posts = response.data[0];

        db.collection('edit').orderBy('Title', 'desc').get({ keys: true }).then(users => {
        users.forEach(element => {
          let objIndex = this.posts.findIndex((obj => obj.id == element.data.id));
          console.log(this.posts[objIndex])
          this.posts[objIndex].title = element.data.Title;
          this.posts[objIndex].description = element.data.Description;
        })
      })

      db.collection('delete').orderBy('id', 'desc').get({ keys: true }).then(DeletedPosts => {
        DeletedPosts.forEach(element => {
          let objIndex = this.posts.findIndex((obj => obj.id == element.data.id));
          this.posts.splice(objIndex,1);
        })
      })

  })

    this.PopulateOfflinePosts();

    },500);


  },

  notifySuccess(){
    this.successMsg = "post added";

    setTimeout(() => {
        this.successMsg = '';
        this.ToggleModal();
    }, 2000);
  },

  ToggleModal(){
    if(this.Toggle == true){
      this.Toggle = false
      this.errors = []
    }else{
      this.Toggle = true
      this.errors = []
    }
    this.Title = '',
    this.Description = ''
  },

  PopulateOfflinePosts(){
    db.collection('failed-posts').get({ keys: true }).then(failedPost => {
      failedPost.forEach(element => {
      let newPost = {
        id: element.key,
        Title: element.data.Title,
        Description: element.data.Description,
        Status: element.data.Status,
      }
      //console.log("posts to be added :", newPost) 
      this.offlinePosts.push(newPost)
      })
    })
  },

  processOfflineCreate(){
    db.collection('failed-posts').orderBy('Title', 'desc').get({ keys: true }).then(failedPost=> {
      failedPost.forEach(element => {
        axios.post('https://phpwebservice.herokuapp.com/api/createPost.php',{
        title : element.data.Title,
        description: element.data.Description,
        status: element.data.Status
        }).then(response => {
          //console.log(response)
          element.data.sent = true
        }).catch( err => {
          //console.log(err)
        })

        if(element.data.sent = true){
        db.collection('failed-posts').doc(element.key).delete()
        }

      });
    })
  },

  processOfflineEdit(){
    db.collection('edit').orderBy('Title', 'desc').get({ keys: true }).then(failedEdit => {
      failedEdit.forEach(element => {
        axios.post('https://phpwebservice.herokuapp.com/api/updatePost.php',{
        postId: element.data.id,
        title : element.data.Title,
        description: element.data.Description,
        }).then(response => {
          console.log(response)
          element.data.sent = true
        }).catch( err => {
          console.log(err)
        })
        if(element.data.sent = true){
          db.collection('edit').doc(element.key).delete()
        }
      });
    })
  },

   processOfflineDelete(){
    db.collection('delete').orderBy('id', 'desc').get({ keys: true }).then(failedDelete => {
      failedDelete.forEach(element => {
        axios.delete(`https://phpwebservice.herokuapp.com/api/deletePost.php?postId=${element.data.id}`,{}).then(response => {
          console.log(response)
          element.data.sent = true
          db.collection('delete').doc(element.key).delete()
        }).catch( err => {
      console.log(err)
      })
      });
    })
  }

  //end of methods
  },
  created(){

    if(navigator.onLine){
      this.processOfflineCreate();
      this.processOfflineEdit();
      this.processOfflineDelete();
    }

    setTimeout(()=>{
      
    axios.get('https://phpwebservice.herokuapp.com/api/getPosts.php').then(response => {
      //this.posts = response.data
      this.posts = response.data[0];
        db.collection('edit').orderBy('Title', 'desc').get({ keys: true }).then(users => {
        users.forEach(element => {
          let objIndex = this.posts.findIndex((obj => obj.id == element.data.id));
          console.log(this.posts[objIndex])
          this.posts[objIndex].title = element.data.Title;
          this.posts[objIndex].description = element.data.Description;
        })
      })
      db.collection('delete').orderBy('id', 'desc').get({ keys: true }).then(DeletedPosts => {
        DeletedPosts.forEach(element => {
          let objIndex = this.posts.findIndex((obj => obj.id == element.data.id));
          this.posts.splice(objIndex,1);
        })
      })
      this.loading = false;
    })
  this.PopulateOfflinePosts();
  },800);

  //end of created
  },

  mounted()
  {

  },
}
</script>

<style scoped>

.bg-smoke{
  background-color:rgba(0,0,0,.8);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

</style>