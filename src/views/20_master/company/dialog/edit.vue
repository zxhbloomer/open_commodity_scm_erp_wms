<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改、步骤窗体-->
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
      :before-close="handleClose"
      width="1000px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="140px"
        status-icon
        :validate-on-rule-change="false"
      >
        <el-tabs style="height: 400px;">
          <br>
          <el-tab-pane>
            <template slot="label">基本信息
              <el-badge
                v-show="settings.badge.countOne>0"
                :value="settings.badge.countOne"
                type="danger"
              />
            </template>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="企业编号："
                  prop="code"
                >
                  <el-input
                    ref="refFocusOne"
                    v-model.trim="dataJson.tempJson.code"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.code"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isUpdateModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="社会信用代码："
                  prop="company_no"
                >
                  <el-input
                    ref="refFocusOne"
                    v-model.trim="dataJson.tempJson.company_no"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.company_no"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="企业全称："
                  prop="name"
                >
                  <el-input
                    ref="refFocusTwo"
                    v-model.trim="dataJson.tempJson.name"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.name"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="企业简称："
                  prop="simple_name"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.simple_name"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.simple_name"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="法定代表人："
                  prop="juridical_name"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.juridical_name"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.juridical_name"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="注册资本（万）："
                  prop="register_capital"
                >
                  <el-input-number
                    v-model.trim="dataJson.tempJson.register_capital"
                    clearable
                    show-word-limit
                    controls-position="right"
                    :min="0"
                    :max="1000000"
                    style="width: 100%"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="企业类型："
                  prop="type"
                >
                  <select-dict
                    v-model="dataJson.tempJson.type"
                    :para="CONSTANTS.DICT_SYS_COMPANY_TYPE"
                    init-placeholder="请选择企业类型"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="成立日期："
                  prop="setup_date"
                >
                  <el-date-picker
                    v-model="dataJson.tempJson.setup_date"
                    value-format="yyyy-MM-dd"
                    type="date"
                    clearable
                    :placeholder="isPlaceholderShow('选择日期')"
                    style="width: 100%"
                    :disabled="isViewModel"
                    @change="handleSetup_dateChange()"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" />
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="营业有效期 ："
                  prop="end_date"
                >
                  <el-date-picker
                    ref="refEnd_date"
                    v-model="dataJson.tempJson.end_date"
                    value-format="yyyy-MM-dd"
                    type="date"
                    clearable
                    :placeholder="isPlaceholderShow('选择日期')"
                    style="width: 100%"
                    :disabled="settings.rules_disable.end_date || isViewModel"
                    @change="handleEnd_dateChange()"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="营业有效期长期："
                  prop="long_term"
                >
                  <el-switch
                    v-model="dataJson.tempJson.long_term"
                    inactive-text="营业有效期"
                    active-text="长期"
                    :disabled="isViewModel"
                    @change="handleLongTermChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              label="说明："
              prop="descr"
            >
              <el-input
                v-model.trim="dataJson.tempJson.descr"
                clearable
                show-word-limit
                type="textarea"
                :maxlength="dataJson.inputSettings.maxLength.descr"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>

          </el-tab-pane>

          <el-tab-pane label="地址信息">

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="联系人："
                  prop="link_man"
                >
                  <el-input
                    v-model.trim="popSettings.one.selectedDataJson.link_man"
                    disabled
                  >
                    <el-button
                      slot="append"
                      ref="selectOne"
                      icon="el-icon-search"
                      :disabled="isViewModel"
                      @click="handleModuleDialogClick"
                    >
                      选择
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="电话："
                  prop="phone"
                >
                  <el-input
                    v-model.trim="popSettings.one.selectedDataJson.phone"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="邮编："
                  prop="postal_code"
                >
                  <el-input
                    v-model.trim="popSettings.one.selectedDataJson.postal_code"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="默认地址："
                  prop="is_default"
                >
                  <el-switch v-model="popSettings.one.selectedDataJson.is_default" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="省市区："
                  prop="cascader_text"
                >
                  <el-input
                    v-model.trim="popSettings.one.selectedDataJson.cascader_text"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="标签："
                  prop="tag"
                >
                  <radio-dict
                    v-model="popSettings.one.selectedDataJson.tag"
                    :para="CONSTANTS.DICT_SYS_ADDRESS_TAG_TYPE"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item
              label="详细地址："
              prop="detail_address"
            >
              <el-input
                v-model.trim="popSettings.one.selectedDataJson.detail_address"
                disabled
              />
            </el-form-item>

            <el-row v-show="settings.dialogStatus === PARAMETERS.STATUS_UPDATE || isViewModel">
              <el-col :span="12">
                <el-form-item
                  label="更新人："
                  prop="u_name"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.u_name"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="更新时间："
                  prop="u_time"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.u_time"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

          </el-tab-pane>
        </el-tabs>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <div class="floatLeft">
          <el-button
            v-show="!isViewModel"
            type="danger"
            :disabled="settings.loading || settings.btnDisabledStatus.disabledReset"
            @click="doReset()"
          >重置</el-button>
        </div>
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
        <el-button
          v-show="settings.btnShowStatus.showCopyInsert"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledCopyInsert "
          @click="doCopyInsert()"
        >确定</el-button>
      </div>
    </el-dialog>

    <address-dialog
      :visible="popSettings.one.visible"
      @closeMeOk="handleAddressCloseOk"
      @closeMeCancel="handleAddressCloseCancel"
    />

  </div>
