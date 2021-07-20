<template lang="pug">
header
  div Header
  .spacer
  div
    i.fas.fa-language
main Main
footer Footer
</template>
<style lang="stylus" scoped>
header {
  display: flex;
}

.spacer {
  flex-grow: 1;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
});
</script>
