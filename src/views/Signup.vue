<template>
<v-app>
    <v-container fill-height fluid>
      <v-col class="pa-7">
        <h2>Sign up</h2>
        <v-form ref="form">
          <v-row>
            <v-text-field
            v-model="email"
            type="text"
            :rules="formRules.email"
            prepend-icon="mail"
            label="E-mail">
            </v-text-field>
          </v-row>
          <v-row>
            <v-text-field
            v-model="password"
            type="password"
            :rules="formRules.password"
            prepend-icon="lock"
            label="Password">
            </v-text-field>
          </v-row>
          <v-row>
            <v-icon>person</v-icon>
            <v-col class="py-0">
              <v-text-field
              v-model="name.lastName"
              type="text"
              :rules="formRules.name"
              label="姓">
              </v-text-field>
            </v-col>
            <v-col class="py-0">
              <v-text-field
              v-model="name.firstName"
              type="text"
              :rules="formRules.name"
              label="名">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-icon>person</v-icon>
            <v-col class="py-0">
              <v-text-field
              v-model="nameEng.lastName"
              type="text"
              :rules="formRules.nameEng"
              label="Family name">
              </v-text-field>
            </v-col>
            <v-col class="py-0">
              <v-text-field
              v-model="nameEng.firstName"
              type="text"
              :rules="formRules.nameEng"
              label="First name">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-text-field
            v-model="nickName"
            type="text"
            :rules="formRules.nickName"
            prepend-icon="account_circle"
            label="Nickname"
            hint="点数表に表示される名前です">
            </v-text-field>
          </v-row>
          <v-alert
          type="error"
          class="py-2"
          v-if="error">
            {{errorMessage}}
          </v-alert>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn
            color="primary"
            class="mb-10"
            height="38px"
            @click="signup()"
            :loading="loading">register</v-btn>
          </v-row>
        </v-form>
        <p>Do you have an account?
          <router-link to="/signin">login</router-link>
        </p>
      </v-col>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import * as firebase from 'firebase/app';
// import 'firebase/auth';

@Component({
  components: {
  },
})
export default class Signup extends Vue {
  email = "";
  password = "";
  name = {
    firstName: "",
    lastName: "",
  };
  nameEng = {
    firstName: "",
    lastName: "",
  };
  nickName = "";

  loading = false;
  error = false;
  errorMessage = "";

  getLen(str: string) {
    var result = 0;
    for(var i=0;i<str.length;i++){
      var chr = str.charCodeAt(i);
      if((chr >= 0x00 && chr < 0x81) ||
        (chr === 0xf8f0) ||
        (chr >= 0xff61 && chr < 0xffa0) ||
        (chr >= 0xf8f1 && chr < 0xf8f4)){
        //半角文字の場合は1を加算
        result += 1;
      }else{
        //それ以外の文字の場合は2を加算
        result += 2;
      }
    }
    //結果を返す
    return result;
  }

  formRules = {
    email: [
      (v: any) => !!v || 'メールアドレスを入力してください',
      // (v: any) => (v && v.length<20) || '長すぎます'
    ],
    password: [
      (v: any) => !!v || 'パスワードを入力してください',
      (v: any) => (v && v.length>=6) || 'パスワードは6文字以上で入力してください'
    ],
    name: [
      (v: any) => !!v || '名前を入力してください',
      // (v: any) => (v && v.length<20) || '長すぎます'
    ],
    nameEng: [
      (v: any) => !!v || '名前を入力してください',
      (v: any) => (v && v.match(/^[A-Za-z]*$/)) || '英語で入力してください'
    ],
    nickName: [
      (v: any) => !!v || 'ニックネームを入力してください',
      (v: any) => (v && this.getLen(v)<11) || '長すぎます'
    ],
    
  }

  signup() {
    // if ((this.$refs.form as HTMLFormElement).validate()) {
    //   this.loading = true
    //   firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
    //     .then(user => {
    //       alert('Create account: '+ user.user!.email);
    //       this.$firestore.collection("users").doc(user.user!.uid).set({
    //         // id: user.user!.uid,
    //         email: this.email,
    //         name: this.name,
    //         nameEng: this.nameEng,
    //         nickName: this.nickName
    //       })
    //       this.error = false;
    //       this.loading = false;
    //       (this.$refs.form as HTMLFormElement).reset();
    //       this.$router.push('/signin');
    //     })
    //     .catch(error => {
    //       this.errorMessage = error.message;
    //       this.error = true;
    //       this.loading = false;
    //       // alert(error.message)
    //     })
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>