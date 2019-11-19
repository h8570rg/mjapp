import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

// import Home from './views/Home.vue'
// import Signup from './views/Signup.vue'
// import Signin from './views/Signin.vue'
// import ScoreBoard from './views/ScoreBoard.vue'
// import Free from './views/Free.vue'
// import Log from './views/Log.vue'

const Home = () => import('./views/Home.vue')
const Signup = () => import('./views/Signup.vue')
const Signin = () => import('./views/Signin.vue')
const ScoreBoard = () => import('./views/ScoreBoard.vue')
const Free = () => import('./views/Free.vue')
const Log = () => import('./views/Log.vue')

// import * as firebase from 'firebase/app';
// import 'firebase/auth';
import {db, auth} from './firebase';


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
    {
      path: '/log',
      name: 'log',
      component: Log,
    },
  ]
})

router.beforeEach((to, from, next) => {
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    auth.onAuthStateChanged(function (user) {
      if (user) {
        next()
      } else {
        next({
          path: '/signin',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

export default router