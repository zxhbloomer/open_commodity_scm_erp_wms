<template>
  <el-upload
    class="el-button-group"
    :action="getActionUrl()"
    :show-file-list="false"
    :http-request="uploadRequest"
    :on-success="handleUploadFileSuccess"
    :on-error="handleUploadFileError"
    :on-progress="handleUploadProcess"
    :before-upload="handleBeforeUpload"
    :disabled="settings.loadingStatus"
    :accept="accept"
  >
    <el-button
      type="primary"
      :loading="settings.loadingStatus"
    >
      <i
        v-show="!settings.loadingStatus"
        class="el-icon-upload el-icon--right "
      />
      上传
      <i
        v-show="settings.uploadOK"
        class="el-icon-check"
      />
    </el-button>
  </el-upload>
</template>
<script>
import fsRequest from '@/utils/fsRequest'

export default {
  name: 'SimpleUpload',
  props: {
    // 接受上传的文件类型
    accept: {
      type: String,
      default: '.xls,.xlsx'
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
        // 计数器,不知为何无效
        // percent: 0
      }
    }
  },
  methods: {
    // 获取通用的上传文件地址
    getActionUrl () {
      const _url = '/api/service/v1/upload'
      return _url
    },
    // 提交
    uploadRequest (f) {
      this.settings.loading = true
      const param = new FormData() // 创建form对象
      // param.append('app_key', process.env.VUE_APP_FILE_SYSTEM_APP_KEY)
      // param.append('secret_key', process.env.VUE_APP_FILE_SYSTEM_SECRET_KEY)
      param.append('file', f.file)// 通过append向form对象添加数据
      // param.append('groupid', process.env.VUE_APP_FILE_SYSTEM_GROUPID)

      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      } // 添加请求头
      // 开始执行提交
      fsRequest.post(this.getActionUrl() + '?app_key=' + process.env.VUE_APP_FILE_SYSTEM_APP_KEY + '&secret_key=' + process.env.VUE_APP_FILE_SYSTEM_SECRET_KEY, param, config).then((_data) => {
        // 成功
        f.onSuccess(_data)
        // this.$notify({
        //   title: '上传文件成功',
        //   message: _data.message,
        //   type: 'success',
        //   duration: this.settings.duration
        // })
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
      })
    },
    handleUploadFileSuccess (_response, _file, _fileList) {
      this.settings.loadingStatus = false
      this.settings.uploadOK = true
      this.$emit('upload-success', { response: _response, file: _file, fileList: _fileList })
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
