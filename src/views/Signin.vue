<template>
  <v-app>
    <v-container fill-height fluid>
      <v-col class="pa-7">
        <h2>ログイン</h2>
        <v-form ref="form">
          <v-row>
            <v-text-field
            v-model="email"
            type="text"
            :rules="formRules.email"
            :prepend-icon="icons.mdiEmail"
            label="E-mail">
            </v-text-field>
          </v-row>
          <v-row>
            <v-text-field
            v-model="password"
            type="password"
            :rules="formRules.password"
            :prepend-icon="icons.mdiLock"
            label="Password">
            </v-text-field>
          </v-row>
          <v-alert
          type="error"
          class="py-2"
          v-if="errorMessage">
            {{errorMessage}}
          </v-alert>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn
            color="primary"
            class="mb-10"
            height="38px"
            @click="signin()"
            :loading="loading">ログイン</v-btn>
          </v-row>
        </v-form>
        <p>
          <router-link to="/signup" style="text-decoration: none;">アカウントを作成</router-link>
        </p>
      </v-col>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mdiEmail, mdiLock } from '@mdi/js';

@Component({
  components: {
  },
})
export default class Signin extends Vue {
  icons = {
    mdiEmail,
    mdiLock
  }
  email = "";
  password = "";
  loading = false;
  formRules = {
    email: [
      (v: any) => !!v || 'メールアドレスを入力してください',
    ],
    password: [
      (v: any) => !!v || 'パスワードを入力してください',
    ]
  }
  errorMessage = "";

  signin() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.loading = true;
      const user = {
        email: this.email,
        password: this.password,
      }
      this.$store.dispatch('User/signin', user).then(
        value => {
          this.errorMessage = "";
          this.loading = false;
          (this.$refs.form as HTMLFormElement).reset();
          this.$router.push('/');
        }).catch(err => {
          this.loading = false;
          this.errorMessage = err;
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>