<template>
  <v-container
  style="height: 100%; overflow-y: auto"
  fluid>
    <h2 class="headline grey--text">戦績</h2>
    <v-col class="mt-2">
      <v-row>
        <v-btn-toggle
        v-model="period"
        style="width: 100%;">
          <v-btn
          v-for="(item, index) in periodItems"
          :key="index"
          width="50%"
          height="35px">
            {{item}}
          </v-btn>
        </v-btn-toggle>
      </v-row>
      <v-row class="px-2">
        <v-col class="pa-0 ma-0">
          <v-switch
          v-model="set"
          light
          color="indigo">
            <template v-slot:label>
              <div :class="{isActive: set}" style="font-size: 14px">セット</div>
            </template>
          </v-switch>
        </v-col>
        <v-col class="pa-0 ma-0">
          <v-switch
          v-model="free"
          light
          color="indigo">
            <template v-slot:label>
              <div :class="{isActive: free}" style="font-size: 14px">フリー</div>
            </template>
          </v-switch>
        </v-col>
        <v-col class="pa-0 ma-0">
          <v-select
          v-model="numberOfPlayers"
          :items="numberOfPlayersItems"
          item-text="text"
          item-value="value"
          width="40px"
          light
          style="font-size: 16px;">
          </v-select>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-col>
          <v-row align="center">
            <v-col cols="4" align="center" class="textgrey">対戦数</v-col>
            <v-col cols="8" align="center" class="display-2 font-weight-bold">
              {{score.total}}
            </v-col>
          </v-row>
          <v-divider light></v-divider>
          <v-row align="center">
            <v-col cols="4" align="center" class="textgrey">平均順位</v-col>
            <v-col cols="8" align="center" class="display-2 font-weight-bold">
              {{score.avarage}}
            </v-col>
          </v-row>
          <v-divider light></v-divider>
          <v-row align="center">
            <v-col cols="4" align="center" class="textgrey">順位</v-col>
            <v-col cols="8" align="center" class="display-2 font-weight-bold">
              <span>{{score.first}}</span> -
              <span>{{score.second}}</span> -
              <span>{{score.third}}</span>
              <span v-if="numberOfPlayers == 4"> - </span>
              <span v-if="numberOfPlayers == 4">{{score.fourth}}</span>
            </v-col>
          </v-row>
          <v-divider light></v-divider>
          <v-row align="center" class="my-2 mx-4">
            <v-col>
              <v-row justify="center" class="textgrey">1位率</v-row>
              <v-row justify="center" class="font-weight-bold">{{score.firstRate}}</v-row>
            </v-col>
            <v-col>
              <v-row justify="center" class="textgrey">2位率</v-row>
              <v-row justify="center" class="font-weight-bold">{{score.secondRate}}</v-row>
            </v-col>
            <v-col>
              <v-row justify="center" class="textgrey">3位率</v-row>
              <v-row justify="center" class="font-weight-bold">{{score.thirdRate}}</v-row>
            </v-col>
            <v-col v-if="numberOfPlayers == 4">
              <v-row justify="center" class="textgrey">4位率</v-row>
              <v-row justify="center" class="font-weight-bold">{{score.fourthRate}}</v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class PersonalScoreHome extends Vue {
  period = 0;
  periodItems = [
    "月間",
    "通算"
  ];
  free = false;
  set = true;
  numberOfPlayers = 4;
  numberOfPlayersItems = [
    {
      text: "四麻",
      value: 4
    },
    {
      text: "三麻",
      value: 3
    },
  ]


  // set4 set3 free4 free3
  // 順位のみ
  get set4() {
    let scores = this.$store.getters['Log/scoreBoardsData'];
    let score = scores.filter((score: any) => {
      let date = new Date(score.date);
      let today = new Date();
      if (this.period == 0) {
        return score.rule.numberOfPlayers == 4
        && date.getFullYear() == today.getFullYear()
        && date.getMonth() == today.getMonth()
      } else {
        return score.rule.numberOfPlayers == 4
      }
    })
    let first = 0;
    let second = 0;
    let third = 0;
    let fourth = 0;
    score.forEach((e :any) => {
      first += e.first;
      second += e.second;
      third += e.third;
      fourth += e.fourth;
    })
    return {
      first: first,
      second: second,
      third: third,
      fourth: fourth
    };
  }

  get set3() {
    let scores = this.$store.getters['Log/scoreBoardsData'];
    let score = scores.filter((score: any) => {
      let date = new Date(score.date);
      let today = new Date();
      if (this.period == 0) {
        return score.rule.numberOfPlayers == 3
        && date.getFullYear() == today.getFullYear()
        && date.getMonth() == today.getMonth()
      } else {
        return score.rule.numberOfPlayers == 3
      }
    })
    let first = 0;
    let second = 0;
    let third = 0;
    let fourth = 0;
    score.forEach((e :any) => {
      first += e.first;
      second += e.second;
      third += e.third;
      fourth += e.fourth;
    })
    return {
      first: first,
      second: second,
      third: third,
      fourth: fourth
    };
  }

  get free4() {
    let scores = this.$store.getters['Log/freeScoresData'];
    let score = scores.filter((score: any) => {
      let date = new Date(score.date);
      let today = new Date();
      if (this.period == 0) {
        return score.numberOfPlayers == 4
        && date.getFullYear() == today.getFullYear()
        && date.getMonth() == today.getMonth()
      } else {
        return score.numberOfPlayers == 4
      }
    })
    let first = 0;
    let second = 0;
    let third = 0;
    let fourth = 0;
    score.forEach((e :any) => {
      first += e.first;
      second += e.second;
      third += e.third;
      fourth += e.fourth;
    })
    return {
      first: first,
      second: second,
      third: third,
      fourth: fourth
    };
  }

  get free3() {
    let scores = this.$store.getters['Log/freeScoresData'];
    let score = scores.filter((score: any) => {
      let date = new Date(score.date);
      let today = new Date();
      if (this.period == 0) {
        return score.numberOfPlayers == 3
        && date.getFullYear() == today.getFullYear()
        && date.getMonth() == today.getMonth()
      } else {
        return score.numberOfPlayers == 3
      }
    })
    let first = 0;
    let second = 0;
    let third = 0;
    let fourth = 0;
    score.forEach((e :any) => {
      first += e.first;
      second += e.second;
      third += e.third;
      fourth += e.fourth;
    })
    return {
      first: first,
      second: second,
      third: third,
      fourth: fourth
    };
  }

  get score() {
    let first = 0;
    let second = 0;
    let third = 0;
    let fourth = 0;
    if (this.set == true) {
      if (this.numberOfPlayers == 4) {
        first += this.set4.first;
        second += this.set4.second;
        third += this.set4.third;
        fourth += this.set4.fourth;
      } else if (this.numberOfPlayers == 3) {
        first += this.set3.first;
        second += this.set3.second;
        third += this.set3.third;
      }
    }
    if (this.free == true) {
      if (this.numberOfPlayers == 4) {
        first += this.free4.first;
        second += this.free4.second;
        third += this.free4.third;
        fourth += this.free4.fourth;
      } else if (this.numberOfPlayers == 3) {
        first += this.free3.first;
        second += this.free3.second;
        third += this.free3.third;
      }
    }
    let total = first + second + third + fourth;
    let avarage = "0";
    let firstRate = "0";
    let secondRate = "0";
    let thirdRate = "0";
    let fourthRate = "0";
    if (total !== 0) {
      avarage = ((first * 1 + second * 2 + third * 3 + fourth * 4) / total).toFixed(2);
      firstRate = (first / total * 100).toFixed(1);
      secondRate = (second / total * 100).toFixed(1);
      thirdRate = (third / total * 100).toFixed(1);
      fourthRate = (fourth / total * 100).toFixed(1);
    }
    return {
      total: total,
      avarage: avarage,
      first: first,
      second: second,
      third: third,
      fourth: fourth,
      firstRate: firstRate,
      secondRate: secondRate,
      thirdRate: thirdRate,
      fourthRate: fourthRate,
    }
  }

  created() {
    this.$store.dispatch('Log/startListener');
  }

  destroyed() {
    this.$store.dispatch('Log/stopListener')
  }

}
</script>

<style lang="scss" scoped>
  .isActive {
    font-weight: bolder;
    color: #222;
  }

  .textgrey {
    color: #777;
  }
</style>