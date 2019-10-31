<template>
  <v-app>
    <v-container fill-height fluid>
      <v-col class="pa-7">
        <h2>Login</h2>
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
            @click="signin()"
            :loading="loading">login</v-btn>
          </v-row>
        </v-form>
        <p>You don't have an account?
          <router-link to="/signup">create account</router-link>
        </p>
      </v-col>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  components: {
  },
})
export default class Signin extends Vue {
  email = "";
  password = "";

  loading = false;
  error = false;
  errorMessage = "";

  formRules = {
    email: [
      (v: any) => !!v || 'メールアドレスを入力してください',
      // (v: any) => (v && v.length<20) || '長すぎます'
    ],
    password: [
      (v: any) => !!v || 'パスワードを入力してください',
    ]
  }

  signin() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.loading = true;
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
            user => {
              this.$firestore.collection("users").doc(user.user!.uid).get().then(doc => {
                let profile = doc.data();
                profile!.id = user.user!.uid;
                localStorage.setItem("user", JSON.stringify(profile));
                this.$router.push('/');
                this.loading = false;
                this.error = false;
                (this.$refs.form as HTMLFormElement).reset();
              });
            },
            err => {
              this.errorMessage = err.message;
              this.error = true;
              // alert(err.message);
              this.loading = false;
            }
          )
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          this.errorMessage = errorMessage;
          this.error = true;
          // alert(errorMessage);
          this.loading = false;
        });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>