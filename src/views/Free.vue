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
    <v-toolbar-title class="pl-1">Free</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>save</v-icon>
    </v-btn>
    <v-menu>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
          <v-list-item
            v-for="n in 5"
            :key="n"
            @click="() => {}"
          >
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
    </v-menu>

  </v-app-bar>

  <v-content>
    <v-container
    fluid
    class=""
    style="height: 100%;">

    <!-- タイトル -->
    <v-row style="height: 10%">
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
      <v-col>
        <span class="display-1 font-weight-bold">履歴</span>
      </v-col>
      <v-col>
        <span class="display-1 font-weight-bold">戦績</span>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <!-- 入力 -->
    <v-row style="height: 30%" align="center">
      <v-col>
        <span class="display-1 font-weight-bold">入力</span>
        <v-row class="my-6" justify="center">
          <v-btn-toggle
          v-model="rank"
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

</v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class ScoreBoard extends Vue {
  parlor: any = {};
  rank = null;
  scores: any[] = [];
  get user() {
    return JSON.parse(localStorage.getItem("user") as string)
  }

  created() {
    this.parlor = JSON.parse(localStorage.getItem("selectedParlor") as string);
    this.$firestore.collection("users").doc(this.user.id).collection("freeScore").doc(this.parlor.name).get().then(doc => {
      if(doc.exists) {
        if (doc.data()!.scores !== undefined) {
          this.scores = Array(doc.data()!.scores);
        }
      }
    })
  }

  submit() {
    if (this.rank == null) {
      console.log("null!");
    } else {
      this.scores.push(
        { date: new Date(), rank: this.rank }
      )
      this.$firestore.collection("users").doc(this.user.id).collection("freeScore").doc(this.parlor.name).set({
        scores: this.scores
      })
      console.log(this.scores);
      this.rank = null;
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '../assets/common.scss';

.row {
  margin: 0;
}

</style>