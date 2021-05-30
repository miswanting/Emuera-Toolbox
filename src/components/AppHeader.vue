<template lang="pug">
header.flex.text-black.bg-white(class="dark:text-white dark:bg-black")
  HeaderMenus
  .window-title.flex-grow.p-1.text-center.cursor-move(
    style="-webkit-app-region: drag"
  ) {{ $t('Emuera Toolbox') }}
  .window-command.flex.cursor-pointer
    .window-user.p-1.cursor-not-allowed
      i.fas.fa-user.fa-fw
    ChangeLanguageButton
    ThemeToggleButton
    .window-minimize.p-1(
      class="hover:bg-green-500 hover:dark:bg-green-500",
      @click="min"
    )
      i.fas.fa-minus.fa-fw
    .window-maximize.p-1(
      class="hover:bg-yellow-500 hover:dark:bg-yellow-500",
      @click="max"
    )
      i.fas.fa-compress.fa-fw(v-if="isMax")
      i.fas.fa-expand.fa-fw(v-else="")
    .window-close.p-1(class="hover:bg-red-500 hover:dark:bg-red-500", @click="close")
      i.fas.fa-times.fa-fw
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer } from "electron";
import HeaderMenus from "./HeaderMenus.vue";
import ChangeLanguageButton from "./ChangeLanguageButton.vue";
import ThemeToggleButton from "./ThemeToggleButton.vue";

export default defineComponent({
  components: { HeaderMenus, ChangeLanguageButton, ThemeToggleButton },
  data() {
    return {
      isMax: false,
    };
  },
  methods: {
    min() {
      ipcRenderer.invoke("minWin");
    },
    max() {
      this.isMax = !this.isMax;
      ipcRenderer.invoke("maxWin");
    },
    close() {
      ipcRenderer.invoke("closeWin");
    },
  },
});
</script>
