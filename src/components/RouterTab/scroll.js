import { debounce } from './util'
import { scrollTo } from './util/dom'

// 页签滚动
export default {
  data () {
    return {
      hasScroller: false
    }
  },

  watch: {
    async activeTabId () {
      if (!this.$el) return

      // 激活页签时，如果当前页签不在可视区域，则滚动显示页签
      await this.$nextTick()

      const $cur = this.$el.querySelector('.router-tab-nav .actived')
      const $scr = this.$el.querySelector('.router-tab-scroll')
      if ($cur) {
        const cLeft = $cur.offsetLeft
        const sLeft = $scr.scrollLeft
        if (cLeft < sLeft || cLeft + $cur.clientWidth > sLeft + $scr.clientWidth) {
          this.adjust()
        }
      }
    }
  },

  created () {
    this.$nextTick(this.adjust)
  },

  mounted () {
    // 页面载入和浏览器窗口大小改变时调整Tab滚动显示
    window.addEventListener('resize', this.onResize = debounce(this.adjust))
  },

  destroyed () {
    // 销毁后移除监听事件
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    // Tab滚动
    tabScroll (direction) {
      const $tab = this.$el.querySelector('.router-tab-header')
      const $scr = $tab.querySelector('.router-tab-scroll')
      const space = $tab.clientWidth - 110

      scrollTo($scr, $scr.scrollLeft + (direction === 'left' ? -space : space))
    },

    // 调整Tab滚动显示
    adjust () {
      if (!this.$el) return

      const $tab = this.$el.querySelector('.router-tab-header')
      const $scr = $tab.querySelector('.router-tab-scroll')
      const $nav = $scr.querySelector('.router-tab-nav')
      const $cur = $nav.querySelector('.actived')
      const hasScroller = this.hasScroller = $nav.clientWidth > $scr.clientWidth // 判断是否需要滚动

      if ($cur && hasScroller) {
        scrollTo($scr, $cur.offsetLeft + ($cur.clientWidth - $scr.clientWidth) / 2)
      }
    }
  }
}
