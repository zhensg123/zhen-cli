<template>
  <!-- <div class="el-backtop" v-show='toTopShow' @click='gotoPageTop'><i class="el-icon-caret-top"></i></div> -->
    <div class="vue-template-backtop" v-show='toTopShow' @click='gotoPageTop'>
       顶
    </div>
</template>
<script>
import Tween from '@/util/tween'
export default {
  name: 'back-top',
  props: {
    duration: {
      type: Number,
      default: 60
    },
    showDistance: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      toTopShow: false
    }
  },
  methods: {
    gotoPageTop () {
      let t = 0 // 开始时间
      const b = this.scrollTop// 开始位置
      const c = -this.scrollTop // 变化值
      const d = this.duration
      const doc = document
      const win = window
      const step = () => {
        const value = Tween.Cubic.easeOut(t, b, c, d)
        // document.documentElement.scrollTop = value;
        // let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if (doc.documentElement.scrollTop) {
          doc.documentElement.scrollTop = value
        }
        if (win.pageYOffset) {
          win.pageYOffset = value
        }
        if (doc.body.scrollTop) {
          doc.body.scrollTop = value
        }
        t++
        if (t <= d) {
          // 继续运动
          win.requestAnimationFrame(step)
        } else {
          // 动画结束
        }
      }
      step()
    },
    handleScroll () {
      this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      this.toTopShow = this.scrollTop > this.showDistance
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}

</script>
<style lang="scss" scoped>
.vue-template-backtop {
  position: fixed;
  background-color: #fff;
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 4000;
  bottom: 32px;
  right: 16px;
  height: 79px;
    opacity: 0.9;
    width: 38px;
    height: 38px;
    border-radius: 3px;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #fff;
}
.back-top {
    position: fixed;
    bottom: 32px;
    right: 16px;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    z-index: 1000;
    cursor: pointer;
}
</style>
