<template>
<v-app>

  <v-app-bar
    app
    color="indigo"
    dark>
    <v-btn
    icon
    to="/">
      <v-icon large>{{icons.mdiChevronLeft}}</v-icon>
    </v-btn>
    <v-toolbar-title class="pl-1">ScoreBoard</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="reset()">
      <v-icon>{{icons.mdiDelete}}</v-icon>
    </v-btn>
    <v-btn icon @click="save()">
      <v-icon>{{icons.mdiContentSave}}</v-icon>
    </v-btn>
    <v-btn icon @click="openPlayerAddModal()">
      <v-icon>{{icons.mdiAccountPlus}}</v-icon>
    </v-btn>

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
        <!-- ヘッダー -->
        <v-col
        class="header align-center py-0">
          <v-row
          class="flex-nowrap">
            <v-col
            :cols="tableHead"
            class="pa-0">
            </v-col>
            <v-col
            class="py-3 px-0"
            style="overflow: hidden; white-space: nowrap; position: relative; height: 40px"
            v-for="(player, index) in players"
            :key="player.id">
              <span class="playerName" :class="{linked: player.id.length > 12}">{{player.nickName}}</span>
              <v-btn
              absolute
              text
              tile
              color="#AAA"
              style="top: 0; left: 0; border-radius: 5px"
              height="100%"
              width="100%"
              class="pa-0"
              @click="openPlayerChangeModal(index)"
              >
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <!-- ボディ -->
        <v-col
        class="body py-0">
          <v-col
          class="pa-0"
          v-for="index in games"
          :key="index"
          style="position: relative">
            <v-row>
              <v-col
              class="text-center px-0 py-1"
              :cols="tableHead">
                {{index}}
              </v-col>
              <v-col
              class="text-center px-0 py-1"
              v-for="player in players"
              :key="player.id"
              :class="{ minus: getScore(player.id, index) < 0 }">
                {{getScore(player.id, index)}}
              </v-col>
            </v-row>
            <v-btn
            absolute
            text
            tile
            color="#DDD"
            style="top: 0; left: 0"
            height="100%"
            width="100%"
            @click="openScoresModal(index)"
            >
            </v-btn>
            <v-divider></v-divider>
          </v-col>
        </v-col>

        <!-- フッター -->
        <v-col
        class="footer py-2">
          <v-col
          class="pa-0">

            <!-- チップ -->
            <v-row
            style="position: relative;">
              <v-col
              class="text-center px-0 py-2"
              :cols="tableHead">
                Chip
              </v-col>
              <v-col
              class="text-center px-0 py-2"
              v-for="player in players"
              :key="player.id"
              :class="{ minus: getChip(player.id) < 0 }">
                {{getChip(player.id)}}
              </v-col>
              <v-btn
              absolute
              text
              tile
              color="#AAA"
              style="top: 0; left: 0"
              height="100%"
              width="100%"
              @click="openChipModal()"
              >
              </v-btn>
            </v-row>
            <v-divider></v-divider>

            <!-- 合計 -->
            <v-row
            class="">
              <v-col
              :cols="tableHead"
              class="text-center px-0 py-2">
                Total
              </v-col>
              <v-col
              class="text-center px-0 py-2"
              v-for="player in players"
              :key="player.id"
              :class="{ minus: getTotal(player.id) < 0 }">
                {{getTotal(player.id)}}
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <!-- ￥ -->
            <v-row
            class="">
              <v-col
              class="text-center px-0 py-2"
              :cols="tableHead">
                ￥
              </v-col>
              <v-col
              class="text-center px-0 py-2"
              v-for="player in players"
              :key="player.id"
              :class="{ minus: getYen(player.id) < 0 }">
                {{getYen(player.id)}}
              </v-col>
            </v-row>
          </v-col>
        </v-col>
      </v-carousel-item>

      <v-carousel-item>
        <ScoreBoardData />
      </v-carousel-item>

      <v-carousel-item>
        <ScoreBoardGraph />
      </v-carousel-item>

    </v-carousel>

    <!-- モーダル -->
    <!-- プレイヤーモーダル -->
    <v-dialog
      persistent
      v-model="showPlayerModal"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="headline">
          <span v-if="playerModalType == 'change'">プレイヤー名変更</span>
          <span v-if="playerModalType == 'add'">プレイヤー追加</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <v-form ref="playerForm">
              <v-row class="d-flex flex-nowrap align-center">
                <v-text-field
                  v-model="newPlayer.nickName"
                  class="mx-4"
                  label="Name"
                  :rules="[
                    v => !!v || '名前を入力してください',
                    v => (v && v.length <= 10) || '名前が長すぎます'
                  ]"
                  required
                ></v-text-field>
                <v-btn
                  x-small
                  class="px-0"
                  color="primary"
                  height="30px"
                  @click="searchPlayer()"
                >
                  <v-icon>{{icons.mdiMagnify}}</v-icon>
                </v-btn>
              </v-row>
            </v-form>
          </v-container>
          <v-alert
            type="error"
            class="py-2"
            v-if="playerModalErrorMessage"
          >
            {{playerModalErrorMessage}}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="playerModalType == 'change'"
            text
            color="red"
            @click="deletePlayer()"
          >
            Delete
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="blue darken-1"
            @click="closePlayerModal()"
          >
            Close
          </v-btn>
          <v-btn
            v-if="playerModalType == 'change'"
            color="blue darken-1"
            text
            @click="changePlayer()"
          >
            Save
          </v-btn>
          <v-btn
            v-if="playerModalType == 'add'"
            color="blue darken-1"
            text
            @click="addPlayer()"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- プレイヤー検索モーダル -->
    <v-dialog
      persistent
      v-model="showSearchPlayerModal"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">プレイヤー検索</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <v-form ref="searchPlayerForm">
              <v-col class="pa-0">
                <v-text-field
                  v-model="searchPlayerFilter"
                  class="ma-0 pa-0"
                  label="filter"
                  :prepend-inner-icon="icons.mdiMagnify"
                >
                </v-text-field>
                <div
                  style="height: 250px; overflow-y: auto"
                  class="px-3"
                >
                  <div
                    v-for="(player, index) in filteredSearchPlayers"
                    :key="player.id"
                    class="my-1"
                  >
                    <input
                      type="radio"
                      :id="player.id"
                      :value="index"
                      v-model="selectedSearchPlayerIndex"
                      style="display: none"
                      class="searchPlayer"
                    >
                    <label
                      :for="player.id"
                      class="searchPlayer__label"
                    >
                      <div class="py-1 px-3">
                        <p
                          class="ma-0"
                          style="text-align: left"
                        >
                          {{player.nickName}}
                        </p>
                        <p
                          class="ma-0"
                          style="text-align: left"
                        >
                          {{player.name.lastName}} {{player.name.firstName}}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

              </v-col>
            </v-form>
          </v-container>
          <v-alert
          type="error"
          class="py-2"
          v-if="searchPlayerModalErrorMessage"
          >{{searchPlayerModalErrorMessage}}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeSearchPlayer()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="saveSearchPlayer()">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- スコアモーダル -->
    <v-dialog
    persistent
    v-model="showScoresModal"
    max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{selectedGameIndex}}半荘目</span>
        </v-card-title>
        <v-card-text class="">
          <v-container>
            <v-form ref="playersForm">
              <v-row class="d-flex align-center">
                <v-spacer></v-spacer>
                <v-switch
                v-model="scoreModalSwitch"
                :label="'点数入力'">
                </v-switch>
              </v-row>
              <v-row
              class="d-flex flex-nowrap align-center"
              v-for="(player, index) in players"
              :key="player.id">
                <div class="subtitle-2" style="width: 150px">{{player.nickName}}</div>
                <v-text-field
                type="number"
                v-model.number="newScores[index]"
                v-if="!scoreModalSwitch"
                class="mx-5"
                required
                suffix="pt">
                </v-text-field>
                <v-text-field
                type="number"
                v-model.number="newScores[index]"
                v-if="scoreModalSwitch"
                class="mx-5"
                required
                suffix="点">
                </v-text-field>
                <v-btn
                color="primary"
                class="pa-1"
                small
                @click="inputScoreAuto(index)">
                  残り自動入力
                </v-btn>
              </v-row>
              <v-row
              class="d-flex flex-nowrap align-center"
              v-if="scoreModalSwitch">
                <div class="subtitle-2" style="width: 150px">飛ばし</div>
                <v-select
                v-model="tobashi"
                :items="players"
                item-text="nickName"
                item-value="id"
                class="mx-5"
                required>
                </v-select>
              </v-row>
            </v-form>
          </v-container>
          <v-alert
          type="error"
          class="py-2"
          v-if="scoreModalErrorMessage"
          >{{scoreModalErrorMessage}}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click="deleteScores()">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeScoresModal()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="saveScores()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- チップモーダル -->
    <v-dialog
    persistent
    v-model="showChipModal"
    max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">チップ</span>
        </v-card-title>
        <v-card-text class="">
          <v-container>
            <v-form ref="chipForm">
              <v-row class="d-flex align-center">
                <v-spacer></v-spacer>
                <v-switch
                v-model="chipModalSwitch"
                :label="'枚数入力'">
                </v-switch>
              </v-row>
              <v-row
              class="d-flex flex-nowrap align-center"
              v-for="(player, index) in players"
              :key="player.id">
                <div class="subtitle-2" style="width: 150px">{{player.nickName}}</div>
                <v-text-field
                type="number"
                v-model.number="newChips[index]"
                v-if="!chipModalSwitch"
                class="mx-5"
                required
                suffix="pt">
                </v-text-field>
                <v-text-field
                type="number"
                v-model.number="newChips[index]"
                v-if="chipModalSwitch"
                class="mx-5"
                required
                suffix="枚">
                </v-text-field>
                <v-btn
                color="primary"
                class="pa-1"
                small
                @click="inputChipAuto(index)">
                  残り自動入力
                </v-btn>
              </v-row>
            </v-form>
          </v-container>
          <v-alert
          type="error"
          class="py-2"
          v-if="chipModalErrorMessage"
          >{{chipModalErrorMessage}}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeChipModal()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="saveChip()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 確認モーダル -->
    <v-dialog
    v-model="popup"
    max-width="600px">
      <v-card>
        <v-col>
          <p>{{popupMsg}}</p>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn text color="blue darken-1" @click="popupMsg = ''; popup = false;">ok</v-btn>
          </v-row>
        </v-col>
      </v-card>
    </v-dialog>

    </v-container>
  </v-content>

  <v-bottom-navigation
  v-model="nav"
  grow
  app
  color="teal">
    <v-btn>
      <span>Score</span>
      <v-icon>{{icons.mdiFormatListNumbered}}</v-icon>
    </v-btn>
    <v-btn>
      <span>Data</span>
      <v-icon>{{icons.mdiChartBar}}</v-icon>
    </v-btn>
    <v-btn>
      <span>Graph</span>
      <v-icon>{{icons.mdiChartTimelineVariant}}</v-icon>
    </v-btn>
  </v-bottom-navigation>

