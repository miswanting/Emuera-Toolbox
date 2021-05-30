<template lang="pug">
.theme-toggle-button-container.flex
  .theme-toggle-button.p-1.cursor-pointer(
    class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white",
    @click="toggle"
  )
    i.fas.fa-moon.fa-fw(v-if="$store.state.theme.dark")
    i.fas.fa-sun.fa-fw(v-else="")
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  methods: {
    toggle() {
      this.$store.commit("theme/toggle");
    },
  },
});
</script>

