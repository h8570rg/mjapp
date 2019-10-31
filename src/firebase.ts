// import Vue from 'vue'
// const VueFire = require('vuefire');

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Vue.use(VueFire)

// // Initialize Cloud Firestore through Firebase
// firebase.initializeApp({
//   apiKey: 'AIzaSyDbmXoy_ycO8X2ox25qznPlNDOl6NBccMY',
//   authDomain: 'mj-app-pwa.firebaseapp.com',
//   projectId: 'mj-app-pwa'
// });

// export const db = firebase.firestore();

// import firebase from 'firebase/app'
// import 'firebase/firestore'

// Get a Firestore instance
// export const db = firebase
//   .initializeApp({ projectId: 'mj-app-pwa' })
//   .firestore()

export default {
  install(Vue: any, options: any) {
    const firebaseApp = firebase.initializeApp({
      apiKey: 'AIzaSyDbmXoy_ycO8X2ox25qznPlNDOl6NBccMY',
      authDomain: 'mj-app-pwa.firebaseapp.com',
      projectId: 'mj-app-pwa'
    })
    Vue.prototype.$firestore = firebaseApp.firestore();
    // Vue.prototype.$auth = firebaseApp.auth();
  }
}