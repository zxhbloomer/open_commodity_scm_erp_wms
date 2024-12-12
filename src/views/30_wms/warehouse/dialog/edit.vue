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
        label-position="right"
        label-width="150px"
        status-icon
      >
        <el-tabs
          style="height: 380px"
          @tab-click="handleTabsClick"
        >
          <br>

          <el-tab-pane>
            <template slot="label">
              基本信息
              <el-badge
                v-show="settings.badge.countOne > 0"
                :value="settings.badge.countOne"
                type="danger"
              />
            </template>
            <el-row>

              <el-col :span="12">
                <el-form-item
                  label="仓库编码："
                  prop="code"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.code"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.code"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="仓库名称："
                  prop="name"
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
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="仓库简称："
                  prop="short_name"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.short_name"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.short_name"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="仓库类型："
                  prop="warehouse_type"
                >
                  <select-dict
                    v-model="dataJson.tempJson.warehouse_type"
                    :para="CONSTANTS.DICT_M_WAREHOUSE_TYPE"
                    init-placeholder="请选择仓库类型"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="监管企业："
                  prop="charge_company_id"
                >
                  <select-charge-company
                    v-model.trim="dataJson.tempJson.charge_company_name"
                    :placeholder="isPlaceholderShow('请选监管企业')"
                    @closeParentDialog="handleDialogClose"
                    @onReturnData="handleChargeReturnData"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="运营企业："
                  prop="operate_company_id"
                >
                  <select-operate-company
                    v-model.trim="dataJson.tempJson.operate_company_name"
                    :placeholder="isPlaceholderShow('请选择运营企业')"
                    @closeParentDialog="handleDialogClose"
                    @onReturnData="handleOperateReturnData"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="联系人："
                  prop="contact_person"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.contact_person"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.contact_person"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="联系手机："
                  prop="mobile_phone"
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
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="省市区："
                  prop="cascader_areas"
                >
                  <el-cascader
                    ref="refCascader"
                    v-model="dataJson.tempJson.cascader_areas"
                    :placeholder="isPlaceholderShow('请选择省市区')"
                    filterable
                    clearable
                    :options="dataJson.cascader.data"
                    style="width: 100%"
                    :disabled="isViewModel"
                    @change="handleCascaderChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="片区："
                  prop="zone"
                >
                  <select-dict
                    v-model="dataJson.tempJson.zone"
                    :para="CONSTANTS.DICT_M_WAREHOUSE_ZONE"
                    init-placeholder="请选择仓库片区"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              label="详细地址："
              prop="address"
            >
              <el-input
                v-model.trim="dataJson.tempJson.address"
                clearable
                show-word-limit
                type="textarea"
                :maxlength="dataJson.inputSettings.maxLength.address"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane>
            <template slot="label">
              其他信息
              <el-badge
                v-show="settings.badge.countTwo > 0"
                :value="settings.badge.countTwo"
                type="danger"
              />
            </template>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="仓库面积："
                  prop="area"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.area"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.area"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="仓库容积："
                  prop="warehouse_capacity"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.warehouse_capacity"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.warehouse_capacity"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="经度信息："
                  prop="longitude"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.longitude"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.longitude"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="纬度信息："
                  prop="latitude"
                >
                  <el-input
                    v-model.trim="dataJson.tempJson.latitude"
                    clearable
                    show-word-limit
                    :maxlength="dataJson.inputSettings.maxLength.latitude"
                    :placeholder="isPlaceholderShow('请输入')"
                    :disabled="isViewModel"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="启用日期："
                  prop="start_dt"
                >
                  <el-date-picker
                    v-model="dataJson.tempJson.start_dt"
                    value-format="yyyy-MM-dd"
                    type="date"
                    clearable
                    :placeholder="isPlaceholderShow('选择日期')"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="到期日期："
                  prop="end_dt"
                >
                  <el-date-picker
                    v-model="dataJson.tempJson.end_dt"
                    value-format="yyyy-MM-dd"
                    type="date"
                    clearable
                    :placeholder="isPlaceholderShow('选择日期')"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="每日收货开始时间："
                  prop="receive_start_time"
                >
                  <el-time-picker
                    v-model="dataJson.tempJson.receive_start_time"
                    value-format="HH:mm:ss"
                    format="HH:mm:ss"
                    clearable
                    :placeholder="isPlaceholderShow('选择时间')"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="每日收货结束时间："
                  prop="receive_end_time"
                >
                  <el-time-picker
                    v-model="dataJson.tempJson.receive_end_time"
                    value-format="HH:mm:ss"
                    format="HH:mm:ss"
                    clearable
                    :placeholder="isPlaceholderShow('选择时间')"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="每日发货开始时间："
                  prop="deliver_start_time"
                >
                  <el-time-picker
                    v-model="dataJson.tempJson.deliver_start_time"
                    value-format="HH:mm:ss"
                    format="HH:mm:ss"
                    clearable
                    :placeholder="isPlaceholderShow('选择时间')"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="每日发货结束时间："
                  prop="deliver_end_time"
                >
                  <el-time-picker
                    v-model="dataJson.tempJson.deliver_end_time"
                    value-format="HH:mm:ss"
                    format="HH:mm:ss"
                    clearable
                    :placeholder="isPlaceholderShow('选择时间')"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="是否启用："
                  prop="enable"
                >
                  <el-switch
                    v-model="dataJson.tempJson.enable"
                    active-color="#ff4949"
                    inactive-color="#dcdfe6"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="是否质检仓："
                  prop="warehouse_check"
                >
                  <el-switch
                    v-model="dataJson.tempJson.warehouse_check"
                    active-color="#ff4949"
                    inactive-color="#dcdfe6"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="启用库区："
                  prop="enable_location"
                >
                  <el-switch
                    v-model="dataJson.tempJson.enable_location"
                    disabled="true"
                    active-color="#ff4949"
                    inactive-color="#dcdfe6"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="启用库位："
                  prop="enable_bin"
                >
                  <el-switch
                    v-model="dataJson.tempJson.enable_bin"
                    disabled="true"
                    active-color="#ff4949"
                    inactive-color="#dcdfe6"
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
<style >
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>

