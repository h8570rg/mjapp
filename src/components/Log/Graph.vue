<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { Line, mixins } from "vue-chartjs"

@Component({
  components: {
  },
})
export default class ScoreBoardGraph extends Mixins(Line, mixins.reactiveProp) {
  @Prop() chartData!: object;
  @Prop() chartOptions!: object;

  @Watch('chartData')
  function(){
    this.renderChart(this.chartData, this.chartOptions);
  }

  mounted() {
    this.renderChart(this.chartData, this.chartOptions)
  }

}
</script>

<style lang="scss" scoped>

</style>