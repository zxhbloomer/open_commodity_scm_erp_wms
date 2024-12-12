<template>
  <div>
    <div
      class="user-info-head"
      @click="editCropper()"
    >
      <img
        :src="options.img"
        title="点击上传头像"
        class="img-circle img-lg"
      >
    </div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      @opened="modalOpened"
      @close="closeDialog"
    >
      <el-row>
        <el-col
          :xs="24"
          :md="12"
          :style="{height: '350px'}"
        >
          <vue-cropper
            v-if="visible"
            ref="cropper"
            :img="options.img"
            :info="true"
            :auto-crop="options.autoCrop"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :fixed-box="options.fixedBox"
            @realTime="realTime"
          />
        </el-col>
        <el-col
          :xs="24"
          :md="12"
          :style="{height: '350px'}"
        >
          <div class="avatar-upload-preview">
            <img
              :src="previews.url"
              :style="previews.img"
            >
          </div>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col
          :lg="2"
          :md="2"
        >
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button size="small">
              选择
              <i class="el-icon-upload el-icon--right" />
            </el-button>
          </el-upload>
        </el-col>
        <el-col
          :lg="{span: 1, offset: 2}"
          :md="2"
        >
          <el-button
            icon="el-icon-plus"
            size="small"
            @click="changeScale(1)"
          />
        </el-col>
        <el-col
          :lg="{span: 1, offset: 1}"
          :md="2"
        >
          <el-button
            icon="el-icon-minus"
            size="small"
            @click="changeScale(-1)"
          />
        </el-col>
        <el-col
          :lg="{span: 1, offset: 1}"
          :md="2"
        >
          <el-button
            icon="el-icon-refresh-left"
            size="small"
            @click="rotateLeft()"
          />
        </el-col>
        <el-col
          :lg="{span: 1, offset: 1}"
          :md="2"
        >
          <el-button
            icon="el-icon-refresh-right"
            size="small"
            @click="rotateRight()"
          />
        </el-col>
        <el-col
          :lg="{span: 2, offset: 6}"
          :md="2"
        >
          <el-button
            type="primary"
            size="small"
            @click="uploadImg()"
          >提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { VueCropper } from 'vue-cropper'
// import { updateAvatarApi } from '@/api/20_master/staff/staff'
import fsRequest from '@/utils/fsRequest'

export default {
  components: { VueCropper },
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      fileName: '',
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,
      // 弹出层标题
      title: '修改头像',
      options: {
        img: store.getters.avatar, // 裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true // 固定截图框大小 不允许改变
      },
      previews: {}
    }
  },
  created () {
    this.options.img = this.user.avatar
  },
  methods: {
    // 获取通用的上传文件地址
    getActionUrl () {
      const _url = '/api/service/v1/upload'
      return _url
    },
    // 编辑头像
    editCropper () {
      this.open = true
    },
    // 打开弹出层结束时的回调
    modalOpened () {
      this.visible = true
    },
    // 覆盖默认的上传行为
    requestUpload () {
    },
    // 向左旋转
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    // 向右旋转
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    // 图片缩放
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 上传预处理
    beforeUpload (file) {
      this.fileName = file.name
      if (file.type.indexOf('image/') === -1) {
        this.$modal.msgError('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.options.img = reader.result
        }
      }
    },
    // 上传图片
    uploadImg () {
      this.$refs.cropper.getCropBlob(data => {
        var f = new File([data], this.fileName)
        // debugger
        const param = new FormData() // 创建form对象
        param.append('app_key', process.env.VUE_APP_FILE_SYSTEM_APP_KEY)
        param.append('secret_key', process.env.VUE_APP_FILE_SYSTEM_SECRET_KEY)
        param.append('file', f)// 通过append向form对象添加数据

        // param.append('groupid', process.env.VUE_APP_FILE_SYSTEM_GROUPID)

        const config = {
          headers: { 'content-type': 'multipart/form-data' }
        } // 添加请求头
        // 开始执行提交
        fsRequest.post(this.getActionUrl(), param, config).then((_data) => {
          console.log('上传文件成功:' + _data)
        }, (_error) => {
          console.log('上传文件发生异常:' + _error)
          // this.$notify({
          //   title: '上传文件发生异常',
          //   message: _error.message,
          //   type: 'error',
          //   duration: this.settings.duration
          // })
        })

        // const formData = new FormData()
        // formData.append('avatarfile', data)
        // uploadAvatar(formData).then(response => {
        //   this.open = false;
        //   this.options.img = process.env.VUE_APP_BASE_API + response.imgUrl;
        //   store.commit('SET_AVATAR', this.options.img);
        //   this.$modal.msgSuccess("修改成功");
        //   this.visible = false;
        // });
      })
    },
    // 实时预览
    realTime (data) {
      this.previews = data
    },
    // 关闭窗口
    closeDialog () {
      this.options.img = store.getters.avatar
      this.visible = false
    }
  }
}
</script>
<style>
.box-card {
  margin-bottom: 25px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 100%;
  clear: both;
  margin-top: 0;
  padding: 0;
  font-size: 14px;
  color: rgba(103, 106, 108);
  font-family: Arial, Helvetica, sans-serif;
}
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  content: '+';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 50%;
}
.img-lg {
  width: 120px;
  height: 120px;
}
.img-circle {
  border-radius: 50%;
}
.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}
.pull-right {
  float: right !important;
}
.font-noraml {
  font-weight: 400;
}
.list-group {
  padding-left: 0;
  margin-bottom: 20px;
}
.list-group-item {
  background-color: inherit;
  border: 1px solid #e7eaec;
  display: block;
  margin-bottom: -1px;
  padding: 10px 15px;
  position: relative;
}
.fa {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
<style lang='scss' scoped>
/**
 * 通用css样式布局处理
 * Copyright (c) 2019 ruoyi
 */

/** 基础通用 **/
.pt5 {
  padding-top: 5px;
}
.pr5 {
  padding-right: 5px;
}
.pb5 {
  padding-bottom: 5px;
}
.mt5 {
  margin-top: 5px;
}
.mr5 {
  margin-right: 5px;
}
.mb5 {
  margin-bottom: 5px;
}
.mb8 {
  margin-bottom: 8px;
}
.ml5 {
  margin-left: 5px;
}
.mt10 {
  margin-top: 10px;
}
.mr10 {
  margin-right: 10px;
}
.mb10 {
  margin-bottom: 10px;
}
.ml10 {
  margin-left: 10px;
}
.mt20 {
  margin-top: 20px;
}
.mr20 {
  margin-right: 20px;
}
.mb20 {
  margin-bottom: 20px;
}
.ml20 {
  margin-left: 20px;
}

.h1,
.h2,
.h3,
.h4,
.h5,
.h6,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: inherit;
  font-weight: 500;
  line-height: 1.1;
  color: inherit;
}

