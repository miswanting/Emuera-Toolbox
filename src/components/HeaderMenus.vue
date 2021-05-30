<template lang="pug">
.window-menus.flex.cursor-pointer
  HeaderMenuItem(
    v-for="item in $store.state.menu.template",
    :data="item",
    :isRoot="false"
  )
  .menu.p-1(
    class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white"
  )
    i.fas.fa-plus.fa-fw
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderMenuItem from "./HeaderMenuItem.vue";

export default defineComponent({
  components: { HeaderMenuItem },
});
</script>
