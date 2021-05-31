<template lang="pug">
AppHeader
main.editor.flex-grow.flex.flex-col.cursor-default.text-black.bg-white(
  class="dark:text-white dark:bg-black"
)
  .title-bar.flex
    .title.font-bold.p-1.cursor-pointer(
      class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white",
      @click="clickTitle"
    ) {{ $t('Editor') }}
    .path.px-1.flex.flex-grow
      .py-1.cursor-pointer(
        v-for="(piece, i) in pathPieces",
        class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white"
      ) {{ piece }}
  .content.flex-grow
    div
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
      let path = this.$route.params.pieces;
      if (path === "") {
        path = [];
      }
      if (path.length > 1) {
        for (let i = 0; i < path.length - 1; i++) {
          (path as string[])[i] += "/";
        }
      }
      return [
        "/",
        ...(path as string[]).map((x: string) => {
          return x;
        }),
      ];
    },
  },
  methods: {
    clickTitle() {
      this.$router.back();
    },
  },
});
</script>
