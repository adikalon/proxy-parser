<template>
  <div>
    <div id="options">
      <div class="field-body setting-row" v-for="(setting, item) in this.$root.settings" :key="item">
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
            :class="{'is-loading': this.$root.save}"
            @click="send"
            :disabled="(this.$root.runned || this.okIcon) ? true : false"
          >
            <span class="icon is-small" v-if="okIcon">
              <i class="fas fa-check"></i>
            </span>
            <span>{{ saveButtonText }}</span>
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
        okIcon: false,
        saveButtonText: 'Сохранить'
      }
    },
    methods: {
      send() {
        if (this.$root.runned || this.okIcon) {
          return null
        }

        this.$root.save = true

        let fields = {}

        for (const input of this.$refs.inputs) {
          fields[input.name] = input.value

          for (const [item, setting] of Object.entries(this.$root.settings)) {
            for (const [key, value] of Object.entries(setting)) {
              if (value.name === input.name) {
                this.$root.settings[item][key].value = input.value
              }
            }
          }
        }

        ipcRenderer.send('config-save', fields)
      },
      reset() {
        for (let input of this.$refs.inputs) {
          input.value = input.getAttribute('b-value')
        }
      }
    },
    mounted() {
      ipcRenderer.on('config-save-done', (event, result) => {
        if (result) {
          this.$root.save = false
          this.okIcon     = true

          setTimeout(() => this.okIcon = false, 1000)
        } else {
          this.$root.save     = false
          this.saveButtonText = 'Ошибка'
        }
      })
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
