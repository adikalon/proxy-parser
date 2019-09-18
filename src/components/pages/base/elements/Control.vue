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
          <button class="button is-danger">Очистить</button>
          <button @click="closeRemoveModal" class="button">Отмена</button>
        </footer>
      </div>
    </div>
    <article class="message" v-show="onHints">
      <div class="message-header">
        <p>Спецсимволы</p>
      </div>
      <div class="message-body">
        <b>%i</b> - IP
      </div>
    </article>
    <div class="field has-addons">
      <p class="control has-icons-left is-expanded">
        <input @focus="showHints" @blur="hideHints" class="input" type="text" placeholder="Шаблон">
        <span class="icon is-small is-left">
          <i class="fas fa-file-export"></i>
        </span>
      </p>
      <div class="control">
        <a class="button is-link">
          Экспорт
        </a>
      </div>
      <div class="control" title="Очистить базу данных">
        <a @click="openRemoveModal" class="button is-danger">
          <span class="icon is-small">
            <i class="fa fa-trash-alt" aria-hidden="true"></i>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        onHints: false,
        onModalRemove: false
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
      }
    }
  }
</script>

<style scoped>
  .message:not(:last-child) {
    margin-bottom: 0;
  }
</style>
