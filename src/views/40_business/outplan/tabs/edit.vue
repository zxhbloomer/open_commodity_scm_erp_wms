<template>
  <div class="app-container">
    <div class="edit-container">
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
        status-icon
      >
        <el-alert
          title="出库计划基本信息"
          type="info"
          :closable="false"
        />
        <br>

        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item label="计划单号">
            {{ dataJson.tempJson.plan_code == null?'系统自动生成':dataJson.tempJson.plan_code }}
          </el-descriptions-item>
          <el-descriptions-item label="序号">{{ dataJson.tempJson.no }}</el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              出库类型
            </div>
            <el-form-item
              prop="type"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.type"
                :para="CONSTANTS.DICT_B_OUT_PLAN_TYPE"
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
              货主
            </div>
            <el-form-item
              prop="owner_name"
              label-width="0"
            >
              <!-- <input-search
                v-model.trim="dataJson.tempJson.owner_name"
                :disabled="isViewModel"
                @onInputSearch="handleOwnerDialog"
              /> -->
              <el-select
                v-model="dataJson.tempJson.owner_name"
                :placeholder="isPlaceholderShow('请选择货主')"
                :disabled="isViewModel"
                filterable
                clearable
                @change="selectOwner"
              >
                <el-option
                  v-for="item in dataJson.ownerComboList"
                  :key="item.id"
                  :label="item.short_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              委托方
            </div>
            <el-form-item
              prop="consignor_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.consignor_name"
                :disabled="isViewModel"
                @onInputSearch="handleConsignorDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              出库时间
            </div>
            <el-form-item
              prop="plan_time"
              label-width="0"
            >
              <el-date-picker
                v-model="dataJson.tempJson.plan_time"
                value-format="yyyy-MM-dd"
                type="date"
                clearable
                :disabled="isViewModel"
                :placeholder="isPlaceholderShow('选择日期')"
                style="width: 100%"
              />
            </el-form-item>

          </el-descriptions-item>
          <el-descriptions-item label="单据状态">
            {{ dataJson.tempJson.status_name }}
          </el-descriptions-item>
          <el-descriptions-item label="备注">
            <el-form-item
              prop="remark"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.remark"
                show-word-limit
                :disabled="isViewModel"
                :maxlength="dataJson.inputSettings.maxLength.remark"
                :placeholder="isPlaceholderShow('请输入')"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item
            v-if="dataJson.tempJson.status =='4'"
            label="作废理由"
          >{{ dataJson.tempJson.cancel_remark }}
          </el-descriptions-item>
          <el-descriptions-item v-if="dataJson.tempJson.status !=='4'" />
        </el-descriptions>

        <br>
        <el-alert
          title="合同信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item>
            <div slot="label">
              合同编号
            </div>
            <el-form-item
              prop="contract_no"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.contract_no"
                :disabled="isViewModel"
                @onInputSearch="handleOrderDialog"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="外部关联单号">
            {{ dataJson.tempJson.extra_code == null? '-' : dataJson.tempJson.extra_code }}
          </el-descriptions-item>
          <el-descriptions-item label="放货指令单号">
            {{ dataJson.tempJson.release_order_code == null?'-':dataJson.tempJson.release_order_code }}
          </el-descriptions-item>
          <el-descriptions-item label="单据类型">
            {{ dataJson.tempJson.bill_type_name == null?'-':dataJson.tempJson.bill_type_name }}
          </el-descriptions-item>

          <el-descriptions-item label="合同日期">
            {{ dataJson.tempJson.contract_dt == null?'-':formatDate(dataJson.tempJson.contract_dt) }}
          </el-descriptions-item>

          <el-descriptions-item label="客户">
            {{ dataJson.tempJson.customer_name == null?'-':dataJson.tempJson.customer_name }}
          </el-descriptions-item>

          <el-descriptions-item label="合同量">
            {{ dataJson.tempJson.contract_num == null?'-':dataJson.tempJson.contract_num }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="settings.over_release"
            label="上浮百分比"
          >
            <el-form-item
              prop="over_inventory_upper"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.over_inventory_upper"
                class="slotColor"
                type="text"
                clearable
                show-word-limit
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item />
        </el-descriptions>
        <br>
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
            :disabled="!settings.specBtnShowStatus.showUpdate"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleInventoryEdit"
          >编辑</el-button>
          <el-button
            v-show="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
            :disabled="!settings.specBtnShowStatus.showUpdate"
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
          @current-change="handleCurrentChange"
        >
          <el-table-column
            type="index"
            width="45"
            label="No"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="140"
            prop="sku_code"
            label="物料编码"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="goods_name"
            label="物料名称"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="pm"
            label="品名"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="spec"
            label="规格"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="type_gauge"
            label="型规"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="alias"
            label="别称"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="120"
            prop="warehouse_name"
            label="出库仓库"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="count"
            label="出库数量"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="unit_name"
            label="出库单位"
          />

          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="weight"
            label="出库数量换算"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="unit"
            label="库存计量单位"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="has_handle_count"
            label="已出库数量"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.has_handle_count == null? '': formatNumber(scope.row.has_handle_count,true,4) }}
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="pending_count"
            label="待出库数量"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.pending_count > 0?formatNumber(scope.row.pending_count,true,4) : '0' }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="return_qty"
            label="退货数量"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.return_qty > 0?formatNumber(scope.row.return_qty,true,4) : '0' }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="remark"
            label="备注"
          />
        </el-table>
      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />

      <el-button
        v-show="settings.btnShowStatus.showInsert"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert"
        size="medium"
        @click="doInsert()"
      >保存</el-button>
      <el-button
        v-show="settings.btnShowStatus.showUpdate && !isViewModel"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate"
        size="medium"
        @click="doUpdate()"
      >保存</el-button>
      <el-button
        :disabled="settings.loading"
        size="medium"
        @click="handleCancel()"
      >返回</el-button>
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
      :data="dataJson.updateJson"
      :dialog-status="popSettingsData.inventoryDialog.dialogStatus"
      @closeMeOk="handleInventoryCloseOk"
      @closeMeCancel="handleInventoryCloseCancel"
    />
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
.slotColor
/deep/.el-input-group__append, .el-input-group__prepend {
  background-color: #f5f7fa;
  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 20px;
  width: 1px;
  white-space: nowrap;
}
</style>

