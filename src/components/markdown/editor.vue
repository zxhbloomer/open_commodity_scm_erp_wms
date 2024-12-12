<template>
  <div>
    <editor
      ref="editor"
      :initial-value="initialValue"
      :options="editorOptions"
      :height="height"
      initial-edit-type="markdown"
      preview-style="vertical"
      @change="onEditorChange"
    />
  </div>
</template>
<script>
import { Editor } from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import fsRequest from '@/utils/fsRequest'

export default {
  components: { Editor },
  props: {
    initialValue: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  data () {
    return {
      editorText: '',
      editorOptions: {
        hideModeSwitch: true,
        // 编辑器选项，包括钩子函数
        hooks: {
          // 重写图片上传的方法
          addImageBlobHook: (blob, callback) => {
            console.log(blob, callback)
            this.uploadFile(blob, function (imageUrl) {
              callback(imageUrl) // 将链接传递给编辑器
            }, function (error) {
              console.error('上传图片失败：', error)
            })
          }
        }
      }
    }
  },
  watch: {
    initialValue (val) {
      this.$refs.editor.invoke('setMarkdown', this.initialValue)
    }
  },
  mounted () {
  },
  methods: {
    getActionUrl () {
      const _url = '/api/service/v1/upload'
      return _url
    },
    onEditorChange (event, a) {
      this.editorText = this.$refs.editor.invoke('getMarkdown')
      this.$emit('text-changed', this.editorText)
    },
    // 图片上传
    uploadFile (blob, successCallback, errorCallback) {
      var f = new File([blob], blob.name)
      // debugger
      const param = new FormData() // 创建form对象
      param.append('app_key', process.env.VUE_APP_FILE_SYSTEM_APP_KEY)
      param.append('secret_key', process.env.VUE_APP_FILE_SYSTEM_SECRET_KEY)
      param.append('file', f)// 通过append向form对象添加数据

      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      } // 添加请求头
      // 开始执行提交
      fsRequest.post(this.getActionUrl(), param, config).then((_data) => {
        successCallback(_data.data.url)
      }, (_error) => {
        errorCallback('图片上传失败')
      })
    }
  }
}
</script>

<style scoped>

</style>
