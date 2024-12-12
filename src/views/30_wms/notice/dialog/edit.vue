<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改 -->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :title="PARAMETERS.STATUS_TEXT_MAP[dialogStatus]"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="950px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="0px"
        status-icon
      >
        <el-alert
          title="通知基本信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="2"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item label="编号">

            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}

          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              版本号
            </div>
            <el-form-item
              prop="version_code"
              label-width="0"
            >
              <el-input
                ref="refFocusOne"
                v-model.trim="dataJson.tempJson.version_code"
                :maxlength="dataJson.inputSettings.maxLength.version_code"
                clearable
                show-word-limit
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              版本名称
            </div>
            <el-form-item
              prop="version_name"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.version_name"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.version_name"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              类型
            </div>
            <el-form-item
              prop="loading"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.type"
                :value="dataJson.tempJson.type"
                :para="CONSTANTS.DICT_S_APP_NOTICE_TYPE"
                init-placeholder="请选择"
                :disabled="isViewModel"
                style="width:100%"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              安装包
            </div>
            <el-form-item
              prop="url"
              label-width="0"
            >
              <Simple-upload
                :accept="'.apk'"
                @upload-success="handleUploadFileSuccess"
                @upload-error="handleUploadFileError"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item />
        </el-descriptions>
        <br>
        <el-alert
          title="通知内容"
          type="info"
          :closable="false"
        />
        <br>
        <el-input
          v-model.trim="dataJson.tempJson.title"
          clearable
          show-word-limit
          :maxlength="dataJson.inputSettings.maxLength.loading"
          :placeholder="isPlaceholderShow('请输入标题')"
          :disabled="isViewModel"
        />
        <br>
        <br>
        <editor
          id="editor_id"
          v-model.trim="dataJson.tempJson.content"
          height="300px"
          width="100%"
          theme-type="simple"
          :content="dataJson.tempJson.content"
          plugins-path="/static/kindeditor/plugins/"
          :load-style-mode="false"
          @on-content-change="onContentChange"
        />

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <el-button
          plain
          :disabled="settings.loading"
          @click="handleCancel()"
        >取消</el-button>
        <el-button
          v-show="settings.btnShowStatus.showInsert"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
          @click="doInsert()"
        >确定</el-button>
        <el-button
          v-show="settings.btnShowStatus.showUpdate && !isViewModel"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
          @click="doUpdate()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.edit-container {
  height: calc(100vh - 160px);
  overflow-x: auto;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.dialog-footer {
  text-align: center;
}
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
.el-button-group {
  margin-bottom: 15px;
}
.el-popup-border-color >>> .el-input__inner {
  border-color: #1890ff;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { updateApi, insertApi } from '@/api/30_wms/notice/notice'
import SelectDict from '@/components/00_dict/select/SelectDict'
import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'
import SimpleUpload from '@/components/10_file/SimpleApkUpload'

export default {
  components: { SelectDict, SimpleUpload },
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
    data: {
      type: Object,
      default: null
    },
    dialogStatus: {
      type: String,
      default: constants_para.STATUS_VIEW
    }
  },
  data () {
    return {
      fileLabelStyle: {
        width: '3%',
        'text-align': 'right'
      },
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      editorOption: {
        modules: {
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'], // 引用，代码块
            [{ 'header': 1 }, { 'header': 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
            [{ 'script': 'sub' }, { 'script': 'super' }], // 上下标
            [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
            [{ 'direction': 'rtl' }], // 文本方向
            [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 几级标题
            [{ 'color': [] }, { 'background': [] }], // 字体颜色，字体背景颜色
            [{ 'font': [] }], // 字体
            [{ 'align': [] }], // 对齐方式
            ['clean'], // 清除字体样式
            ['image', 'video'] // 上传图片、上传视频
          ]
        },
        theme: 'snow'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        license_frontVo: [],
        license_front: [],

        license_backVo: [],
        license_back: [],

        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          version_code: undefined,
          version_name: undefined,
          type: '1',
          url: undefined,
          title: undefined,
          contet: undefined
        },
        // 单条数据 json
        tempJson: {
          version_code: undefined,
          version_name: undefined,
          type: '1',
          url: undefined,
          title: undefined,
          contet: undefined
        },
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20,
            short_name: 50,
            warehouse_type: 10,
            contact_person: 20,
            mobile_phone: 20,
            charge_company_id: 10,
            operate_company_id: 10,
            area: 20,
            warehouse_capacity: 20,
            longitude: 20,
            latitude: 20,
            province: 20,
            city: 20,
            district: 20,
            address: 20
          }
        }
      },
      // 页面设置json
      settings: {
        showUpload1: true,
        showUpload2: true,
        // loading 状态
        loading: true,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus,
        // pop的check内容
        rulesOne: {
          version_code: [
            { required: true, message: '请输版本号', trigger: 'change' }
          ],
          version_name: [
            { required: true, message: '请输入版本名称', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请输选择类型', trigger: 'change' }
          ],
          title: [
            { required: true, message: '请输入通知标题', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请输入通知内容', trigger: 'change' }
          ]
        },
        rules: {

        },
        // 错误数目
        badge: {
          countOne: 0,
          countTwo: 0
        }
      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (
        this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT ||
        this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT
      ) {
        return false
      } else {
        return true
      }
    },
    listenVisible () {
      return this.visible
    },
    isViewModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_VIEW) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {},
  created () {
    this.init()
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 初始化处理
    init () {
      this.settings.rules = this.settings.rulesOne
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          break
      }
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(
        this
      ).dataJson.tempJsonOriginal
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(
        this
      ).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(
        this
      ).settings.btnDisabledStatus
    },
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)

      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson',
        (newVal, oldVal) => {
          this.settings.btnDisabledStatus.disabledInsert = false
          this.settings.btnDisabledStatus.disabledUpdate = false
        },
        { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },

    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 插入逻辑
    doInsert () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData)
            .then(
              _data => {
                this.$emit('closeMeOk', { return_flag: true, data: _data })
              },
              _error => {
                this.$emit('closeMeOk', { return_flag: false, error: _error })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData)
            .then(
              _data => {
                this.dataJson.tempJson = deepCopy(_data.data)
                this.$emit('closeMeOk', { return_flag: true, data: _data })
              },
              _error => {
                this.$emit('closeMeOk', { return_flag: false, error: _error })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    // 开始综合验证
    doValidateByTabs () {
      // 第一个tabs
      this.settings.rules = this.settings.rulesOne
      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
      this.$refs['dataSubmitForm'].validate((valid, validateItems) => {
        if (valid === false) {
          this.settings.badge.countOne = Object.keys(validateItems).length
        } else {
          this.settings.badge.countOne = 0
        }
      })
      // 所有的数据进行验证
      this.doValidateAllRules()
    },
    // 所有的数据开始validate
    doValidateAllRules () {
      if (this.isLoginEnabled) {
        this.settings.rules = { ...this.settings.rulesOne, ...this.settings.rulesTwo }
      } else {
        this.settings.rules = { ...this.settings.rulesOne }
      }

      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
    },
    // 驾驶证正面上传成功
    handleLicenseUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.license_frontVo.push(res.response.data)
      this.dataJson.license_front.push(res.response.data.url)
      this.dataJson.tempJson.license_frontVos = this.dataJson.license_frontVo
      this.dataJson.tempJson.license_frontVo = res.response.data
      if (this.dataJson.license_frontVo.length === 1) {
        this.settings.showUpload1 = false
      } else {
        this.settings.showUpload1 = true
      }
    },
    //  驾驶证正面上传失败
    handleLicenseUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除 驾驶证正面文件
    removeLicenseFile (val) {
      // 获取下标
      const _index = this.dataJson.license_frontVo.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.license_frontVo.splice(_index, 1)
      this.dataJson.license_front.splice(_index, 1)
      this.dataJson.tempJson.license_frontVos.splice(_index, 1)
      if (this.dataJson.license_frontVo.length === 1) {
        this.settings.showUpload1 = false
      } else {
        this.settings.showUpload1 = true
      }
    },

    // 驾驶证副页上传成功
    handleLicenseBackUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.license_backVo.push(res.response.data)
      this.dataJson.license_back.push(res.response.data.url)
      this.dataJson.tempJson.license_backVos = this.dataJson.license_backVo
      this.dataJson.tempJson.license_backVo = res.response.data
      if (this.dataJson.license_backVo.length === 1) {
        this.settings.showUpload2 = false
      } else {
        this.settings.showUpload2 = true
      }
    },
    //  驾驶证副页上传失败
    handleLicenseBackUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除 驾驶证副页面文件
    removeLicenseBackFile (val) {
      // 获取下标
      const _index = this.dataJson.license_backVo.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.license_backVo.splice(_index, 1)
      this.dataJson.license_back.splice(_index, 1)
      this.dataJson.tempJson.license_backVos.splice(_index, 1)
      if (this.dataJson.license_backVo.length === 1) {
        this.settings.showUpload2 = false
      } else {
        this.settings.showUpload2 = true
      }
    },
    onContentChange (val) {
      this.dataJson.tempJson.content = val
    },
    // 文件上传成功
    handleUploadFileSuccess (res) {
      // 开始导出
      this.dataJson.tempJson.url = res.response.data.url
    },
    // 文件上传失败
    handleUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '导入错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    }

  }
}
</script>
