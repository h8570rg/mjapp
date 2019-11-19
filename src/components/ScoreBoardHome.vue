<template>
  <v-container
  style="height: 100%; overflow-y: auto"
  fluid>
    <h2 class="headline grey--text">ルールを選択してください</h2>
    <v-col>

      <!-- ルールカード -->
      <transition-group name="card">
        <v-card
        raised
        color="teal darken-2"
        class="my-2"
        v-for="rule in sortedRules"
        :key="rule.title">
          <v-card-title
          class="headline font-weight-bold py-2">
            <v-icon class="mr-2">list</v-icon>
            {{rule.title}}
            <v-spacer></v-spacer>
            <v-icon small v-for="index in rule.numberOfPlayers" :key="index">person</v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text
          class="ml-1 body-2 font-weight-regular"
          style="color: #EEE;">
            <v-row>
              <v-col class="py-0" cols="3">レート</v-col>
              <v-col class="py-0">点{{rule.rate}}</v-col>
            </v-row>
            <v-row>
              <v-col class="py-0" cols="3">順位点</v-col>
              <v-col class="py-0">
                <v-row class="ma-0">
                  <div
                  class="mr-2"
                  v-for="(uma, index) in rule.uma"
                  :key="index">
                    {{uma}}pt
                  </div>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0" cols="3">飛び賞</v-col>
              <v-col class="py-0">{{rule.bonus}}pt</v-col>
            </v-row>
            <v-row>
              <v-col class="py-0" cols="3">チップ</v-col>
              <v-col class="py-0">{{rule.chip}}pt</v-col>
            </v-row>
            <v-row>
              <v-col class="py-0" cols="3">清算方法</v-col>
              <v-col class="py-0">{{rule.round}}</v-col>
            </v-row>
          </v-card-text>
          <v-btn
          absolute
          style="top: 0; left: 0"
          height="100%"
          width="100%"
          color="transparent"
          @click="selectRule(rule)"
          >
          </v-btn>
        </v-card>
      </transition-group>
    </v-col>

      <!-- 追加ボタン -->
      <v-btn
      fab
      color="pink"
      absolute
      style="bottom: 20px; right: 20px;"
      @click="showNewRule = !showNewRule">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <!-- モーダル -->
      <!-- 新規ルールモーダル -->
      <v-dialog
      v-model="showNewRule"
      persistent
      max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">新規ルール作成</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="form">
                <v-row>
                  <v-text-field
                  v-model="newRule.title"
                  :rules="formRules.name"
                  label="タイトル"
                  required>
                  </v-text-field>
                </v-row>
                <v-row>
                  <v-select
                  v-model.number="newRule.numberOfPlayers"
                  :items="formRules.numberOfPlayersItems"
                  item-text="label"
                  item-value="value"
                  label="プレイ人数"
                  :rules="[v => !!v || 'プレイ人数を選択してください']"
                  required>
                  </v-select>
                </v-row>
                <v-row>
                  <v-select
                  v-model.number="newRule.rate"
                  :items="formRules.rateItems"
                  item-text="label"
                  item-value="value"
                  label="レート"
                  hint="例: 点5 → 1000点50円"
                  :rules="[v => (!!v || 0 ) || 'レートを選択してください']"
                  required>
                  </v-select>
                </v-row>
                <v-row v-if="newRule.numberOfPlayers == 4">
                  <v-select
                  v-model="newRule.uma"
                  :rules="[v => !!v || 'ウマを選択してください']"
                  :items="formRules.umaItems4"
                  item-text="label"
                  item-value="value"
                  label="ウマ">
                  </v-select>
                </v-row>
                <v-row  v-if="newRule.numberOfPlayers == 3">
                  <v-select
                  v-model="newRule.uma"
                  :rules="[v => !!v || 'ウマを選択してください']"
                  :items="formRules.umaItems3"
                  item-text="label"
                  item-value="value"
                  label="ウマ">
                  </v-select>
                </v-row>
                <v-row>
                  <v-select
                  v-model.number="newRule.defaultScore"
                  :rules="[v => !!v || '持ち点を選択してください']"
                  :items="formRules.defaultScoreItems"
                  suffix="点"
                  label="持ち点"
                  required>
                  </v-select>
                </v-row>
                <v-row>
                  <v-select
                  v-model.number="newRule.kaeshi"
                  :rules="[v => !!v || 'オカを選択してください']"
                  :items="formRules.okaItems"
                  suffix="点返し"
                  label="オカ"
                  required>
                  </v-select>
                </v-row>
                <v-row>
                  <v-select
                  v-model.number="newRule.bonus"
                  :rules="[v => v !== null || '飛び賞を選択してください']"
                  :items="formRules.bonusItems"
                  suffix="pt"
                  label="飛び賞"
                  required>
                  </v-select>
                </v-row>
                <v-row>
                  <v-select
                  v-model.number="newRule.chip"
                  :rules="[v => !!v || 'チップを選択してください']"
                  :items="formRules.chipItems"
                  suffix="pt"
                  label="チップ"
                  required>
                  </v-select>
                </v-row>
                <v-row>
                  <v-select
                  v-model.number="newRule.round"
                  :rules="[v => !!v || '清算方法を選択してください']"
                  :items="formRules.roundItems"
                  label="清算方法"
                  required>
                  </v-select>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeNewRule()">Close</v-btn>
            <v-btn color="blue darken-1" text @click="saveNewRule()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 確認モーダル -->
      <v-dialog
      v-model="showConfirm"
      max-width="600px">
      <v-card>
        <v-col>
          <p>前回使用したデータが残っています。続きから始めますか？</p>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn text color="blue darken-1" @click="toScoreBoard()">yes</v-btn>
            <v-btn text color="blue darken-1" @click="toNewScoreBoard()">no</v-btn>
          </v-row>
        </v-col>
      </v-card>
      </v-dialog>
      

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


