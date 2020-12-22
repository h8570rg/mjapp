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
        v-for="parlor in parlors"
        :key="parlor.name">
          <v-card-title
          class="headline font-weight-bold py-2">
            <v-icon class="mr-2">{{icons.mdiStore}}</v-icon>
              {{parlor.name}}
            <v-spacer></v-spacer>
            <v-icon
            small
            v-for="index in parlor.numberOfPlayers"
            :key="index">
              {{icons.mdiAccount}}
            </v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text
          class="ml-1 body-2 font-weight-regular"
          style="color: #EEE;">
            <v-row>
              <v-col class="py-0" cols="3">レート</v-col>
              <v-col class="py-0">点{{parlor.rate}}</v-col>
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
      <v-icon>{{icons.mdiPlus}}</v-icon>
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
                item-value="value"
                item-text="label"
                label="レート"
                hint="例: 点5 → 1000点50ベリー"
                required>
                </v-select>
              </v-row>
              <v-row>
                <v-select
                v-model="newParlor.numberOfPlayers"
                :rules="formRules.numberOfPlayers"
                :items="formRules.numberOfPlayersItems"
                item-text="label"
                item-value="value"
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

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  mdiStore,
  mdiAccount,
  mdiPlus
} from '@mdi/js';

@Component({
  components: {
  },
})
export default class FreeHome extends Vue {
  icons = {
    mdiStore,
    mdiAccount,
    mdiPlus
  }
  get parlors() {
    return this.$store.getters['Free/parlors'];
  }

  showNewParlor: boolean = false;
  newParlor = {
    name: "",
    rate: "",
    numberOfPlayers: null,
  }
  formRules = {
    name: [
      (v: any) => !!v || '店舗名を入力してください',
      (v: any) => {
        let names = this.parlors.map((e: any) => {
          return e.name;
        })
        if (names.indexOf(v) >= 0) {
          return 'その名前はすでに存在しています'
        } else {
          return true
        }
      }
    ],
    rate: [
      (v: any) => !!v || 'レートを選択してください',
    ],
    numberOfPlayers: [
      (v: any) => !!v || 'プレイ人数を選択してください',
    ],
    rateItems: [
      { label: "点1", value: 1 },
      { label: "点2", value: 2 },
      { label: "点3", value: 3 },
      { label: "点5", value: 5 },
      { label: "点10", value: 10 },
      { label: "点20", value: 20 },
    ],
    numberOfPlayersItems: [
      { label: "四麻", value: 4 },
      { label: "三麻", value: 3 },
    ],
  }

  created() {
    this.$store.dispatch('Free/startListener');
  }
  
  destroyed() {
    this.$store.dispatch('Free/stopListener')
  }

  closeNewParlor() {
    (this.$refs.form as HTMLFormElement).reset();
    this.showNewParlor = false;
  }

  saveNewParlor() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.$store.dispatch('Free/addParlor', this.newParlor)
      this.showNewParlor = false;
      (this.$refs.form as HTMLFormElement).reset();
    }
  }

  selectParlor(parlor: any) {
    this.$router.push('/free');
    this.$store.dispatch('Free/gameStart', parlor)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/common.scss';


</style>