<template>
  <div class="progress-circle">
    <!-- viewBox x坐标 y坐标 width height -->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <!-- 浅绿色部分圆圈 -->
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <!-- 深绿色部分圆圈 动态部分 -->
      <!-- stroke-dasharray 描边长度 pi * 周长 -->
      <!-- stroke-dashoffset 虚线线条从开始位置（圆圈最右边中点）到指定位置的长度 -->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        dashArray: Math.PI * 100
      }
    },
    computed: {
      dashOffset () {
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: var(--bgcolor-shallow-2)
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme-main
</style>