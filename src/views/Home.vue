<template>
<v-app>
  <v-navigation-drawer
    v-model="drawer"
    app>
    <v-list dense flat>
      <v-list-item>
        <v-list-item-action>
          <v-icon>home</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-action>
          <v-icon>contact_mail</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Contact</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar
    app
    color="indigo"
    dark
  >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title class="pl-2">Home</v-toolbar-title>
    <v-icon class="ml-auto">person</v-icon>
    <div class="ml-1">{{user.name}}</div>
  </v-app-bar>


  <v-content>
    <v-container
      fluid
      class="pa-0"
      style="height: 100%">
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
    color="deep-purple">
    <v-btn>
      <span>ScoreBoard</span>
      <v-icon>description</v-icon>
    </v-btn>
    <v-btn>
      <span>Free</span>
      <v-icon>language</v-icon>
    </v-btn>
    <v-btn>
      <span>Log</span>
      <v-icon>history</v-icon>
    </v-btn>
    <v-btn>
      <span>PersonalScore</span>
      <v-icon>timeline</v-icon>
    </v-btn>
  </v-bottom-navigation>
</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ScoreBoardHome from '../components/ScoreBoardHome.vue'
import FreeHome from '../components/FreeHome.vue'
import LogHome from '../components/LogHome.vue'
import PersonalScoreHome from '../components/PersonalScoreHome.vue'

@Component({
  components: {
    ScoreBoardHome,
    FreeHome,
    LogHome,
    PersonalScoreHome,
  }
})
export default class Home extends Vue{
  private drawer = null;
  public user = {
    name: "Tetsuo Hirota"
  }
  private nav = 0;
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