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
    <v-toolbar-title class="pl-1">ScoreBoard</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="reset()">
      <v-icon>delete</v-icon>
    </v-btn>
    <v-btn icon @click="save()">
      <v-icon>save</v-icon>
    </v-btn>
    <v-btn icon @click="openPlayerAddModal()">
      <v-icon>person_add</v-icon>
    </v-btn>

  </v-app-bar>

  <v-content>
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
            class="text-center py-3 px-0"
            style="overflow: hidden; white-space: nowrap; position: relative; border-radius: 5px;"
            v-for="(player, index) in players"
            :key="player.id">
              <div>{{player.nickName}}</div>
              <v-btn
              absolute
              text
              tile
              color="#AAA"
              style="top: 0; left: 0"
              height="100%"
              width="100%"
              class="pa-0"
              @click="openPlayerModal(index)"
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
        <ScoreBoardData :parentPlayers="players" :parentScores="scores" />
      </v-carousel-item>

      <v-carousel-item>
        <ScoreBoardGraph :players="players" :scores="scores" />
      </v-carousel-item>

    </v-carousel>

    <!-- モーダル -->

    <!-- プレイヤーモーダル -->
    <v-dialog
    persistent
    v-model="showPlayerModal"
    max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">プレイヤー名変更</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <v-form ref="playerForm">
              <v-row
              class="d-flex flex-nowrap align-center">
                <v-text-field
                v-model="newPlayerNickName"
                class="mx-4"
                label="Name"
                :rules="[v => !!v || '名前を入力してください']"
                required>
                </v-text-field>
                <v-btn
                x-small
                class="px-0"
                color="primary"
                height="30px"
                @click="searchPlayer()">
                  <v-icon small>search</v-icon>
                </v-btn>
              </v-row>
            </v-form>
          </v-container>
          <v-alert
          type="error"
          class="py-2"
          v-if="newPlayerError"
          >{{errorMessage}}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click="deletePlayer()">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closePlayerModal()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="savePlayer()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- プレイヤー追加モーダル -->
    <v-dialog
    persistent
    v-model="showPlayerAddModal"
    max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">プレイヤー追加</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <v-form ref="playerAddForm">
              <v-row
              class="d-flex flex-nowrap align-center">
                <v-text-field
                v-model="newPlayerAddNickName"
                class="mx-4"
                label="New Player"
                :rules="[v => !!v || '名前を入力してください']"
                required>
                </v-text-field>
                <v-btn
                x-small
                class="px-0"
                color="primary"
                height="30px"
                @click="searchPlayerAdd()">
                  <v-icon small>search</v-icon>
                </v-btn>
              </v-row>
            </v-form>
          </v-container>
          <v-alert
          type="error"
          class="py-2"
          v-if="newPlayerAddError"
          >{{errorMessage}}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closePlayerAddModal()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="savePlayerAdd()">Save</v-btn>
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
          v-if="newScoreError"
          >{{errorMessage}}</v-alert>
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
          v-if="newChipError"
          >{{errorMessage}}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeChipModal()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="saveChip()">Save</v-btn>
        </v-card-actions>
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
import ScoreBoardData from '../components/ScoreBoard/ScoreBoardData.vue'
import ScoreBoardGraph from '../components/ScoreBoard/ScoreBoardGraph.vue'

@Component({
  components: {
    ScoreBoardData,
    ScoreBoardGraph,
  },
})
export default class ScoreBoard extends Vue {
  // データ関連
  private rule: any = {};
  private scores: any[] = [];
  private chips: any[] = [];
  private numberOfPlayers = 4;
  private defaultScore = 25000;
  // private title = "2019/10/06";
  private players = [
    { id: "player1", nickName: "player1" },
    { id: "player2", nickName: "player2" },
    { id: "player3", nickName: "player3" },
    { id: "player4", nickName: "player4" },
  ]

  // プレイヤーモーダル関連
  private showPlayerModal = false;
  private selectedPlayerIndex = 0;
  private newPlayerNickName = "";
  private newPlayerId: string = "";
  private newPlayerError: boolean = false;

  @Watch('newPlayerNickName')
  onTextChangedA(newText: string, oldText: string) {
    this.newPlayerId = newText;
  }