</v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mdiChevronLeft, mdiDelete, mdiContentSave, mdiAccountPlus, mdiMagnify, mdiFormatListNumbered, mdiChartBar, mdiChartTimelineVariant } from '@mdi/js';

import ScoreBoardData from '../components/ScoreBoard/ScoreBoardData.vue'
import ScoreBoardGraph from '../components/ScoreBoard/ScoreBoardGraph.vue'

interface player {
  nickName: string,
  id: string
}

@Component({
  components: {
    ScoreBoardData,
    ScoreBoardGraph,
  },
})
export default class ScoreBoard extends Vue {
  icons = {
    mdiChevronLeft,
    mdiDelete,
    mdiContentSave,
    mdiAccountPlus,
    mdiMagnify,
    mdiFormatListNumbered,
    mdiChartBar,
    mdiChartTimelineVariant
  }
  get rule() {
    return this.$store.getters['ScoreBoard/rule'];
  }
  get title() {
    return this.$store.getters['ScoreBoard/title'];
  }
  get players() {
    return this.$store.getters['ScoreBoard/players'];
  }
  get scores() {
    return this.$store.getters['ScoreBoard/scores'];
  }
  get chips() {
    return this.$store.getters['ScoreBoard/chips'];
  }

  // プレイヤーモーダル関連
  showPlayerModal = false;
  playerModalType = "";     //change or add
  selectedPlayerIndex = 0;
  newPlayer: player = {
    nickName: "",
    id: ""
  }
  // playerModalError = false;
  playerModalErrorMessage = "";

