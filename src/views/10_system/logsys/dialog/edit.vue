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
      width="1350px"
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

        <el-descriptions
          title=""
          :column="2"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item label="类型">

            {{ dataJson.tempJson.type }}

          </el-descriptions-item>
          <el-descriptions-item label="操作">

            {{ dataJson.tempJson.operation }}

          </el-descriptions-item>
          <el-descriptions-item label="类名">

            {{ dataJson.tempJson.class_name }}

          </el-descriptions-item>
          <el-descriptions-item label="方法名">

            {{ dataJson.tempJson.class_method }}

          </el-descriptions-item>
          <el-descriptions-item label="请求类型">

            {{ dataJson.tempJson.http_method }}

          </el-descriptions-item>
          <el-descriptions-item label="url">

            {{ dataJson.tempJson.url }}

          </el-descriptions-item>
          <el-descriptions-item label="参数">

            {{ dataJson.tempJson.params }}

          </el-descriptions-item>
          <el-descriptions-item label="异常信息">

            {{ dataJson.tempJson.exception }}

          </el-descriptions-item>
          <el-descriptions-item label="创建时间">

            {{ dataJson.tempJson.c_time }}

          </el-descriptions-item>
          <el-descriptions-item />

        </el-descriptions>

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
import { updateApi, insertApi } from '@/api/30_wms/driver/driver'

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
      contentStyle: {
        width: '18%'
      },
      labelStyle: {
        width: '3%',
        'text-align': 'right'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        id_card_frontVo: [],
        id_card_front: [],

        id_card_backVo: [],
        id_card_back: [],

        driver_licenseVo: [],
        driver_license: [],
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          config_key: '',
          value: '',
          descr: ''
        },
        // 单条数据 json
        tempJson: null,
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
        showUpload3: true,
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
          name: [
            { required: true, message: '请输入仓库名称', trigger: 'change' }
          ],
          code: [
            { required: true, message: '请输入仓库编码', trigger: 'change' }
          ],
          short_name: [
            { required: true, message: '请输入仓库简称', trigger: 'change' }
          ],
          warehouse_type: [
            { required: true, message: '请输入仓库类型', trigger: 'change' }
          ],
          charge_company_id: [
            { required: true, message: '请输入监管企业', trigger: 'change' }
          ],
          operate_company_id: [
            { required: true, message: '请输入运营企业', trigger: 'change' }
          ],
          province: [
            { required: true, message: '请输入省份', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请输入城市', trigger: 'change' }
          ],
          district: [
            { required: true, message: '请输入区县', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'change' }
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
    // 身份证人像面上传成功
    handleIdCardFrontUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.id_card_frontVo.push(res.response.data)
      this.dataJson.id_card_front.push(res.response.data.url)
      this.dataJson.tempJson.id_card_frontVos = this.dataJson.id_card_frontVo
      this.dataJson.tempJson.id_card_frontVo = res.response.data
      if (this.dataJson.id_card_frontVo.length === 1) {
        this.settings.showUpload1 = false
      } else {
        this.settings.showUpload1 = true
      }
    },
    //  身份证人像面上传失败
    handleIdCardFrontUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除 身份证人像面文件
    removeIdCardFrontFile (val) {
      // 获取下标
      const _index = this.dataJson.id_card_frontVo.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.id_card_frontVo.splice(_index, 1)
      this.dataJson.id_card_front.splice(_index, 1)
      this.dataJson.tempJson.id_card_frontVos.splice(_index, 1)
      if (this.dataJson.id_card_frontVo.length === 1) {
        this.settings.showUpload1 = false
      } else {
        this.settings.showUpload1 = true
      }
    },

    // 身份证国徽面上传成功
    handleIdCardBackUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.id_card_backVo.push(res.response.data)
      this.dataJson.id_card_back.push(res.response.data.url)
      this.dataJson.tempJson.id_card_backVos = this.dataJson.id_card_backVo
      this.dataJson.tempJson.id_card_backVo = res.response.data
      if (this.dataJson.id_card_backVo.length === 1) {
        this.settings.showUpload2 = false
      } else {
        this.settings.showUpload2 = true
      }
    },
    //  身份证国徽面上传失败
    handleIdCardBackUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除 身份证国徽面文件
    removeIdCardBackFile (val) {
      // 获取下标
      const _index = this.dataJson.id_card_backVo.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.id_card_backVo.splice(_index, 1)
      this.dataJson.id_card_back.splice(_index, 1)
      this.dataJson.tempJson.id_card_backVos.splice(_index, 1)
      if (this.dataJson.id_card_backVo.length === 1) {
        this.settings.showUpload2 = false
      } else {
        this.settings.showUpload2 = true
      }
    },

    // 驾驶证附件上传成功
    handleDriverLicenseUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.driver_licenseVo.push(res.response.data)
      this.dataJson.driver_license.push(res.response.data.url)
      this.dataJson.tempJson.driver_licenseVos = this.dataJson.driver_licenseVo
      this.dataJson.tempJson.driver_licenseVo = res.response.data
      if (this.dataJson.driver_licenseVo.length === 1) {
        this.settings.showUpload3 = false
      } else {
        this.settings.showUpload3 = true
      }
    },
    //  驾驶证附件上传失败
    handleDriverLicenseUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除驾驶证附件
    removeDriverLicenseFile (val) {
      // 获取下标
      const _index = this.dataJson.driver_licenseVo.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.driver_licenseVo.splice(_index, 1)
      this.dataJson.driver_license.splice(_index, 1)
      this.dataJson.tempJson.driver_licenseVos.splice(_index, 1)
      if (this.dataJson.driver_licenseVo.length === 1) {
        this.settings.showUpload3 = false
      } else {
        this.settings.showUpload3 = true
      }
    }
  }
}
</script>
