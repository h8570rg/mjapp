<template>
  <v-container
  style="height: 100%;"
  fluid>
    <h2 class="headline grey--text my-1">ルールを選択してください</h2>
    <v-layout
    column
    class="px-4"
    style="overflow-y: scroll; height: calc(100% - 28px)"
    align-content-start>

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
            <v-layout>
              <div style="width: 70px;">レート</div>
              <div>点{{rule.rate}}</div>
            </v-layout>
            <v-layout>
              <div style="width: 70px;">順位点</div>
              <div
              v-for="uma in rule.uma"
              :key="uma"
              class="mr-2">
                {{uma}}pt
              </div>
            </v-layout>
            <v-layout>
              <div style="width: 70px;">飛び賞</div>
              <div>{{rule.bonus}}pt</div>
            </v-layout>
            <v-layout>
              <div style="width: 70px;">チップ</div>
              <div>{{rule.chip}}pt</div>
            </v-layout>
            <v-layout>
              <div style="width: 70px;">返し</div>
              <div>{{rule.kaeshi}}点</div>
            </v-layout>
            <v-layout>
              <div style="width: 70px;">清算方法</div>
              <div>{{rule.round}}</div>
            </v-layout>
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

    </v-layout>

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
      if (a.lastUse < b.lastUse) {
          return 1;
        } else {
          return -1;
        }
      }
    );
  }

  created(){
    // ローカルストレージから読み込み
    const rules = JSON.parse(localStorage.getItem("rules") as string);
    if (rules !== null) {
      this.rules = rules;
    }
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
    this.$router.push('/scoreboard');
    localStorage.setItem("selectedRule", JSON.stringify(rule));
  }
//   rulesRef = this.$firestore.collection("rules");
//   private rules = new Array;

//   toScoreBoard(a: any){
//     console.log(a);
//     console.log("H");
//   }
//   test() {
//     console.log(this.rules);
//   }

//   getMyRules() {
//     return new Promise(resolve => {
//       resolve(this.$store.getters.getMyRules)
//     })
//   }

//   getRule(rule: string) {
//     return new Promise(resolve => {
//       this.rulesRef.doc(rule).get().then((doc)=> {
//         if (doc.exists) {
//           resolve(doc.data())
//         }
//       })
//     })
//   }

//   async setRules() {
//     // let rules = new Array;
//     const myRules: any = await this.getMyRules();
//     for (let i = 0; i < myRules.length; i++){
//       const rule:any = await this.getRule(myRules[i])
//       this.rules.push(rule);
//     }
//     // return rules;
//   }
//   start(){
//     this.$router.push('/scoreboard')
//   }
}
</script>

<style lang="scss" scoped>
@import '../assets/common.scss';

.card{
  &-enter-active, &-leave-active, &-move {
    transition: opacity 0.5s, transform 0.5s;
  }
  &-enter, &-leave-to {
    opacity: 0;
  }
}

</style>