  // プレイヤー検索モーダル関連
  showSearchPlayerModal = false;
  searchPlayers: any[] = [];
  selectedSearchPlayerIndex = "";
  searchPlayerFilter = "";
  // searchPlayerModalError = false;
  searchPlayerModalErrorMessage = "";
  get filteredSearchPlayers() {
    if (this.searchPlayerFilter == "") {
      return [];
    } else {
      return this.searchPlayers.filter(player => {
        return player.nickName.indexOf(this.searchPlayerFilter) !== -1
          || player.name.firstName.indexOf(this.searchPlayerFilter) !== -1 
          || player.name.lastName.indexOf(this.searchPlayerFilter) !== -1
      })
    }
  }

  // スコアモーダル関連
  showScoresModal = false;
  selectedGameIndex = 0;
  scoreModalSwitch = false;
  scoreModalErrorMessage = "";
  newScores: number[] = [];
  tobashi = "";

  // チップモーダル関連
  showChipModal = false;
  chipModalSwitch = false;
  chipModalErrorMessage = "";
  newChips: number[] = [];

  // 表示関連
  games = 50;
  tableHead = 2;
  nav = 0;
  popup = false;
  popupMsg = "";

  // firestoreに保存するための配列→オブジェクト変換
  formatNestedArray(arr: any) {
    interface obj {
      [key: string]: any;
    }
    const obj: obj = {};
    for (let i = 0; i < arr.length; i++) {
      obj[i] = arr[i];
    }
    return obj;
  }

