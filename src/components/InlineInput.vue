<template lang="pug">
span.input
  span.prompt [
  span.value(
    @input="$emit('update:value', $event.target.innerText)",
    contenteditable,
    spellcheck="false"
  ) {{ value }}
  span.prompt ]
</template>
<script>
export default {
  props: { value: String },
  emits: ["update:value"],
};
</script>
<style lang="stylus" scoped>
.input
  background-color var(--interactable-back)

  &:hover
    color var(--hover-front)
    background-color var(--hover-back)

  &:active
    color var(--active-front)
    background-color var(--active-back)

  &.disabled
    color var(--disabled-front)
    background-color var(--disabled-back)

    &:hover
      color var(--disabled-front)
      background-color var(--disabled-back)

    &:active
      color var(--disabled-front)
      background-color var(--disabled-back)

  .prompt
    cursor default

  .value
    cursor text
    display inline-block
    min-width 2rem
    outline none
</style>