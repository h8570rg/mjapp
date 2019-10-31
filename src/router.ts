import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Signup from './views/Signup.vue'
import Signin from './views/Signin.vue'
import ScoreBoard from './views/ScoreBoard.vue'
import Free from './views/Free.vue'

// import * as firebase from 'firebase/app';
// import 'firebase/auth';

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/index.html',
      redirect: '/'
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin,
    },
    {
      path: '/scoreboard',
      name: 'scoreboard',
      component: ScoreBoard,
    },
    {
      path: '/free',
      name: 'free',
      component: Free,
    },
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    if (localStorage.getItem("user") !== null) {
      next()
    } else {
      next({
        path: '/signin',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router