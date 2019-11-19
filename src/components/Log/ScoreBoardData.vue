<template>
  <v-col style="height: 100%; overflow-y: auto" class="px-0">
    <v-row class="justify-center ma-0">

      <v-card
      class="my-1 py-2"
      width="82%"
      v-for="data in playerData"
      :key="data.id">
        <v-card-title
        class="py-0 headline teal--text">
          {{data.nickName}}
        </v-card-title>
        <v-card-text
        class="py-0 px-2">
          <v-col
          class="px-5 py-0">
            <v-row class="ma-0 py-1">
              <v-col class="pa-0 text-center">平均順位</v-col>
              <v-col class="pa-0 text-center black--text font-weight-bold display-1">{{data.avarage}}</v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col class="pa-0 text-center">順位</v-col>
              <v-col class="pa-0 text-center black--text font-weight-bold display-1">
                {{data.first}} - {{data.second}} - {{data.third}}<span v-if="rule.numberOfPlayers == 4"> - {{data.fourth}}</span>
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col class="pa-0">
                <v-row class="ma-0 py-1 justify-center">1位率</v-row>
                <v-row class="ma-0 justify-center black--text font-weight-bold">{{data.firstRate}}%</v-row>
              </v-col>
              <v-col class="pa-0">
                <v-row class="ma-0 py-1 justify-center">2位率</v-row>
                <v-row class="ma-0 justify-center black--text font-weight-bold">{{data.secondRate}}%</v-row>
              </v-col>
              <v-col class="pa-0">
                <v-row class="ma-0 py-1 justify-center">3位率</v-row>
                <v-row class="ma-0 justify-center black--text font-weight-bold">{{data.thirdRate}}%</v-row>
              </v-col>
              <v-col class="pa-0" v-if="rule.numberOfPlayers == 4">
                <v-row class="ma-0 py-1 justify-center">4位率</v-row>
                <v-row class="ma-0 justify-center black--text font-weight-bold">{{data.fourthRate}}%</v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-card-text>
      </v-card>
    
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class ScoreBoardData extends Vue {
  get playerData() {
    return this.$store.getters['Log/playerData'];
  }

  get rule() {
    return this.$store.getters['Log/selectedScoreBoard'].rule;
  }
}
</script>

<style lang="scss" scoped>

</style>