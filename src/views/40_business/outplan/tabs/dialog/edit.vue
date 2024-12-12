<template>
  <div class="app-container">

    <el-form
      ref="dataSubmitForm"
      :rules="settings.rules"
      :model="dataJson.tempJson"
      label-position="right"
      label-width="150px"
      status-icon
    >

      <el-alert
        title="出库计划单基本信息"
        type="info"
        :closable="false"
      />
      <br>
      <el-row>

        <el-col :span="6">
          <el-form-item
            label="计划单号："
            prop="code"
          >
            <el-input
              ref="refFocusOne"
              v-model.trim="dataJson.tempJson.code"
              clearable
              show-word-limit
              disabled
              :placeholder="isPlaceholderShow('系统自动生成')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="货主："
            prop="owner_name"
          >
            <el-input
              v-model.trim="dataJson.tempJson.owner_name"
              disabled
            >
              <el-button
                v-if="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
                slot="append"
                ref="selectOne"
                :disabled="isViewModel"
                icon="el-icon-search"
                @click="handleOwnerDialog()"
              >
                选择
              </el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="委托方："
            prop="consignor_name"
          >
            <el-input
              v-model.trim="dataJson.tempJson.consignor_name"
              disabled
            >
              <el-button
                v-if="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
                slot="append"
                ref="selectOne"
                icon="el-icon-search"
                :disabled="isViewModel"
                @click="handleConsignorDialog()"
              >
                选择
              </el-button>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item
            label="出库类型："
            prop="type"
          >
            <select-dict
              v-model="dataJson.tempJson.type"
              :para="CONSTANTS.DICT_B_OUT_PLAN_TYPE"
              init-placeholder="请选择出库类型"
              :disabled="isViewModel"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="计划日期："
            prop="plan_time"
          >
            <el-date-picker
              v-model="dataJson.tempJson.plan_time"
              value-format="yyyy-MM-dd"
              type="date"
              clearable
              :placeholder="isPlaceholderShow('选择日期')"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-alert
        title="合同信息"
        type="info"
        :closable="false"
      />
      <br>
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="合同编号："
            prop="contract_no"
          >
            <el-input
              v-model.trim="dataJson.tempJson.contract_no"
              disabled
            >
              <el-button
                v-if="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
                slot="append"
                ref="selectOne"
                icon="el-icon-search"
                @click="handleOrderDialog()"
              >
                选择
              </el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="单据类型："
            prop="bill_type"
          >
            <select-dict
              v-model="dataJson.tempJson.bill_type"
              :para="CONSTANTS.DICT_B_OUT_PLAN_BUSINESS_TYPE"
              init-placeholder="请选择仓库类型"
              :disabled="isViewModel"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item
            label="合同日期："
            prop="contract_dt"
          >
            <el-date-picker
              v-model="dataJson.tempJson.contract_dt"
              value-format="yyyy-MM-dd"
              type="date"
              clearable
              disabled
              :placeholder="isPlaceholderShow('选择日期')"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="客户："
            prop="client_name"
          >
            <el-input
              v-model.trim="dataJson.tempJson.client_name"
              clearable
              show-word-limit
              :maxlength="dataJson.inputSettings.maxLength.client_name"
              :placeholder="isPlaceholderShow('请输入')"
              disabled
              type="number"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="6">
          <el-form-item
            label="合同量："
            prop="contract_num"
          >
            <el-input
              v-model.trim="dataJson.tempJson.contract_num"
              clearable
              show-word-limit
              :maxlength="dataJson.inputSettings.maxLength.contract_num"
              :placeholder="isPlaceholderShow('请输入')"
              disabled
              type="number"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-alert
        title="出库物料明细"
        type="info"
        :closable="false"
      />
      <br>
      <el-button-group>
        <el-button
          v-show="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
          type="primary"
          icon="el-icon-circle-plus-outline"
          :loading="settings.loading"
          @click="handleInventoryInsert"
        >新增</el-button>
        <el-button
          v-show="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
          type="primary"
          icon="el-icon-edit-outline"
          :loading="settings.loading"
          @click="handleInventoryEdit"
        >编辑</el-button>
        <el-button
          v-show="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
          :disabled="!settings.btnShowStatus.showUpdate"
          type="primary"
          icon="el-icon-circle-close"
          :loading="settings.loading"
          @click="handleInventoryDelete"
        >删除</el-button>
      </el-button-group>
      <el-table
        ref="multipleTable"
        v-loading="settings.loading"
        :data="dataJson.detailListData"
        :element-loading-text="'正在拼命加载中...'"
        element-loading-background="rgba(255, 255, 255, 0.5)"
        :height="settings.tableHeight"
        stripe
        border
        fit
        highlight-current-row
        :default-sort="{prop: 'u_time', order: 'descending'}"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="45"
          label="No"
        />
        <el-table-column
          sortable="custom"
          show-overflow-tooltip
          min-width="120"
          prop="warehouse_name"
          label="仓库"
        />
        <el-table-column
          sortable="custom"
          show-overflow-tooltip
          min-width="130"
          prop="code"
          label="物料编码"
        />
        <el-table-column
          sortable="custom"
          show-overflow-tooltip
          min-width="130"
          prop="goods_name"
          label="物料名称"
        />
        <el-table-column
          sortable="custom"
          show-overflow-tooltip
          min-width="130"
          prop="pm"
          label="品名"
        />
        <el-table-column
          sortable="custom"
          show-overflow-tooltip
          min-width="130"
          prop="spec"
          label="规格"
        />
        <el-table-column
          sortable="custom"
          show-overflow-tooltip
          min-width="150"
          prop="count"
          label="出库数量"
        />
        <el-table-column
          sortable="custom"
          show-overflow-tooltip
          min-width="150"
          prop="unit_name"
          label="出库单位"
        />

        <el-table-column
          sortable="custom"
          show-overflow-tooltip
          min-width="150"
          prop="weight"
          label="换算后数量"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="150"
          label="单位"
        >
          <template>吨</template>
        </el-table-column>
      </el-table>
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
      >返回</el-button>
      <el-button
        v-show="settings.btnShowStatus.showInsert"
        plain
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
        @click="doInsert()"
      >保存</el-button>
      <el-button
        v-show="settings.btnShowStatus.showUpdate && !isViewModel"
        plain
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
        @click="doUpdate()"
      >保存</el-button>
    </div>

    <consignor-dialog
      v-if="popSettingsData.searchDialogDataOne.visible"
      :visible="popSettingsData.searchDialogDataOne.visible"
      @closeMeOk="handleConsignorCloseOk"
      @closeMeCancel="handleConsignorCloseCancel"
    />
    <owner-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      @closeMeOk="handleOwnerCloseOk"
      @closeMeCancel="handleOwnerCloseCancel"
    />
    <order-dialog
      v-if="popSettingsData.searchDialogDataThree.visible"
      :visible="popSettingsData.searchDialogDataThree.visible"
      @closeMeOk="handleOrderCloseOk"
      @closeMeCancel="handleOrderCloseCancel"
    />
    <inventory-dialog
      v-if="popSettingsData.inventoryDialog.visible"
      :visible="popSettingsData.inventoryDialog.visible"
      @closeMeOk="handleInventoryCloseOk"
      @closeMeCancel="handleInventoryCloseCancel"
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
import { updateApi, insertApi } from '@/api/40_business/outplan/outplan'
import { getAreasCascaderApi } from '@/api/00_common/systemArea'
import consignorDialog from '@/views/30_wms/customer/dialog/dialog'
import ownerDialog from '@/views/30_wms/customer/dialog/dialog'
import orderDialog from '@/views/40_business/outorder/dialog/dialog'
import inventoryDialog from '@/views/40_business/outplan/tabs/dialog/inventoryEdit'