  save() {
    if (this.scores.length > 0) {
      this.$store.dispatch('ScoreBoard/save');
      this.popup = true;
      this.popupMsg = "セーブしました";
    }
  }

  reset() {
    let result = confirm("本当にリセットしますか？");
    if (result) {
      this.$store.dispatch('ScoreBoard/reset');
    }
  }

  // 結果計算
  getScore(id: string, index: number) {
    const game = this.scores[index-1]
    if (game === undefined) {
      return null;
    } else {
      const score = game.find((el: any) => {
        return el.id === id;
      });
      if (score === undefined){
        return null;
      } else {
        return score.score;
      }
    }
  }

  getChip (id: string) {
    const chip = this.chips.find((el: any) => {
      return el.id === id;
    })
    if (chip === undefined) {
      return null;
    } else {
      return chip.chip;
    }
  }

  getTotal (id: string) {
    const personalScores = this.scores!.map((el: any) => {
      return el.find((el: any) => {
        return el.id === id;
     })
    });
    const totalScore = personalScores.reduce((currentTotal: number, score: any) => {
      if(score === undefined) {
        return currentTotal;
      } else {
        return Number(score.score) + currentTotal;
      }
    }, 0);
    return totalScore + this.getChip(id);
  }

  getYen (id: string) {
    return this.getTotal(id) * this.rule.rate * 10;
  }

