import { createApp } from 'vue'
import  store  from './vuex'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Vlf from 'vlf'
import localforage from 'localforage'
import Localbase from 'localbase'

createApp(App).use(router,localforage,Vlf,Localbase).use(store).mount('#app',store);

//use(store).use(Vlf).use(localforage)