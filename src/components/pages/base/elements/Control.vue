<template>
  <div>
    <div :class="{ 'is-active': onModalRemove }" class="modal" id="modalRemove">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Очистить базу данных?</p>
          <button @click="closeRemoveModal" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <p>Все собранные ip-адреса будут удалены без возможности восстановить</p>
        </section>
        <footer class="modal-card-foot field is-grouped is-grouped-right">
          <button @click="truncateTable" class="button is-danger">Очистить</button>
          <button @click="closeRemoveModal" class="button">Отмена</button>
        </footer>
      </div>
    </div>
    <article class="message" v-show="onHints">
      <div class="message-header">
        <p>Спецсимволы</p>
      </div>
      <div class="message-body">
        <table class="characters-description">
          <tr>
            <td><b>%c</b> - страна</td>
            <td><b>%i</b> - IP</td>
          </tr>
          <tr>
            <td><b>%p</b> - порт</td>
            <td><b>%s</b> - источник</td>
          </tr>
        </table>
      </div>
    </article>
    <div class="field has-addons">
      <p class="control has-icons-left is-expanded">
        <input
          ref="pattern"
          @focus="showHints"
          @blur="hideHints"
          class="input"
          type="text"
          placeholder="Шаблон (по умолчанию: %i:%p)"
        >
        <span class="icon is-small is-left">
          <i class="fas fa-file-export"></i>
        </span>
      </p>
      <div class="control">
        <button class="button is-link" :class="{'is-loading': loadPullButton}" ref="pullButton" @click="pull">
          Экспорт
        </button>
        <a ref="download" class="download"></a>
      </div>
      <div class="control" title="Обновить список">
        <button
          class="button is-success"
          :class="{'is-loading': loadRefreshButton}"
          ref="refreshButton"
          @click="refresh"
        >
          <span class="icon is-small">
            <i class="fa fa-sync" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="control" title="Очистить базу данных">
        <button
          class="button is-danger"
          :class="{'is-loading': loadTruncateButton}"
          ref="truncateButton"
          @click="openRemoveModal"
        >
          <span class="icon is-small">
            <i class="fa fa-trash-alt" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  const electron = window.require('electron')
  const ipcRenderer = electron.ipcRenderer

  export default {
    data() {
      return {
        onHints: false,
        onModalRemove: false,
        loadPullButton: false,
        loadRefreshButton: false,
        loadTruncateButton: false
      }
    },

    methods: {
      showHints() {
        this.onHints = true
      },

      hideHints() {
        this.onHints = false
      },

      closeRemoveModal() {
        this.onModalRemove = false
      },

      openRemoveModal() {
        this.onModalRemove = true
      },

      pull() {
        this.loadPullButton = true

        const pattern = this.$refs.pattern.value
        const proxies = ipcRenderer.sendSync('proxies-pull', pattern)

        if (proxies) {
          const file = new Blob([proxies], {type: 'text/plain'})

          this.$refs.download
            .setAttribute('href', window.URL.createObjectURL(file))

          this.$refs.download.setAttribute('download', 'proxies.txt')
          this.$refs.download.click()

          this.loadPullButton = false
        } else {
          this.loadPullButton = false
          this.$refs.pullButton.innerText = 'Ошибка'
        }
      },

      refresh() {
        this.loadRefreshButton = true

        const proxies = ipcRenderer.sendSync('proxies-all')

        if (proxies) {
          this.$root.proxies = proxies
          this.loadRefreshButton = false
        } else {
          this.loadRefreshButton = false
          this.$refs.refreshButton.innerText = 'Ошибка'
        }
      },

      truncateTable() {
        this.closeRemoveModal()

        this.loadTruncateButton = true

        const truncate = ipcRenderer.sendSync('proxies-truncate')

        if (truncate) {
          this.$root.proxies = []
          this.loadTruncateButton = false
        } else {
          this.loadTruncateButton = false
          this.$refs.truncateButton.innerText = 'Ошибка'
        }
      }
    }
  }
</script>

<style scoped>
  .message:not(:last-child) {
    margin-bottom: 0;
  }

  .download {
    display: none;
  }

  .characters-description {
    width: 100%;
  }
</style>
