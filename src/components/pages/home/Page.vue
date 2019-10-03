<template>
  <div>
    <div id="top">
      <app-menu></app-menu>
      <article class="message is-dark">
        <div class="message-body">
          {{ this.$root.description }}
        </div>
      </article>
    </div>
    <div id="bottom">
      <app-runner></app-runner>
    </div>
  </div>
</template>

<script>
  import Runner from './elements/Runner'

  export default {
    components: {
      'app-runner': Runner
    }
  }
</script>

<style scoped>
  #top {
    min-height: calc(100vh - 350px);
  }

  #bottom {
    height: 350px;
  }
</style>
