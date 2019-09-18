<template>
  <div>
    <app-menu></app-menu>
    <app-documentation></app-documentation>
  </div>
</template>

<script>
  import Documentation from './elements/Documentation'

  export default {
    components: {
      'app-documentation': Documentation
    }
  }
</script>

<style scoped>

</style>
