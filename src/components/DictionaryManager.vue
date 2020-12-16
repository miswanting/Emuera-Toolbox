<template lang="pug">
main
  .title-bar
    .title(@click="onTitleClick()") DictionaryManager
  .transfer-window
    .left-window
      .new-dictionary
        i.fas.fa-plus.fa-fw
    .operator
      .spacer
      .to-right
        i.fas.fa-angle-right.fa-fw
      .to-left
        i.fas.fa-angle-left.fa-fw
      .spacer
    .right-window
</template>
<script>
export default {
  methods: {
    onTitleClick() {
      this.$router.back();
    },
  },
};
</script>
<style lang="stylus" scoped>
main
  flex-grow 1
  color var(--default-front)
  background-color var(--default-back)
  display flex
  flex-direction column

  .spacer
    flex-grow 1

  .title-bar
    display flex
    margin .5rem

    .title
      cursor pointer
      background-color var(--interactable-back)

      &:hover
        background-color var(--hover-back)

      &:active
        background-color var(--active-back)

  .transfer-window
    flex-grow 1
    display flex

    .left-window
      flex-grow 1
      margin .5rem
      background-color var(--static-back)

      > div
        padding .5rem
        background-color var(--interactable-back)
        cursor pointer

        &:hover
          background-color var(--hover-back)

        &:active
          background-color var(--active-back)

      .new-dictionary
        text-align center

    .operator
      display flex
      flex-direction column

      .to-right
        cursor pointer
        padding .5rem
        background-color var(--interactable-back)

        &:hover
          background-color var(--hover-back)

        &:active
          background-color var(--active-back)

      .to-left
        cursor pointer
        padding .5rem
        background-color var(--interactable-back)

        &:hover
          background-color var(--hover-back)

        &:active
          background-color var(--active-back)

    .right-window
      flex-grow 1
      margin .5rem
      background-color var(--static-back)

      > div
        padding .5rem
        background-color var(--interactable-back)
        cursor pointer

        &:hover
          background-color var(--hover-back)

        &:active
          background-color var(--active-back)
</style>