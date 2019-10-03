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
                >{{ parser.name }}</option>
              </select>
            </span>
            <span class="icon is-small is-left">
              <i class="fas fa-globe"></i>
            </span>
          </p>
          <p class="control" title="Очистить метки">
            <a class="button" :disabled="this.$root.runned ? true : false">
              <span class="icon is-small">
                <i class="fa fa-trash-alt" aria-hidden="true"></i>
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
              :disabled="this.$root.loading ? true : false"
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
      <p v-for="(log, key) in this.$root.logs" :key="key">{{ log.date }} - {{ log.message }}</p>
    </div>
  </div>
</template>

<script>
  const electron = window.require('electron')
  const ipcRenderer = electron.ipcRenderer

  export default {
    methods: {
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
        this.$root.description = this.$root.parsers[key].description
      },

      runParser() {
        if (this.$root.loading) {
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
      ipcRenderer.on('parser-finish', (event, arg) => {
        this.$root.loading = false
        this.$root.runned  = false
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
    max-height: calc(100% - 36px);
    min-height: calc(100% - 36px);
  }

  #navigation {
    display:flex;
    flex-direction:row;
    justify-content: space-between;
  }
</style>
