<template>
  <v-container
  style="height: 100%; overflow-y: auto"
  fluid>
    <h2 class="headline grey--text">戦績</h2>
    <v-col>
      <v-row>
        <v-btn-toggle
        v-model="period"
        class="theme--light"
        dark="false">
          <v-btn dark="false">月間</v-btn>
          <v-btn dark="false">通算</v-btn>
        </v-btn-toggle>
      </v-row>
    </v-col>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class PersonalScoreHome extends Vue {

}
</script>

<style lang="scss" scoped>

</style>