@Component({
  components: {
  },
})
export default class ScoreBoardHome extends Vue {
  showNewRule = false;
  showConfirm = false;
  newRule = {
    title: "",
    rate: null,
    uma: null,
    kaeshi: null,
    chip: null,
    bonus: null,
    lastUse: "Date()",
    round: "",
    numberOfPlayers: null,
    defaultScore: null,
  };
  selectedRule: any = [];
  formRules = {
    numberOfPlayersItems: [
      { label: "四麻", value: 4 },
      { label: "三麻", value: 3 },
    ],
    rateItems: [
      { label: "点1", value: 1 },
      { label: "点2", value: 2 },
      { label: "点3", value: 3 },
      { label: "点5", value: 5 },
      { label: "点10", value: 10 },
      { label: "点20", value: 20 },
      { label: "点50", value: 50 },
      { label: "点100", value: 100 },
      { label: "点200", value: 200 },
    ],
    name: [
      (v: any) => !!v || 'タイトルを入力してください',
      (v: any) => (v && v.length<20) || '長すぎます',
      (v: any) => {
        let titles = this.sortedRules.map((e: any) => {
          return e.title;
        })
        if (titles.indexOf(v) >= 0) {
          return 'その名前はすでに存在しています'
        } else {
          return true
        }
      }
    ],
    umaItems4: [
      { label: "なし", value: [0, 0, 0, 0] },
      { label: "10pt 5pt -5pt -10pt", value: [10, 5, -5, -10] },
      { label: "20pt 10pt -10pt -20pt", value: [20, 10, -10, -20] },
      { label: "30pt 10pt -10pt -30pt", value: [30, 10, -10, -30] },
      { label: "40pt 20pt -20pt -40pt", value: [40, 20, -20, -40] },
    ],
    umaItems3: [
      { label: "なし", value: [0, 0, 0] },
      { label: "10pt 0pt -10pt", value: [10, 0, -10] },
      { label: "20pt 0pt -20pt", value: [20, 0, -20] },
    ],
    okaItems: [
      25000, 30000, 35000, 40000
    ],
    chipItems: [
      1, 2, 3, 4, 5, 10, 20
    ],
    bonusItems: [
      0, 5, 10, 20
    ],
    roundItems: [
      "五捨六入", "四捨五入", "切り捨て", "切り上げ",
    ],
    defaultScoreItems: [
      25000, 35000
    ]
  };

  get sortedRules() {
    return this.$store.getters['ScoreBoard/sortedRulesByLastUse'];
  }

  closeNewRule() {
    (this.$refs.form as HTMLFormElement).reset();
    this.showNewRule = false;
  }

  saveNewRule() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.newRule.lastUse = String(new Date());
      const newRule = JSON.parse(JSON.stringify(this.newRule));
      this.$store.dispatch('ScoreBoard/addRule', newRule);
      this.showNewRule = false;
      (this.$refs.form as HTMLFormElement).reset();
    }
  }

  selectRule(rule: any) {
    this.selectedRule = rule
    const scores = this.$store.getters['ScoreBoard/scores'];
    if (scores.length == 0) {
      this.toNewScoreBoard();
    } else {
      this.showConfirm = true; 
    }
  }

  toScoreBoard() {
    this.$router.push('/scoreboard');
  }

  toNewScoreBoard() {
    this.$store.dispatch('ScoreBoard/reset', this.selectedRule.numberOfPlayers);
    this.$store.dispatch('ScoreBoard/gameStart', this.selectedRule);
    const id = this.$store.getters['User/user'].id;
    const nickName = this.$store.getters['User/user'].nickName;
    this.$store.dispatch('ScoreBoard/changePlayer', {index: 0, id: id, nickName: nickName})
    this.toScoreBoard();
  }

}
</script>

<style lang="scss" scoped>
@import '../assets/common.scss';

.v-expansion-panel::before {
  box-shadow: none;
}
</style>