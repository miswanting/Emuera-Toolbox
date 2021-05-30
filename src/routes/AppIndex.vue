<template lang="pug">
AppHeader
main.idle.flex-grow.grid.place-items-center.cursor-default.text-black.bg-white(
  class="dark:text-white dark:bg-black",
)
  div
    .text-xl.font-bold {{ $t('Emuera Toolbox') }}
    div
      span.underline {{ $t('New') }}
      span &nbsp;
      span {{ $t('or') }}
      span &nbsp;
      span.underline {{ $t('Open') }}
      span &nbsp;
      span {{ $t('a Game Folder to continue...') }}
AppFooter
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";

export default defineComponent({
  components: { AppHeader, AppFooter },
});
</script>
