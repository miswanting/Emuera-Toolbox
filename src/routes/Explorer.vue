<template lang="pug">
AppHeader
main.explorer.flex-grow.flex.flex-col.cursor-default.text-black.bg-white(
  class="dark:text-white dark:bg-black"
)
  .title-bar.flex
    .title.font-bold.p-1 {{ $t('Explorer') }}
    .path.px-1.flex
      .py-1.cursor-pointer(
        v-for="piece in pathPieces",
        class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white"
      ) {{ piece }}
  .content.flex-grow.p-1
    div(
      v-for="item in currentFolder",
      class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white"
    )
      div(v-if="item.type === 'folder'") {{ item.name }}/
      div(v-else="") {{ item.name }}
AppFooter
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";

export default defineComponent({
  components: { AppHeader, AppFooter },
  computed: {
    pathPieces() {
      const pieces = this.$route.params.path.split("/");
      return pieces.map((x: string) => {
        return x + "/";
      });
    },
    currentFolder() {
      const pieces = this.$route.params.path.split("/");
      let index = 0;
      let currentNode = this.$store.state.fs.project;
      if (this.$store.state.fs.project !== {}) {
        while (true) {
          this.$store.state.fs.project;
          break;
        }
        return [
          ...Object.values(currentNode.folders),
          ...Object.values(currentNode.files),
        ];
      }
    },
  },
});
</script>
