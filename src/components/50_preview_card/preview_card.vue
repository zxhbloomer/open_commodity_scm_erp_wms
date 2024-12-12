<!--card-->
<template>
  <el-card
    :body-style="{ padding: '0px' }"
    style="min-width: 100%;height: 100%;"
  >
    <iframe
      ref="iframe"
      :src="dataJson.preview_pic_url"
      frameborder="0"
      class="iframe"
      scrolling="auto"
      width="228"
      height="150"
    />
    <div>
      <span class="span_filename">文件名：{{ fileName }}</span>
      <span class="time span_time">{{ formatDateTime(time) }}</span>
      <span
        :v-if="showTitle"
        class="span_title"
      >{{ title }}</span>
      <div class="bottom">
        <el-button
          v-if="showDelete"
          type="text"
          class="floatLeft"
          @click="handleDelete"
        >删除</el-button>
        <el-button
          type="text"
          class="floatRight"
          @click="handlePreview"
        >预览</el-button>
        <el-button
          type="text"
          class="floatRight"
          @click="handleDownload"
        >下载</el-button>
      </div>
    </div>
    <iframe
      id="refIframe"
      ref="refIframe"
      scrolling="no"
      frameborder="0"
      style="display:none"
      name="refIframe"
    >x</iframe>
  </el-card>
</template>

<style scoped>
/* .iframe {
  width: 100%;
  height: 100%;
} */
.span_filename {
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding-left: 10px;
}
.span_title {
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding-left: 10px;
}
.span_time {
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding-left: 10px;
}
.time {
  color: #999;
}
.floatRight {
  float: right;
  padding-right: 10px;
}
.floatLeft {
  float: left;
  padding-left: 10px;
}
.el-card {
  margin-bottom: 10px;
}
.bottom {
  line-height: 10px;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>

<script>
import { Base64 } from 'js-base64'
import { exportCorsFileApi } from '@/api/00_common/corsDownload'

export default {
  name: 'CardComponent',
  props: {
    // 文件名
    fileName: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: '-'
    },
    // url
    url: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 400
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    showTitle: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataJson: {
        preview_online_url: this.url,
        preview_pic_url: this.url,
        settings: {
          // 页面设置json
          // loading 状态
          loading: true
        }

      }
    }
  },
  // 监听器
  watch: {
    url: {
      handler (newVal, oldVal) {
        this.dataJson.preview_online_url = this.url
        this.dataJson.preview_pic_url = this.url
        this.init()
      }
    }
  },
  created () {
    // 初始化查询
    this.init()
  },
  mounted () {

    // 描绘完成
  },
  destroyed () {
  },
  methods: {
    // 初始化
    init () {
      const base64_encode = encodeURIComponent(Base64.encode(this.url))
      console.log('---------------------------')
      console.log(base64_encode)
      console.log(this.url)
      console.log('---------------------------')
      this.dataJson.preview_online_url = process.env.VUE_APP_FILE_ONLINE_PREVIEW_URL + '?url=' + base64_encode
      this.dataJson.preview_pic_url = process.env.VUE_APP_FILE_PIC_PREVIEW_URL +
        '?width=' + process.env.VUE_APP_FILE_ONLINE_PREVIEW_WIDTH +
        '&height=' + process.env.VUE_APP_FILE_ONLINE_PREVIEW_HEIGHT +
        '&url=' + base64_encode
    },
    handleDelete () {
      this.$emit('removeFile', this.url)
    },
    handlePreview () {
      window.open(this.dataJson.preview_online_url + '&width=' + this.width + '&height=' + this.height)
    },
    async handleDownload () {
      const url = this.url // data:项目中获取的数据，包含文件url以及文件名等相关参数
      const fileName = this.fileName
      const res = await exportCorsFileApi({ // 获取文件二进制数据的接口
        urlPath: url
      })
      this.saveAs(new Blob([res], { type: 'text/plain;charset=UTF-8' }), fileName)
    },

    // 导出文件函数
    saveAs (obj, fileName) {
      const ele = document.createElement('a')
      ele.download = fileName || '下载'
      ele.href = URL.createObjectURL(obj) // 绑定a标签
      ele.style.display = 'none'
      document.body.appendChild(ele) // 兼容火狐浏览器
      ele.click()
      setTimeout(function () { // 延时释放
        URL.revokeObjectURL(obj) // 用URL.revokeObjectURL()来释放这个object URL
        document.body.removeChild(ele)// 兼容火狐浏览器
      }, 100)
    }
  }
}
</script>
