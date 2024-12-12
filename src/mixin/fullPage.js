import screenfull from 'screenfull'
export const fullPage = {
  name: 'fullPage',
  data () {
    return {
      isFullPage: screenfull.isFullscreen
    }
  },
  computed: {
  },
  mounted () {
    const title = this.$router.currentRoute.meta.title
    if (title) {
      document.title = title
    }
    const self = this
    document.addEventListener('keydown', this.handleKeyDown)
    window.onresize = () => {
      self.isFullPage = screenfull.isFullscreen
    }
  },
  methods: {
    handleKeyDown (e) {
      if (e && e.keyCode === 122) {
        e.preventDefault() // 阻止默认事件
        this.fullpageClick()
      }
    },
    fullpageClick () {
      this.isFullPage = !this.isFullPage
      if (!screenfull.enabled) {
        this.$message({
          message: 'Your browser does not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle().then((e) => {})
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.onresize = null
  }
}
