<template>
  <v-container
  style="height: 100%; overflow-y: auto"
  fluid>
    <h2 class="headline grey--text">店舗を選択してください</h2>
    <v-col>
      
      <!-- ルールカード -->
      <transition-group name="card">
        <v-card
        raised
        color="purple darken-2"
        class="my-2"
        v-for="parlor in sortedParlors"
        :key="parlor.name">
          <v-card-title
          class="headline font-weight-bold py-2">
            <v-icon class="mr-2">store</v-icon>{{parlor.name}}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text
          class="ml-1 body-2 font-weight-regular"
          style="color: #EEE;">
            <v-row>
              <v-col class="py-0" cols="4">レート</v-col>
              <v-col class="py-0">点{{parlor.rate}}</v-col>
            </v-row>
            <v-row>
              <v-col class="py-0" cols="4">プレイ人数</v-col>
              <v-col class="py-0">{{parlor.numberOfPlayers}}人</v-col>
            </v-row>
          </v-card-text>
          <v-btn
          absolute
          style="top: 0; left: 0"
          height="100%"
          width="100%"
          color="transparent"
          @click="selectParlor(parlor)"
          >
          </v-btn>
        </v-card>
      </transition-group>
    </v-col>

    <!-- 追加ボタン -->
    <v-btn
    fab
    color="pink accent-2"
    absolute
    style="bottom: 20px; right: 20px;"
    @click="showNewParlor = !showNewParlor">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- モーダル -->
    <v-dialog
    v-model="showNewParlor"
    persistent
    max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">新規店舗作成</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-text-field
                v-model="newParlor.name"
                :rules="formRules.name"
                label="店舗名"
                required>
                </v-text-field>
              </v-row>
              <v-row>
                <v-select
                v-model.number="newParlor.rate"
                :rules="formRules.rate"
                :items="formRules.rateItems"
                label="レート"
                hint="例: 5 → 1000点50円"
                required>
                </v-select>
              </v-row>
              <v-row>
                <v-select
                v-model="newParlor.numberOfPlayers"
                :rules="formRules.numberOfPlayers"
                :items="formRules.numberOfPlayersItems"
                label="プレイ人数"
                required>
                </v-select>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeNewParlor()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="saveNewParlor()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
export default class FreeHome extends Vue {
  parlorsRef = this.$firestore.collection("users").doc(this.user.id).collection("freeScore");
  parlors: any[] = [];
  load = true;
  showNewParlor: boolean = false;
  newParlor = {
    name: "",
    rate: "",
    numberOfPlayers: null,
    lastUse: "",
  }
  formRules = {
    name: [
      (v: any) => !!v || '店舗名を入力してください',
    ],
    rate: [
      (v: any) => !!v || 'レートを選択してください',
    ],
    numberOfPlayers: [
      (v: any) => !!v || 'プレイ人数を選択してください',
    ],
    rateItems: [ 1, 2, 3, 5, 10, 20 ],
    numberOfPlayersItems: [ 3, 4 ],
  }

  get user() {
    return JSON.parse(localStorage.getItem("user") as string)
  }

  get sortedParlors() {
    return this.parlors.sort((a: any, b: any) => {
      if (new Date(a.lastUse) < new Date(b.lastUse)) {
          return 1;
        } else {
          return -1;
        }
      }
    );
  }

  created() {
    this.parlorsRef.onSnapshot(docs => {
      let parlors: any[] = []
      docs.forEach(doc => {
        parlors.push({
          name: doc.data().name,
          rate: doc.data().rate,
          numberOfPlayers: doc.data().numberOfPlayers,
          lastUse: doc.data().lastUse
        })
      })
      Vue.nextTick(() => {
        this.parlors = parlors;
        this.load = false;
      })
    })
  }

  closeNewParlor() {
    (this.$refs.form as HTMLFormElement).reset();
    this.showNewParlor = false;
  }

  saveNewParlor() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.parlorsRef.doc(this.newParlor.name).set({
        name: this.newParlor.name,
        rate: this.newParlor.rate,
        numberOfPlayers: this.newParlor.numberOfPlayers,
        lastUse: String(new Date()),
        scores: {},
      })
      this.showNewParlor = false;
      (this.$refs.form as HTMLFormElement).reset();
    }
  }

  selectParlor(parlor: any) {
    this.$router.push('/free');
    this.parlorsRef.doc(parlor.name).update({
      lastUse: String(new Date())
    })
    localStorage.setItem("selectedParlor", JSON.stringify(parlor));
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/common.scss';


</style>