<template>
  <div class="tabs is-centered">
    <ul>
      <router-link tag="li" exact to="/" active-class="is-active">
        <a>
          <span class="icon is-small">
            <i
              class="fas"
              :class="{'fa-circle-notch fa-spin': this.$root.runned, 'fa-play-circle': !this.$root.runned}"
              aria-hidden="true"
            ></i>
          </span>
          <span>Парсер</span>
        </a>
      </router-link>
      <router-link tag="li" to="/base" active-class="is-active">
        <a>
          <span class="icon is-small"><i class="fas fa-database" aria-hidden="true"></i></span>
          <span>База Данных</span>
        </a>
      </router-link>
      <router-link tag="li" to="/config" active-class="is-active">
        <a>
          <span class="icon is-small"><i class="fas fa-cog" aria-hidden="true"></i></span>
          <span>Настройки</span>
        </a>
      </router-link>
      <!-- <router-link tag="li" to="/about" active-class="is-active">
        <a>
          <span class="icon is-small"><i class="fas fa-info-circle" aria-hidden="true"></i></span>
          <span>Инфо</span>
        </a>
      </router-link> -->
    </ul>
  </div>
</template>

<script>

</script>

<style scoped>

</style>
