<!--card-->
<template>
  <div v-if="data">

    <el-card
      :body-style="{ padding: '0px' }"
      style="min-width: 100%;height: 100%;"
    >
      <div
        v-if="data.url!== null && data.url!== ''"
        class="video-container"
      >
        <video controls loop autoplay muted height="150">
          <source :src="data.url">
        </video>
      </div>
      <el-empty
        v-if="data.url=== null || data.url=== ''"
        description=" "
      />
      <div>
        <!-- <span class="span_file_name">文件名：{{ data.file_name }}</span>
      <span class="time span_time">{{ formatDateTime(data.c_time) }}</span>
      <span
        :v-if="showTitle"
        class="span_title"
      >{{ title }}</span>
      <span class="span_name">{{ data.c_name }}</span>
      <span class="span_phone">{{ data.c_phone }}</span> -->
        <span class="span_name">{{ title }}</span>
        <span class="time span_time">{{ data.u_time === null? ' ':formatDateTime(data.u_time) }}</span>
        <span class="span_name">{{ data.u_name }} {{ data.u_name===null?' ':'|' }} {{ data.u_phone }}</span>
        <div class="">
          <el-upload
            class="el-button-style"
            :action="getActionUrl()"
            :show-file-list="false"
            :http-request="uploadRequest"
            :on-success="handleUploadFileSuccess"
            :on-error="handleUploadFileError"
            :on-progress="handleUploadProcess"
            :before-upload="handleBeforeUpload"
            :disabled="settings.loadingStatus"
            accept="*"
          >
            <el-button
              v-if="showUpdate"
              type="text"
              class="floatLeft"
              @click="handleUpdate"
            >替换
            </el-button>
          </el-upload>
          <el-button
            v-if="showDelete"
            type="text"
            class="floatLeft"
            @click="handleDelete"
          >删除</el-button>

          <el-button
            v-if="data.url!== null && data.url!== ''"
            type="text"
            class="floatRight"
            @click="handlePreview"
          >预览</el-button>
          <el-button
            v-if="data.url!== null && data.url!== ''"
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
  </div>
</template>

<style scoped>
.video-container {
  background-color: #444;
}
/* .iframe {
  width: 100%;
  height: 100%;
} */
.el-button-style {
  float: left;
}
.span_file_name {
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
.span_name {
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding-left: 10px;
}
.span_phone {
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
.el-empty {
  width: 228px;
  height: 156px;
}
</style>

<script>
import { Base64 } from 'js-base64'
import { exportCorsFileApi } from '@/api/00_common/corsDownload'
import fsRequest from '@/utils/fsRequest'

export default {
  name: 'CardComponent',
  props: {
    // 文件对象
    data: {
      type: Object,
      default: undefined
    },
    idx: {
      type: Number,
      default: undefined
    },
    // url
    url: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 228
    },
    height: {
      type: Number,
      default: 150
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    showUpdate: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    showTitle: {
      type: Boolean,
      default: false
    },
    // preview_urls
    previewUrls: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      settings: {
        duration: 4000,
        loadingStatus: false,
        uploadOK: false
      },
      dataJson: {
        width: this.width,
        height: this.height,
        preview_online_url: ((this.data) ? this.data.url : undefined),
        preview_pic_url: ((this.data) ? this.data.url : undefined),
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
    data: {
      handler (newVal, oldVal) {
        if (!(newVal === undefined || newVal === null || JSON.stringify(newVal) === '{}')) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    // 初始化查询
    this.init()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    // 初始化
    init () {
      if (!this.data) {
        return
      }

      const base64_encode = encodeURIComponent(Base64.encode(this.data.url))
      const base64_encode_urls = encodeURIComponent(Base64.encode(this.previewUrls))

      // console.log('---------------------------')
      // console.log(base64_encode)
      // console.log(this.data.url)
      // console.log('---------------------------')
      if (this.previewUrls === null || this.previewUrls === undefined || this.previewUrls === '') {
        this.dataJson.preview_online_url = process.env.VUE_APP_FILE_PIC_PREVIEW_URL + '?url=' + base64_encode
      } else {
        this.dataJson.preview_online_url = process.env.VUE_APP_FILE_PICS_PREVIEW_URL + '?urls=' + base64_encode_urls
      }

      this.dataJson.preview_pic_url = process.env.VUE_APP_FILE_PIC_PREVIEW_URL +
        '?width=' + process.env.VUE_APP_FILE_ONLINE_PREVIEW_WIDTH +
        '&height=' + process.env.VUE_APP_FILE_ONLINE_PREVIEW_HEIGHT +
        '&url=' + base64_encode
    },
    handleDelete () {
      this.$emit('removeFile', this.data.url)
    },
    handleUpdate () {
      this.$emit('updateFile', this.data.url)
    },
    handlePreview () {
      // window.open(this.dataJson.preview_online_url + '&width=' + this.width + '&height=' + this.height)
      // window.open(this.dataJson.preview_online_url)
      this.$emit('emitPreview', this.data.url)
    },
    async handleDownload () {
      const url = this.data.url // data:项目中获取的数据，包含文件url以及文件名等相关参数
      const fileName = this.data.file_name || this.data.fileName
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
    },
    // 获取通用的上传文件地址
    getActionUrl () {
      const _url = '/api/service/v1/upload'
      return _url
    },
    // 提交
    uploadRequest (f) {
      this.settings.loading = true
      const param = new FormData() // 创建form对象
      param.append('app_key', process.env.VUE_APP_FILE_SYSTEM_APP_KEY)
      param.append('secret_key', process.env.VUE_APP_FILE_SYSTEM_SECRET_KEY)
      param.append('file', f.file)// 通过append向form对象添加数据

      // param.append('groupid', process.env.VUE_APP_FILE_SYSTEM_GROUPID)

      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      } // 添加请求头
      // 开始执行提交

      fsRequest.post(this.getActionUrl(), param, config).then((_data) => {
        // 成功
        f.onSuccess(_data)
        console.log('上传文件成功:' + _data)
      }, (_error) => {
        // 失败
        f.onError(_error)
        console.log('上传文件发生异常:' + _error)
        // this.$notify({
        //   title: '上传文件发生异常',
        //   message: _error.message,
        //   type: 'error',
        //   duration: this.settings.duration
        // })
      }).finally(() => {
        this.closeLoading()
      })
    },
    handleUploadFileSuccess (_response, _file, _fileList) {
      this.settings.loadingStatus = false
      this.settings.uploadOK = true
      this.$emit('upload-success', { response: _response, file: _file, fileList: _fileList, idx: this.idx })
    },
    handleUploadFileError (_err, _file, _fileList) {
      this.settings.loadingStatus = false
      this.settings.uploadOK = false
      this.$emit('upload-error', { err: _err, file: _file, fileList: _fileList })
    },
    handleUploadProcess (event, file, fileList) {
      this.settings.loadingStatus = true
      this.settings.uploadOK = false
      this.dataJson.percent = file.percentage.toFixed(0)
    },
    handleBeforeUpload (file) {
      this.settings.loadingStatus = true
      this.settings.uploadOK = false
    }
  }
}
</script>
