<template>
<v-app>

  <v-app-bar
    app
    color="indigo"
    dark
  >
    <v-btn
      icon
      to="/"
    >
      <v-icon>arrow_back_ios</v-icon>
    </v-btn>
    <v-toolbar-title class="pl-1">Free</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
          <v-list-item
            @click="deleteParlor()"
          >
            <v-list-item-title>削除</v-list-item-title>
          </v-list-item>
        </v-list>
    </v-menu>
  </v-app-bar>

  <v-content
  style="height: 100%;">
    <v-container
    fluid
    style="height: 100%;">

    <!-- タイトル -->
    <v-row style="height: 10%" align="center">
      <v-chip
      class="pa-5"
      color="purple"
      text-color="white"
      label>
        <v-icon class="mr-2">store</v-icon>
        {{parlor.name}}
      </v-chip>
      
    </v-row>

    <!-- ボディ -->
    <v-row style="height: 60%">
      <v-col
      style="height: 100%;">
        <div
        class="display-1 font-weight-bold"
        style="height: 20px; margin-bottom: 10px;">
          履歴
        </div>
        <v-col
        ref="scroll"
        class="pa-0"
        style="overflow-y: auto; height: calc(100% - 40px); position: relative;">
          <v-row
          v-for="(score, index) in scores"
          :key="index"
          class="px-2"
          align="center"
          style="height: 10%; position: relative">
            <v-col class="pa-0" cols="4">
              <div
              class="rank"
              :class="{ first: score.rank == 1, second: score.rank == 2, third: score.rank == 3, fourth: score.rank == 4 }">
                {{score.rank}}
              </div>
            </v-col>
            <v-col class="pa-0" cols="8">
              <v-row>
                <v-col class="pa-0 caption" cols="8">{{new Date(score.date).getFullYear()}}/{{new Date(score.date).getMonth()+1}}/{{new Date(score.date).getDate()}}</v-col>
                <v-col class="pa-0 caption" cols="4">{{new Date(score.date).getHours()}}:{{new Date(score.date).getMinutes()}}</v-col>
              </v-row>
            </v-col>
            <v-btn
            absolute
            style="top: 0; left: 0"
            height="100%"
            width="100%"
            color="transparent"
            depressed
            @click="deleteFlagOn(index)"
            >
            </v-btn>
          </v-row>
        </v-col>
      </v-col>
      <v-col
      style="height: 100%;">
        <div
        class="display-1 font-weight-bold"
        style="height: 20px; margin-bottom: 10px;">
          戦績
        </div>
        <v-col
        class="pa-0"
        style="overflow: hidden; height: calc(100% - 40px);">
          <v-row>
            <v-col cols="7" align="center">対戦数</v-col>
            <v-col cols="5" align="center" class="font-weight-bold">{{totalScore.length}}</v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="7" align="center">平均順位</v-col>
            <v-col cols="5" align="center" class="font-weight-bold">{{totalScore.avarage}}</v-col>
          </v-row>
          <v-divider></v-divider>
          <v-col>
            <v-row class="mb-2" justify="center">順位</v-row>
            <v-row>
              <v-row>
                <v-col class="pa-0 font-weight-bold" align="center">{{totalScore.first}}</v-col>-
                <v-col class="pa-0 font-weight-bold" align="center">{{totalScore.second}}</v-col>-
                <v-col class="pa-0 font-weight-bold" align="center">{{totalScore.third}}</v-col><span v-if="parlor.numberOfPlayers == 4">-</span>
                <v-col class="pa-0 font-weight-bold" align="center" v-if="parlor.numberOfPlayers == 4">{{totalScore.fourth}}</v-col>
              </v-row>
            </v-row>
          </v-col>
          <v-divider></v-divider>
          <v-col class="px-0">
            <v-row>
              <v-col class="py-1" cols="7" align="center">1位率</v-col>
              <v-col class="py-1 font-weight-bold" cols="5" align="center">{{totalScore.firstRatio}}%</v-col>
            </v-row>
            <v-row>
              <v-col class="py-1" cols="7" align="center">2位率</v-col>
              <v-col class="py-1 font-weight-bold" cols="5" align="center">{{totalScore.secondRatio}}%</v-col>
            </v-row>
            <v-row>
              <v-col class="py-1" cols="7" align="center">3位率</v-col>
              <v-col class="py-1 font-weight-bold" cols="5" align="center">{{totalScore.thirdRatio}}%</v-col>
            </v-row>
            <v-row v-if="parlor.numberOfPlayers == 4">
              <v-col class="py-1" cols="7" align="center">4位率</v-col>
              <v-col class="py-1 font-weight-bold" cols="5" align="center">{{totalScore.fourthRatio}}%</v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <!-- 入力 -->
    <v-row style="height: 30%" align="center">
      <v-col>
        <span class="display-1 font-weight-bold">入力</span>
        <v-row class="my-6" justify="center">
          <v-btn-toggle
          v-model.number="rank"
          dense>
            <v-btn
            v-for="n in parlor.numberOfPlayers"
            :key="n"
            :value="n"
            >
              {{n}}
            </v-btn>
          </v-btn-toggle>
        </v-row>
        <v-row class="justify-center">
          <v-btn color="primary" @click="submit()">送信</v-btn>
        </v-row>
      </v-col>
    </v-row>
    </v-container>
  </v-content>

  <!-- 確認モーダル -->
  <v-dialog
  v-model="deleteFlag"
  max-width="600px">
    <v-card>
      <v-col>
        <p>削除しますか？</p>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn text color="blue darken-1" @click="deleteScore()">yes</v-btn>
          <v-btn text color="blue darken-1" @click="deleteFlag = false">no</v-btn>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>

