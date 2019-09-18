<template>
  <div>
    <app-menu></app-menu>
    <app-table id="table"></app-table>
    <app-control id="control"></app-control>
  </div>
</template>

<script>
  import Table from './elements/Table'
  import Control from './elements/Control'

  export default {
    components: {
      'app-table': Table,
      'app-control': Control
    }
  }
</script>

<style scoped>
  #table {
    min-height: calc(100vh - 113px);
    max-height: calc(100vh - 113px);
    overflow: auto;
    margin-bottom: 36px;
  }

  #control {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
