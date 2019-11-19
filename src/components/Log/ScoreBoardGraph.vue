<template>
<v-container fill-height fluid>
  <Graph :chartData="chartData" :chartOptions="chartOptions" style="position: relative; width: 100%"/>
</v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Graph from './Graph.vue'

@Component({
  components: {
    Graph
  },
})
export default class ScoreBoardGraph extends Vue {
  colors = [
    "#F44336",
    "#9C27B0",
    "#2196F3",
    "#4CAF50",
    "#FF9800",
    "#795548",
  ];

  get players() {
    return this.$store.getters['Log/selectedScoreBoard'].players;
  }

  get scores() {
    return this.$store.getters['Log/selectedScoreBoard'].scores;
  }

  get datasets() {
    let scores = this.scores;
    let players = this.players;
    let datasets: any[] = [];
    this.players.forEach((player: any, index: number) => {
      let label = player.nickName;
      let total: number = 0;
      let data: number[] = [];
      scores.forEach((score: any) => {
        let playerScore = score.find((e: any) => {
          return e.id == player.id;
        })
        if (playerScore !== undefined) {
          total += playerScore.score;
          data.push(total)
        } else {
          data.push(total)
        }
      })
      let color = this.colors[index];
      datasets.push({
        label: label,
        data: data,
        fill: false,
        borderColor: color,
        backgroundColor: color,
        lineTension: 0,
      })
    })
    return datasets;
  }

  get labels() {
    let labels: number[] = [];
    for (let i = 0; i < this.scores.length; i++) {
      labels.push(i+1)
    }
    return labels;
  }

  get chartData() {
    return {
      labels: this.labels,
      datasets: this.datasets,
    }
  }

  public chartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 13,
        padding: 20,
      }
    },
    scales: {
      yAxes: [{
        scaleLabel: {
        },
        ticks: {
        },
        gridLines: {
          zeroLineWidth: 2,
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: '半荘',
          padding: 0,
        },
        ticks: {
        }
      }],
    }
  }

}
</script>

<style lang="scss" scoped>

</style>