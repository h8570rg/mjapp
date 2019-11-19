// import * as firebase from 'firebase/app';
import {db, auth} from '../../firebase';
const scoresRef = db.collection("scores");
const usersRef = db.collection("users");

import {scoreBoardData, scoreBoardPersonalData} from './calc'

function formatNestedArray(arr: any) {
  interface obj {
    [key: string]: any;
  }
  const obj: obj = {};
  for (let i = 0; i < arr.length; i++) {
    obj[i] = arr[i];
  }
  return obj;
}

const state = {
  rules: [],
  rule: "",
  title: "",
  players: [
    { id: "player1", nickName: "player1" },
    { id: "player2", nickName: "player2" },
    { id: "player3", nickName: "player3" },
    { id: "player4", nickName: "player4" },
  ],
  scores: [],
  chips: [],
}

const mutations = {
  addRule: (state: any, rule: any) => {
    state.rules.push(rule)
  },
  
  changeLastUse: (state: any, rule: any) => {
    state.rules.find((e: any) => {
      return e.title == rule.title;
    }).lastUse = String(new Date());
  },

  setRule: (state: any, rule: any) => {
    state.rule = rule;
  },

  setTitle: (state: any) => {
    state.title = String(new Date());
  },

  changePlayer: (state: any, {index, id, nickName}: any ) => {
    state.players[index] = {
      id: id,
      nickName: nickName,
    }
  },

  changePlayerScore: (state: any, {oldId, newId}: any) => {
    state.scores.forEach((score: any) => {
      score.forEach((e: any) => {
        if(e.id == oldId) {
          e.id = newId;
        }
      })
    })
  },

  addPlayer: (state: any, {id, nickName}: any) => {
    state.players.push({
      id: id,
      nickName: nickName
    })
  },

  deletePlayer: (state: any, index: number) => {
    state.players.splice(index, 1);
  },

  changeScore: (state: any, {index, scores}: any) => {
    if (state.scores.length <= index) {
      state.scores.push(scores);
    } else {
      state.scores[index] = scores;
    }
  },

  deleteScore: (state: any, index: number) => {
    state.scores.splice(index, 1);
  },

  changeChips: (state: any, chips: any) => {
    state.chips = chips;
  },

  reset: (state: any) => {
    state.title = String(new Date());
    if (state.rule.numberOfPlayers == 4) {
      state.players = [
        { id: "player1", nickName: "player1" },
        { id: "player2", nickName: "player2" },
        { id: "player3", nickName: "player3" },
        { id: "player4", nickName: "player4" },
      ];
    } else if (state.rule.numberOfPlayers == 3) {
      state.players = [
        { id: "player1", nickName: "player1" },
        { id: "player2", nickName: "player2" },
        { id: "player3", nickName: "player3" },
      ];
    }
    state.scores = [];
    state.chips = [];
  },
}

const actions = {
  addRule: ({commit}: any, rule: any) => {
    commit('addRule', rule);
  },

  gameStart: ({commit}: any, rule: any) => {
    commit('setRule', rule);
    commit('changeLastUse', rule);
    commit('setTitle');
  },
  
  changePlayer: ({commit}: any, {index, id, nickName}: any) => {
    commit('changePlayer', {index: index, id: id, nickName: nickName});
  },

  changePlayerScore: ({commit}: any, {oldId, newId}: any) => {
    commit('changePlayerScore', {oldId: oldId, newId: newId});
  },

  addPlayer: ({commit}: any, {id, nickName}: any) => {
    commit('addPlayer', {id: id, nickName: nickName});
  },

  deletePlayer: ({commit}: any, index: number) => {
    commit('deletePlayer', index);
  },

  changeScore: ({commit}: any, {index, scores}: any) => {
    commit('changeScore', {index: index, scores: scores});
  },

  deleteScore: ({commit}: any, index: number) => {
    commit('deleteScore', index);
  },

  changeChips: ({commit}: any, chips: any) => {
    commit('changeChips', chips);
  },

  reset: ({commit}: any) => {
    commit('reset');
  },

  save: ({state}: any) => {
    scoresRef.doc(state.title).set({
      date: String(new Date()),
      players: state.players,
      scores: formatNestedArray(state.scores),
      rule: state.rule,
      chips: state.chips
    });
  },

  searchPlayers: () => {
    return new Promise((resolve, reject) => {
      let players: any[] = [];
      usersRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc: any) => {
          players.push(
            {
              id: doc.id,
              nickName: doc.data().nickName,
              name: doc.data().name,
              email: doc.data().email
            }
          )
        })
        resolve(players);
      });
    })
  },
}

const getters = {
  rules: (state: any) => {
    return state.rules;
  },

  sortedRulesByLastUse: (state: any) => {
    return state.rules.sort((a: any, b: any) => {
      if (new Date(a.lastUse) < new Date(b.lastUse)) {
          return 1;
        } else {
          return -1;
        }
      }
    )
  },

  rule: (state: any) => {
    return state.rule;
  },

  title: (state: any) => {
    return state.title;
  },

  players: (state: any) => {
    return state.players;
  },

  scores: (state: any) => {
    return state.scores;
  },

  chips: (state: any) => {
    return state.chips;
  },

  playerData: (state: any) => {
    return scoreBoardData({
      players: state.players,
      scores: state.scores
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}