</v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as firebase from 'firebase/app';

@Component({
  components: {
  },
})
export default class ScoreBoard extends Vue {
  scoresRef = this.$firestore.collection("users").doc(this.user.id).collection("freeScore");
  parlor: any = {};
  rank = null;
  scores: any[] = [];
  deleteFlag: boolean = false;
  selectedScoreIndex: number = -1;
  
  get user() {
    return JSON.parse(localStorage.getItem("user") as string)
  }

  created() {
    this.parlor = JSON.parse(localStorage.getItem("selectedParlor") as string);
    this.scoresRef.doc(this.parlor.name).onSnapshot(doc => {
      this.scores = doc.data()!.scores;
      Vue.nextTick(() => {
        let container = (this.$refs.scroll as HTMLElement)
        container.scrollTop = container.scrollHeight;
      })
    })
  }

  submit() {
    if (this.rank !== null) {
      this.scoresRef.doc(this.parlor.name).update({
        scores: firebase.firestore.FieldValue.arrayUnion({ date: String(new Date()), rank: this.rank })
      })
      this.rank = null;
    }
  }

  get totalScore() {
    const array = this.scores!.map((score: any) => {
      return score.rank;
    });
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
    const total = array.reduce((currentTotal, score) => {
      return score + currentTotal;
    }, 0)
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

  deleteFlagOn(index: number) {
    this.selectedScoreIndex = index;
    this.deleteFlag = true;
  }

  deleteScore() {
    this.scoresRef.doc(this.parlor.name).update({
      scores: firebase.firestore.FieldValue.arrayRemove({ date: this.scores[this.selectedScoreIndex].date, rank: this.scores[this.selectedScoreIndex].rank })
    })
    this.deleteFlag = false;
  }

  deleteParlor() {
    this.$router.push('/');
    this.scoresRef.doc(this.parlor.name).delete();
  }
  
}
</script>

<style lang="scss" scoped>
// @import '../assets/common.scss';

.row {
  margin: 0;
}

.rank {
  $size: 25px;
  height: $size;
  width: $size;
  line-height: $size;
  text-align: center;
  border-radius: 20%;
  border: 1px solid #ddd;
  // background-color: pink;
  box-sizing: border-box;
}

.first {
  background-image: linear-gradient(135deg, #a79756, #faf8c5, #a79756);
}
.second {
  background-image: linear-gradient(to top left, #A5A5A5, #BABAC2, #E8E8E8, #A5A5A5, #BABAC2);
}
.third {
  background-image: linear-gradient(to top left, #97461ab7, #fbd8c5e5, #7c3a208c, #e7bea0);
}
.fourth {
  background-color: rgb(133, 133, 133);
  color: white;
}

</style>