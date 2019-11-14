<template>
  <v-col style="height: 100%; overflow-y: auto" class="px-0">
    <v-row class="justify-center ma-0">

      <v-card
      class="my-1 py-2"
      width="82%"
      v-for="player in players"
      :key="player.id">
        <v-card-title
        class="py-0 headline teal--text">
          {{player.nickName}}
        </v-card-title>
        <v-card-text
        class="py-0 px-2">
          <v-col
          class="px-5 py-0">
            <v-row class="ma-0 py-1">
              <v-col class="pa-0 text-center">平均順位</v-col>
              <v-col class="pa-0 text-center black--text font-weight-bold display-1">{{personalRank(player.id).avarage}}</v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col class="pa-0 text-center">順位</v-col>
              <v-col class="pa-0 text-center black--text font-weight-bold display-1">{{personalRank(player.id).first}} - {{personalRank(player.id).second}} - {{personalRank(player.id).third}} - {{personalRank(player.id).fourth}}</v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col class="pa-0">
                <v-row class="ma-0 py-1 justify-center">1位率</v-row>
                <v-row class="ma-0 justify-center black--text font-weight-bold">{{personalRank(player.id).firstRate}}%</v-row>
              </v-col>
              <v-col class="pa-0">
                <v-row class="ma-0 py-1 justify-center">2位率</v-row>
                <v-row class="ma-0 justify-center black--text font-weight-bold">{{personalRank(player.id).secondRate}}%</v-row>
              </v-col>
              <v-col class="pa-0">
                <v-row class="ma-0 py-1 justify-center">3位率</v-row>
                <v-row class="ma-0 justify-center black--text font-weight-bold">{{personalRank(player.id).thirdRate}}%</v-row>
              </v-col>
              <v-col class="pa-0">
                <v-row class="ma-0 py-1 justify-center">4位率</v-row>
                <v-row class="ma-0 justify-center black--text font-weight-bold">{{personalRank(player.id).fourthRate}}%</v-row>
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
  @Prop()
  parentPlayers!: any;

  @Prop()
  parentScores!: any;

  get players() {
    return this.parentPlayers;
  }

  get scores() {
    return this.parentScores;
  }

  // スコアをランクに変換
  changeRank(AllScores: any) {
    let AllRank: any[] = [];
    AllScores.forEach((scores: any) => {
      let ranks = [];
      const sortedScores = scores.sort((a: any, b: any) => b.score - a.score);
      for (let i = 0; i < this.players.length; i++) {
        let index = sortedScores.findIndex((score: any) => score.id === this.players[i].id);
        ranks.push(
          { id: this.players[i].id, rank: index + 1 }
        )
      }
      AllRank.push(ranks)
    });
    return AllRank;
  }

  // 全員分のランク合計
  get totalRank() {
    let AllRank = this.changeRank(this.scores);
    let playerRank = [];
    for (let i = 0; i < this.players.length; i++) {
      let first = 0;
      let second = 0;
      let third = 0;
      let fourth= 0;
      AllRank.forEach((ranks: any) => {
        ranks.forEach((rank: any) => {
          if(rank.id === this.players[i].id) {
            switch (rank.rank) {
              case 1:
                first += 1;
                break;
              case 2:
                second += 1;
                break;
              case 3:
                third += 1;
                break;
              case 4:
                fourth += 1;
                break;
            }
          } 
        })
      })
      playerRank.push(
        { id: this.players[i].id, first: first, second: second, third: third, fourth: fourth }
      )
    }
    return playerRank;
  }

  // 個人のランク合計
  personalRank(id: string) {
    let rank: any = this.totalRank.find((e: any) => {
      return e.id === id;
    });
    let first = rank.first;
    let second = rank.second;
    let third = rank.third;
    let fourth = rank.fourth;
    let total = (first + second + third + fourth)
    let avarage = (first * 1 + second * 2 + third * 3 + fourth * 4) / total;
    let firstRate = (first / total * 100);
    let secondRate = (second / total * 100);
    let thirdRate = (third / total * 100);
    let fourthRate = (fourth / total * 100);
    if (total == 0) {
      avarage = 0;
      firstRate = 0;
      secondRate = 0;
      thirdRate = 0;
      fourthRate = 0;
    }
    return {
      id: id,
      avarage: avarage.toFixed(2),
      first: first,
      second: second,
      third: third,
      fourth: fourth,
      firstRate: firstRate.toFixed(1),
      secondRate: secondRate.toFixed(1),
      thirdRate: thirdRate.toFixed(1),
      fourthRate: fourthRate.toFixed(1),
    }
  }


}
</script>

<style lang="scss" scoped>

</style>