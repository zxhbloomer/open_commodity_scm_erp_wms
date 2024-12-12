import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

export default {
  beforeMount () {
  },
  mounted () {
    this.setUIheight()
    this.$nextTick(() => {
      addResizeListener(window.document.body, this.doResize)
    })
  },
  updated () {
    this.setUIheight()
  },
  // 生命周期结束时销毁事件
  destroyed () {
    if (this.resizeListener) removeResizeListener(window.document.body, this.doResize)
  },
  methods: {
    doResize () {
      this.setUIheight()
    },
    setUIheight () {
      try {
        // 定义高度
        const elementHeight = document.documentElement.clientHeight - 84
        // 获取所有的ref，主要判断minus的refs
        const listRefsNames = Object.keys(this.$refs).map((key) => {
          return this.$refs[key]
        })
        let valLeft = 0
        let valRight = 0
        for (let i = 0; i < Object.keys(this.$refs).length; i++) {
          if (Object.keys(this.$refs)[i].indexOf('minusLeft') >= 0) {
            valLeft = valLeft + listRefsNames[i].$el.offsetHeight
          }
          if (Object.keys(this.$refs)[i].indexOf('minusRight') >= 0) {
            valRight = valRight + listRefsNames[i].$el.offsetHeight
          }
        }
        const rtnLeftHeight = elementHeight - valLeft - 60
        const rtnRightHeight = elementHeight - valRight - 140
        this.treeHeight = rtnLeftHeight
        this.tableHeight = rtnRightHeight

        return { leftHeigh: rtnLeftHeight, rightHeigh: rtnRightHeight }
      } catch (error) {
        console.log('mixin error')
      }
    }
  }
}