  // モーダル関連
  // プレイヤーモーダル
  openPlayerChangeModal(index: number) {
    this.selectedPlayerIndex = index;
    this.newPlayer.nickName = this.players[index].nickName;
    this.playerModalType = 'change';
    this.showPlayerModal = true;
  }
  openPlayerAddModal() {
    this.playerModalType = 'add';
    this.showPlayerModal = true;
  }
  resetPlayerModal() {
    (this.$refs.playerForm as HTMLFormElement).reset();
    this.playerModalErrorMessage = "";
    this.newPlayer.id = "";
  }
  closePlayerModal() {
    this.showPlayerModal = false;
    this.resetPlayerModal();
  }
  changePlayer() {
    if (this.newPlayer.id.length <= 12) {
      this.newPlayer.id = this.newPlayer.nickName;
    }
    if ((this.$refs.playerForm as HTMLFormElement).validate()) {
      let oldId = this.players[this.selectedPlayerIndex].id;
      let existIds = this.players.map((player: any) => player.id);
      let existNickNames = this.players.map((player:any) => player.nickName);
      if(existIds.includes(this.newPlayer.id) || existNickNames.includes(this.newPlayer.nickName)){
        this.playerModalErrorMessage = "その名前は既に存在しています"
      } else {
        this.$store.dispatch('ScoreBoard/changePlayerScore', {
          oldId: oldId,
          newId: this.newPlayer.id
        })
        this.$store.dispatch('ScoreBoard/changePlayer', {
          index: this.selectedPlayerIndex,
          id: this.newPlayer.id,
          nickName: this.newPlayer.nickName
        })
        this.showPlayerModal = false;
        this.resetPlayerModal();
      }
    }
  }
  deletePlayer() {
    let result = confirm("削除すると収支が合わなくなる可能性があります。\n本当に削除しますか？")
    if (result) {
      this.$store.dispatch('ScoreBoard/deletePlayer', this.selectedPlayerIndex);
      this.showPlayerModal = false;
      this.resetPlayerModal();
    }
  }
  addPlayer() {
    if (this.newPlayer.id.length <= 12) {
      this.newPlayer.id = this.newPlayer.nickName;
    }
    if ((this.$refs.playerForm as HTMLFormElement).validate()) {
      let existIds = this.players.map((player: any) => player.id);
      let existNickNames = this.players.map((player: any) => player.nickName);
      if(existIds.includes(this.newPlayer.id) || existNickNames.includes(this.newPlayer.nickName)){
        this.playerModalErrorMessage = "その名前は既に存在しています"
      } else {
        this.$store.dispatch('ScoreBoard/addPlayer', {
          id: this.newPlayer.id,
          nickName: this.newPlayer.nickName
        })
        this.showPlayerModal = false;
        this.resetPlayerModal();
      }
    }
  }

  // プレイヤー検索モーダル
  searchPlayer() {
    this.showSearchPlayerModal = true;
    this.$store.dispatch('ScoreBoard/searchPlayers').then(
      value => {
        this.searchPlayers = value;
      }
    )
  }
  resetSearchPlayerModal() {
    this.searchPlayerFilter = "";
    this.selectedSearchPlayerIndex = "";
    this.searchPlayerModalErrorMessage = "";
  }
  closeSearchPlayer() {
    this.showSearchPlayerModal = false;
    this.resetSearchPlayerModal();
  }
  saveSearchPlayer() {
    const selectedPlayer = this.filteredSearchPlayers[Number(this.selectedSearchPlayerIndex)]
    this.newPlayer.nickName = selectedPlayer.nickName;
    this.newPlayer.id = selectedPlayer.id;
    Vue.nextTick(() => {
      if (this.playerModalType == 'change') {
        this.changePlayer();
      } else if (this.playerModalType == 'add') {
        this.addPlayer();
      }
    })
    this.showSearchPlayerModal = false;
    this.resetSearchPlayerModal();
  }
  