<script>
import SelectDict from '@/components/00_dict/select/SelectDict'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { updateApi, insertApi, getApi, getOverReleaseConfigApi } from '@/api/40_business/outplan/outplan'
// import { getListApi } from '@/api/10_system/appcode/config'
import consignorDialog from '@/views/30_wms/customer/dialog/dialog'
import ownerDialog from '@/views/30_wms/owner/dialog/dialog'
import orderDialog from '@/views/40_business/order/dialog/dialog'
import inventoryDialog from '@/views/40_business/outplan/tabs/dialog/inventoryEdit'
import InputSearch from '@/components/40_input/inputSearch'
import mixin from './mixin/editResizeHandlerMixin'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import { getApi as getOrderApi } from '@/api/40_business/outorder/outorder'

export default {
  components: { InputSearch, SelectDict, consignorDialog, ownerDialog, orderDialog, inventoryDialog },
  directives: { elDragDialog },
  mixins: [mixin],
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
    editStatus: {
      type: String,
      default: constants_para.STATUS_INSERT
    },
    canEdit: {
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
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      inventorySearchForm: {},
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
        // 来源数据
        // app_data_list: null,
        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          consignor_name: '',
          owner_name: '',
          plan_time: '',
          type: '',
          contract_no: '',
          over_inventory_upper: 0
        },
        currentJson: {
        },
        updateJson: {
        },
        // 单条数据 json
        tempJson: {},
        inputSettings: {
          maxLength: {
            contract_num: 20,
            ship_name: 20,
            contract_no: 20,
            remark: 100
          }
        },
        detailListData: []
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        // 是否开启超发
        over_release: false,
        duration: 4000,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        specBtnShowStatus: {
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
            { required: true, message: '出库时间', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择出库类型', trigger: 'change' }
          ],
          over_inventory_upper: [
            // { required: true, message: '请输入上浮百分比', trigger: 'change' },
            { validator: this.over_inventory_upper_validator, trigger: 'blur' }
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
        this.settings.editStatus === this.PARAMETERS.STATUS_INSERT ||
        this.settings.editStatus === this.PARAMETERS.STATUS_COPY_INSERT
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
      if (this.settings.editStatus === this.PARAMETERS.STATUS_VIEW) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {},
  created () {
    // 查询超收开关是否开启
    this.getOverConfig()
    this.init()
    // 初始化货主
    this.getOwnerData()
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 初始化处理
    async init () {
      this.settings.rules = this.settings.rulesOne
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.editStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          await this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          await this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_VIEW:
          await this.initViewModel()
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
    async initInsertModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)

      // 设置按钮
      this.settings.btnShowStatus.showInsert = true

      if (this.data !== null && this.data.order_id !== null) {
        this.getOrderDetail(this.data.order_id)
      }

      // 控件focus
      this.$nextTick(() => {
        // this.$refs['refFocusOne'].focus()
      })
      // 初始化来源
      // await getListApi({}).then(response => {
      //   this.dataJson.app_data_list = response.data
      // }).finally(() => {
      // })
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
    async initUpdateModel () {
      // 数据初始化
      await this.getData()

      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        // this.$refs['refFocusOne'].focus()
      })
      // 初始化来源
      // await getListApi({}).then(response => {
      //   this.dataJson.app_data_list = response.data
      // }).finally(() => {
      // })
    },
    // 查看时的初始化
    async initViewModel () {
      this.settings.editStatus = this.PARAMETERS.STATUS_VIEW
      //  数据初始化
      this.getData()
      // 初始化来源
      // await getListApi({}).then(response => {
      //   this.dataJson.app_data_list = response.data
      // }).finally(() => {
      // })
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
      this.$emit('emitReturn')
    },
    // 插入逻辑
    doInsert () {
      // 开始综合验证
      this.doValidateByTabs()
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.consignor_id = this.popSettingsData.searchDialogDataOne.selectedDataJson.id
          // tempData.owner_id = this.popSettingsData.searchDialogDataTwo.selectedDataJson.id
          tempData.client_id = this.popSettingsData.searchDialogDataThree.selectedDataJson.id
          tempData.consignor_code = this.popSettingsData.searchDialogDataOne.selectedDataJson.code
          // tempData.owner_code = this.popSettingsData.searchDialogDataTwo.selectedDataJson.code
          tempData.client_code = this.popSettingsData.searchDialogDataThree.selectedDataJson.code
          tempData.detailList = this.dataJson.detailListData
          tempData.over_inventory_upper = tempData.over_inventory_upper === null ? 0 : tempData.over_inventory_upper / 100
          this.settings.loading = true
          insertApi(tempData)
            .then(
              _data => {
                this.$notify({
                  title: '新增处理成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })
              },
              _error => {
                this.$notify({
                  title: '新增处理失败',
                  message: _error.error.message,
                  type: 'error',
                  duration: this.settings.duration
                })
              }
            )
            .finally(() => {
              // 通知兄弟组件
              this.$off(this.EMITS.EMIT_OUTPLAN_LOADING)
              this.$emit(this.EMITS.EMIT_OUTPLAN_LOADING)

              this.$off(this.EMITS.EMIT_OUTPLAN_CHANGE)
              this.$emit(this.EMITS.EMIT_OUTPLAN_CHANGE)
              this.$emit('emitReturn')
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
          // tempData.owner_id = this.popSettingsData.searchDialogDataTwo.selectedDataJson.id
          tempData.client_id = this.popSettingsData.searchDialogDataThree.selectedDataJson.id
          tempData.consignor_code = this.popSettingsData.searchDialogDataOne.selectedDataJson.code
          // tempData.owner_code = this.popSettingsData.searchDialogDataTwo.selectedDataJson.code
          tempData.client_code = this.popSettingsData.searchDialogDataThree.selectedDataJson.code
          tempData.over_inventory_upper = tempData.over_inventory_upper === null ? 0 : tempData.over_inventory_upper / 100
          tempData.detailList = this.dataJson.detailListData
          this.settings.loading = true
          updateApi(tempData)
            .then(
              _data => {
                this.dataJson.tempJson = deepCopy(_data.data)
                // this.$emit('closeMeOk', { return_flag: true, data: _data })
                this.$notify({
                  title: '新增处理成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })
              },
              _error => {
                // this.$emit('closeMeOk', { return_flag: false, error: _error })
                this.$notify({
                  title: '新增处理失败',
                  message: _error.error.message,
                  type: 'error',
                  duration: this.settings.duration
                })
              }
            )
            .finally(() => {
              // 通知兄弟组件
              this.$off(this.EMITS.EMIT_OUTPLAN_LOADING)
              this.$emit(this.EMITS.EMIT_OUTPLAN_LOADING)

              this.$off(this.EMITS.EMIT_OUTPLAN_CHANGE)
              this.$emit(this.EMITS.EMIT_OUTPLAN_CHANGE)
              this.$emit('emitReturn')
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
    // 委托方
    handleConsignorDialog () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    // 委托方：关闭对话框：确定
    handleConsignorCloseOk (val) {
      if (val.enable === false) {
        this.showErrorMsg('该委托方已禁用，请重新选择')
        return
      }
      this.popSettingsData.searchDialogDataOne.selectedDataJson = val
      this.dataJson.tempJson.consignor_name = val.name
      this.dataJson.tempJson.consignor_id = val.id
      this.dataJson.tempJson.consignor_code = val.code
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
      if (val.enable === false) {
        this.showErrorMsg('该货主已禁用，请重新选择')
        return
      }
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
      this.dataJson.tempJson.owner_name = val.name
      this.popSettingsData.searchDialogDataTwo.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.owner_id = val.id
      this.dataJson.tempJson.owner_code = val.code
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
      this.dataJson.tempJson.client_name = val.client_name
      this.dataJson.tempJson.client_id = val.client_id
      this.dataJson.tempJson.client_code = val.client_code
      this.dataJson.tempJson.customer_name = val.customer_name
      this.dataJson.tempJson.customer_id = val.client_id
      this.dataJson.tempJson.customer_code = val.client_code
      this.dataJson.tempJson.bill_type_name = val.bill_type_name
      this.dataJson.tempJson.bill_type = val.bill_type
      this.dataJson.tempJson.ship_name = val.ship_name
      this.dataJson.tempJson.order_id = val.serial_id
      this.dataJson.tempJson.order_type = val.serial_type
      this.dataJson.tempJson.order_detail_no = val.order_detail_no
      this.dataJson.tempJson.sku_code = val.sku_code
      this.dataJson.tempJson.over_inventory_upper = val.over_inventory_upper === null ? '0' : val.over_inventory_upper * 100
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
      this.$confirm('是否确认删除该条数据', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.dataJson.detailListData.splice(this.dataJson.currentJson.index, 1)
        this.dataJson.currentJson = {}
      }).catch(action => {

      })
    },
    // 编辑库存数据
    handleInventoryEdit () {
      // 编辑
      this.popSettingsData.inventoryDialog.visible = true
      this.popSettingsData.inventoryDialog.dialogStatus = constants_para.STATUS_UPDATE
      this.dataJson.updateJson = this.dataJson.currentJson
      this.dataJson.updateJson.owner_id = this.dataJson.tempJson.owner_id
      this.dataJson.updateJson.owner_name = this.dataJson.tempJson.owner_name
      if (this.dataJson.tempJson.contract_no !== null && this.dataJson.tempJson.contract_no !== undefined && this.dataJson.tempJson.contract_no !== '' &&
        this.editStatus === constants_para.STATUS_INSERT) {
        this.dataJson.updateJson.sku_code = this.dataJson.tempJson.sku_code
        this.dataJson.updateJson.contract_no = this.dataJson.tempJson.contract_no
      }
    },
    // 新增出库数据
    handleInventoryInsert () {
      if (this.dataJson.tempJson.owner_id === '' || this.dataJson.tempJson.owner_id === undefined) {
        this.showErrorMsg('请先选择货主')
        return
      }
      // 新增
      const tempData = {
        owner_id: this.dataJson.tempJson.owner_id,
        owner_name: this.dataJson.tempJson.owner_name
      }
      this.dataJson.updateJson = tempData
      if (this.dataJson.tempJson.contract_no !== null && this.dataJson.tempJson.contract_no !== undefined && this.dataJson.tempJson.contract_no !== '') {
        this.dataJson.updateJson.sku_code = this.dataJson.tempJson.sku_code
        this.dataJson.updateJson.contract_no = this.dataJson.tempJson.contract_no
      }
      this.popSettingsData.inventoryDialog.visible = true
    },

    // 库存：关闭对话框：确定
    handleInventoryCloseOk (val) {
      this.popSettingsData.inventoryDialog.selectedDataJson = val.data
      this.dataJson.tempJson.client_name = val.name
      this.popSettingsData.inventoryDialog.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false

      if (val.data.index === undefined) {
        var result1 = this.dataJson.detailListData.some(item => {
          if (item.sku_id === val.data.sku_id) {
            return true
          }
          return false
        })

        if (result1) {
          this.showErrorMsg('已存在物料，不能添加相同物料！')
          return
        }
        // 新增
        this.dataJson.detailListData.push(val.data)
      } else {
        var result2 = this.dataJson.detailListData.some(item => {
          if (item.sku_id === val.data.sku_id && this.dataJson.detailListData[val.data.index].sku_id !== val.data.sku_id) {
            return true
          }
          return false
        })

        if (result2) {
          this.showErrorMsg('已存在物料，不能添加相同物料！')
          return
        }
        // 修改
        this.dataJson.detailListData.splice(val.data.index, 1, val.data)
      }
    },
    // 库存：关闭对话框：取消
    handleInventoryCloseCancel () {
      this.popSettingsData.inventoryDialog.visible = false
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson !== undefined && row !== null) {
        this.settings.specBtnShowStatus.showUpdate = true
      } else {
        this.settings.specBtnShowStatus.showUpdate = false
      }
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.detailListData.lastIndexOf(row)
      return _index
    },
    async getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        this.dataJson.tempJson.over_inventory_upper = this.dataJson.tempJson.over_inventory_upper * 100
        this.dataJson.tempJsonOriginal = deepCopy(response.data)
        this.dataJson.detailListData = this.dataJson.tempJson.detailList

        this.popSettingsData.searchDialogDataOne.selectedDataJson.id = this.dataJson.tempJson.consignor_id
        this.popSettingsData.searchDialogDataTwo.selectedDataJson.id = this.dataJson.tempJson.owner_id
        this.popSettingsData.searchDialogDataThree.selectedDataJson.id = this.dataJson.tempJson.order_id
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 选择货主
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
        // 新增时默认选中第一条
        if (this.PARAMETERS.STATUS_INSERT === this.editStatus) {
          this.dataJson.tempJson.owner_name = _data.data[0].short_name
          this.dataJson.tempJson.owner_id = _data.data[0].id
          this.dataJson.tempJson.owner_code = _data.data[0].code
        }
      }, (_error) => {
      })
    },
    selectOwner (val) {
      this.dataJson.tempJson.owner_id = val
      var owner = this.dataJson.ownerComboList.find((item) => {
        return item.id === val
      })
      this.dataJson.tempJson.owner_name = owner.short_name
      this.dataJson.tempJson.owner_code = owner.code
    },
    getOverConfig () {
      getOverReleaseConfigApi().then((_data) => {
        if (_data.data.config_value === '1') {
          this.settings.over_release = true
        } else {
          this.settings.over_release = false
        }
      }, (_error) => {
      })
    },
    // 上浮百分比校验
    over_inventory_upper_validator (rule, value, callback) {
      if (this.dataJson.tempJson.over_inventory_upper !== undefined && this.dataJson.tempJson.over_inventory_upper !== null) {
        if (isNaN(this.dataJson.tempJson.over_inventory_upper)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 查询订单详情
    getOrderDetail () {
      this.settings.loading = true
      const param = { id: this.data.order_id }
      getOrderApi(param).then((_data) => {
        const data = _data.data
        data.customer_name = data.client_name
        data.serial_id = data.id
        data.serial_type = 'b_out_order'
        data.sku_code = this.data.sku_code
        this.handleOrderCloseOk(data)
      }).finally(() => {
        this.settings.loading = false
      })
    }

  }

}
</script>
