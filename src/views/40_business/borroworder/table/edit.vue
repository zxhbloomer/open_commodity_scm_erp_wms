<template>
  <div class="app-container">
    <div class="edit-container">

      <el-alert
        title="基本信息"
        type="info"
        :closable="false"
      />
      <br>
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="6px"
        status-icon
        :validate-on-rule-change="false"
      >
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
            <div
              slot="label"
              class="required-mark"
            >
              放货指令编号
            </div>
            <el-form-item prop="code">
              <el-input
                v-model.trim="dataJson.tempJson.code"
                clearable
                placeholder="放货指令编号"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="放货指令类型">
            <el-form-item
              prop="type_name"
            >
              <select-dict
                v-model="dataJson.tempJson.type_name"
                :para="CONSTANTS.DICT_B_RELEASE_ORDER_TYPE"
                init-placeholder="放货指令类型"
                @change="handleOrderTypeChange"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="业务板块">
            <el-form-item
              prop="business_plate_name"
              label-width="0"
            >
              <business-select
                v-model="dataJson.tempJson.business_plate_name"
                @change="handleBusinessChange"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="业务类型">
            <el-form-item
              prop="business_type_name"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.business_type_name"
                :para="CONSTANTS.DICT_B_RELEASE_ORDER_BUSINESS_TYPE"
                init-placeholder="放货指令类型"
                @change="handleOrderBusinessTypeChange"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="订单编号">
            <el-form-item
              prop="client_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.order_code"
                @onInputSearch="handleOutOrderDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="合同编号">
            {{ dataJson.tempJson.contract_code === null || dataJson.tempJson.contract_code === undefined ? '-' : dataJson.tempJson.contract_code }}
          </el-descriptions-item>

          <el-descriptions-item label="客户">
            {{ dataJson.tempJson.customer_name === null || dataJson.tempJson.customer_name === undefined ? '-' : dataJson.tempJson.customer_name }}
          </el-descriptions-item>

          <el-descriptions-item label="委托方">
            <el-form-item
              prop="consignor_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.consignor_name"
                @onInputSearch="handleConsignorDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="货主">
            <el-form-item
              prop="owner_name"
              label-width="0"
            >
              <el-select
                v-model="dataJson.tempJson.owner_name"
                filterable
                clearable
                @change="selectOwner"
              >
                <el-option
                  v-for="item in dataJson.ownerComboList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="放货指令日期">
            <el-form-item
              prop="out_time"
              label-width="0"
            >
              <el-date-picker
                v-model="dataJson.tempJson.out_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                clearable
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="计划时间">
            <el-form-item
              prop="plan_time"
              label-width="0"
            >
              <el-date-picker
                v-model="dataJson.tempJson.plan_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                clearable
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="上浮百分比">
            <el-form-item
              prop="float_up"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.float_up"
                :decimal-places="2"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="下浮百分比">
            <el-form-item
              prop="float_down"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.float_down"
                :decimal-places="2"
                :currency-symbol="''"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="总金额">
            <el-form-item
              prop="total_amount"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.total_amount"
                :decimal-places="2"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="账户余额">
            <el-form-item
              prop="balance"
              label-width="0"
            >
              <numeric
                v-model="dataJson.tempJson.balance"
                :decimal-places="2"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="状态">
            {{ dataJson.tempJson.status_name === null || dataJson.tempJson.status_name === undefined ? '-' : dataJson.tempJson.status_name }}
          </el-descriptions-item>

          <el-descriptions-item label="备注">
            <el-form-item
              prop="remark"
            >
              <el-input
                v-model.trim="dataJson.tempJson.remark"
                clearable
                placeholder="备注"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="创建人">
            {{ dataJson.tempJson.c_name }}
          </el-descriptions-item>

          <el-descriptions-item label="创建时间">
            {{ dataJson.tempJson.c_time == null ? '': formatDateTime(dataJson.tempJson.c_time) }}
          </el-descriptions-item>

          <el-descriptions-item label="更新人">
            {{ dataJson.tempJson.u_name }}
          </el-descriptions-item>

          <el-descriptions-item label="更新时间">
            {{ dataJson.tempJson.u_time == null ? '': formatDateTime(dataJson.tempJson.u_time) }}
          </el-descriptions-item>
        </el-descriptions>
      </el-form>
      <br>
      <el-alert
        title="物料明细"
        type="info"
        :closable="false"
      />
      <el-button-group>
        <el-button
          type="primary"
          icon="el-icon-edit-outline"
          :loading="settings.loading"
          :disabled="!settings.btnDisabledStatus.disabledInsert"
          @click="handleGoodsInsert"
        >新增</el-button>
        <el-button
          type="primary"
          icon="el-icon-edit-outline"
          :disabled="settings.btnDisabledStatus.disabledUpdate"
          :loading="settings.loading"
          @click="handleGoodsUpdate"
        >编辑</el-button>
        <el-button
          type="primary"
          icon="el-icon-edit-outline"
          :disabled="settings.btnDisabledStatus.disabledDelete"
          :loading="settings.loading"
          @click="handleGoodsDelete"
        >删除</el-button>
      </el-button-group>

      <el-table
        ref="multipleTable"
        v-loading="settings.loading"
        :data="dataJson.tempJson.detailList"
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
          show-overflow-tooltip
          min-width="130"
          prop="no"
          label="序号"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="commodity_code"
          label="商品编号"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="commodity_name"
          label="商品名称"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="commodity_spec"
          label="商品规格"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="commodity_spec_code"
          label="商品规格编码"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="commodity_nickname"
          label="商品别称"
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
          prop="qty"
          label="放货数量"
        >
          <template v-slot="scope">
            {{ scope.row.qty == null? '-':isZhongLin ? formatNumber3(scope.row.qty) : formatNumber(scope.row.qty,true,4) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="price"
          label="单价"
        >
          <template v-slot="scope">
            {{ scope.row.price == null ? '': formatCurrency(scope.row.price, true) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="amount"
          label="金额"
        >
          <template v-slot="scope">
            {{ scope.row.amount == null ? '': formatCurrency(scope.row.amount, true) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="qty"
          label="已生产数量"
        >
          <template v-slot="scope">
            {{ scope.row.has_product_num == null? '-':isZhongLin ? formatNumber3(scope.row.has_product_num) : formatNumber(scope.row.has_product_num,true,4) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="unit_name"
          label="单位"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="warehouse_name"
          label="仓库"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="remark"
          label="备注"
        />
      </el-table>

    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />

      <el-button
        v-show="settings.btnShowStatus.showInsert"
        type="primary"
        :disabled="settings.loading || settings.btnPageDisabledStatus.disabledInsert"
        size="medium"
        @click="doInsert"
      >保存</el-button>
      <el-button
        v-show="settings.btnShowStatus.showUpdate"
        :disabled="settings.loading"
        type="primary"
        size="medium"
        @click="doUpdate"
      >保存</el-button>
      <el-button
        :disabled="settings.loading"
        size="medium"
        @click="handleCancel()"
      >返回</el-button>
    </div>

    <OutOrderDialog
      v-if="settings.popSettings.one.visible"
      :visible="settings.popSettings.one.visible"
      @closeMeCancel="handleOutOrderCancel"
      @closeMeOk="handleOutOrderCloseOk"
    />

    <consignor-dialog
      v-if="settings.popSettings.two.visible"
      :visible="settings.popSettings.two.visible"
      @closeMeOk="handleConsignorCloseOk"
      @closeMeCancel="handleConsignorCloseCancel"
    />

    <GoodsEdit
      v-if="settings.popSettings.three.visible"
      :visible="settings.popSettings.three.visible"
      :dialog-status="settings.popSettings.three.dialogStatus"
      :data="settings.popSettings.three.data"
      @closeMeCancel="handleGoodsEditCancel"
      @closeMeOk="handleGoodsEditOk"
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
  margin-top: 5px;
  margin-bottom: 10px;
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
import { getApi, insertApi, updateApi } from '@/api/40_business/releaseorder/releaseorder'
import SelectDict from '@/components/00_dict/select/SelectDict.vue'
import BusinessSelect from '@/views/30_wms/businesstype/component/businessSelect.vue'
import InputSearch from '@/components/40_input/inputSearch/index.vue'
import OutOrderDialog from '@/views/40_business/outorder/dialog/dialog'
import consignorDialog from '@/views/30_wms/customer/dialog/dialog.vue'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import numeric from '@/components/40_input/numeric/index.vue'
import GoodsEdit from '@/views/40_business/releaseorder/table/dialog/goodsEdit'

export default {
  components: { numeric, consignorDialog, InputSearch, BusinessSelect, SelectDict, OutOrderDialog, GoodsEdit },
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
    editStatus: {
      type: String,
      default: constants_para.STATUS_INSERT
    }
  },
  data () {
    return {
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      fileLabelStyle: {
        width: '2.3%',
        'text-align': 'right'
      },
      dataJson: {
        // 货主
        ownerComboList: [],
        // 单条数据 json
        tempJson: {
          // 业务板块
          business_plate_name: null,
          // 货主
          owner_id: null,
          detailList: []
        }
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        duration: 4000,
        // 表格高度
        tableHeight: 325,
        // 以下为pop的内容：数据弹出框
        popSettings: {
          // 订单 合同
          one: {
            visible: false,
            props: {
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          },
          // 委托方
          two: {
            visible: false,
            props: {
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          },
          // 物料
          three: {
            visible: false,
            props: {
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          }
        },
        btnDisabledStatus: {
          // 物料新增按钮
          disabledInsert: true,
          disabledUpdate: true,
          disabledDelete: true
        },
        // 页面保存按钮
        btnPageDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true
        },
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        // pop的check内容
        rules: {
          // 业务板块
          code: [
            { required: true, message: '请输入放货指令编号', trigger: 'change' }
          ]
        },
        selection: [],
        dialogStatus: this.editStatus
      }
    }
  },
  computed: {
    // 判断是否是中林环境
    isZhongLin () {
      const href = window.location.href
      if (href.indexOf('shyiyuanth') !== -1 || href.indexOf('172.21.1.249') !== -1 || href.indexOf('localhost') !== -1) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {
    'dataJson.tempJson': {
      handler (newVal, oldVal) {
        this.settings.btnPageDisabledStatus.disabledInsert = false
        this.settings.btnPageDisabledStatus.disabledUpdate = false
      },
      deep: true
    }

  },
  created () {
    this.init()
    // 初始化货主
    this.getOwnerData()
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
  },
  methods: {
    // // 初始化处理
    init () {
      switch (this.editStatus) {
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          break
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
      }
      this.settings.loading = false

      // 计算物料明细表格高度，分辨率不一致保持始终固定在底部
      this.settings.tableHeight = document.body.clientHeight - 585
    },
    // 查看时的初始化
    initViewModel () {
      this.getData()
    },
    // 新增时初始化
    initInsertModel () {
      this.settings.btnShowStatus.showInsert = true
    },
    initUpdateModel () {
      this.dataJson.tempJson = this.data
      this.settings.btnShowStatus.showUpdate = true
      this.getData()
    },

    // 取消按钮
    handleCancel () {
      this.$emit('emitReturn')
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        console.log(response.data)
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 修改 放货指令类型
    handleOrderTypeChange (val, selectedData) {
      this.dataJson.tempJson.type_name = selectedData.name
    },
    // 修改 放货业务指令类型
    handleOrderBusinessTypeChange (val, selectedData) {
      this.dataJson.tempJson.business_type_name = selectedData.name
    },
    // 业务板块选择
    handleBusinessChange (id, value) {
      this.dataJson.tempJson.business_plate_name = value.name
    },
    // 选择销售单号 打开页面
    handleOutOrderDialog () {
      this.settings.popSettings.one.visible = true
    },
    // 销售订单关闭页面 取消
    handleOutOrderCancel () {
      this.settings.popSettings.one.visible = false
    },
    // 销售订单关闭页面 确认
    handleOutOrderCloseOk (val) {
      this.settings.popSettings.one.visible = false
      this.dataJson.tempJson.order_code = val.order_no
      this.dataJson.tempJson.contract_code = val.contract_no
      this.dataJson.tempJson.customer_name = val.customer_name
    },
    // 打开委托方选择页面
    handleConsignorDialog () {
      this.settings.popSettings.two.visible = true
    },
    // 关闭 委托方选择页面
    handleConsignorCloseCancel () {
      this.settings.popSettings.two.visible = false
    },
    // 关闭委托方选择页面, 确认
    handleConsignorCloseOk (val) {
      this.settings.popSettings.two.visible = false
      this.dataJson.tempJson.consignor_name = val.name
      this.dataJson.tempJson.consignor_code = val.code
    },
    // 选择货主
    selectOwner (val) {
      const name = val
      var owner = this.dataJson.ownerComboList.find((item) => {
        return item.name === name
      })
      this.dataJson.tempJson.owner_id = owner.id
      this.dataJson.tempJson.owner_code = owner.code
      this.dataJson.tempJson.owner_name = owner.name
    },
    // 查询货主
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
    },
    // 物料新增
    handleGoodsInsert () {
      this.settings.popSettings.three.visible = true
      this.settings.popSettings.three.dialogStatus = this.PARAMETERS.STATUS_INSERT
    },
    // 物料新增 取消
    handleGoodsEditCancel () {
      this.settings.popSettings.three.visible = false
    },
    // 物料新增, 确定
    handleGoodsEditOk (val) {
      this.settings.popSettings.three.visible = false
      if (val.edit_status === this.PARAMETERS.STATUS_INSERT) {
        // 校验是否有相同的物料
        for (let i = 0; i < this.dataJson.tempJson.detailList.length; i++) {
          if (this.dataJson.tempJson.detailList[i].commodity_spec === val.data.commodity_spec) {
            this.showErrorMsg('不可添加两条相同的商品')
            return
          }
        }
        this.dataJson.tempJson.detailList.push(val.data)
      } else if (val.edit_status === this.PARAMETERS.STATUS_UPDATE) {
        if (this.dataJson.tempJson.detailList.length) {
          for (let i = 0; i < this.dataJson.tempJson.detailList.length; i++) {
            if (val.data.index !== i) {
              if (this.dataJson.tempJson.detailList[i].commodity_spec === val.data.commodity_spec) {
                this.showErrorMsg('不可添加两条相同的商品')
                return
              }
            }
          }
        }
        this.dataJson.tempJson.detailList.splice(val.data.index, 1, val.data)
      }
      // 排序
      for (let i = 0; i < this.dataJson.tempJson.detailList.length; i++) {
        this.$set(this.dataJson.tempJson.detailList[i], 'no', i + 1)
      }
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.settings.btnDisabledStatus.disabledDelete = false
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.tempJson.detailList.lastIndexOf(row)
      return _index
    },
    // 编辑
    handleGoodsUpdate () {
      this.settings.popSettings.three.visible = true
      this.settings.popSettings.three.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.settings.popSettings.three.data = this.dataJson.currentJson
    },
    // 删除
    handleGoodsDelete () {
      this.dataJson.tempJson.detailList.splice(this.dataJson.rowIndex, 1)
    },
    // 新增
    doInsert () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          if (this.dataJson.tempJson.detailList === null || !this.dataJson.tempJson.detailList.length) {
            this.showErrorMsg('请添加商品')
            return
          }
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData).then((_data) => {
            this.$emit('emitReturn', { return_flag: true, data: _data })
          }, (_error) => {
            // this.$emit('emitReturn', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 新增
    doUpdate () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          if (this.dataJson.tempJson.detailList === null || !this.dataJson.tempJson.detailList.length) {
            this.showErrorMsg('请添加商品')
            return
          }
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData).then((_data) => {
            this.$emit('emitReturn', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('emitReturn', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    }

  }

}
</script>
