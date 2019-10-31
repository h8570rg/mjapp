import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
// const createPersistedState = require('vuex-persistedstate')
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
    homeNav: 0,
  },
  mutations: {
    changeHomeNav: (state: any, nav: number) => {
      state.homeNav = nav;
    }
  },
  actions: {
    changeHomeNav: ({ commit }, nav: number) => {
      commit('changeHomeNav', nav);
    }
  },
  getters: {
    homeNav: (state: any) => {
      return state.homeNav;
    }
  },
})
