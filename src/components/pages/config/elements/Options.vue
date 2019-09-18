<template>
  <div>
    <div class="field-body">
      <div class="field">
        <p class="control is-expanded has-icons-left">
          <input class="input" type="text" placeholder="Name">
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control is-expanded has-icons-left">
          <input class="input" type="text" placeholder="Name">
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </p>
      </div>
    </div>
    <div class="gap"></div>
    <div class="field-body">
      <div class="field">
        <p class="control is-expanded has-icons-left">
          <input class="input" type="text" placeholder="Name">
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </p>
      </div>
      <div class="field">
        <p class="control is-expanded has-icons-left">
          <input class="input" type="text" placeholder="Name">
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  const electron = window.require('electron')
  const ipcRenderer = electron.ipcRenderer

  ipcRenderer.on('config', (event, message) => {
    console.log(message)
  })

  export default {

  }
</script>

<style scoped>
  .gap {
    height: 10px;
  }
</style>
