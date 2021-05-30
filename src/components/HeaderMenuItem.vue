<template lang="pug">
.menu-container
  .menu-separator.border(v-if="'type' in data")
  .menu-button.p-1(
    v-else="",
    @click="click",
    class="hover:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white"
  ) {{ $t('role' in data ? data.role : data.label) }}
  .menu-container.absolute.border(v-if="show")
    HeaderMenuItem(
      v-for="item in data.submenu",
      :data="item",
      :isRoot="false",
      @click="childClick"
    )
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HeaderMenuItem",
  props: {
    data: Object,
    isRoot: Boolean,
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    click() {
      if ("submenu" in this.data) {
        this.show = !this.show;
      } else if ("click" in this.data) {
        this.data.click();
      }
    },
    childClick() {
      this.show = !this.show;
    },
  },
});
</script>
