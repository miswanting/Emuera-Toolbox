<template lang="pug">
.erh
  .ast(v-if="data.ast") {{ data.ast }}
  .raw(v-else-if="data.raw") {{ rawLines }}
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
  },
  methods: {},
};
</script>
<style lang="stylus" scoped>
.erh
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
</style>