export default {
  components: { SelectDict, consignorDialog, ownerDialog, orderDialog, inventoryDialog },
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
      default: constants_para.STATUS_INSERT
    }
  },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null
      },

      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        // 弹出的查询框参数设置
        searchDialogDataOne: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataTwo: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的查询框参数设置
        searchDialogDataThree: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataFour: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataFive: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataSix: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataSeven: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }

        },
        // 弹出的商品查询框参数设置
        inventoryDialog: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        }
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
          descr: ''
        },
        // 单条数据 json
        tempJson: null,
        inputSettings: {
          maxLength: {
            contract_num: 20,
            ship_name: 20,
            contract_no: 20,
            primary_quantity: 10,
            car_count: 20,
            actual_count: 20,
            price: 10
          }
        },
        detailListData: []
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
          consignor_name: [
            { required: true, message: '请选择委托方', trigger: 'change' }
          ],
          owner_name: [
            { required: true, message: '请选择货主', trigger: 'change' }
          ],
          plan_time: [
            { required: true, message: '请选择委托日期', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择入库类型', trigger: 'change' }
          ],
          warehouse_name: [
            { required: true, message: '请输选择仓库', trigger: 'change' }
          ],
          location_name: [
            { required: true, message: '请选择库区', trigger: 'change' }
          ],
          bin_name: [
            { required: true, message: '请选择库位', trigger: 'change' }
          ],
          inbound_time: [
            { required: true, message: '请输入入库时间', trigger: 'change' }
          ],
          goods_name: [
            { required: true, message: '请选择物料', trigger: 'change' }
          ],
          actual_count: [
            { required: true, message: '请输入入库数量', trigger: 'change' }
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
      this.dataJson.tempJson.unit = '吨'
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
      this.dataJson.detailListData = this.dataJson.tempJson.detailVo
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
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      this.dataJson.detailListData = this.dataJson.tempJson.detailVo
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
          tempData.consignor_id = this.popSettingsData.searchDialogDataOne.selectedDataJson.id
          tempData.owner_id = this.popSettingsData.searchDialogDataTwo.selectedDataJson.id
          tempData.client_id = this.popSettingsData.searchDialogDataThree.selectedDataJson.id
          tempData.consignor_code = this.popSettingsData.searchDialogDataOne.selectedDataJson.code
          tempData.owner_code = this.popSettingsData.searchDialogDataTwo.selectedDataJson.code
          tempData.client_code = this.popSettingsData.searchDialogDataThree.selectedDataJson.code
          tempData.detailVo = this.dataJson.detailListData
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
          tempData.consignor_id = this.popSettingsData.searchDialogDataOne.selectedDataJson.id
          tempData.owner_id = this.popSettingsData.searchDialogDataTwo.selectedDataJson.id
          tempData.client_id = this.popSettingsData.searchDialogDataThree.selectedDataJson.id
          tempData.consignor_code = this.popSettingsData.searchDialogDataOne.selectedDataJson.code
          tempData.owner_code = this.popSettingsData.searchDialogDataTwo.selectedDataJson.code
          tempData.client_code = this.popSettingsData.searchDialogDataThree.selectedDataJson.code
          tempData.detailVo = this.dataJson.detailListData
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
      this.dataJson.tempJson.province_code = val[0]
      this.dataJson.tempJson.city_code = val[1]
      this.dataJson.tempJson.area_code = val[2]
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
    // 委托方
    handleConsignorDialog () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    // 委托方：关闭对话框：确定
    handleConsignorCloseOk (val) {
      this.popSettingsData.searchDialogDataOne.selectedDataJson = val
      this.dataJson.tempJson.consignor_name = val.name
      this.popSettingsData.searchDialogDataOne.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 委托方：关闭对话框：取消
    handleConsignorCloseCancel () {
      this.popSettingsData.searchDialogDataOne.visible = false
    },
    // 货主
    handleOwnerDialog () {
      this.popSettingsData.searchDialogDataTwo.visible = true
    },
    // 货主：关闭对话框：确定
    handleOwnerCloseOk (val) {
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
      this.dataJson.tempJson.owner_name = val.name
      this.popSettingsData.searchDialogDataTwo.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 货主：关闭对话框：取消
    handleOwnerCloseCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
    },
    // 订单
    handleOrderDialog () {
      this.popSettingsData.searchDialogDataThree.visible = true
    },
    // 订单：关闭对话框：确定
    handleOrderCloseOk (val) {
      this.popSettingsData.searchDialogDataThree.selectedDataJson = val
      this.dataJson.tempJson.contract_no = val.contract_no
      this.dataJson.tempJson.contract_dt = val.contract_dt
      this.dataJson.tempJson.contract_num = val.contract_num
      this.dataJson.tempJson.client_name = val.supplier_name
      this.dataJson.tempJson.ship_name = val.ship_name
      this.dataJson.tempJson.order_id = val.id
      this.popSettingsData.searchDialogDataThree.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 订单：关闭对话框：取消
    handleOrderCloseCancel () {
      this.popSettingsData.searchDialogDataThree.visible = false
    },
    // 库存数据删除
    handleInventoryDelete () {
      // 删除
      this.popSettingsData.inventoryDialog.visible = true
    },
    // 库存数据编辑
    handleInventoryEdit () {
      // 删除
      this.popSettingsData.inventoryDialog.visible = true
    },
    // 库存数据选择
    handleInventoryInsert () {
      // 新增
      this.popSettingsData.inventoryDialog.visible = true
    },

    // 库存：关闭对话框：确定
    handleInventoryCloseOk (val) {
      this.popSettingsData.inventoryDialog.selectedDataJson = val.data
      this.dataJson.tempJson.client_name = val.name
      this.popSettingsData.inventoryDialog.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.detailListData.push(val.data)
    },
    // 库存：关闭对话框：取消
    handleInventoryCloseCancel () {
      this.popSettingsData.inventoryDialog.visible = false
    }
  }

}
</script>
