<template lang="pug">
.change-language-button-container
  .window-language.p-1(
    class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white",
    @click="click"
  )
    i.fas.fa-globe.fa-fw
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {} from "vue-i18n";

export default defineComponent({
  methods: {
    click() {
      if (this.$i18n.locale === "en") {
        this.$i18n.locale = "zh_CN";
      } else {
        this.$i18n.locale = "en";
      }
    },
  },
});
</script>