.el-dialog:not(.is-fullscreen) {
  margin-top: 6vh !important;
}

.el-dialog__wrapper.scrollbar .el-dialog .el-dialog__body {
  overflow: auto;
  overflow-x: hidden;
  max-height: 70vh;
  padding: 10px 20px 0;
}

.el-table {
  .el-table__header-wrapper,
  .el-table__fixed-header-wrapper {
    th {
      word-break: break-word;
      background-color: #f8f8f9;
      color: #515a6e;
      height: 40px;
      font-size: 13px;
    }
  }
  .el-table__body-wrapper {
    .el-button [class*='el-icon-'] + span {
      margin-left: 1px;
    }
  }
}

/** 表单布局 **/
.form-header {
  font-size: 15px;
  color: #6379bb;
  border-bottom: 1px solid #ddd;
  margin: 8px 10px 25px 10px;
  padding-bottom: 5px;
}

/** 表格布局 **/
.pagination-container {
  position: relative;
  height: 25px;
  margin-bottom: 10px;
  margin-top: 15px;
  padding: 10px 20px !important;
}

/* tree border */
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #ffffff none;
  border-radius: 4px;
}

.pagination-container .el-pagination {
  right: 0;
  position: absolute;
}

@media (max-width: 768px) {
  .pagination-container .el-pagination > .el-pagination__jump {
    display: none !important;
  }
  .pagination-container .el-pagination > .el-pagination__sizes {
    display: none !important;
  }
}

.el-table .fixed-width .el-button--mini {
  padding-left: 0;
  padding-right: 0;
  width: inherit;
}

/** 表格更多操作下拉样式 */
.el-table .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 5px;
}

.el-table .el-dropdown,
.el-icon-arrow-down {
  font-size: 12px;
}

.el-tree-node__content > .el-checkbox {
  margin-right: 8px;
}

.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.list-group {
  padding-left: 0px;
  list-style: none;
}

.list-group-item {
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0px;
  font-size: 13px;
}

.pull-right {
  float: right !important;
}

.el-card__header {
  padding: 14px 15px 7px;
  min-height: 40px;
}

.el-card__body {
  padding: 15px 20px 20px 20px;
}

.card-box {
  padding-right: 15px;
  padding-left: 15px;
  margin-bottom: 10px;
}

/* button color */
.el-button--cyan.is-active,
.el-button--cyan:active {
  background: #20b2aa;
  border-color: #20b2aa;
  color: #ffffff;
}

.el-button--cyan:focus,
.el-button--cyan:hover {
  background: #48d1cc;
  border-color: #48d1cc;
  color: #ffffff;
}

.el-button--cyan {
  background-color: #20b2aa;
  border-color: #20b2aa;
  color: #ffffff;
}

/* text color */
.text-navy {
  color: #1ab394;
}

.text-primary {
  color: inherit;
}

.text-success {
  color: #1c84c6;
}

.text-info {
  color: #23c6c8;
}

.text-warning {
  color: #f8ac59;
}

.text-danger {
  color: #ed5565;
}

.text-muted {
  color: #888888;
}

/* image */
.img-circle {
  border-radius: 50%;
}

.img-lg {
  width: 120px;
  height: 120px;
}

.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
}

/* 拖拽列样式 */
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}

.top-right-btn {
  position: relative;
  float: right;
}
</style>