  // スコアモーダル
  getScoresModalTotal() {
    let total = this.newScores.reduce((currentTotal, newScore) => {
      return Number(newScore) + currentTotal
    }, 0)
    if (this.scoreModalSwitch) {
      total -= this.rule.defaultScore * this.rule.numberOfPlayers;
    }
    return total;
  }
  inputScoreAuto(index: number) {
    this.$set(this.newScores, index, 0)
    this.$set(this.newScores, index, 0 - this.getScoresModalTotal()!)
  }
  changeScorePt(scores: any) {
    
    // トップから順に並び替え
    const sortedScores = scores.sort((a: any, b: any) => b.score - a.score);
    let first = 0;
    let bonus = 0;
    for (let i = 1; i < this.rule.numberOfPlayers; i++) {
      let rounded = this.round(sortedScores[i].score - this.rule.kaeshi) + this.rule.uma[i];
      first -= rounded;
      if (sortedScores[i].score < 0) {
        if (this.tobashi !== "") {
          rounded -= this.rule.bonus;
          bonus += this.rule.bonus;
        }
      }
      sortedScores[i].score = rounded;
    }
    sortedScores[0].score = first;
    if (this.tobashi !== "") {
      sortedScores.find((score: any) => {
        return score.id == this.tobashi
      }).score += bonus;
    }
  }
  round(score: number): number {
    let rounded: number = 0;
    switch (this.rule.round) {
      case "五捨六入":
        rounded = this.gosyarokunyuu(score);
        break;
      case "四捨五入":
        rounded = this.sisyagonyuu(score);
        break;
      case "切り捨て":
        rounded =  this.kirisute(score);
        break;
      case "切り上げ":
        rounded = this.kiriage(score);
        break;
    }
    return rounded;
  }
  gosyarokunyuu(score: number): number {
    let int = Math.floor(score / 1000);
    let dec = score % 1000;
    let ans = 0;
    if (int >= 0) {
      if (dec >= 600) {
        ans = int + 1;
      } else {
        ans = int;
      }
    } else if (int < 0) {
      if (dec <= -600 || dec == 0) {
        ans = int;
      } else {
        ans = int + 1;
      }
    }
    return ans;
  }
  sisyagonyuu(score: number): number {
    let int = Math.floor(score / 1000);
    let dec = score % 1000;
    let ans = 0;
    if (int >= 0) {
      if (dec >= 500) {
        ans = int + 1;
      } else {
        ans = int;
      }
    } else if (int < 0) {
      if (dec <= -500 || dec == 0) {
        ans = int;
      } else {
        ans = int + 1;
      }
    }
    return ans;
  }
  kiriage(score: number): number {
    let int = Math.floor(score / 1000);
    let dec = score % 1000;
    let ans = 0;
    if (score > 0) {
      if (dec > 0) {
        ans = int +1;
      } else {
        ans = int;
      }
    } else if (score < 0) {
      if (dec >= 0) {
        ans = int;
      } else {
        ans = int + 1;
      }
    }
    return ans;
  }
  kirisute(score: number): number {
    let int = Math.floor(score / 1000);
    let dec = score % 1000;
    let ans = 0;
    if (score >= 0) {
      ans = int;
    } else if (score < 0) {
      if (dec > 0) {
        ans = int - 1;
      } else {
        ans = int;
      }
    }
    return ans;
  }

  openScoresModal(index: number) {
    this.selectedGameIndex = index;
    this.showScoresModal = true;
    this.tobashi = "";
    // スコアの情報がすでにある場合
    if (this.scores[index - 1] !== undefined) {
      for (let i = 0; i < this.players.length; i++) {
        let playerScore = this.scores[index-1].find((e: any) => {
          return e.id === this.players[i].id;
        })
        if (playerScore !== undefined) {
          this.newScores[i] = playerScore.score;
        }
      }
    }
  }
  resetScoresModal() {
    this.newScores = [];
    this.tobashi = "";
    this.scoreModalErrorMessage = "";
  }
  closeScoresModal() {
    this.showScoresModal = false;
    this.resetScoresModal();
  }
  saveScores() {
    const players = this.players;
    const newScores = this.newScores;
    let scores = [];
    // 合計0判定
    if (this.getScoresModalTotal() !== 0) {
      this.scoreModalErrorMessage = "合計が0になるように入力してください"
    } else {
      // 点数をscoresに入力
      for (let i = 0; i < players.length; i++) {
        if (typeof newScores[i] == "number") {
          let score = {
            id: players[i].id,
            score: newScores[i],
          };
          scores.push(score)
        }
      }
      // n人判定
      if(scores.length !== this.rule.numberOfPlayers) {
        this.scoreModalErrorMessage = this.rule.numberOfPlayers + "人分の数値を入力してください"
      } else {
        // 点数をptに変える
        if (this.scoreModalSwitch) {
          this.changeScorePt(scores)
        }
        this.$store.dispatch('ScoreBoard/changeScore', {
          index: this.selectedGameIndex-1,
          scores: scores
        });
        this.showScoresModal = false;
        this.resetScoresModal();
      }
    }
  }
  deleteScores() {
    let result = confirm("本当に削除しますか？");
    if (result) {
      this.$store.dispatch('ScoreBoard/deleteScore', this.selectedGameIndex - 1);
      this.showScoresModal = false;
      this.resetScoresModal();
    }
  }

