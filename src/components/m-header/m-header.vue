<template>
  <div class="m-header">
    <theme></theme>
    <h1 class="text"><i class="icomoon-297logo"></i>297Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  import Theme from '../theme/theme'
  export default {
    components: {
      Theme
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .m-header
    position: relative
    display flex
    height:44px
    text-align: center
    color: var(--header-color)
    background: var(--header-bgColor)
    font-size: 0
    .text
      display: flex
      flex: 1
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
      align-items: center
      justify-content: center
      color:var(--header-color)
      .icomoon-297logo
        display: block
        padding: 8px
        font-size: 26px
    .mine
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
</style>