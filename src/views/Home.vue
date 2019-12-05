<template>
<v-app>
  <v-navigation-drawer
  style="height: 100%;"
    v-model="drawer"
    app>
    <v-list dense flat>
      <v-list-item-group>
        <v-list-item @click="signOut()">
          <v-list-item-action>
            <v-icon>{{icons.mdiLogoutVariant}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item @click="clear()">
          <v-list-item-action>
            <v-icon>delete</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Clear</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar
    app
    color="indigo"
    dark
  >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title class="pl-2">Home</v-toolbar-title>
    <v-icon class="ml-auto">{{icons.mdiAccount}}</v-icon>
    <div class="ml-1">{{user.nameEng.firstName}} {{user.nameEng.lastName}}</div>
  </v-app-bar>


  <v-content
  style="height: 100%">
    <v-container
      fluid
      class="pa-0"
      style="height: 100%;">
      <v-carousel
        v-model="nav"
        :continuous="false"
        :hide-delimiters="true"
        :show-arrows="false"
        height="100%">
        <v-carousel-item>
          <ScoreBoardHome/>
        </v-carousel-item>
        <v-carousel-item>
          <FreeHome/>
        </v-carousel-item>
        <v-carousel-item>
          <LogHome/>
        </v-carousel-item>
        <v-carousel-item>
          <PersonalScoreHome/>
        </v-carousel-item>
      </v-carousel>
    </v-container>
  </v-content>
  
  <v-bottom-navigation
    v-model="nav"
    grow
    app
    color="indigo">
    <v-btn>
      <span>ScoreBoard</span>
      <v-icon>{{icons.mdiPencil}}</v-icon>
    </v-btn>
    <v-btn>
      <span>Free</span>
      <v-icon>{{icons.mdiStore}}</v-icon>
    </v-btn>
    <v-btn>
      <span>History</span>
      <v-icon>{{icons.mdiHistory}}</v-icon>
    </v-btn>
    <v-btn>
      <span>Data</span>
      <v-icon>{{icons.mdiChartBar}}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ScoreBoardHome from '../components/ScoreBoardHome.vue'
import FreeHome from '../components/FreeHome.vue'
import LogHome from '../components/LogHome.vue'
import PersonalScoreHome from '../components/PersonalScoreHome.vue'
import { mdiLogoutVariant, mdiAccount, mdiPencil, mdiStore, mdiHistory, mdiChartBar } from '@mdi/js';

@Component({
  components: {
    ScoreBoardHome,
    FreeHome,
    LogHome,
    PersonalScoreHome,
  }
})
export default class Home extends Vue {
  icons = {
    mdiLogoutVariant,
    mdiAccount,
    mdiPencil,
    mdiStore,
    mdiHistory,
    mdiChartBar
  }
  private drawer = null;
  private nav = 0;
  
  @Watch('nav')
  changeNav() {
    this.$store.dispatch('Display/changeHomeNav', this.nav)
  }

  get user() {
    return this.$store.getters['User/user']
  }

  created() {
    this.nav = this.$store.getters['Display/homeNav'];
  }

  signOut() {
    let result = confirm("本当にログアウトしますか？")
    if (result) {
      this.$store.dispatch('User/signOut').then(() => {
        this.$router.push('/signin');
      })
    }
  }

  clear() {
    let result = confirm("リセットします。データは消えません。")
    if (result) {
      this.$store.dispatch('User/signOut').then(() => {
        this.$router.push('/signin');
        localStorage.clear();
        location.reload();
      })
    }
  }


}
</script>
<style lang="scss" scoped>
@import '../assets/common.scss';

.v-btn:hover:before,
.v-btn:hover::before,
.v-btn:focus-within:before,
.v-btn:focus:before,
.v-btn:focus::before{
  opacity: 0 !important;
}

</style>