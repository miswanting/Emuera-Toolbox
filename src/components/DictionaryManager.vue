<template lang="pug">
main
  .title-bar
    .title(@click="onTitleClick()") DictionaryManager
  .transfer-window
    .dictionary-config(v-if="showConfigModal")
      .center-group 
        div 
          .spacer
          div 新建空字典
          .spacer
        div 
          label 字典名称
          .spacer
          InlineInput(v-model:value="currentNewDictToAccept.name") 
        div 
          label 字典版本
          .spacer
          InlineInput(v-model:value="currentNewDictToAccept.version") 
        div 
          label 字典作者
          .spacer
          InlineInput(v-model:value="currentNewDictToAccept.author") 
        div 
          .cancle(@click="showConfigModal = false") 取消
          .spacer
          .accept(@click="acceptNewDict") 确定
    .left-window
      .header 可激活字典
      .dict(v-for="(d, i) in $store.state.dict.avaliable")
        .name {{ d.name }}
        .author {{ '@' + d.author }}
        .version {{ 'v' + d.version }}
        .operator(@click="openConfigModal(i)")
          i.fas.fa-cog.fa-fw
        .operator(@click="enableDict(i)")
          i.fas.fa-angle-right.fa-fw
      abbr.create-dictionary(
        title="Create Blank Dictionary",
        @click="openConfigModal(-1)"
      )
        i.fas.fa-plus.fa-fw
    .right-window
      .header 已激活字典
      .dict(v-for="(d, i) in $store.state.dict.active")
        .operator(@click="disableDict(i)")
          i.fas.fa-angle-left.fa-fw
        .name {{ d.name }}
        .author {{ '@' + d.author }}
        .version {{ 'v' + d.version }}
        .operator(:class="{ active: d.current }", @click="setCurrent(i)")
          i.fas.fa-crosshairs.fa-fw
</template>
<script>
import InlineInput from "./InlineInput.vue";
export default {
  components: { InlineInput },
  data() {
    return {
      showConfigModal: false,
      currentEditDict: {},
      currentNewDictToAccept: {},
    };
  },
  methods: {
    onTitleClick() {
      this.$router.back();
    },
    openConfigModal(i) {
      this.currentNewDictToAccept = {
        name: "New Dict",
        version: "0.1.0",
        author: "Anonymous",
        current: false,
      };
      this.showConfigModal = true;
    },
    acceptNewDict() {
      this.$store.state.dict.avaliable.push(this.currentNewDictToAccept);
      this.showConfigModal = false;
    },
    enableDict(i) {
      this.$store.state.dict.active.push(
        this.$store.state.dict.avaliable.splice(i, 1)[0]
      );
    },
    disableDict(i) {
      this.$store.state.dict.avaliable.push(
        this.$store.state.dict.active.splice(i, 1)[0]
      );
    },
    setCurrent(index) {
      for (let i = 0; i < this.$store.state.dict.active.length; i++) {
        if (i === index) {
          this.$store.state.dict.active[i].current = true;
        } else {
          this.$store.state.dict.active[i].current = false;
        }
      }
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
    min-width 1rem

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
    position relative

    .dictionary-config
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      backdrop-filter blur(3px) brightness(.5)
      display grid
      place-items center

      .center-group
        background-color var(--default-back)

        &>div
          display flex
          text-align center

        .accept
          cursor pointer
          background-color #335539

          &:hover
            background-color #437749

          &:active
            background-color #539959

        .cancle
          cursor pointer
          background-color #553639

          &:hover
            background-color #774649

          &:active
            background-color #995659

    .left-window
      width 50vw
      margin .5rem
      background-color var(--static-back)

      .header
        padding .5rem
        background-color var(--default-back)
        font-weight bold
        text-align center

      .dict
        background-color var(--interactable-back)
        display flex

        .name
          padding .5rem

        .author
          padding .5rem
          flex-grow 1

        .version
          font-size x-small
          align-self center
          margin 0 .5rem
          padding 0 .5rem

        .operator
          padding .5rem
          cursor pointer

          &:hover
            background-color var(--hover-back)

          &:active
            background-color var(--active-back)

      .create-dictionary
        padding .5rem
        display block
        text-align center
        align-self center
        background-color var(--interactable-back)
        cursor pointer

        &:hover
          background-color var(--hover-back)

        &:active
          background-color var(--active-back)

    .right-window
      width 50vw
      margin .5rem
      background-color var(--static-back)

      .header
        padding .5rem
        background-color var(--default-back)
        font-weight bold
        text-align center

      .dict
        background-color var(--interactable-back)
        display flex

        .name
          padding .5rem

        .author
          padding .5rem
          flex-grow 1

        .version
          font-size x-small
          align-self center
          margin 0 .5rem
          padding 0 .5rem

        .operator
          padding .5rem
          cursor pointer

          &:hover
            background-color var(--hover-back)

          &:active
            background-color var(--active-back)

          &.active
            color #0f0
            cursor default

            &:hover
              background-color var(--interactable-back)

            &:active
              background-color var(--interactable-back)
</style>