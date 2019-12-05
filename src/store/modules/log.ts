import * as firebase from 'firebase/app';
import {db, auth} from '../../firebase';

import {
  scoreBoardData,
  scoreBoardPersonalData,
  freeScorePersonalData
} from './calc'

const usersRef = db.collection("users");
const scoreBoardsRef = db.collection("scores");
let unsubscribe1: any = null;
let unsubscribe2: any = null;

const state = {
  scoreBoards: [],
  freeScores: [],
  selectedScoreBoard: {},
}

const mutations = {
  setScoreBoards : (state: any, scoreBoards: any) => {
    state.scoreBoards = scoreBoards;
  },

  setFreeScores: (state: any, freeScores: any) => {
    state.freeScores = freeScores;
  },

  setSelectedScoreBoard: (state: any, scoreBoard: any) => {
    state.selectedScoreBoard = scoreBoard;
  }
}

const actions = {
  startListener: ({commit, rootState}: any) => {
    unsubscribe1 = scoreBoardsRef.where("players", "array-contains", {id: rootState.User.id, nickName: rootState.User.nickName}).onSnapshot(querySnapshot => {
      let scoreBoards: any = [];
      querySnapshot.forEach(doc => {
        scoreBoards.push({
          date: doc.data().date,
          players: doc.data().players,
          rule: doc.data().rule,
          scores: Object.keys(doc.data().scores).map(k => doc.data().scores[k]),
          chips: doc.data().chips
        })
      })
      commit('setScoreBoards', scoreBoards);
    });

    unsubscribe2 = usersRef.doc(rootState.User.id).collection("freeScore").onSnapshot(docs => {
      console.log("listen!");
      let freeScores: any[] = []
      docs.forEach(doc => {
        doc.data().scores.forEach((score: any) => {
          const date = new Date(score.date);
          const scoreDate = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
          }
          const freeScore = freeScores.find((free: any) => {
            return free.parlor == doc.data().name
              && free.date.year == scoreDate.year
              && free.date.month == scoreDate.month
              && free.date.day == scoreDate.day
          })
          if (freeScore !== undefined) {
            freeScore.ranks.push({rank: score.rank, date: score.date})
          } else {
            freeScores.push(
              {
                parlor: doc.data().name,
                numberOfPlayers: doc.data().numberOfPlayers,
                date: {
                  year: scoreDate.year,
                  month: scoreDate.month,
                  day: scoreDate.day,
                },
                ranks: [{rank: score.rank, date: score.date}]
              }
            )
          }
        })
      })
      commit('setFreeScores', freeScores);
    });
  },

  stopListener: ({commit}: any) => {
    console.log("stop!");
    unsubscribe1();
    unsubscribe2();
  },

  selectScoreBoard: ({commit}: any, log: any) => {
    commit('setSelectedScoreBoard', log);
  }
}

const getters = {
  scoreBoardsData: (state: any, getters: any, rootState: any) => {
    let scoreBoardsData: any[] = [];
    state.scoreBoards.forEach((e: any) => {
      const pd = scoreBoardPersonalData(e, rootState.User.id);
      scoreBoardsData.push({
        date: e.date,
        players: e.players,
        rule: e.rule,
        chips: e.chips,
        scores: e.scores,
        avarage: pd.avarage,
        first: pd.first,
        second: pd.second,
        third: pd.third,
        fourth: pd.fourth,
        firstRate: pd.firstRate,
        secondRate: pd.secondRate,
        thirdRate: pd.thirdRate,
        fourthRate: pd.fourthRate,
      })
    })
    return scoreBoardsData;
  },

  freeScoresData: (state: any) => {
    let freeScoresData: any[] = [];
    state.freeScores.forEach((e: any) => {
      const pd = freeScorePersonalData(e.ranks);
      freeScoresData.push({
        parlor: e.parlor,
        numberOfPlayers: e.numberOfPlayers,
        date: String(new Date(e.date.year, e.date.month, e.date.day)),
        ranks: e.ranks,
        length: pd.length,
        avarage: pd.avarage,
        first: pd.first,
        second: pd.second,
        third: pd.third,
        fourth: pd.fourth,
        firstRatio: pd.firstRatio,
        secondRatio: pd.secondRatio,
        thirdRatio: pd.thirdRatio,
        fourthRatio: pd.fourthRatio
      })
    })
    return freeScoresData;
  },

  selectedScoreBoard: (state: any) => {
    return state.selectedScoreBoard;
  },

  // selectedScoreBoardの全員分データ
  playerData: (state: any) => {
    return scoreBoardData({
      players: state.selectedScoreBoard.players,
      scores: state.selectedScoreBoard.scores
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