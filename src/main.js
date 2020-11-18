import { createApp } from 'vue'
import  store  from './vuex'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Vlf from 'vlf'
import localforage from 'localforage'
import Localbase from 'localbase'
import VueOffline from 'vue-offline'

createApp(App).use(router,Localbase,VueOffline).use(store).mount('#app',store);

//use(store).use(Vlf).use(localforage)