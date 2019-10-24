<template>
  <div id="bottom-block">
    <div id="navigation">
      <div class="nav-item">
        <div class="field has-addons">
          <p class="control has-icons-left">
            <span class="select">
              <select ref="currentParser" @change="changeParser" :disabled="this.$root.runned ? true : false">
                <option
                  v-for="(parser, key) in this.$root.parsers"
                  :key="key"
                  :value="key"
                  :selected="(key == currentParser) ? true : false"
                >{{ parser.name }}</option>
              </select>
            </span>
            <span class="icon is-small is-left">
              <i class="fas fa-globe"></i>
            </span>
          </p>
          <p class="control" title="Очистить метки">
            <a
              class="button"
              :class="{'is-loading': loadClearButton}"
              :disabled="(this.$root.runned || this.clearOkIcon) ? true : false"
              @click="clearMarks"
              ref="clearButton"
            >
              <span class="icon is-small">
                <i class="fa" :class="{'fa-check': clearOkIcon, 'fa-trash-alt': !clearOkIcon}" aria-hidden="true"></i>
              </span>
            </a>
          </p>
          <p class="control">
            <a
              ref="runButton"
              class="button"
              :class="{'is-loading': this.$root.loading}"
              @click="runParser"
              :title="this.$root.runned ? 'Остановить парсер' : 'Запустить парсер'"
              :disabled="(this.$root.loading || this.clearOkIcon) ? true : false"
            >
              <span class="icon is-small">
                <i
                  class="fa"
                  :class="{'fa-play': !this.$root.runned, 'fa-stop': this.$root.runned}"
                  aria-hidden="true"
                ></i>
              </span>
            </a>
          </p>
        </div>
      </div>
      <div class="nav-item">
        <div class="field has-addons">
          <p class="control">
            <a class="button" @click="clearConsole" title="Очистить консоль">
              <span class="icon is-small">
                <i class="fa fa-recycle" aria-hidden="true"></i>
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button" @click="scrollConsoleToTop" title="Консоль вверх">
              <span class="icon is-small">
                <i class="fa fa-chevron-up" aria-hidden="true"></i>
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button" @click="scrollConsoleToBottom" title="Консоль вниз">
              <span class="icon is-small">
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
              </span>
            </a>
          </p>
        </div>
      </div>
    </div>
    <div id="console">
      <div class="log-message-block" v-for="(log, key) in this.$root.logs" :key="key">
        <p class="log-message-date">{{ dateFormat(log.date) }}</p>
        <p v-html="log.message"></p>
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
        loadClearButton: false,
        clearOkIcon: false,
        currentParser: this.$root.parser
      }
    },
    methods: {
      dateFormat(timestamp) {
        const date  = new Date(timestamp)
        const hour  = ('0' + date.getHours()).slice(-2)
        const min   = ('0' + date.getMinutes()).slice(-2)
        const sec   = ('0' + date.getSeconds()).slice(-2)
        const msec  = ('0' + date.getMilliseconds()).slice(-3)
        const total = `${hour}:${min}:${sec}.${msec}`

        return total
      },

      clearConsole() {
        this.$root.logs = []
        this.$el.querySelector("#console").innerHTML = ''
      },

      scrollConsoleToTop() {
        let console = this.$el.querySelector("#console")
        console.scrollTop = 0
      },

      scrollConsoleToBottom() {
        let console = this.$el.querySelector("#console")
        console.scrollTop = console.scrollHeight
      },

      changeParser(event) {
        const key = event.target.value
        this.$root.parser = key
        this.$root.description = this.$root.parsers[key].description
      },

      clearMarks() {
        if (this.$root.runned || this.clearOkIcon) {
          return null
        }

        this.loadClearButton = true

        const key   = this.$refs.currentParser.value
        const name  = this.$root.parsers[key].name

        if (ipcRenderer.sendSync('parser-clear', name)) {
          this.loadClearButton = false
          this.clearOkIcon = true

          setTimeout(() => this.clearOkIcon = false, 1000)
        } else {
          this.loadClearButton = false
          this.$refs.clearButton.innerText = 'Ошибка'
        }
      },

      runParser() {
        if (this.$root.loading || this.clearOkIcon) {
          return null
        }

        if (this.$root.runned) {
          this.$root.loading = true

          ipcRenderer.send('parser-stop')
        } else {
          this.$root.runned = true
          const key   = this.$refs.currentParser.value
          const file  = this.$root.parsers[key].file

          ipcRenderer.send('parser-start', file)
        }
      }
    },
    mounted() {
      this.scrollConsoleToBottom()

      ipcRenderer.on('parser-log', () => {
        // this.scrollConsoleToBottom()
        setTimeout(() => this.scrollConsoleToBottom(), 500)
      })

      ipcRenderer.on('parser-finish', (event, message) => {
        // this.scrollConsoleToBottom()
        setTimeout(() => this.scrollConsoleToBottom(), 500)
      })
    }
  }
</script>

<style scoped>
  #bottom-block {
    height: 100%;
  }

  #console {
    overflow: auto;
    background-color: #3B3F44;
    color: #FFFFFF;
    line-height: 120%;
    max-height: calc(100% - 36px);
    min-height: calc(100% - 36px);
  }

  #navigation {
    display:flex;
    flex-direction:row;
    justify-content: space-between;
  }

  .log-message-block:not(:first-child) {
    margin-top: 15px;
  }

  .log-message-date {
    font-weight: bold;
  }
</style>