  // プレイヤー追加モーダル関連
  private showPlayerAddModal = false;
  private newPlayerAddNickName = "";
  private newPlayerAddId: string = "";
  private newPlayerAddError: boolean = false;

  @Watch('newPlayerAddNickName')
  onTextChangedB(newText: string, oldText: string) {
    this.newPlayerAddId = newText;
  }

  // スコアモーダル関連
  private showScoresModal = false;
  private selectedGameIndex = 0;
  private scoreModalSwitch = false;
  private newScoreError = false;
  private newScores: number[] = [];
  private tobashi = "";

  // チップモーダル関連
  private showChipModal = false;
  private chipModalSwitch = false;
  private newChipError = false;
  private newChips: number[] = [];

  // 表示関連
  private games = 50;
  private tableHead = 2;
  private nav = 0;
  private errorMessage = "";

  created() {
    // ローカルストレージから読み込み
    const user = JSON.parse(localStorage.getItem("user") as string);
    const rule = JSON.parse(localStorage.getItem("selectedRule") as string);
    const scores = JSON.parse(localStorage.getItem("scores") as string);
    const chips = JSON.parse(localStorage.getItem("chips") as string);
    const players = JSON.parse(localStorage.getItem("players") as string);
    if (rule !== null) {
      this.rule = rule;
    }
    if (scores !== null) {
      this.scores = scores;
    }
    if (chips !== null) {
      this.chips = chips;
    }
    if (players !== null) {
      this.players = players;
    } else {
      this.players = [
        { id: user.id, nickName: user.nickName },
        { id: "player2", nickName: "player2" },
        { id: "player3", nickName: "player3" },
        { id: "player4", nickName: "player4" },
      ]
    }
  }

  save() {
    alert("save機能は実装されていません")
  }