</template>

<style scoped>
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
</style>

<script>

import { updateApi, insertApi } from '@/api/20_master/company/company'
import { getDataByIdApi } from '@/api/20_master/address/address'
import RadioDict from '@/components/00_dict/redio'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import addressDialog from '@/views/20_master/address/dialog/dialog'
import SelectDict from '@/components/00_dict/select/SelectDict'

export default {
  // name: '', // 页面id，和router中的name需要一致，作为缓存
  components: { RadioDict, addressDialog, SelectDict },
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
      // 监听器
      watch: {
        unwatch_tempJson: null,
        unwatch_address: null
      },
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          code: '',
          descr: '',
          dbversion: 0,
          register_capital: undefined
        },
        // 单条数据 json
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20,
            descr: 200,
            simple_name: 20
          }
        }
      },
      settings: {
        // loading 状态
        loading: true,
        // 按钮状态
        btnShowStatus: {
          showInsert: false,
          showUpdate: false,
          showCopyInsert: false
        },
        // 按钮状态：是否可用
        btnDisabledStatus: {
          disabledReset: true,
          disabledInsert: true,
          disabledUpdate: true,
          disabledCopyInsert: true
        },
        dialogStatus: this.dialogStatus,
        // pop的check内容
        rules: {},
        // 基本信息栏目check
        rulesOne: {
          // code: [{ required: true, message: '请输入企业编号', trigger: 'change' }],
          company_no: [{ required: true, message: '请输入社会信用代码', trigger: 'change' }],

          name: [{ required: true, message: '请输入企业全称', trigger: 'change' }],
          simple_name: [{ required: true, message: '请输入企业简称', trigger: 'change' }]
          // juridical_name: [{ required: true, message: '请输入法定代表人', trigger: 'change' }],
          // register_capital: [{ required: true, message: '请输入注册资本（万）', trigger: 'change' }],
          // type: [{ required: true, message: '请选择企业类型', trigger: 'change' }],
          // setup_date: [
          //   { required: true, message: '请输入成立日期', trigger: 'change' },
          //   { validator: this.validateSetup_date, trigger: 'change' }
          // ],
          // end_date: [
          //   { required: true, message: '请输入营业有效期', trigger: 'change' },
          //   { validator: this.validateEnd_date, trigger: 'change' }
          // ]
        },
        rules_disable: {
          // 默认可用
          end_date: false
        },
        // 错误数目
        badge: {
          countOne: 0,
          countTwo: 0,
          countThree: 0,
          countFour: 0
        }
      },
      popSettings: {
        // 地址簿弹出框
        one: {
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {}
        }
      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT || this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT) {
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
  watch: {
  },
  created () {
    this.init()
  },
  mounted () {
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 初始化处理
    init () {
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_COPY_INSERT:
          this.initCopyInsertModel()
          break
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          break
      }
      // 设置验证条件
      this.setRules()
      // 初始化模块选择
      this.initAddressSelectButton()
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(this).dataJson.tempJsonOriginal
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(this).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(this).settings.btnDisabledStatus
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
    // 复制新增时的初始化
    async initCopyInsertModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJson.code = ''
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      var _address_data = this.getAddressDataByid()
      this.popSettings.one.selectedDataJson = deepCopy(_address_data)
      // 设置按钮
      this.settings.btnShowStatus.showCopyInsert = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusTwo'].focus()
      })
    },
    // 修改时的初始化
    async initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      var _address_data = await this.getAddressDataByid()
      this.popSettings.one.selectedDataJson = deepCopy(_address_data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
    },
    // 查看时的初始化
    async initViewModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      var _address_data = await this.getAddressDataByid()
      this.popSettings.one.selectedDataJson = deepCopy(_address_data)
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.tempJson', (newVal, oldVal) => {
        this.settings.btnDisabledStatus.disabledReset = false
        this.settings.btnDisabledStatus.disabledInsert = false
        this.settings.btnDisabledStatus.disabledUpdate = false
        this.settings.btnDisabledStatus.disabledCopyInsert = false
      }, { deep: true }
      )
      // 监听地址簿的返回
      this.watch.unwatch_address = this.$watch('popSettings.one.selectedDataJson', (newVal, oldVal) => {
        if (newVal !== {}) {
          this.dataJson.tempJson.address_id = this.popSettings.one.selectedDataJson.id
        } else {
          this.popSettings.one.selectedDataJson.id = undefined
        }
      }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
      if (this.watch.unwatch_address) {
        this.watch.unwatch_address()
      }
    },
    // 重置按钮
    doReset () {
      switch (this.settings.dialogStatus) {
        case this.PARAMETERS.STATUS_UPDATE:
          // 数据初始化
          // this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refFocusOne'].focus()
          })
          break
        case this.PARAMETERS.STATUS_COPY_INSERT:
          // 数据初始化
          // this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson.code = ''
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refFocusTwo'].focus()
          })
          break
        default:
          // 数据初始化
          // this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
          this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refFocusOne'].focus()
          })
          break
      }
      // 初始化按钮
      this.initButtonDisabledStatus()
      // 初始化watch
      this.setWatch()

      // 去除validate信息
      this.$nextTick(() => {
        this.$refs['dataSubmitForm'].clearValidate()
      })
    },
    // 插入逻辑
    doInsert () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData).then((_data) => {
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData).then((_data) => {
            this.dataJson.tempJson = deepCopy(_data.data)
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 复制新增逻辑
    doCopyInsert () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData).then((_data) => {
            this.dataJson.tempJson = deepCopy(_data.data)
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // --------------地址簿 弹出查询框：--------------
    // 选择or重置按钮的初始化
    initAddressSelectButton () {
      this.$nextTick(() => {
        this.$refs.selectOne.$el.parentElement.className = 'el-input-group__append el-input-group__append_select'
      })
    },
    handleModuleDialogClick () {
      // 选择按钮
      this.popSettings.one.visible = true
    },
    // 关闭对话框：确定
    handleAddressCloseOk (val) {
      this.popSettings.one.selectedDataJson = val
      this.popSettings.one.visible = false
    },
    // 关闭对话框：取消
    handleAddressCloseCancel () {
      this.popSettings.one.visible = false
    },
    // 关闭dialog
    handleClose (done) {
      this.unWatch()
      done()
    },
    // -------------------不同的页签，标签进行的验证------------------
    // 所有的数据开始validate
    doValidateAllRules () {
      this.settings.rules = { ...this.settings.rulesOne }
      // this.$refs['dataSubmitForm'].rules = this.settings.rules
    },
    // 设置验证rules
    setRules () {
      this.settings.rules = this.settings.rulesOne
      // this.$refs['dataSubmitForm'].rules = this.settings.rules
    },
    // 开始综合验证
    doValidateByTabs () {
      this.setRules()
      this.$refs['dataSubmitForm'].validate((valid, validateItems) => {
        if (valid === false) {
          this.settings.badge.countOne = Object.keys(validateItems).length
        } else {
          this.settings.badge.countOne = 0
        }
      })

      // 第二个tabs

      // 所有的数据进行验证
      this.doValidateAllRules()
    },
    // reset所有验证
    doResetValidate () {
      this.settings.badge.countOne = 0
      this.settings.badge.countTwo = 0
      this.$nextTick(() => {
        this.$refs['dataSubmitForm'].clearValidate()
        this.doValidateAllRules()
      })
    },
    // 营业有效期长期
    handleLongTermChange (val) {
      if (val) {
        // 营业有效期 不可用
        this.settings.rules_disable.end_date = true
        this.dataJson.tempJson.end_date = '9999/01/01'
      } else {
        this.settings.rules_disable.end_date = false
        this.dataJson.tempJson.end_date = ''
      }
    },
    // -------------------验证部分------------------
    // 营业有效期需要大于成立日期
    validateSetup_date (rule, value, callback) {
      const _data = Date.parse(value)
      if (!isNaN(Date.parse(value))) {
        if (_data > Date.parse(this.dataJson.tempJson.end_date)) {
          return callback(new Error('输入的营业有效期应大于成立日期'))
        }

        return callback()
      }
    },
    validateEnd_date (rule, value, callback) {
      const _data = Date.parse(value)
      if (!isNaN(Date.parse(value))) {
        if (_data <= Date.parse(this.dataJson.tempJson.setup_date)) {
          return callback(new Error('输入的营业有效期应大于成立日期'))
        }
        return callback()
      }
    },
    handleSetup_dateChange () {
      this.$refs.dataSubmitForm.validateField('setup_date')
      this.$refs.dataSubmitForm.validateField('end_date')
    },
    handleEnd_dateChange () {
      this.$refs.dataSubmitForm.validateField('setup_date')
      this.$refs.dataSubmitForm.validateField('end_date')
    },
    async getAddressDataByid () {
      return await getDataByIdApi({ id: this.dataJson.tempJson.address_id }).then(response => {
        return response.data
      })
    }
  }
}
</script>
