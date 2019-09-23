<template>
  <div>
    <app-menu id="menu"></app-menu>
    <app-options></app-options>
  </div>
</template>

<script>
  import Options from './elements/Options'

  export default {
    components: {
      'app-options': Options
    }
  }
</script>

<style scoped>
  #menu {
    margin-bottom: 24px;
  }
</style>
