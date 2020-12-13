<template lang="pug">
main.idle
  .center-group
    .title Emuera Toolbox
    .msg New or Open a Game Folder to continue...
</template>
<script>
export default {};
</script>
<style lang="stylus" scoped>
.idle
  flex-grow 1
  display grid
  place-items center
  color var(--default-front)
  background-color var(--default-back)

  .title
    font-weight bold
    color var(--o)

  .msg
    color var(--n)
</style>