  // チップモーダル
  openChipModal() {
    this.showChipModal = true;
    // スコアの情報がすでにある場合
    if (this.chips.length !== 0) {
      for (let i = 0; i < this.players.length; i++) {
        let playerChip = this.chips.find((e: any) => {
          return e.id === this.players[i].id;
        })
        if (playerChip !== undefined) {
          this.newChips[i] = playerChip.chip;
        }
      }
    }
  }
  closeChipModal() {
    this.showChipModal = false;
    this.chipModalErrorMessage = "";
    this.newChips = [];
  }
  saveChip() {
    const newChips = this.newChips;
    let chips = [];

    // 合計0判定
    if (this.getChipModalTotal() !== 0) {
      this.chipModalErrorMessage = "合計が0になるように入力してください"
    } else {

      // 点数をchipsに入力
      for (let i = 0; i < this.players.length; i++) {
        if (typeof newChips[i] == "number") {
          let chip = { id: this.players[i].id, chip: newChips[i] };
          chips.push(chip);
        }
      }

      // 点数をptに変える
      if (this.chipModalSwitch) {
        chips = chips.map((e: any) => {
          return { id: e.id, chip: e.chip * this.rule.chip }
        })
      }

      this.$store.dispatch('ScoreBoard/changeChips', chips);
      this.chipModalErrorMessage = "";
      this.showChipModal = false;
      this.newChips = [];
    }
  }
  getChipModalTotal() {
    let total = this.newChips.reduce((currentTotal, newChip) => {
      return Number(newChip) + currentTotal
    }, 0)
    return total;
  }
  inputChipAuto(index: number) {
    this.$set(this.newChips, index, 0)
    this.$set(this.newChips, index, 0 - this.getChipModalTotal()!)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/common.scss';

$header-height: 60px;

.header {
  position: fixed;
  height: $header-height;
  display: flex;
  border-bottom: 1px solid rgba(0,0,0,0.12);
}

.body {
  position: absolute;
  height: calc(100% - 59px - 130px);
  top: $header-height;
  overflow-y: auto;
}

.footer {
  position: absolute;
  bottom: 0px;
  padding-top: 0;
  border-top: 1px solid rgba(0,0,0,0.12);
}

.minus{
  color: red;
}
.playerName {
  transform: translateX(-50%) translateY(-50%);
  position: absolute;
  top: 50%;
  left: 50%;
}
.linked {
  // padding: 3px 8px;
  // border-radius: 10px;
  // background: teal;
  // color: white;
  color: teal;
  font-weight: bold;
}

.searchPlayer__label div {
  color: rgba(0,0,0,0.87);
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
  box-sizing: border-box;
  p:nth-of-type(2) {
    color: rgba(0,0,0,0.54);
    font-size: 10px;
  }
}

.searchPlayer:checked + .searchPlayer__label div {
  color: teal;
  border: 2px solid teal;
}

.v-btn:hover:before,
.v-btn:hover::before,
.v-btn:focus-within:before,
.v-btn:focus::before,
.v-btn:focus:before{
  opacity: 0 !important;
}

</style>