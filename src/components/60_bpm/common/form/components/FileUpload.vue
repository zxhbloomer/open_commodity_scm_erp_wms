<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-button size="small" icon="el-icon-paperclip" round>选择文件</el-button>
      <ellipsis slot="tip" :row="1" :content="placeholder + sizeTip" hover-tip class="el-upload__tip" />
    </div>
    <div v-else>
      <el-upload
        :file-list="_value"
        action="#"
        :limit="maxSize"
        with-credentials
        :multiple="maxSize > 0"
        :data="uploadParams"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :http-request="requestUpload"
      >
        <el-button size="small" icon="el-icon-paperclip" round>选择文件</el-button>
        <ellipsis slot="tip" :row="1" :content="placeholder + sizeTip" hover-tip class="el-upload__tip" />

      </el-upload>
    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'
import Ellipsis from '@/components/60_bpm/common/Ellipsis'
// import { upLoadFileApi, downLoadFileApi } from '@/api/design'
// import { downloadFileBlob } from '@/utils/index'
export default {
  name: 'ImageUpload',
  components: {},
  mixins: [componentMinxins, Ellipsis],
  props: {
    placeholder: {
      type: String,
      default: '请选择附件'
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    maxSize: {
      type: Number,
      default: 5
    },
    maxNumber: {
      type: Number,
      default: 10
    },
    fileTypes: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      disabled: false,
      uploadParams: {}
    }
  },
  computed: {
    sizeTip () {
      if (this.fileTypes.length > 0) {
        return ` | 只允许上传[${String(this.fileTypes).replaceAll(',', '、')}]格式的文件，且单个附件不超过${this.maxSize}MB`
      }
      return this.maxSize > 0 ? ` | 单个附件不超过${this.maxSize}MB` : ''
    }
  },
  methods: {
    // 覆盖默认的上传行为
    requestUpload () {

    },
    beforeUpload (file) {
      // const alows = [];
      // if (alows.indexOf(file.type) === -1) {
      //   this.$message.warning('存在不支持的图片格式');
      // } else
      if (this.maxSize > 0 && file.size / 1024 / 1024 > this.maxSize) {
        this.$message.warning(`单张图片最大不超过 ${this.maxSize}MB`)
      } else {
        // 上传文件的需要formdata类型;所以要转
        const FormDatas = new FormData()
        FormDatas.append('file', file)
        // upLoadFileApi(FormDatas).then(res => {
        //   console.log('uploadFile', res)
        //
        //   if (res.data.result) {
        //     this._value.push(res.data.result) // 成功过后手动将文件添加到展示列表里
        //     this.$emit('input', this._value)
        //   }
        // })

        return true
      }
      return false
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      console.log(file)
    },
    handleDownload (file) {
      // 上传文件的需要formdata类型;所以要转
      const FormDatas = new FormData()
      FormDatas.append('name', file.name)
      // downLoadFileApi(FormDatas).then(res => {
      //   if (res.data) {
      //     downloadFileBlob(res.data, file.name)
      //   }
      // })
    }
  }
}
</script>

<style lang="less" scoped></style>

