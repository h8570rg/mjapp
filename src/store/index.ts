import Vue from 'vue'
import Vuex from 'vuex'
// import * as firebase from 'firebase/app';
// import 'firebase/firestore';

// firebase.initializeApp({
//   apiKey: 'AIzaSyDbmXoy_ycO8X2ox25qznPlNDOl6NBccMY',
//   authDomain: 'mj-app-pwa.firebaseapp.com',
//   projectId: 'mj-app-pwa'
// });

// import { vuexfireMutations, firestoreAction } from 'vuexfire'
// // const db = require('./db')
// const db = firebase.firestore()

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scores: [],
    Rules: [],
    Users: [],


    // 後でローカルに移す
    login: true,
    user: { id: "000001", name: "Tetsuo Hirota", nickname: "広田", icon: "" },
    myRules: [
      { id: "rule1", lastUse: new Date(2019, 10-1, 10)},
      { id: "rule2", lastUse: new Date(2019, 10-1, 12)},
      { id: "rule3", lastUse: new Date(2019, 10-1, 11)},
    ],
    selectedRule: []
  },
  mutations: {
    // ...vuexfireMutations,
  },
  actions: {

    // bindScores: firestoreAction(({ bindFirestoreRef }) => {
    //   // return the promise returned by `bindFirestoreRef`
    //   return bindFirestoreRef('scores', db.collection('scores'))
    // }),
    // bindRules: firestoreAction(({ bindFirestoreRef }) => {
    //   // return the promise returned by `bindFirestoreRef`
    //   return bindFirestoreRef('rules', db.collection('rules'))
    // }),
    // bindUsers: firestoreAction(({ bindFirestoreRef }) => {
    //   // return the promise returned by `bindFirestoreRef`
    //   return bindFirestoreRef('users', db.collection('users'))
    // }),

    // changeScore: firestoreAction(({state}) => {
    //   db.collection('scores')
    //     .doc('score1')
    //     .update({ date: {year: 200, month: 50, day: 1}, score: { player1: 5,player2: 5,player3: 5,player4: 5} })
    // }),
    // addScore: firestoreAction(({state}) => {
    //   db.collection('scores')
    //     .add(
    //       { date: {year: 200, month: 50, day: 1}, score: { player1: 5,player2: 5,player3: 5,player4: 5} }
    //     )
    // }),
  },
  getters: {
    // getScores: (state: any) => {
    //   return state.scores;
    // },
    // getSelectedRule: ( state: any ) => {
    //   return state.selectedRule;
    // },
    // getUserRule: (state: any) => {
    //   return state.users.find((user: any) => {
    //     return user.id === "000001";
    //   })
    // },
    getMyRules: (state: any) => {
      return state.myRules.sort((a: any, b: any) => {
        if (a.lastUse < b.lastUse) {
          return 1;
        } else {
          return -1;
        }
      }).map((rule: any) => { return rule.id });
    },
    // getRules: (state: any) => {
    //   return db.collection("rules")
    //   .get()
    //   .then((querySnapshot) => {
    //     const documents = querySnapshot.docs.map(doc => doc.data());
    //     return documents
    //   })
    // }
  }
})
