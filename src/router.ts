import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ScoreBoard from './views/ScoreBoard.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/index.html',
      component: Home,
      alias: '/',
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/scoreboard',
      name: 'scoreboard',
      component: ScoreBoard,
    },

  ]
})
