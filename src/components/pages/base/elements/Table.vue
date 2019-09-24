<template>
  <div>
    <table class="table is-fullwidth is-striped is-narrow is-hoverable is-bordered">
      <thead>
        <tr>
          <th>Страна</th>
          <th>IP</th>
          <th>Порт</th>
          <th>Источник</th>
          <th>Добавлен</th>
          <th>Обновлен</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th>Страна</th>
          <th>IP</th>
          <th>Порт</th>
          <th>Источник</th>
          <th>Добавлен</th>
          <th>Обновлен</th>
        </tr>
      </tfoot>
      <tbody>
        <tr v-for="proxy in proxies" :key="proxy.id">
          <td>{{ proxy.country }}</td>
          <td>{{ proxy.ip }}</td>
          <td>{{ proxy.port }}</td>
          <td>{{ proxy.source }}</td>
          <td>{{ dateFormat(proxy.inserted) }}</td>
          <td>{{ dateFormat(proxy.updated) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        proxies: this.$root.proxies
      }
    },
    methods: {
      dateFormat(timestamp) {
        const date  = new Date(timestamp)
        const day   = ('0' + date.getDate()).slice(-2)
        const month = ('0' + (date.getMonth() + 1)).slice(-2)
        const year  = date.getFullYear()
        const hour  = ('0' + date.getHours()).slice(-2)
        const min   = ('0' + date.getMinutes()).slice(-2)
        const sec   = ('0' + date.getSeconds()).slice(-2)
        const total = `${day}.${month}.${year} - ${hour}:${min}:${sec}`

        return total
      }
    }
  }
</script>

<style scoped>

</style>
