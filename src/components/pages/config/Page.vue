<template>
  <div>
    <app-menu id="menu"></app-menu>
    <app-options id="options"></app-options>
    <app-buttons id="buttons"></app-buttons>
  </div>
</template>

<script>
  import Options from './elements/Options'
  import Buttons from './elements/Buttons'

  export default {
    components: {
      'app-options': Options,
      'app-buttons': Buttons
    }
  }
</script>

<style scoped>
  #menu {
    margin-bottom: 24px;
  }

  #options {
    min-height: calc(100vh - 111px);
    max-height: calc(100vh - 111px);
    overflow: auto;
    margin-left: 10px;
    margin-right: 10px;
  }

  #buttons {
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
