<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  const electron = window.require('electron')
  const ipcRenderer = electron.ipcRenderer

  export default {
    mounted() {
      ipcRenderer.on('parser-finish', (event, message) => {
        this.$root.loading = false
        this.$root.runned  = false

        this.$root.logs.push(message)
      })
    }
  }
</script>

<style>

</style>
