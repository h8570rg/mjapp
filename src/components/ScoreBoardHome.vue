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
            <v-icon class="mr-2">list</v-icon>{{rule.title}}
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
                  v-for="uma in rule.uma"
                  :key="uma">
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
              <v-col class="py-0" cols="3">返し</v-col>
              <v-col class="py-0">{{rule.kaeshi}}点</v-col>
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
                  v-model.number="newRule.rate"
                  :items="[1,2,3,5,10,20,50,100,200]"
                  label="レート"
                  hint="例: 5 → 1000点50円"
                  :rules="[v => !!v || 'レートを選択してください']"
                  required>
                  </v-select>
                </v-row>
                <v-row>
                  <v-select
                  v-model="newRule.uma"
                  :rules="[v => !!v || 'ウマを選択してください']"
                  :items="formRules.umaItems"
                  label="ウマ"
                  required>
                  </v-select>
                </v-row>
                <v-row>
                  <v-select
                  v-model.number="newRule.bonus"
                  :rules="[v => (!!v || v==0) || '飛び賞を選択してください']"
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
  public rules: any[] = [];
  private showNewRule = false;
  showConfirm = false;
  selectedRule: any = {};
  private newRule = {
    title: "",
    rate: null,
    uma: null,
    kaeshi: null,
    chip: null,
    bonus: null,
    lastUse: "Date()",
    round: ""
  }
  private formRules = {
    name: [
      (v: any) => !!v || 'タイトルを入力してください',
      (v: any) => (v && v.length<20) || '長すぎます'
    ],
    umaItems: [
      [
        10, 5, -5, -10
      ],
      [
        20, 10, -10, -20
      ],
      [
        30, 10, -10, -30
      ],
      [
        40, 20, -20, -40
      ],
    ],
    okaItems: [
      25000,
      30000,
      40000
    ],
    chipItems: [
      1, 2, 3, 4, 5, 10, 20
    ],
    bonusItems: [
      0, 5, 10, 20
    ],
    roundItems: [
      "五捨六入",
      "四捨五入",
      "切り捨て",
      "切り上げ",
    ]
  }

  get sortedRules() {
    return this.rules.sort((a: any, b: any) => {
      if (new Date(a.lastUse) < new Date(b.lastUse)) {
          return 1;
        } else {
          return -1;
        }
      }
    );
  }

  created() {
    // ローカルストレージから読み込み
    const rules = JSON.parse(localStorage.getItem("rules") as string);
    if (rules !== null) {
      this.rules = rules;
    }
    // console.log(new Date());
    // console.log(this.rules[0].lastUse);
    // console.log(new Date(this.rules[0].lastUse));
    
  }

  closeNewRule() {
    (this.$refs.form as HTMLFormElement).reset();
    this.showNewRule = false;
  }

  saveNewRule() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.newRule.lastUse = String(new Date());
      const newRule = JSON.parse(JSON.stringify(this.newRule))
      this.rules.push(newRule);
      localStorage.setItem("rules", JSON.stringify(this.rules))
      this.showNewRule = false;
      (this.$refs.form as HTMLFormElement).reset();
    }
  }

  selectRule(rule: any) {
    this.selectedRule = rule;
    const scores = JSON.parse(localStorage.getItem("scores") as string);
    if (scores == null) {
      this.toNewScoreBoard();
    } else {
      if (scores.length == 0){
        this.toNewScoreBoard();
        } else {
        this.showConfirm = true; 
      }
    }
  }

  toScoreBoard() {
    localStorage.setItem("selectedRule", JSON.stringify(this.selectedRule));
    this.$router.push('/scoreboard');
    this.changeLastUse(this.selectedRule);
  }

  toNewScoreBoard() {
    localStorage.setItem("selectedRule", JSON.stringify(this.selectedRule));
    localStorage.removeItem("scores");
    localStorage.removeItem("chips");
    localStorage.removeItem("players");
    localStorage.setItem("title", JSON.stringify(String(new Date())));
    this.$router.push('/scoreboard');
    this.changeLastUse(this.selectedRule);
  }

  changeLastUse(selectedRule: any) {
    this.rules.find((rule: any) => {
      return rule.title == selectedRule.title;
    }).lastUse = new Date();
    localStorage.setItem("rules",JSON.stringify(this.rules));
  }

}
</script>

<style lang="scss" scoped>
@import '../assets/common.scss';
</style>