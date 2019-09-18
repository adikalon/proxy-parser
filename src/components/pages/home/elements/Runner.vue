<template>
  <div id="bottom-block">
    <div id="navigation">
      <div class="nav-item">
        <div class="field has-addons">
          <p class="control has-icons-left">
            <span class="select">
              <select>
                <option selected>Country</option>
                <option>Select dropdown</option>
                <option>With options</option>
              </select>
            </span>
            <span class="icon is-small is-left">
              <i class="fas fa-globe"></i>
            </span>
          </p>
          <p class="control" title="Очистить метки">
            <a class="button">
              <span class="icon is-small">
                <i class="fa fa-trash-alt" aria-hidden="true"></i>
              </span>
            </a>
          </p>
          <p class="control" title="Запустить парсер">
            <a class="button">
              <span class="icon is-small">
                <i class="fa fa-play" aria-hidden="true"></i>
              </span>
            </a>
          </p>
        </div>
      </div>
      <div class="nav-item">
        <div class="field has-addons">
          <p class="control" @click="clearConsole" title="Очистить консоль">
            <a class="button">
              <span class="icon is-small">
                <i class="fa fa-recycle" aria-hidden="true"></i>
              </span>
            </a>
          </p>
          <p class="control" @click="scrollConsoleToTop" title="Консоль вверх">
            <a class="button">
              <span class="icon is-small">
                <i class="fa fa-chevron-up" aria-hidden="true"></i>
              </span>
            </a>
          </p>
          <p class="control" @click="scrollConsoleToBottom" title="Консоль вниз">
            <a class="button">
              <span class="icon is-small">
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
              </span>
            </a>
          </p>
        </div>
      </div>
    </div>
    <div id="console">
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti numquam laudantium dicta, nobis nemo fugit beatae cupiditate veniam ex ducimus libero eius blanditiis perspiciatis incidunt nihil consequatur quam consequuntur quidem.
      Cumque, numquam hic aut architecto esse iste, vero ab ea ratione, fugit corporis magni laboriosam enim error. Ea perferendis cupiditate dolore. Aut quis cum saepe molestias quasi omnis rerum magni.
      Ad nihil quis nostrum, corrupti quisquam illo officia minus possimus eaque iusto odit cupiditate cumque, et mollitia natus esse, dolorem facilis consequuntur voluptates quo fuga maxime. Qui error molestias praesentium!
      Alias possimus eum beatae sapiente, nobis reprehenderit amet! Sapiente voluptatibus totam perferendis corporis quae laborum veniam atque dignissimos debitis alias. Vitae vero exercitationem et debitis hic nam amet nulla omnis.
      Eos aliquam, nemo necessitatibus quas, dolore eaque nesciunt itaque dicta magni, quo natus ex non unde iste veritatis tenetur magnam eveniet qui expedita molestias omnis excepturi numquam beatae. Quam, ex.
      Porro rem, quisquam nostrum exercitationem praesentium vero voluptatum, deleniti, cum beatae fugit quam accusamus incidunt omnis repudiandae! Inventore possimus ab veritatis quidem saepe perspiciatis a id doloribus voluptas. Fugit, vitae?
      Nostrum repudiandae ipsam commodi quaerat tenetur dolores culpa dicta. Quidem assumenda voluptate nisi officia sapiente dolorum aspernatur, eius quibusdam alias rerum molestias facere recusandae aut, maxime iste eos veniam minus?
      Obcaecati harum inventore enim explicabo quo commodi suscipit debitis expedita deleniti ratione accusantium temporibus at animi ab, illum voluptas? Autem, fugit debitis qui reprehenderit libero necessitatibus voluptatem doloremque magnam vitae.
      Nulla optio, delectus sunt unde in nesciunt! Quidem ipsam possimus soluta quod deserunt perspiciatis, inventore eum minima. At incidunt doloribus aut eius! Nihil quibusdam dolorum eos obcaecati! Perspiciatis, ad consequatur?
      Optio dignissimos aspernatur nihil iure aut quia error culpa hic ad quis. Ea consectetur vero voluptate quam, fugiat sunt eaque. Sunt distinctio sapiente debitis id porro at obcaecati tempore nemo!</p>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      clearConsole() {
        this.$el.querySelector("#console").innerHTML = ''
      },

      scrollConsoleToTop() {
        let console = this.$el.querySelector("#console")
        console.scrollTop = 0
      },

      scrollConsoleToBottom() {
        let console = this.$el.querySelector("#console")
        console.scrollTop = console.scrollHeight
      }
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
