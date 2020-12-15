<template lang="pug">
.erb
  //- .ast(v-if="$store.state.editorMode === 'view' && data.ast") {{ data.ast }}
  //- .raw(v-else-if="$store.state.editorMode === 'view' && data.raw") {{ rawLines }}
  table
    tbody
      tr(v-for="dr in displayRows")
        td.line-num {{ dr.oldLineNum }}
        td {{ dr.oldLineText }}
        td.line-num(v-if="$store.state.editorMode === 'trans'") {{ dr.newLineNum }}
        td(v-if="$store.state.editorMode === 'trans'") {{ dr.newLineText }}
</template>
<script>
export default {
  props: {
    data: Object,
  },
  computed: {
    rawLines() {
      if (this.data.raw) {
        return this.data.raw.split("\r\n");
      }
      return [];
    },
    displayRows() {
      const rows = [];
      let line = 1;
      if (this.$store.state.editorMode === "view" && this.data.raw) {
        console.log(this.data.raw);
        this.data.raw.split("\r\n").forEach((el) => {
          rows.push({
            oldLineNum: line,
            oldLineText: el,
            newLineNum: line,
            newLineText: el,
          });
          line += 1;
        });
      } else if (this.$store.state.editorMode === "edit" && this.data.raw) {
      } else if (this.$store.state.editorMode === "trans" && this.data.raw) {
        console.log(this.data.raw);
        this.data.raw.split("\r\n").forEach((el) => {
          rows.push({
            oldLineNum: line,
            oldLineText: el,
            newLineNum: line,
            newLineText: el,
          });
          line += 1;
        });
      }
      return rows;
    },
  },
  methods: {},
};
</script>
<style lang="stylus" scoped>
.erb
  flex-grow 1
  display flex
  flex-direction column
  color var(--default-front)
  background-color var(--static-back)
  height -webkit-fill-available
  overflow-y auto

  .spacer
    flex-grow 1

  abbr
    text-decoration none

  .line-num
    width min-width
    user-select none
    vertical-align top
</style>