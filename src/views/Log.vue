<template>
<v-app>

  <v-app-bar
    app
    color="indigo"
    dark>
    <v-btn
    icon
    to="/">
      <v-icon>arrow_back_ios</v-icon>
    </v-btn>
    <v-toolbar-title class="pl-1">Log</v-toolbar-title>
    <v-spacer></v-spacer>
    <span class="font-weight-bold">{{title.getFullYear()}} / {{title.getMonth() + 1}} / {{title.getDate()}}</span>
  </v-app-bar>

  <v-content
  style="height: 100%">
    <v-container
    fluid
    class="pa-0"
    style="height: 100%;">
      <v-carousel
        light
        v-model="nav"
        :continuous="false"
        :hide-delimiters="true"
        :show-arrows="false"
        height="100%">

        <v-carousel-item>
          <ScoreBoard />
        </v-carousel-item>

        <v-carousel-item>
          <ScoreBoardData />
        </v-carousel-item>

        <v-carousel-item>
          <ScoreBoardGraph />
        </v-carousel-item>

      </v-carousel>
    </v-container>
  </v-content>

  <v-bottom-navigation
  v-model="nav"
  grow
  app
  color="teal">
    <v-btn>
      <span>Score</span>
      <v-icon>format_list_numbered</v-icon>
    </v-btn>
    <v-btn>
      <span>Data</span>
      <v-icon>insert_chart_outlined</v-icon>
    </v-btn>
    <v-btn>
      <span>Graph</span>
      <v-icon>timeline</v-icon>
    </v-btn>
  </v-bottom-navigation>

</v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ScoreBoard from '../components/Log/ScoreBoard.vue'
import ScoreBoardData from '../components/Log/ScoreBoardData.vue'
import ScoreBoardGraph from '../components/Log/ScoreBoardGraph.vue'

@Component({
  components: {
    ScoreBoard,
    ScoreBoardData,
    ScoreBoardGraph
  },
})
export default class Log extends Vue {
  get title() {
    return new Date(this.$store.getters['Log/selectedScoreBoard'].date);
  }
  nav = 0;
}
</script>

<style lang="scss" scoped>
@import '../assets/common.scss';
</style>