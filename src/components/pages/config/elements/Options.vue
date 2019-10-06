<template>
  <div>
    <div id="options">
      <div class="field-body setting-row" v-for="(setting, item) in settings" :key="item">
        <div class="field" v-for="set in setting" :key="set.id">
          <label :title="set.title"><b>{{ set.label }}</b></label>
          <p class="control is-expanded has-icons-left">
            <input
              ref="inputs"
              class="input"
              :name="set.name"
              :type="set.type"
              :placeholder="set.placeholder"
              :value="set.value"
              :b-value="set.value"
            >
            <span class="icon is-small is-left">
              <i class="fas" :class="set.icon"></i>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div id="buttons">
      <div class="field is-grouped is-grouped-right">
        <p class="control">
          <a
            class="button is-link"
            ref="saveButton"
            :class="{'is-loading': loadSaveButton}"
            @click="send"
            :disabled="this.$root.runned ? true : false"
          >
            <span class="icon is-small" v-if="okIcon">
              <i class="fas fa-check"></i>
            </span>
            <span>Сохранить</span>
          </a>
        </p>
        <p class="control" title="Восстановить сохраненные настройки">
          <a class="button is-light" @click="reset">
            Сбросить
          </a>
        </p>
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
        settings: this.$root.settings,
        loadSaveButton: false,
        okIcon: false
      }
    },
    methods: {
      send() {
        if (this.$root.runned) {
          return null
        }

        this.loadSaveButton = true

        let fields = {}

        for (const input of this.$refs.inputs) {
          fields[input.name] = input.value

          for (const [item, setting] of Object.entries(this.settings)) {
            for (const [key, value] of Object.entries(setting)) {
              if (value.name === input.name) {
                this.settings[item][key].value = input.value
              }
            }
          }
        }

        if (ipcRenderer.sendSync('config-save', fields)) {
          this.loadSaveButton = false
          this.okIcon         = true

          setTimeout(() => this.okIcon = false, 1000)
        } else {
          this.$refs.saveButton.innerText = 'Ошибка'
          this.loadSaveButton = false
        }
      },
      reset() {
        for (let input of this.$refs.inputs) {
          input.value = input.getAttribute('b-value')
        }
      }
    }
  }
</script>

<style scoped>
  .setting-row {
    margin-bottom: 15px;
  }

  #options {
    min-height: calc(100vh - 121px);
    max-height: calc(100vh - 121px);
    overflow: auto;
    margin-left: 10px;
    margin-right: 10px;
  }

  #buttons {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
