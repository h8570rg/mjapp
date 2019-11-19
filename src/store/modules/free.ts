import * as firebase from 'firebase/app';
import {db, auth} from '../../firebase';
import {freeScorePersonalData} from './calc';

const usersRef = db.collection("users");
let unsubscribe: any = null;

const state = {
  parlors: [],
  parlor: {},
  personalData: {},
}

const mutations = {
  setParlors: (state: any, parlors: any) => {
    state.parlors = parlors
  },

  setParlor: (state: any, parlor:any) => {
    state.parlor = parlor;
  },

  setPersonalData: (state: any, personalData: any) => {
    state.personalData = personalData;
  }
}

const actions = {
  startListener: ({commit, rootState, state}: any) => {
    unsubscribe = usersRef.doc(rootState.User.id).collection("freeScore").onSnapshot(docs => {
      console.log("listen!");
      let parlors: any[] = []
      docs.forEach(doc => {
        parlors.push({
          name: doc.data().name,
          rate: doc.data().rate,
          numberOfPlayers: doc.data().numberOfPlayers,
          lastUse: doc.data().lastUse,
          scores: doc.data().scores
        });
        if (doc.data().name == state.parlor.name) {
          commit('setPersonalData', freeScorePersonalData(doc.data().scores))
        }
      })
      commit('setParlors', parlors);
    })
  },

  stopListener: ({commit}: any) => {
    console.log("stop!");
    unsubscribe();
  },

  addParlor: ({commit, rootState}: any, parlor: any) => {
    usersRef.doc(rootState.User.id).collection("freeScore").doc(parlor.name).set({
      name: parlor.name,
      rate: parlor.rate,
      numberOfPlayers: parlor.numberOfPlayers,
      lastUse: String(new Date()),
      scores: []
    })
  },
  
  deleteParlor: ({commit, rootState, state}: any) => {
    usersRef.doc(rootState.User.id).collection("freeScore").doc(state.parlor.name).delete();
  },

  addScore: ({commit, rootState, state}: any, rank: number) => {
    usersRef.doc(rootState.User.id).collection("freeScore").doc(state.parlor.name).update({
      scores: firebase.firestore.FieldValue.arrayUnion({ date: String(new Date()), rank: rank })
    })
  },
  
  deleteScore: ({commit, rootState, state}: any, score: any) => {
    usersRef.doc(rootState.User.id).collection("freeScore").doc(state.parlor.name).update({
      scores: firebase.firestore.FieldValue.arrayRemove(score)
    })
  },

  gameStart: ({commit, rootState}: any, parlor: any) => {
    commit('setParlor', parlor);
    usersRef.doc(rootState.User.id).collection("freeScore").doc(parlor.name).update({
      lastUse: String(new Date()),
    })
  },

}

const getters = {
  parlors: (state: any) => {
    return state.parlors.sort((a: any, b: any) => {
      if (new Date(a.lastUse) < new Date(b.lastUse)) {
          return 1;
        } else {
          return -1;
        }
      }
    );
  },

  scores: (state: any) => {
    return state.parlors.find((parlor: any) => {
      return parlor.name == state.parlor.name;
    }).scores;
  },

  parlor: (state: any) => {
    return state.parlor;
  },

  personalData: (state: any) => {
    return state.personalData;
  }
}

export default {
  namespaced: true,
  unsubscribe,
  state,
  mutations,
  actions,
  getters
}