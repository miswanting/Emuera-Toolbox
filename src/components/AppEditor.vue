<template lang="pug">
main.editor
  .title-bar
    .title(@click="onTitleClick()") Editor
    .spacer
    .opreaters
      abbr(
        title="编辑模式",
        :class="{ active: $store.state.editorMode === 'edit' }",
        @click="changeEditorMode('edit')"
      )
        span 编
      abbr(
        title="翻译模式",
        :class="{ active: $store.state.editorMode === 'trans' }",
        @click="changeEditorMode('trans')"
      )
        span 译
      span &emsp;
      abbr(title="New File")
        i.fas.fa-file-medical.fa-xs.fa-fw
      abbr(title="New Folder")
        i.fas.fa-folder-plus.fa-xs.fa-fw
      abbr(title="New Dict")
        i.fas.fa-book-medical.fa-xs.fa-fw
      abbr(title="Convert All SHIFT_JIS File To UTF-8")
        i.fas.fa-recycle.fa-xs.fa-fw
  EditorConfig(v-if="fileMeta.ext === '.config'", :data="fileMeta")
  EditorCsv(v-if="fileMeta.ext === '.csv'", :data="fileMeta")
  EditorErh(v-if="fileMeta.ext === '.erh'", :data="fileMeta")
  EditorErb(v-if="fileMeta.ext === '.erb'", :data="fileMeta")
</template>
<script>
import EditorConfig from "./EditorConfig.vue";
import EditorCsv from "./EditorCsv.vue";
import EditorErh from "./EditorErh.vue";
import EditorErb from "./EditorErb.vue";
export default {
  components: {
    EditorConfig,
    EditorCsv,
    EditorErh,
    EditorErb,
  },
  data() {
    return {};
  },
  computed: {
    fileMeta() {
      return this.getFileMetaRecursively(
        this.$route.params.path,
        this.$store.state.projectHierarchy
      );
    },
  },
  mounted() {},
  methods: {
    changeEditorMode(text) {
      if (this.$store.state.editorMode === "view")
        this.$store.state.editorMode = text;
      else if (text === this.$store.state.editorMode)
        this.$store.state.editorMode = "view";
      else this.$store.state.editorMode = text;
    },
    onTitleClick() {
      this.$router.back();
    },
    getFileMetaRecursively(pathPieces, hierarchy) {
      if (pathPieces.length === 1) return hierarchy.files[pathPieces[0]];
      return this.getFileMetaRecursively(
        pathPieces.slice(1, pathPieces.length),
        hierarchy.folders[pathPieces[0]]
      );
    },
  },
};
</script>
<style lang="stylus" scoped>
.editor
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

    .opreaters
      abbr
        cursor pointer
        padding 0 .1rem
        background-color var(--interactable-back)

        &:hover
          background-color var(--hover-back)

        &:active
          background-color var(--active-back)

        &.active
          background-color var(--active-back)

          &:hover
            background-color var(--hover-back)

          &:active
            background-color var(--default-back)
</style>