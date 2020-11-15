<template>

  <div>
        <div class="w-screen h-full " :class="GetTheme">
            <form class="flex flex-col  bg-red-400 h-full mx-auto" @submit.prevent="checkForm">
                <div class="flex flex-col">
                        <label for="email" class="w-2/3 mx-auto py-2 text-default" :class="GetTheme">Email</label>
                        <input v-model="email" type="email" name="email" class="w-2/3 mx-auto bg-color1 p-2 text-default" :class="GetTheme">
                </div>
                <div class="flex flex-col">
                        <label for="password" class="w-2/3 mx-auto py-2 text-default " :class="GetTheme">Password</label>
                        <input v-model="password" type="password" name="password" class="w-2/3 mx-auto bg-color1 p-2 text-default" :class="GetTheme">
                </div>

          <div class="flex flex-col w-2/3 mx-auto">
              <div v-for="(errorObject,k) in errors" :key="k">
                  <div v-for="(ErrorMessage,k1) in errorObject" :key="k1" class="py-2 my-2 bg-btnDelete rounded-lg font-bold px-2">
                      <transition name="bounce">
                        {{ErrorMessage}}
                      </transition>
                  </div>     
              </div>
          </div>

                <div class="flex flex-col">
                        <button type="submit" name="button" class="bg-secondary hover:bg-tertiary text-default font-bold py-2 px-4 rounded w-2/3 mx-auto my-5" :class="GetTheme">Submit</button>
                </div>

                <div class="flex flex-col w-2/3 mx-auto py-2 text-default" :class="GetTheme">
                        <router-link to="/register">Dont have an account ? register</router-link>
                </div>
            </form>
        </div>
  </div>

</template>

<script>


import axios from "axios"

export default {

    name: 'login',
    components: {
    },

  data(){
    return{
        email: '',
        password: '',
        device_name: 'test',
        errors : [],
        offlineError : [['You are offline, Please go online to login']]
    }
  },
  computed : {
    GetTheme(){
      return this.$store.state.theme
    }
  },
  methods:{
        login(){

          if(!navigator.onLine){
            this.errors = this.offlineError
          }
          else
          {
            this.$store.dispatch('login', {
              email: this.email,
              password: this.password
            }).then(() => { this.$router.push({ name: 'posts' }) }).catch(error => {
              this.errors = error.response.data
            });
          }

        },

     checkForm (e) {
      this.errors = [];

      if (!this.email) {
        this.errors.push(['Email required.']);
      } else if (!this.validEmail(this.email)) {
        this.errors.push(['Valid email required.']);
      }

      if(!this.password){
        this.errors.push(['Password required.']);
      }else if(this.password.length < 8){
        this.errors.push(['Password needs to be 8 characters']);
      }
      if(!this.password.length > 20 ){
        this.errors.push(['Password needs to be less than 8 characters']);
      }
      if(!this.passwordHasDigit(this.password)){
        this.errors.push(['Password Must contain a number']);
      }
      if(!this.passwordHasLetter(this.password)){
        this.errors.push(['Password Must contain a letter']);
      }

      if (!this.errors.length) {
        this.login();
        return true;
      }

      e.preventDefault();
    },
    validEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    passwordHasDigit (password) {
      var re = /\d/;
      return re.test(password);
    },
    passwordHasLetter(password){
      var re = /[A-Z]/i;
      return re.test(password)
    }    


  },
  created(){
    
  },

  mounted()
  {

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