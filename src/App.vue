<template lang="pug">
RouterView
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
  name: "Emuera-Toolbox",
  components: { RouterView },
  mounted() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      this.$store.commit("theme/toggle");
  },
});
</script>
