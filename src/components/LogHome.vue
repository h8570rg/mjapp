<template>
<v-container
  style="height: 100%; overflow-y: auto"
  fluid
>
    <h2 class="headline grey--text">履歴</h2>
    <v-col>
      
      <!-- ルールカード -->
      <transition-group name="card">
        <div
          v-for="(log, index) in logs"
          :key="'log' + index"
        >
          <!-- スコアボード -->
          <v-card
            v-if="log.parlor == undefined"
            raised
            color="teal darken-1"
            class="my-2"
          >
            <v-card-title class="headline font-weight-bold py-2">
              <v-icon class="mr-2">{{icons.mdiAccountMultiple}}</v-icon>
              {{new Date(log.date).getFullYear()}} /
              {{new Date(log.date).getMonth()+1}} /
              {{new Date(log.date).getDate()}}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text
              class="ml-1 body-2 font-weight-regular"
            >
              <v-row>
                <v-col class="py-0" cols="3">メンバー</v-col>
                <v-col class="py-0">
                  <span v-for="player in log.players" :key="player.id">
                    {{player.nickName}}
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="3">平均順位</v-col>
                <v-col class="py-0">
                  {{log.avarage}}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="3">順位</v-col>
                <v-col class="py-0">
                  {{log.first}} -
                  {{log.second}} -
                  {{log.third}} -
                  {{log.fourth}}
                </v-col>
              </v-row>
            </v-card-text>
            <v-btn
              absolute
              style="top: 0; left: 0"
              height="100%"
              width="100%"
              color="transparent"
              @click="toScoreBoard(log)"
            >
            </v-btn>
          </v-card>

          <!-- フリー -->
          <v-card
            v-if="log.parlor !== undefined"
            raised
            color="purple darken-1"
            class="my-2"
          >
            <v-card-title class="headline font-weight-bold py-2">
              <v-icon class="mr-2">{{icons.mdiStore}}</v-icon>
              {{new Date(log.date).getFullYear()}} /
              {{new Date(log.date).getMonth()+1}} /
              {{new Date(log.date).getDate()}}
              <v-spacer></v-spacer>
              <span class="caption">@{{log.parlor}}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text
            class="ml-1 body-2 font-weight-regular">
              <v-row>
                <v-col class="py-0" cols="3">平均順位</v-col>
                <v-col class="py-0">
                  {{log.avarage}}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="3">順位</v-col>
                <v-col class="py-0">
                  {{log.first}} -
                  {{log.second}} -
                  {{log.third}} -
                  {{log.fourth}}
                </v-col>
              </v-row>
            </v-card-text>
            <!-- <v-btn
              absolute
              style="top: 0; left: 0"
              height="100%"
              width="100%"
              color="transparent"
            >
            </v-btn> -->
          </v-card>

        </div>
      </transition-group>
    </v-col>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  mdiAccountMultiple,
  mdiStore,
} from '@mdi/js';

@Component({
  components: {
  },
})
export default class LogHome extends Vue {
  icons = {
    mdiAccountMultiple,
    mdiStore
  }
  get scoreBoardsData() {
    return this.$store.getters['Log/scoreBoardsData']
  }

  get freeScoresData() {
    return this.$store.getters['Log/freeScoresData']
  }

  get logs() {
    return this.scoreBoardsData.concat(this.freeScoresData).sort((a: any, b: any) => {
      if (new Date(a.date) < new Date(b.date)) {
          return 1;
        } else {
          return -1;
        }
      }
    );
  }

  created() {
    this.$store.dispatch('Log/startListener');
  }

  destroyed() {
    this.$store.dispatch('Log/stopListener')
  }

  toScoreBoard(log: any) {
    this.$store.dispatch('Log/selectScoreBoard', log),
    this.$router.push('/log')
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/common.scss';

</style>