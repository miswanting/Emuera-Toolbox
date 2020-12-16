<template lang="pug">
.erb
  //- .ast(v-if="$store.state.editorMode === 'view' && data.ast") {{ data.ast }}
  //- .raw(v-else-if="$store.state.editorMode === 'view' && data.raw") {{ rawLines }}
  table
    tbody
      tr(v-for="dr in totalLines")
        td.line-num {{ dr.oldLineNum }}
        td {{ dr.oldLineText }}
        td.line-num(v-if="$store.state.editorMode === 'trans'") {{ dr.newLineNum }}
        EditorErbLine(
          v-if="$store.state.editorMode === 'trans'",
          :data="dr.newLineText"
        )
</template>
<script>
import { h } from "vue";
import EditorErbLine from "./EditorErbLine.vue";
export default {
  components: { EditorErbLine },
  props: {
    data: Object,
  },
  data() {
    return {
      rows: [],
      translatedRows: [],
    };
  },
  watch: {
    "data.raw"(neo, old) {
      const rows = [];
      let line = 1;
      if (this.$store.state.editorMode === "edit" && this.data.raw) {
        this.data.raw.split("\r\n").forEach((el) => {
          rows.push({
            oldLineNum: line,
            oldLineText: el,
            newLineNum: line,
            newLineText: el,
          });
          line += 1;
        });
      } else if (this.$store.state.editorMode === "trans" && this.data.raw) {
      }
      this.rows = rows;
      // http://api.microsofttranslator.com/v2/Http.svc/Translate?appId=A4D660A48A6A97CCA791C34935E4C02BBB1BEC1C&from=&to=zh&text=color
      // http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=%E8%AE%A1%E7%AE%97
      fetch(
        `http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh_CN&q=${encodeURIComponent(
          "translate"
        )}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (myJson) {
          console.log(myJson.sentences[0].trans);
        });
    },
    "data.ast"(neo, old) {},
    translatedRows(neo, old) {},
  },
  computed: {
    totalLines() {
      const rows = [];
      const maxLineNum = Math.max(
        this.originalLines.length,
        this.modifiedLines.length
      );
      for (let i = 0; i < maxLineNum; i++) {
        const lineEl = {};
        lineEl.oldLineNum = i;
        lineEl.oldLineText =
          i < this.originalLines.length ? this.originalLines[i] : "";
        lineEl.newLineNum = i;
        lineEl.newLineText =
          i < this.modifiedLines.length ? this.modifiedLines[i] : {};
        rows.push(lineEl);
      }
      return rows;
    },
    modifiedLines() {
      const lines = [];
      console.log(this.data.ast);
      if (this.data.ast) {
        this.data.ast.children.forEach((line) => {
          lines.push(line);
        });
      }
      return lines;
    },
    originalLines() {
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
    text-align end
</style>