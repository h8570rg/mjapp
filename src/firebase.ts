import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyDbmXoy_ycO8X2ox25qznPlNDOl6NBccMY',
  authDomain: 'mj-app-pwa.firebaseapp.com',
  projectId: 'mj-app-pwa'
}

const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();

// export default {
//   firestore,
//   auth,
// }

// // export default {
// //   install(Vue: any, options: any) {
// //     const firebaseApp = firebase.initializeApp({
// //       apiKey: 'AIzaSyDbmXoy_ycO8X2ox25qznPlNDOl6NBccMY',
// //       authDomain: 'mj-app-pwa.firebaseapp.com',
// //       projectId: 'mj-app-pwa'
// //     })
// //     Vue.prototype.$firestore = firebaseApp.firestore();
// //     // Vue.prototype.$auth = firebaseApp.auth();
// //   }
// // }