<script>
import SelectDict from '@/components/00_dict/select/SelectDict'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { updateApi, insertApi } from '@/api/30_wms/warehouse/warehouse'
import { getAreasCascaderApi } from '@/api/00_common/systemArea'
import SelectChargeCompany from '@/views/30_wms/customer/selectgrid/selectCustomer'
import SelectOperateCompany from '@/views/30_wms/customer/selectgrid/selectCustomer'

export default {
  components: { SelectDict, SelectChargeCompany, SelectOperateCompany },
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
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          config_key: '',
          value: '',
          descr: '',
          enable: true
        },
        // 单条数据 json
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 100,
            code: 20,
            short_name: 100,
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
            address: 100
          }
        }
      },
      // 页面设置json
      settings: {
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
          short_name: [
            { required: true, message: '请输入仓库简称', trigger: 'change' }
          ],
          warehouse_type: [
            { required: true, message: '请输入仓库类型', trigger: 'change' }
          ],
          // 联系人
          contact_person: [
            { required: this.isRequired, message: '请输入联系人', trigger: 'change' }
          ],
          mobile_phone: [
            { required: this.isRequired, message: '请输入联系手机', trigger: 'change' }
          ],
          cascader_areas: [
            { required: this.isRequired, message: '请输入省市区', trigger: 'change' }
          ],
          address: [
            { required: this.isRequired, message: '请输入详细地址', trigger: 'change' }
          ]
        },
        rulesTwo: {
          area: [
            { required: this.isRequired, message: '请输入仓库面积', trigger: 'change' }
          ],
          start_dt: [
            { required: this.isRequired, message: '请选择启用日期', trigger: 'change' }
          ],
          warehouse_capacity: [
            { required: this.isRequired, message: '请输入仓库容积', trigger: 'change' }
          ],
          end_dt: [
            { required: this.isRequired, message: '请选择到期日期', trigger: 'change' }
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
    // 是否是中林环境
    // isRequired () {
    //   const href = window.location.href
    //   // shyiyuanth
    //   if (href.indexOf('localhost') !== -1) {
    //     alert('订单')
    //     return true
    //   } else {
    //     return false
    //   }
    // }
  },
  // 监听器
  watch: {},
  created () {
    console.log(this.data)
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
      // 初始化级联数据
      this.getCascaderDataList()
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
    handleTabsClick (tab, event) { },
    // 级联事件
    handleCascaderChange (val) {
      this.dataJson.tempJson.cascader_text = this.$refs.refCascader.presentText
      this.dataJson.tempJson.province = val[0]
      this.dataJson.tempJson.city = val[1]
      this.dataJson.tempJson.district = val[2]
    },
    getCascaderDataList () {
      // 级联查询逻辑
      this.settings.loading = true
      getAreasCascaderApi().then(response => {
        this.dataJson.cascader.data = response.data
      }).finally(() => {
        this.settings.loading = false
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

      // 第二个tabs
      this.settings.rules = this.settings.rulesTwo
      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
      this.$refs['dataSubmitForm'].validate((valid, validateItems) => {
        if (valid === false) {
          this.settings.badge.countTwo = Object.keys(validateItems).length
        } else {
          this.settings.badge.countTwo = 0
        }
      })

      // 所有的数据进行验证
      this.doValidateAllRules()
    },
    // 所有的数据开始validate
    doValidateAllRules () {
      this.settings.rules = { ...this.settings.rulesOne, ...this.settings.rulesTwo }

      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
    },
    handleChargeReturnData (val) {
      this.dataJson.tempJson.charge_company_id = val.id
    },
    handleOperateReturnData (val) {
      this.dataJson.tempJson.operate_company_id = val.id
    },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    }
  }
}
</script>
