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
              <v-icon class="mr-2">group</v-icon>
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
                  {{personalRank(log.scores, log.players).avarage}}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="3">順位</v-col>
                <v-col class="py-0">
                  {{personalRank(log.scores, log.players).first}} -
                  {{personalRank(log.scores, log.players).second}} -
                  {{personalRank(log.scores, log.players).third}} -
                  {{personalRank(log.scores, log.players).fourth}}
                </v-col>
              </v-row>
            </v-card-text>
            <v-btn
              absolute
              style="top: 0; left: 0"
              height="100%"
              width="100%"
              color="transparent"
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
              <v-icon class="mr-2">store</v-icon>
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
                  {{freeRank(log.ranks).avarage}}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" cols="3">順位</v-col>
                <v-col class="py-0">
                  {{freeRank(log.ranks).first}} -
                  {{freeRank(log.ranks).second}} -
                  {{freeRank(log.ranks).third}} -
                  {{freeRank(log.ranks).fourth}}
                </v-col>
              </v-row>
            </v-card-text>
            <v-btn
              absolute
              style="top: 0; left: 0"
              height="100%"
              width="100%"
              color="transparent"
            >
            </v-btn>
          </v-card>

        </div>
      </transition-group>
    </v-col>

    <v-overlay :value="load">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class LogHome extends Vue {
  scoreBoardsRef = this.$firestore.collection("scores");
  freesRef = this.$firestore.collection("users").doc(this.user.id).collection("freeScore")

  load = true;

  get user() {
    return JSON.parse(localStorage.getItem("user") as string);
  }

  scoreBoards: any[] = [];
  parlors: any[] = [];
  get frees() {
    interface scores {
      parlor: string,
      date: {
        year: number,
        month: number,
        day: number,
      },
      ranks: number[],
    }
    let frees: scores[] = [];
    this.parlors.forEach(parlor => {
      parlor.scores!.forEach((score: any) => {
        const date = new Date(score.date);
        const scoreDate = {
          year: date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }
        const free = frees.find((free: scores) => {
          return free.parlor == parlor.name
            && free.date.year == scoreDate.year
            && free.date.month == scoreDate.month
            && free.date.day == scoreDate.day
        })
        if (free !== undefined) {
          free.ranks.push(score.rank)
        } else {
          frees.push(
            {
              parlor: parlor.name,
              date: scoreDate,
              ranks: [score.rank]
            }
          )
        }
      })
    })
    return frees
  }

  get logs() {
    let frees = this.frees.map(free => {
      return {
        date: String(new Date(free.date.year, free.date.month-1, free.date.day)),
        parlor: free.parlor,
        ranks: free.ranks,
      }
    })
    return this.scoreBoards.concat(frees).sort((a: any, b: any) => {
      if (new Date(a.date) < new Date(b.date)) {
          return 1;
        } else {
          return -1;
        }
      }
    );
  }

  

  created() {
    this.freesRef.onSnapshot(querySnapshot => {
      let parlors: any = [];
      querySnapshot.forEach(doc => {
        parlors.push(
          doc.data()
        ) 
      })
      this.parlors = parlors;
    })
    this.scoreBoardsRef.where("players", "array-contains", {id: this.user.id, nickName: this.user.nickName}).onSnapshot(querySnapshot => {
      let scores: any = [];
      querySnapshot.forEach(doc => {
        scores.push(
          doc.data()
        )
      })
      this.scoreBoards = scores;
      Vue.nextTick(() => {
        this.load = false;
      })
    });
  }

  // オブジェクト→配列変換
  formatNestedArrayReverse(obj: any) {
    const arr = Object.keys(obj).map(k => obj[k]);
    return arr;
  }

  // scoreBoard用計算

  // スコアをランクに変換
  changeRank(AllScores: any, players: any) {
    const AllScoresCopy = JSON.parse(JSON.stringify(AllScores));
    let AllRank: any[] = [];
    AllScoresCopy.forEach((scores: any) => {
      let ranks = [];
      const sortedScores = scores.sort((a: any, b: any) => b.score - a.score);
      for (let i = 0; i < players.length; i++) {
        let index = sortedScores.findIndex((score: any) => score.id === players[i].id);
        ranks.push(
          { id: players[i].id, rank: index + 1 }
        )
      }
      AllRank.push(ranks)
    });
    return AllRank;
  }

  // 全員分のランク合計
  totalRank(scores: any, players: any) {
    const AllRank = this.changeRank(scores, players);
    let playerRank = [];
    for (let i = 0; i < players.length; i++) {
      let first = 0;
      let second = 0;
      let third = 0;
      let fourth= 0;
      AllRank.forEach((ranks: any) => {
        ranks.forEach((rank: any) => {
          if(rank.id === players[i].id) {
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
        { id: players[i].id, first: first, second: second, third: third, fourth: fourth }
      )
    }
    return playerRank;
  }

  // 個人のランク合計
  personalRank(scores: any, players: any) {
    const totalRank = (this.totalRank(this.formatNestedArrayReverse(scores), players));
    const rank: any = totalRank.find((e: any) => {
      return e.id === this.user.id;
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
      id: this.user.id,
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


  // freeeeeeeeeeeeeee
  freeRank(ranks: any) {
    const array = ranks;
    let first = 0;
    let second = 0;
    let third = 0;
    let fourth = 0;
    for (let i = 0; i < array.length; i++) {
      switch (array[i]) {
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
    const total = array.reduce((currentTotal:number, score: number) => {
      return score + currentTotal;
    }, 0);
    let avarage: number = total / array.length;
    let firstRatio: string = (first / array.length * 100).toFixed(1);
    let secondRatio: string = (second/ array.length * 100).toFixed(1);
    let thirdRatio: string = (third/ array.length * 100).toFixed(1);
    let fourthRatio: string = (fourth/ array.length * 100).toFixed(1);
    if (total == 0) {
      avarage = 0;
      firstRatio = "0";
      secondRatio = "0";
      thirdRatio = "0";
      fourthRatio = "0";
    }
    return {
      length: array.length,
      avarage: avarage.toFixed(2),
      first: first,
      second: second,
      third: third,
      fourth: fourth,
      firstRatio: firstRatio,
      secondRatio: secondRatio,
      thirdRatio: thirdRatio,
      fourthRatio: fourthRatio
    }
  }

}
</script>

<style lang="scss" scoped>
@import '../assets/common.scss';

</style>