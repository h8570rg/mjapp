<template>
	<div>
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
				v-for="player in players"
				:key="player.id">
					<span
					class="playerName"
					:class="{linked: player.id.length > 12}">
						{{player.nickName}}
					</span>
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
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Log extends Vue {

  get scoreBoard() {
    return this.$store.getters['Log/selectedScoreBoard'];
  }
  get rule() {
    return this.scoreBoard.rule;
  }
  get players() {
    return this.scoreBoard.players;
  }
  get scores() {
    return this.scoreBoard.scores;
  }
  get chips() {
    return this.scoreBoard.chips;
  }


  // 表示関連
  games = this.scores.length;
  tableHead = 2;
  popup = false;
  popupMsg = "";

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

  
}
</script>

<style lang="scss" scoped>
@import '../../assets/common.scss';

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