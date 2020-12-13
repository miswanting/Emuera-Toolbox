<template lang="pug">
main.explorer
  .title-bar
    .title(@click="onTitleClick()") Explorer
    div &emsp;
    .path
      span.path-item(@click="onPathClick(-1)") /
      span.path-item(
        v-for="(pathItem, i) in pathItems",
        @click="onPathClick(i)"
      ) {{ pathItem }}
    .spacer
    .opreaters
      abbr(title="New File")
        i.fas.fa-file-medical.fa-xs.fa-fw
      abbr(title="New Folder")
        i.fas.fa-folder-plus.fa-xs.fa-fw
      abbr(title="New Dict")
        i.fas.fa-book-medical.fa-xs.fa-fw
      abbr(title="Convert All SHIFT_JIS File To UTF-8")
        i.fas.fa-recycle.fa-xs.fa-fw
  .content
    .entry(v-for="entryMeta in entryMetas", @click="onEntryClick(entryMeta)")
      .name {{ entryMeta.name + (entryMeta.type === 'folder' ? '/' : '') }}
      .description(v-if="getEntryDescription(entryMeta.name)") {{ getEntryDescription(entryMeta.name) }}
      abbr(title="Active Target", v-if="entryMeta.ext === '.exe'")
        i.fas.fa-crosshairs.fa-xs.fa-fw(style={ color: 'lime' })
      abbr(title="File Encoding", v-if="entryMeta.encoding")
        .encoding {{ entryMeta.encoding }}
      .spacer
      .load-status(v-if="entryMeta.type === 'file'") {{ entryMeta.loadStatus }}
</template>
<script>
import { sep, extname } from "path";
import _ from "lodash";
export default {
  computed: {
    pathPieces() {
      if (this.$route.params.path === "") {
        return [];
      }
      return this.$route.params.path;
    },
    pathItems() {
      const pathItems = [];
      for (let i = 0; i < this.pathPieces.length; i++) {
        pathItems.push(`${this.pathPieces[i]}/`);
      }
      return pathItems;
    },
    entryMetas() {
      function getCurrentFolderMetaRecursively(
        pathPieces,
        currentFolderHierarchy
      ) {
        if (pathPieces.length === 0) {
          return currentFolderHierarchy;
        }
        return getCurrentFolderMetaRecursively(
          pathPieces.slice(1, pathPieces.length),
          currentFolderHierarchy.folders[pathPieces[0]]
        );
      }
      const folderMeta = getCurrentFolderMetaRecursively(
        this.pathPieces,
        this.$store.state.projectHierarchy
      );
      const entryMetas = [];
      for (const key in folderMeta.folders) {
        if (folderMeta.folders.hasOwnProperty(key)) {
          entryMetas.push(folderMeta.folders[key]);
        }
      }
      for (const key in folderMeta.files) {
        if (folderMeta.files.hasOwnProperty(key)) {
          entryMetas.push(folderMeta.files[key]);
        }
      }
      return entryMetas;
    },
  },
  methods: {
    getEntryDescription(entryName) {
      const ext = extname(entryName).toLowerCase();
      let entryDescription = "";
      if (ext === ".exe") entryDescription = "EmueraExecutableFile";
      else if (ext === ".config") entryDescription = "ConfigFile";
      else if (ext === ".csv") entryDescription = "CSVFile";
      else if (ext === ".erh") entryDescription = "EraBasicHeaderFile";
      else if (ext === ".erb") entryDescription = "EraBasicScriptFile";
      return entryDescription;
    },
    onEntryClick(entryMeta) {
      if (entryMeta.type === "folder")
        this.$router.push(`${this.$route.path}/${entryMeta.name}`);
      else if (entryMeta.type === "file") {
        this.$store.commit("parsePackage", {
          type: "loadFile",
          data: _.concat(this.pathPieces, entryMeta.name),
        });
        this.$router.push(
          `/editor/${_.concat(this.pathPieces, entryMeta.name).join("/")}`
        );
      }
    },
    onTitleClick() {
      this.$router.push(
        `/explorer/${this.pathPieces
          .slice(0, this.pathPieces.length - 1)
          .join("/")}`
      );
    },
    onPathClick(index) {
      this.$router.push(
        `/explorer${this.pathPieces.slice(0, index + 1).map((s) => {
          return "/" + s;
        })}`
      );
    },
  },
};
</script>
<style lang="stylus" scoped>
.explorer
  // flex-grow 1
  height 100vh
  display flex
  flex-direction column
  color var(--default-front)
  background-color var(--default-back)

  .spacer
    flex-grow 1

  abbr
    text-decoration none

  .title-bar
    display flex
    margin .5rem

    .title
      cursor pointer
      background-color var(--interactable-back)

      &:hover
        background-color var(--hover-back)

    .path
      background-color var(--interactable-back)

      .path-item
        cursor pointer

        &:hover
          background-color var(--hover-back)

    .opreaters
      background-color var(--interactable-back)

      abbr
        cursor pointer
        padding 0 .1rem

        &:hover
          background-color var(--hover-back)

  .content
    flex-grow 1
    overflow-y auto

  .entry
    display flex
    background-color var(--interactable-back)
    margin 0 .5rem
    align-items center
    cursor pointer

    &:hover
      background-color var(--hover-back)

    .description, .encoding
      font-size x-small
      background-color var(--hover-back)
      padding 0 .2rem
      margin 0 .3rem

    .load-status
      font-size x-small
      color var(--disabled-front)
      margin 0 .5rem
</style>