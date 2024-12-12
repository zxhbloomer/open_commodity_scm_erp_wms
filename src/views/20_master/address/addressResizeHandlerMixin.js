import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

export default {
  created () {
    // 设置页面的name 页面id，和router中的name需要一致，作为缓存
    if (this.meDialogStatus) {
      // 作为弹出框时
      this.$options.name = this.PROGRAMS.D_ADDRESS
    } else {
      // 作为独立页面，通过route路由打开时
      this.$options.name = this.$route.meta.page_code
    }
  },
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
        const elementHeight = document.documentElement.clientHeight - 85
        // 获取所有的ref，主要判断minus的refs
        const listRefsNames = Object.keys(this.$refs).map((key) => {
          return this.$refs[key]
        })
        let val = 0
        for (let i = 0; i < Object.keys(this.$refs).length; i++) {
          if (Object.keys(this.$refs)[i].indexOf('minus') >= 0) {
            val = val + listRefsNames[i].$el.offsetHeight
          }
        }
        let rtnVal = elementHeight - val - 20

        // 判断是否是弹出框
        if (this.meDialogStatus) {
          rtnVal = rtnVal - 170
        }
        // 此处使用的是页面上的值
        this.settings.tableHeight = rtnVal
        return rtnVal
      } catch (error) {
        console.log('mixin error')
      }
    }
  }
}