  // テスト関数
  reset() {
    let result = confirm("本当にリセットしますか？");
    if (result) {
      this.chips = [];
      this.scores = [];
      this.players = [
          { id: "player1", nickName: "player1" },
          { id: "player2", nickName: "player2" },
          { id: "player3", nickName: "player3" },
          { id: "player4", nickName: "player4" },
        ]
      localStorage.setItem("chips", JSON.stringify(this.chips));
      localStorage.setItem("scores", JSON.stringify(this.scores));
      localStorage.setItem("players", JSON.stringify(this.players));
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
    const personalScores = this.scores.map((el: any) => {
      return el.find((el: any) => {
        return el.id === id;
     })
    });
    const totalScore = personalScores.reduce((currentTotal, score) => {
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
  openPlayerModal(index: number) {
    this.selectedPlayerIndex = index;
    this.newPlayerError = false;
    this.newPlayerNickName = this.players[index].nickName;
    this.showPlayerModal = true;
  }
  closePlayerModal() {
    this.showPlayerModal = false;
    (this.$refs.playerForm as HTMLFormElement).reset();
  }
  savePlayer() {
    if ((this.$refs.playerForm as HTMLFormElement).validate()) {
      let existIds = this.players.map((player: any) => player.id);
      if(existIds.includes(this.newPlayerId)){
        this.errorMessage = "その名前は既に存在しています"
        this.newPlayerError = true;
      } else {

      // 既存のスコアの変更
      const oldPlayerId = this.players[this.selectedPlayerIndex].id;
      const oldScores = JSON.stringify(this.scores);
      const newScores = oldScores.replace(new RegExp('"id":"'+oldPlayerId+'"',"g"), '"id":"'+this.newPlayerId+'"');
      this.scores = JSON.parse(newScores);
      localStorage.setItem("scores", JSON.stringify(this.scores));

      // プレイヤー変更
      let newPlayer = { id: this.newPlayerId, nickName: this.newPlayerNickName };
      this.players[this.selectedPlayerIndex] = JSON.parse(JSON.stringify(newPlayer));
      localStorage.setItem("players", JSON.stringify(this.players));
      this.showPlayerModal = false;
      (this.$refs.playerForm as HTMLFormElement).reset();
      }
    }
  }
  searchPlayer() {
    alert("検索機能は実装されていません")
  }
  deletePlayer() {
    let result = confirm("削除すると収支が合わなくなる可能性があります。\n本当に削除しますか？")
    if (result) {
      this.players.splice(this.selectedPlayerIndex, 1);
      localStorage.setItem("players", JSON.stringify(this.players));
      this.showPlayerModal = false;
      (this.$refs.playerForm as HTMLFormElement).reset();
    }
  }

  // プレイヤー追加モーダル
  openPlayerAddModal() {
    // this.newPlayerNickName = "";
    this.showPlayerAddModal = true;
  }
  closePlayerAddModal() {
    this.showPlayerAddModal = false;
    (this.$refs.playerAddForm as HTMLFormElement).reset();
  }
  savePlayerAdd() {
    if ((this.$refs.playerAddForm as HTMLFormElement).validate()) {
      let existIds = this.players.map((player: any) => player.id);
      if(existIds.includes(this.newPlayerAddId)){
        this.errorMessage = "その名前は既に存在しています"
        this.newPlayerAddError = true;
      } else {
      // プレイヤー追加
      let newPlayer = { id: this.newPlayerAddId, nickName: this.newPlayerAddNickName };
      this.players.push(JSON.parse(JSON.stringify(newPlayer)));
      localStorage.setItem("players", JSON.stringify(this.players));
      this.showPlayerAddModal = false;
      (this.$refs.playerAddForm as HTMLFormElement).reset();
      }
    }
  }
  searchPlayerAdd() {
    alert("検索機能は実装されていません")
  }
  
  // スコアモーダル
  getScoresModalTotal() {
    let total = this.newScores.reduce((currentTotal, newScore) => {
      return Number(newScore) + currentTotal
    }, 0)
    if (this.scoreModalSwitch) {
      total -= this.defaultScore * this.numberOfPlayers;
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
    for (let i = 1; i < this.numberOfPlayers; i++) {
      let rounded = this.round(sortedScores[i].score - this.rule.kaeshi) + this.rule.uma[i];
      first -= rounded;
      if (sortedScores[i].score < 0) {
        rounded -= this.rule.bonus;
        bonus += this.rule.bonus;
      }
      sortedScores[i].score = rounded;
    }
    sortedScores[0].score = first;
    sortedScores.find((score: any) => {
      return score.id == this.tobashi
    })
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
  closeScoresModal() {
    this.showScoresModal = false;
    this.newScores = [];
  }
  saveScores() {
    const players = this.players;
    const newScores = this.newScores;
    let scores = []
    // 合計0判定
    if (this.getScoresModalTotal() !== 0) {
      this.errorMessage = "合計が0になるように入力してください"
      this.newScoreError = true;
    } else {
      // 点数をscoresに入力
      for (let i = 0; i < players.length; i++) {
        if (typeof newScores[i] == "number") {
          let score = { id: players[i].id, score: newScores[i] };
          scores.push(score)
        }
      }
      // n人判定
      if(scores.length !== this.numberOfPlayers) {
        this.errorMessage = this.numberOfPlayers + "人分の数値を入力してください"
        this.newScoreError = true;
      } else {
        
        // 点数をptに変える
        if (this.scoreModalSwitch) {
          this.changeScorePt(scores)
        }

        // 点数をthis.scoresに入力
        if (this.scores.length < this.selectedGameIndex) {
          this.scores.push(scores);
        } else {
          this.scores[this.selectedGameIndex-1] = scores;
        }
        localStorage.setItem("scores", JSON.stringify(this.scores));
        this.newScoreError = false;
        this.showScoresModal = false;
        this.newScores = [];
      }
    }
  }
  deleteScores() {
    let result = confirm("本当に削除しますか？");
    if (result) {
      this.scores.splice(this.selectedGameIndex-1, 1)
      this.showScoresModal = false;
      this.newScores = [];
      localStorage.setItem("scores", JSON.stringify(this.scores));
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
    this.newChips = [];
  }
  saveChip() {
    const newChips = this.newChips;
    let chips = [];

    // 合計0判定
    if (this.getChipModalTotal() !== 0) {
      this.errorMessage = "合計が0になるように入力してください"
      this.newChipError = true;
    } else {

      // 点数をscoresに入力
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
      this.chips = chips;
      localStorage.setItem("chips", JSON.stringify(this.chips));
      this.newChipError = false;
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
  overflow-y: scroll;
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

.v-btn:hover:before,
.v-btn:hover::before,
.v-btn:focus-within:before,
.v-btn:focus::before,
.v-btn:focus:before{
  opacity: 0 !important;
}

</style>