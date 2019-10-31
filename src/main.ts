import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import './registerServiceWorker'

import firebase from './firebase'
import vuetify from './plugins/vuetify';

// import * as firebase from 'firebase/app';
// import 'firebase/auth';

// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  // .then(function() {
  //   // Existing and future Auth states are now persisted in the current
  //   // session only. Closing the window would clear any existing state even
  //   // if a user forgets to sign out.
  //   // ...
  //   // New sign-in will be persisted with session persistence.
  //   return firebase.auth().signInWithEmailAndPassword(email, password);
  // })
  // .catch(function(error) {
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  // });

Vue.use(firebase);

Vue.config.productionTip = false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

