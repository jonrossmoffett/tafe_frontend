import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import registerUser from '../views/registerUser.vue'
import posts from '../views/posts.vue'
import login from '../views/login.vue'
import store from '../vuex/index'
import settings from '../views/settings.vue'

const routes = [
 
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'registerUser',
    component: registerUser
  },
  {
    path: '/posts',
    name: 'posts',
    component: posts,
    meta: {reqiuiresAuth: true}
  },  
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/settings',
    name: 'settings',
    component: settings,
    meta: {reqiuiresAuth: true}
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to,from,next) => {
  const loggedIn = localStorage.getItem('user')
  if(to.matched.some(record => record.meta.reqiuiresAuth) && !loggedIn){
   next('/')
  }
  next()
});

export default router
