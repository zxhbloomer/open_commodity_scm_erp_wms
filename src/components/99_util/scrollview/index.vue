<script>
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

export default {
  props: {
    width: {
      type: String,
      default: 'calc(100% - 320px)'
    }
  },

  data () {
    return {
      scrollable: false,
      navOffset: 0
    }
  },

  computed: {
    navStyle () {
      return {
        transform: `translateX(-${this.navOffset}px)`
      }
    }
  },

  updated () {
    this.update()
  },

  mounted () {
    this.$nextTick(() => {
      addResizeListener(window.document.body, this.update)
    })
  },

  beforeDestroy () {
    if (window.document.body && this.update) removeResizeListener(window.document.body, this.update)
  },

  methods: {
    scrollPrev () {
      const containerSize = this.$refs.navScroll.offsetWidth
      const currentOffset = this.navOffset

      if (!currentOffset) return

      const newOffset =
        currentOffset > containerSize ? currentOffset - containerSize : 0

      this.navOffset = newOffset
    },
    scrollNext () {
      // 左右箭头宽度
      const navSize = this.$refs.nav.offsetWidth
      // 顶部菜单可视宽度
      const containerSize = this.$refs.navScroll.offsetWidth
      const currentOffset = this.navOffset

      if (navSize - currentOffset <= containerSize) return

      const newOffset =
        navSize - currentOffset > containerSize * 2
          ? currentOffset + containerSize
          : navSize - containerSize

      this.navOffset = newOffset
    },
    scrollToActiveTab () {
      if (!this.scrollable) return

      const nav = this.$refs.nav
      const activeTab = this.$el.querySelector('.is-active')
      if (!activeTab) return
      const navScroll = this.$refs.navScroll
      const activeTabBounding = activeTab.getBoundingClientRect()
      const navScrollBounding = navScroll.getBoundingClientRect()
      const maxOffset = nav.offsetWidth - navScrollBounding.width
      const currentOffset = this.navOffset
      let newOffset = currentOffset

      if (activeTabBounding.left < navScrollBounding.left) {
        newOffset =
          currentOffset - (navScrollBounding.left - activeTabBounding.left)
      }
      if (activeTabBounding.right > navScrollBounding.right) {
        newOffset =
          currentOffset + activeTabBounding.right - navScrollBounding.right
      }
      newOffset = Math.max(newOffset, 0)
      this.navOffset = Math.min(newOffset, maxOffset)
    },
    update () {
      if (!this.$refs.nav) {
        return
      }
      // const navSize = this.$refs.nav.offsetWidth
      const navSize = this.$el.offsetWidth
      this.height = this.$refs.nav.offsetHeight
      // 获取hamburger 长度
      const hamburger_width = this.$parent.$parent.$el.querySelector('.hamburger-container').offsetWidth
      const hamburger_active_obj = this.$parent.$parent.$el.querySelector('.hamburger-container').querySelector('.is-active')
      let hamburger_active_left_tree_width = 0
      if (hamburger_active_obj) {
        hamburger_active_left_tree_width = 54
      }
      const containerSize = this.$refs.navScroll.offsetWidth - 250 - hamburger_width - hamburger_active_left_tree_width
      const currentOffset = this.navOffset
      if (containerSize < navSize) {
        const currentOffset = this.navOffset
        this.scrollable = this.scrollable || {}
        this.scrollable.prev = currentOffset
        this.scrollable.next = currentOffset + containerSize < navSize
        // 2023-1-13 10:54:40 顶部导航栏显示问题 注释
        // if (navSize - currentOffset < containerSize) {
        //   this.navOffset = navSize - containerSize
        // }
      } else {
        this.scrollable = false
        if (currentOffset > 0) {
          this.navOffset = 0
        }
      }
    }
  },

  render () {
    const { navStyle, scrollable, scrollNext, scrollPrev, height, width } = this
    const lineHeight = {
      'line-height': height + 'px'
    }
    const scrollBtn = scrollable
      ? [
        <span
          class={['scrollView__nav-prev', scrollable.prev ? '' : 'is-disabled']}
          on-click={scrollPrev}
        >
          <i
            style={lineHeight}
            class='el-icon-arrow-left'></i>
        </span>,
        <span
          class={['scrollView__nav-next', scrollable.next ? '' : 'is-disabled']}
          on-click={scrollNext}
        >
          <i style={lineHeight}
            class='el-icon-arrow-right'></i>
        </span>
      ]
      : null

    return (
      <div
        class={[
          'scrollView__nav-wrap',
          scrollable ? 'is-scrollable' : ''
        ]}
        style={{ width }}
      >
        {scrollBtn}
        <div
          class='scrollView__nav-scroll'
          ref='navScroll'
        >
          <div
            class='scrollView__nav'
            ref='nav'
            style={navStyle}
          >
            {this.$slots.default}
          </div>
        </div>
      </div>
    )
  }
}
</script>

<style scoped>
.scrollView__nav-wrap {
  display: inline-block;
  overflow: hidden;
  margin-bottom: -1px;
  position: relative;
  vertical-align: middle;
}

.scrollView__nav-wrap.is-scrollable {
  padding: 0 20px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.scrollView__nav-wrap::after {
  display: none;
}

.scrollView__nav-scroll {
  overflow: hidden;
}

.scrollView__nav {
  white-space: nowrap;
  position: relative;
  transition: transform 0.3s, -webkit-transform 0.3s;
  float: left;
  z-index: 2;
}

.scrollView__nav-prev {
  left: 0;
}
.scrollView__nav-next {
  right: 0;
}
.scrollView__nav-next,
.scrollView__nav-prev {
  position: absolute;
  cursor: pointer;
  line-height: 44px;
  font-size: 16px;
  color: #ffffff;
}
</style>
