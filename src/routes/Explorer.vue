<template lang="pug">
AppHeader
main.explorer.flex-grow.flex.flex-col.cursor-default.text-black.bg-white(
  class="dark:text-white dark:bg-black"
)
  .title-bar.flex
    .title.font-bold.p-1.cursor-pointer(
      class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white",
      @click="clickTitle"
    ) {{ $t('Explorer') }}
    .path.px-1.flex.flex-grow
      .py-1.cursor-pointer(
        v-for="(piece, i) in pathPieces",
        class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white",
        @click="clickPath(i)"
      ) {{ piece }}
  .content.flex-grow.p-1
    .flex.cursor-pointer(
      v-for="item in currentFolder",
      class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white",
      @click="click(item)"
    )
      div(v-if="item.type === 'folder'") {{ item.name }}/
      div(v-else="") {{ item.name }}
      .flex
        .text-xs.self-center.mx-2.text-white.bg-black(
          class="dark:text-black dark:bg-white"
        ) {{ $t(getEntryDes(item)) }}
        .text-xs.self-center.mx-2.text-white.bg-black(
          v-if="'encoding' in item",
          class="dark:text-black dark:bg-white"
        ) {{ item.encoding }}
        .text-xs.self-center.mx-2.text-black(
          v-if="item.ext === '.exe'",
          class="dark:text-white"
        ) 
          i.fas.fa-crosshairs.fa-fw
AppFooter
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { ipcRenderer } from "electron";

export default defineComponent({
  components: { AppHeader, AppFooter },
  computed: {
    pathPieces() {
      let path = this.$route.params.pieces;
      if (path === "") {
        path = [];
      }
      return [
        "/",
        ...(path as string[]).map((x: string) => {
          return x + "/";
        }),
      ] as string[];
    },
    currentFolder() {
      let path = this.$route.params.pieces;
      if (path === "") {
        path = [];
      }
      let currentNode = this.$store.state.fs.project;

      for (let i = 0; i < path.length; i++) {
        currentNode = currentNode.folders[path[i]];
      }

      if (Object.keys(currentNode).length === 0) {
        this.$nextTick(() => {
          this.$router.push("/");
        });
      }

      return [
        ...Object.values(currentNode.folders),
        ...Object.values(currentNode.files),
      ] as any[];
    },
  },
  methods: {
    getEntryDes(item: any) {
      if (item.type === "folder") {
        if (item.name.toLowerCase() === "csv") {
          return "CSV Folder";
        }
        return "Folder";
      } else if (item.type === "file") {
        const pair = item.name.toLowerCase().split(".");
        if (pair[1] === "exe") {
          return "EmueraGameEngine";
        } else if (pair[1] === "config") {
          return "EmueraEngineConfig";
        } else if (pair[1] === "csv") {
          return "DataFile";
        } else if (pair[1] === "erh") {
          return "EraBasicHeaderFile";
        } else if (pair[1] === "erb") {
          return "EraBasicScript";
        }
        return "File";
      }
      return "Unknown";
    },
    getPathPieces() {
      let path = this.$route.params.pieces;
      if (path === "") {
        path = [];
      }
      return path as string[];
    },
    clickTitle() {
      let path = (this as any).getPathPieces();
      if (path.length !== 0) {
        path = path.slice(0, path.length - 1);
      }
      this.$router.push(
        `/explorer${path
          .map((x: string) => {
            return "/" + x;
          })
          .join("")}`
      );
    },
    clickPath(index: number) {
      let t = this.$router.currentRoute.value.path.split("/");
      console.log(index, t.length, t);
      const length = t.length;
      for (let i = 0; i < length - index - 2; i++) {
        t.pop();
      }
      console.log(index, t.length, t);
      this.$router.push(t.join("/"));
    },
    click(item: any) {
      if (item.type === "folder") {
        this.$router.push(
          `${this.$router.currentRoute.value.path}/${item.name}`
        );
      } else if (item.type === "file") {
        let path = (this as any).getPathPieces();
        const dir = path
          .map((x: string) => {
            return "/" + x;
          })
          .join("");
        const newPath = `/editor${dir}/${item.name}`;
        ipcRenderer.send("readFile", [...path, item.name]);
        this.$router.push(newPath);
      }
    },
  },
});
</script>
