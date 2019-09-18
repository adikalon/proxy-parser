<template>
  <div>
    <div id="top">
      <app-menu></app-menu>
      <article class="message is-dark">
        <div class="message-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
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
