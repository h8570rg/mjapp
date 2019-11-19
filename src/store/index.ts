import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import Display from './modules/display'
import User from './modules/user'
import ScoreBoard from './modules/scoreBoard'
import Free from './modules/free'
import Log from './modules/log'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
   Display,
   User,
   ScoreBoard,
   Free,
   Log
  },
  plugins: [createPersistedState()]
})
