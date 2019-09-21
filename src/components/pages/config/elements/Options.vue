<template>
  <div>
    <div class="field-body setting-row" v-for="(setting, item) in settings" :key="item">
      <div class="field" v-for="set in setting" :key="set.id">
        <label :title="set.title"><b>{{ set.label }}</b></label>
        <p class="control is-expanded has-icons-left">
          <input class="input" :type="set.type" :placeholder="set.placeholder" :value="set.value">
          <span class="icon is-small is-left">
            <i :class="set.icon"></i>
          </span>
        </p>
      </div>
    </div>
    <br>
    <div class="gap"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        settings: []
      }
    },
    mounted() {
      for (let setting of this.$root.settings) {
        if (this.settings.length <= 0) {
          this.settings.push([setting])
        } else {
          if (this.settings[this.settings.length - 1].length <= 1) {
            this.settings[this.settings.length - 1].push(setting)
          } else {
            this.settings.push([setting])
          }
        }
      }
    }
  }
</script>

<style scoped>
  .gap {
    height: 10px;
  }

  .setting-row {
    margin-bottom: 15px;
  }
</style>
