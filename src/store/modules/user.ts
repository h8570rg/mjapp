import * as firebase from 'firebase/app';
import {db, auth} from '../../firebase';

const state = {
  id: "",
  email: "",
  name: {
    firstName: "",
    lastName: ""
  },
  nameEng: {
    firstName: "",
    lastName: ""
  },
  nickName: "",
}

const mutations = {
  setUser: (state: any, user: any) => {
    state.id = user.id;
    state.email = user.email;
    state.name = user.name;
    state.nameEng = user.nameEng;
    state.nickName = user.nickName;
  },

  removeUser: (state: any) => {
    state.id = "";
    state.email = "";
    state.name = "";
    state.nameEng = "";
    state.nickName = "";
  }
}

const actions = {
  signin: ({commit}: any, user: any ) => {
    return new Promise((resolve, reject) => {
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(() => {
            return auth.signInWithEmailAndPassword(user.email, user.password).then(
              user => {
                db.collection("users").doc(user.user!.uid).get().then(doc => {
                  let profile = doc.data();
                  profile!.id = user.user!.uid;
                  commit('setUser', profile);
                });
                resolve("");
              },
              err => {
                let msg = "";
                switch (err.code) {
                  case "auth/invalid-email":
                    msg = "メールアドレスが有効ではありません"
                    break;
                  case "auth/user-not-found":
                    msg = "ユーザーが見つかりません"
                    break;
                  case "auth/wrong-password":
                    msg = "パスワードが間違っています"
                    break;
                  default:
                    msg = err.message;
                }
                reject(msg);
              }
            )
          })
          .catch((error) => {
            alert(error.message);
            reject()
          });
    })
  },

  signOut: ({commit}: any) => {
    return new Promise((resolve, reject) => {
      auth.signOut().then(() => {
        commit('removeUser')
        resolve();
      })
    })
  }
}

const getters = {
  user: (state: any) => {
    return state;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}