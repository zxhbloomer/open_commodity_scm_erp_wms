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
      width="900px"
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
          title="司机基本信息"
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

          <el-descriptions-item label="司机编号">

            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}

          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              司机名称
            </div>
            <el-form-item
              prop="name"
              label-width="0"
            >
              <el-input
                ref="refFocusOne"
                v-model.trim="dataJson.tempJson.name"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.name"
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
              身份证号
            </div>
            <el-form-item
              prop="id_card"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.id_card"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.id_card"
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
              手机号
            </div>
            <el-form-item
              prop="mobile_phone"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.mobile_phone"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.mobile_phone"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>
          <!-- <el-descriptions-item>
            <div slot="label">
              启用状态
            </div>
            <el-form-item
              prop="enable"
              label-width="0"
            >
              <el-switch
                v-model="dataJson.tempJson.enable"
                active-color="#13ce66"
                inactive-color="#dcdfe6"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item /> -->

        </el-descriptions>
        <br>
        <el-alert
          title="附件信息"
          type="info"
          :closable="false"
        />
        <br>
        <!--        <el-descriptions-->
        <!--          title=""-->
        <!--          :column="2"-->
        <!--          :label-style="fileLabelStyle"-->
        <!--          :content-style="contentStyle"-->
        <!--          direction="horizontal"-->
        <!--          border-->
        <!--          style="padding-right: 10px;padding-left: 10px;"-->
        <!--        >-->
        <!--          <el-descriptions-item label-width="0">-->
        <!--            <el-row style="display: flex;flex-wrap: wrap;">-->
        <!--              <previewCard-->
        <!--                :data="dataJson.tempJson.id_card_frontVo"-->
        <!--                :show-update="true"-->
        <!--                :title="'身份证人像面'"-->
        <!--                @upload-success="handleIdCardFrontUploadFileSuccess"-->
        <!--              />-->
        <!--            </el-row>-->
        <!--          </el-descriptions-item>-->
        <!--          <el-descriptions-item>-->
        <!--            <el-row style="display: flex;flex-wrap: wrap;">-->
        <!--              <previewCard-->
        <!--                :data="dataJson.tempJson.id_card_backVo"-->
        <!--                :show-update="true"-->
        <!--                :title="'身份证国徽面'"-->
        <!--                @upload-success="handleIdCardBackUploadFileSuccess"-->
        <!--              />-->
        <!--            </el-row>-->
        <!--          </el-descriptions-item>-->

        <!--          <el-descriptions-item>-->
        <!--            <el-row style="display: flex;flex-wrap: wrap;">-->
        <!--              <previewCard-->
        <!--                :data="dataJson.tempJson.driver_licenseVo"-->
        <!--                :show-update="true"-->
        <!--                :title="'驾驶证'"-->
        <!--                @upload-success="handleDriverLicenseUploadFileSuccess"-->
        <!--              />-->
        <!--            </el-row>-->
        <!--          </el-descriptions-item>-->
        <!--          <el-descriptions-item />-->
        <!--        </el-descriptions>-->
        <el-descriptions
          title=""
          :column="1"
          :content-style="contentStyle"
          :label-style="fileLabelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="附件信息">
            <el-row
              style="display: flex;flex-wrap: wrap; "
              :gutter="20"
            >
              <el-col
                :span="8"
              >
                <previewCard
                  :data="dataJson.tempJson.id_card_frontVo"
                  :show-update="true"
                  :title="'身份证人像面'"
                  @upload-success="handleIdCardFrontUploadFileSuccess"
                />
              </el-col>
              <el-col
                :span="8"
              >
                <previewCard
                  :data="dataJson.tempJson.id_card_backVo"
                  :show-update="true"
                  :title="'身份证国徽面'"
                  @upload-success="handleIdCardBackUploadFileSuccess"
                />
              </el-col>
              <el-col
                :span="8"
              >
                <previewCard
                  :data="dataJson.tempJson.driver_licenseVo"
                  :show-update="true"
                  :title="'驾驶证'"
                  @upload-success="handleDriverLicenseUploadFileSuccess"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>

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
br {
  display: block;
  margin: 10px;
  content: ' ';
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { updateApi, insertApi } from '@/api/30_wms/driver/driver'
import previewCard from '@/components/50_preview_card/preview_card_new'

export default {
  components: { previewCard },
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
        width: '2%',
        'text-align': 'right'
      },
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '10%',
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
          enable: true,
          id_card_frontVo: {},
          id_card_backVo: {},
          driver_licenseVo: {}
        },
        // 单条数据 json
        tempJson: {
          enable: true,
          id_card_frontVo: {},
          id_card_backVo: {},
          driver_licenseVo: {}
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
            { required: true, message: '请输入司机名称', trigger: 'change' }
          ],
          id_card: [
            { required: true, message: '请输入身份证号', trigger: 'change' }
          ],
          mobile_phone: [
            { required: true, message: '请输入手机号', trigger: 'change' }
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
      this.dataJson.tempJson.id_card_frontVo = res.response.data
      this.dataJson.tempJson.id_card_frontVo.time = res.response.timestamp
    },

    // 身份证国徽面上传成功
    handleIdCardBackUploadFileSuccess (res) {
      this.dataJson.tempJson.id_card_backVo = res.response.data
      this.dataJson.tempJson.id_card_backVo.time = res.response.timestamp
    },

    // 驾驶证附件上传成功
    handleDriverLicenseUploadFileSuccess (res) {
      this.dataJson.tempJson.driver_licenseVo = res.response.data
      this.dataJson.tempJson.driver_licenseVo.time = res.response.timestamp
    }

  }
}
</script>
