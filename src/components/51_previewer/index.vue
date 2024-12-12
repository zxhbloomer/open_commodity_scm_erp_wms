<template>
  <div id="lightgallery" />
</template>

<style scoped>
.dialog-footer {
  text-align: center;
}
.image-viewer {
  width: 100%;
}
</style>

<script>

import 'lightgallery.js'
import 'lightgallery.js/dist/css/lightgallery.min.css'
import 'lightgallery.js/dist/css/lg-transitions.min.css'
import 'lg-fullscreen.js'
import 'lg-autoplay.js'
import 'lg-video.js'
import 'lg-pager.js'
import 'lg-zoom.js'
import 'lg-rotate.js'
// import 'lg-thumbnail.js'

import elDragDialog from '@/directive/el-drag-dialog'

export default {
  components: {},
  directives: { elDragDialog },
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    paramData: {
      type: Array,
      default: null
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 页面设置json
      settings: {
        loading: true
      },
      preview_data: [
        {
          'html': '<video class="lg-video-object lg-html5" controls="controls" preload="true" autostart="true" autoplay><source src="http://file.shyiyuanth.cn/file/app_monitor/2022/20220716/943/d5cd42d1079e4888ad7decf3f5ff0a1c/1657954122651.mp4" type="video/webm">Your browser does not support HTML5 video</video>',
          'thumb': 'http://oss.shyiyuanth.cn/file/app_monitor/2022/20220318/386/c9e3030e80cc4996b5ac2220f93e4510/1647563438399.png',
          'subHtml': '装货视频'
        },
        {
          'src': 'http://oss.shyiyuanth.cn/file/app_monitor/2022/20220318/399/f59735792d1f45f793e0e987aefc4e6c/1647563412207.png',
          'thumb': 'http://oss.shyiyuanth.cn/file/app_monitor/2022/20220318/399/f59735792d1f45f793e0e987aefc4e6c/1647563412207.png',
          'subHtml': '司机车头照片'
        },

        {
          'src': 'http://oss.shyiyuanth.cn/file/app_monitor/2022/20220318/908/f948fadf0cdb419f9014a792ad6f2ed2/1647563422761.png',
          'thumb': 'http://oss.shyiyuanth.cn/file/app_monitor/2022/20220318/908/f948fadf0cdb419f9014a792ad6f2ed2/1647563422761.png',
          'subHtml': '司机车尾照片'
        }

      ]
    }
  },
  computed: {
  },
  // 监听器
  watch: {},
  created () {
    this.init()
  },
  mounted () {
    // 描绘完成
    this.$nextTick(() => {
      const el = document.getElementById('lightgallery')
      window.lightGallery(el, {
        closable: false,
        hideControlOnEnd: true,
        loop: true,
        dynamic: true,
        mode: 'lg-lollipop-rev', // 转场动画
        dynamicEl: this.paramData,
        index: (this.index)
      })
      el.addEventListener('onCloseAfter', this.onCloseAfter, { once: true })
      el.addEventListener('onAfterOpen', this.onAfterOpen, { once: true })
    })
  },
  destroyed () {
    this.$emit('closeMeCancel')
  },

  methods: {
    // 初始化处理
    init () {
      this.settings.loading = false
    },
    onCloseAfter () {
      const el = document.getElementById('lightgallery')
      window.lgData[el.getAttribute('lg-uid')].destroy(true)
      this.$destroy()
      el.removeEventListener('onCloseAfter', this.onCloseAfter, false)
      this.$emit('closeMeCancel')
    },
    onAfterOpen () {
      window.document.querySelectorAll('button.lg-close.lg-icon')[0].className = ''
      window.document.querySelectorAll('div.lg-toolbar')[0].removeChild(window.document.querySelectorAll('div.lg-toolbar')[0].childNodes[0])
    }

  }
}
</script>
