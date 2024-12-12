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
          title="基本信息"
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

          <el-descriptions-item label="物流单号">
            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}
          </el-descriptions-item>

          <el-descriptions-item label="状态">
            {{ dataJson.tempJson.status_name == null?'制单': dataJson.tempJson.status_name }}
          </el-descriptions-item>

          <el-descriptions-item label="单据类型">
            {{ dataJson.tempJson.type_name == null?'物流直达': dataJson.tempJson.type_name }}
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              承运合同号
            </div>
            <el-form-item
              prop="waybill_contract_no"
              label-width="0"
            >
              <!--              <el-input-->
              <!--                v-model.trim="dataJson.tempJson.waybill_contract_no"-->
              <!--                clearable-->
              <!--                show-word-limit-->
              <!--                :maxlength="dataJson.inputSettings.maxLength.waybill_contract_no"-->
              <!--                :placeholder="isPlaceholderShow('请输入')"-->
              <!--                :disabled="isViewModel"-->
              <!--              />-->
              <input-search
                v-model.trim="dataJson.tempJson.waybill_contract_no"
                :disabled="isViewModel"
                @onInputSearch="handleCarriageOrderDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="承运订单号">
            {{ dataJson.tempJson.carriage_order_no == null?'': dataJson.tempJson.carriage_order_no }}
          </el-descriptions-item>

          <el-descriptions-item label="承运商">
            <el-form-item
              prop="customer_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.customer_name"
                :disabled="true"
                @onInputSearch="handleCustomerDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="派车数">
            {{ dataJson.tempJson.monitor_count == null ? '0' : dataJson.tempJson.monitor_count }}
          </el-descriptions-item>
          <el-descriptions-item label="在途数量">
            {{ dataJson.tempJson.in_transit == null ? '0.00' : formatNumber(dataJson.tempJson.in_transit, true, 4) }}
          </el-descriptions-item>
          <el-descriptions-item />
        </el-descriptions>
        <br>

        <br>
        <el-alert
          title="收货信息"
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
            <div
              slot="label"
              class="required-mark"
            >
              类型
            </div>
            <el-form-item
              prop="in_type"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.in_type"
                :para="CONSTANTS.DICT_MONITOR_TYPE_IN"
                :filter-para="['1']"
                init-placeholder="请选择单据类型"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="货主">
            <el-form-item
              prop="in_owner_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.in_owner_name"
                :disabled="true"
                @onInputSearch="handleInOwnerDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="委托方">
            <el-form-item
              prop="in_consignor_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.in_consignor_name"
                :disabled="true"
                @onInputSearch="handleInConsignorDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="收货地">
            <el-form-item
              prop="in_warehouse_name"
              label-width="0"
            >
              <!-- <input-search
                v-model.trim="dataJson.tempJson.in_warehouse_name"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleInWarehouseDialog"
              /> -->
              <select-warehouse
                v-if="(isUpdateModel && !settings.inPlanStatus) || (isInsertModel && !settings.inPlanStatus)"
                v-model.trim="dataJson.tempJson.in_warehouse_name"
                placement="left"
                :warehouse1="dataJson.tempJson.in_warehouse_id"
                :disabled="true"
                :reset="settings.inWarehouseReset"
                @onReturnData="handleWarehouseInReturnData"
              />
              <span v-if="isViewModel || !((isUpdateModel && !settings.inPlanStatus) || (isInsertModel && !settings.inPlanStatus))">
                {{ dataJson.tempJson.in_warehouse_name }}
              </span>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="仓库类型">
            {{ dataJson.tempJson.in_warehouse_type_name == null?'-':dataJson.tempJson.in_warehouse_type_name }}
          </el-descriptions-item>

          <el-descriptions-item label="详细地址">
            <el-input
              v-model.trim="dataJson.tempJson.in_warehouse_address"
              clearable
              show-word-limit
              :maxlength="dataJson.inputSettings.maxLength.in_warehouse_address"
              :placeholder="isPlaceholderShow('请输入')"
              :disabled="isViewModel"
            />
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入库计划单号</div>
            <input-search
              v-model.trim="dataJson.tempJson.in_plan_code"
              :disabled="isViewModel"
              @onInputSearch="handleInPlanDialog"
            />
          </el-descriptions-item>
          <el-descriptions-item label="收货执行情况">
            {{ dataJson.tempJson.in_rate == null?'0.00%': dataJson.tempJson.in_rate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入库计划生成方式
            </div>
            <radio-dict
              v-model="dataJson.tempJson.in_rule"
              :filter-para="['0']"
              :para="CONSTANTS.DICT_B_LOGISTICS_IN_RULE"
              @change="handleInRuleChange"
            />
          </el-descriptions-item>
          <el-descriptions-item label="应收货数量">
            {{ dataJson.tempJson.in_schedule_qty == null ? '0.00': formatNumber(dataJson.tempJson.in_schedule_qty, true, 4) }}
          </el-descriptions-item>

          <el-descriptions-item label="已收货数量">
            {{ dataJson.tempJson.in_operated_qty == null ? '0.00': formatNumber(dataJson.tempJson.in_operated_qty, true, 4) }}
          </el-descriptions-item>
          <el-descriptions-item label="待收货数量">
            {{ dataJson.tempJson.in_balance_qty == null ? '0.00': formatNumber(dataJson.tempJson.in_balance_qty, true, 4) }}
          </el-descriptions-item>

          <el-descriptions-item label="超收数量">
            {{ dataJson.tempJson.in_over_qty == null ? '0.00': formatNumber(dataJson.tempJson.in_over_qty, true, 4) }}
          </el-descriptions-item>

          <el-descriptions-item label="入库单位">
            {{ dataJson.tempJson.in_unit == null ? '吨' : dataJson.tempJson.in_unit == null }}
          </el-descriptions-item>
          <el-descriptions-item label="采购合同编号">
            {{ dataJson.tempJson.in_contract_no }}
          </el-descriptions-item>

        </el-descriptions>

        <br>
        <el-alert
          title="发货信息"
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
            <div
              slot="label"
              class="required-mark"
            >
              类型
            </div>
            <el-form-item
              prop="out_type"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.out_type"
                :filter-para="['1']"
                :para="CONSTANTS.DICT_MONITOR_TYPE_OUT"
                init-placeholder="请选择单据类型"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="货主">
            <el-form-item
              prop="out_owner_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.out_owner_name"
                :disabled="true"
                @onInputSearch="handleOutOwnerDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="委托方">
            <el-form-item
              prop="out_consignor_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.out_consignor_name"
                :disabled="true"
                @onInputSearch="handleOutConsignorDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="发货地">
            <el-form-item
              prop="out_warehouse_name"
              label-width="0"
            >
              <select-warehouse
                v-if="(isUpdateModel && !settings.outPlanStatus) || (isInsertModel && !settings.outPlanStatus)"
                v-model.trim="dataJson.tempJson.out_warehouse_name"
                placement="left"
                :warehouse1="dataJson.tempJson.out_warehouse_id"
                :disabled="true"
                @onReturnData="handleWarehouseOutReturnData"
              />
              <span v-if="isViewModel || !((isUpdateModel && !settings.outPlanStatus) || (isInsertModel && !settings.outPlanStatus))">
                {{ dataJson.tempJson.out_warehouse_name }}
              </span>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="仓库类型">
            {{ dataJson.tempJson.out_warehouse_type_name == null?'-':dataJson.tempJson.out_warehouse_type_name }}
          </el-descriptions-item>

          <el-descriptions-item label="详细地址">
            <el-input
              v-model.trim="dataJson.tempJson.out_warehouse_address"
              clearable
              show-word-limit
              :maxlength="dataJson.inputSettings.maxLength.out_warehouse_address"
              :placeholder="isPlaceholderShow('请输入')"
              :disabled="isViewModel"
            />

          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              出库计划单号
            </div>
            <input-search
              v-model.trim="dataJson.tempJson.out_plan_code"
              :disabled="isViewModel"
              @onInputSearch="handleOutPlanDialog"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              发货执行情况
            </div>
            {{ dataJson.tempJson.out_rate == null?'0.00%' : dataJson.tempJson.out_rate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              出库计划生成方式
            </div>
            <radio-dict
              v-model="dataJson.tempJson.out_rule"
              :filter-para="['0']"
              :para="CONSTANTS.DICT_B_LOGISTICS_OUT_RULE"
              @change="handleRuleDictChange"
            />
          </el-descriptions-item>

          <el-descriptions-item label="应发货数量">
            {{ dataJson.tempJson.out_schedule_qty == null ? '0.00': formatNumber(dataJson.tempJson.out_schedule_qty, true, 4) }}
          </el-descriptions-item>

          <el-descriptions-item label="已发货数量">
            {{ dataJson.tempJson.out_operated_qty == null ? '0.00': formatNumber(dataJson.tempJson.out_operated_qty, true, 4) }}
          </el-descriptions-item>

          <el-descriptions-item label="待发货数量">
            {{ dataJson.tempJson.out_balance_qty == null ? '0.00': formatNumber(dataJson.tempJson.out_balance_qty, true, 4) }}
          </el-descriptions-item>

          <el-descriptions-item label="超发数量">
            {{ dataJson.tempJson.out_over_qty == null ? '0.00': formatNumber(dataJson.tempJson.out_over_qty, true, 4) }}
          </el-descriptions-item>

          <el-descriptions-item label="出库单位">
            {{ dataJson.tempJson.out_unit == null ? '吨' : dataJson.tempJson.out_unit == null }}
          </el-descriptions-item>

          <el-descriptions-item label="销售合同编号">
            {{ dataJson.tempJson.out_contract_no }}
          </el-descriptions-item>

        </el-descriptions>

        <br>
        <el-alert
          title="商品明细"
          type="info"
          :closable="false"
        />
        <br>

        <el-button-group v-if="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate">
          <el-button
            :disabled="!settings.topBtnShowStatus.showUpdate"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleGoodsEdit"
          >编辑</el-button>

          <!-- <el-button
            v-show="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
            :disabled="!settings.topBtnShowStatus.showUpdate"
            type="primary"
            icon="el-icon-circle-close"
            :loading="settings.loading"
            @click="handleGoodsDelete"
          >删除</el-button> -->
        </el-button-group>
        <el-table
          ref="multipleTable"
          v-loading="settings.loading"
          :data="dataJson.tempJson.detailListData"
          :element-loading-text="'正在拼命加载中...'"
          element-loading-background="rgba(255, 255, 255, 0.5)"
          :height="settings.tableHeight"
          :set-column-size="false"
          columns_index_key="false"
          stripe
          fit
          border
          highlight-current-row
          :default-sort="{prop: 'u_time', order: 'descending'}"
          style="width: 100%"
          @row-click="handleRowClick"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            type="index"
            width="45"
            label="No"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="goods_code"
            label="物料编码"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="sku_name"
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
            min-width="150"
            prop="sku_code"
            label="规格编号"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop="num"
            label="合同数量"
            align="right"
          >
            <template v-slot="scope">
              {{ scope.row.num == null? '-': formatNumber(scope.row.num) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            min-width="50"
            prop="unit_name"
            label="单位"
          />
          <!-- <el-table-column
            show-overflow-tooltip
            min-width="100"
            prop=""
            align="right"
            label="可调度数量"
          >
            <template v-slot="scope">
              {{ 0 >= dataJson.schedule_qty ? 0.00: formatNumber(dataJson.schedule_qty, true, 4) }}
            </template>
          </el-table-column> -->
          <el-table-column
            min-width="100"
            label="运输数量"
            :auto-fit="true"
            align="right"
            prop="actual_count"
          >
            <template v-slot="scope">
              {{ scope.row.actual_count == null? '-': formatNumber(scope.row.actual_count) }}
            </template>
          </el-table-column>

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
        v-show="settings.btnShowStatus.showUpdate"
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

    <out-consignor-dialog
      v-if="popSettingsData.searchDialogDataOne.visible"
      :visible="popSettingsData.searchDialogDataOne.visible"
      :title="popSettingsData.searchDialogDataOne.title"
      @closeMeOk="handleOutConsignorCloseOk"
      @closeMeCancel="handleOutConsignorCloseCancel"
    />
    <out-owner-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      :title="popSettingsData.searchDialogDataOne.title"
      @closeMeOk="handleOutOwnerCloseOk"
      @closeMeCancel="handleOutOwnerCloseCancel"
    />
    <in-consignor-dialog
      v-if="popSettingsData.searchDialogDataThree.visible"
      :visible="popSettingsData.searchDialogDataThree.visible"
      :title="popSettingsData.searchDialogDataOne.title"
      @closeMeOk="handleInConsignorCloseOk"
      @closeMeCancel="handleInConsignorCloseCancel"
    />
    <in-owner-dialog
      v-if="popSettingsData.searchDialogDataFour.visible"
      :visible="popSettingsData.searchDialogDataFour.visible"
      :title="popSettingsData.searchDialogDataOne.title"
      @closeMeOk="handleInOwnerCloseOk"
      @closeMeCancel="handleInOwnerCloseCancel"
    />

    <spec-dialog
      v-if="popSettingsData.searchDialogDataFive.visible"
      :visible="popSettingsData.searchDialogDataFive.visible"
      @closeMeOk="handleSpecCloseOk"
      @closeMeCancel="handleSpecCloseCancel"
    />

    <out-warehouse-dialog
      v-if="popSettingsData.searchDialogDataSix.visible"
      :visible="popSettingsData.searchDialogDataSix.visible"
      @closeMeOk="handleOutWarehouseCloseOk"
      @closeMeCancel="handleOutWarehouseCloseCancel"
    />
    <in-warehouse-dialog
      v-if="popSettingsData.searchDialogDataSeven.visible"
      :visible="popSettingsData.searchDialogDataSeven.visible"
      @closeMeOk="handleInWarehouseCloseOk"
      @closeMeCancel="handleInWarehouseCloseCancel"
    />

    <order-dialog
      v-if="popSettingsData.searchDialogDataEight.visible"
      :title="popSettingsData.searchDialogDataEight.title"
      :visible="popSettingsData.searchDialogDataEight.visible"
      :data="popSettingsData.searchDialogDataEight.data"
      @closeMeOk="handleOrderCloseOk"
      @closeMeCancel="handleOrderCloseCancel"
    />

    <outplan-dialog
      v-if="popSettingsData.searchDialogDataNine.visible"
      :data="dataJson.searchForm"
      :title="popSettingsData.searchDialogDataNine.title"
      :visible="popSettingsData.searchDialogDataNine.visible"
      @closeMeOk="handleOutPlanCloseOk"
      @closeMeCancel="handleOutPlanCloseCancel"
    />

    <goods-dialog
      v-if="popSettingsData.goodsDialog.visible"
      :dialog-status="popSettingsData.goodsDialog.dialogStatus"
      :title="popSettingsData.goodsDialog.title"
      :visible="popSettingsData.goodsDialog.visible"
      :data="popSettingsData.goodsDialog.data"
      @closeMeOk="handleGoodsCloseOk"
      @closeMeCancel="handleGoodsCloseCancel"
    />

    <customer-dialog
      v-if="popSettingsData.searchDialogDataTen.visible"
      :visible="popSettingsData.searchDialogDataTen.visible"
      :title="popSettingsData.searchDialogDataTen.title"
      @closeMeOk="handleCustomerCloseOk"
      @closeMeCancel="handleCustomerCloseCancel"
    />

    <CarriageOrder
      v-if="popSettingsData.searchDialogDataEleven.visible"
      :visible="popSettingsData.searchDialogDataEleven.visible"
      @closeMeOk="handleCarriageCloseOk"
      @closeMeCancel="handleCarriageCloseCancel"
    />

    <in-plan-dialog
      v-if="popSettingsData.searchDialogDataTwelve.visible"
      :title="popSettingsData.searchDialogDataTwelve.title"
      :search-data="popSettingsData.searchDialogDataTwelve.data"
      :visible="popSettingsData.searchDialogDataTwelve.visible"
      @closeMeOk="handleInPlanCloseOk"
      @closeMeCancel="handleInPlanCloseCancel"
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
</style>

<script>
import InputSearch from '@/components/40_input/inputSearch'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getApi, getScheduleQtyApi, insert3Api, updateApi3 } from '@/api/40_business/logistics/logistics'
import { getListApi } from '@/api/30_wms/owner/owner'
import { getListApi1 } from '@/api/30_wms/customer/customer'
import inConsignorDialog from '@/views/30_wms/customer/dialog/dialog'
import inOwnerDialog from '@/views/30_wms/owner/dialog/dialog'
import outConsignorDialog from '@/views/30_wms/customer/dialog/dialog'
import outOwnerDialog from '@/views/30_wms/owner/dialog/dialog'
import orderDialog from '@/views/40_business/logistics/tabs/dialog/order/dialog/dialog'
import specDialog from '@/views/30_wms/spec/dialog/dialog'
import inWarehouseDialog from '@/views/30_wms/warehouse/dialog/dialog'
import outWarehouseDialog from '@/views/30_wms/warehouse/dialog/dialog'
import outplanDialog from '@/views/40_business/outplan/dialog/dialog'
import InPlanDialog from '@/views/40_business/inplan/dialog/dialog'
import SelectDict from '@/components/00_dict/select/SelectDict'
import RadioDict from '@/components/00_dict/redio'
import goodsDialog from '@/views/40_business/logistics/tabs/dialog/goodsEdit'
import customerDialog from '@/views/30_wms/customer/dialog/dialog'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin'
import CarriageOrder from '@/views/40_business/carriageorder/dialog/dialog.vue'

export default {
  components: { customerDialog, goodsDialog, outplanDialog, RadioDict, SelectDict, InputSearch, inWarehouseDialog, outWarehouseDialog, orderDialog, inConsignorDialog, inOwnerDialog, outConsignorDialog, outOwnerDialog, specDialog, SelectWarehouse, CarriageOrder, InPlanDialog },
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
      detailListData: [],
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
      fileLabelStyle: {
        width: '2.3%',
        'text-align': 'right'
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        searchDialogDataOne: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          },
          title: '委托方'
        },
        searchDialogDataTwo: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          },
          title: '货主'
        },
        searchDialogDataThree: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          },
          title: '委托方'
        },
        searchDialogDataFour: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          },
          title: '货主'
        },
        searchDialogDataFive: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        searchDialogDataSix: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        searchDialogDataSeven: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        searchDialogDataEight: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        searchDialogDataNine: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        searchDialogDataTen: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        searchDialogDataEleven: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        searchDialogDataTwelve: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的商品查询框参数设置
        goodsDialog: {
          // 弹出框显示参数
          visible: false,
          data: {
            // 可用库存
            schedule_qty: 0
          },
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        }
      },
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 查询条件
          status: this.CONSTANTS.DICT_B_OUT_PLAN_STATUS_TG,
          type: this.CONSTANTS.DICT_B_OUT_PLAN_TYPE_ZC
        },
        searchZLOwner: {
          name: null,
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION)
        },
        // 查询可用库存参数
        searchScheduleForm: {
          // 查询条件
          out_owner_id: null,
          out_warehouse_id: null,
          sku_id: null
        },
        // 可用库存量
        schedule_qty: 0,
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          contract_no: '',
          out_rule: '1',
          in_rule: '1',
          out_owner_name: '',
          out_consignor_name: '',
          out_warehouse_name: '',
          in_type: '0',
          out_type: '0',
          in_owner_name: '',
          in_consignor_name: '',
          in_warehouse_name: '',
          out_warehouse_address: '',
          in_warehouse_address: '',
          customer_name: '',
          out_warehouse_id: null,
          out_owner_id: null,
          sku_id: null,
          carriage_contract_code: null
        },
        // 单条数据 json
        tempJson: {
          contract_no: '',
          out_rule: '1',
          in_rule: '1',
          out_owner_name: '',
          out_consignor_name: '',
          out_warehouse_name: '',
          out_schedule_qty: 0,
          in_type: '0',
          out_type: '0',
          in_owner_name: '',
          in_consignor_name: '',
          in_warehouse_name: '',
          out_warehouse_address: '',
          in_warehouse_address: '',
          customer_name: '',
          out_warehouse_id: null,
          out_owner_id: null,
          sku_id: null,
          carriage_contract_code: null,
          in_contract_no: null,
          out_contract_no: null
        },
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
        // 是否是中林环境
        isZhongLinEnvironment: false
      },
      // 页面设置json
      settings: {
        outRuleStatus: false,
        inRuleStatus: false,
        outPlanStatus: false,
        inPlanStatus: false,
        inWarehouseReset: false,
        // loading 状态
        loading: true,
        tableHeight: 500,
        duration: 4000,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        topBtnShowStatus: {
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
        dialogStatus: this.editStatus,
        // pop的check内容
        rules: {

          out_type: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          out_owner_name: [
            { required: true, message: '请选择货主', trigger: 'change' }
          ],
          out_consignor_name: [
            { required: true, message: '请输选择委托方', trigger: 'change' }
          ],
          out_warehouse_name: [
            { required: true, message: '请输选择发货地', trigger: 'change' }
          ],
          in_type: [
            { required: true, message: '请选择收货类型', trigger: 'change' }
          ],
          in_owner_name: [
            { required: true, message: '请输选择货主', trigger: 'change' }
          ],
          in_consignor_name: [
            { required: true, message: '请输选择委托方', trigger: 'change' }
          ],
          in_warehouse_name: [
            { required: true, message: '请输选择收货地', trigger: 'change' }
          ],
          customer_name: [
            { required: true, message: '请输选择承运商', trigger: 'change' }
          ],
          waybill_contract_no: [
            // { required: true, message: '请输入物流合同号', trigger: 'change' }
            { validator: this.waybill_contract_no_validator, trigger: 'change' }

          ]
        }
      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_UPDATE) {
        return true
      } else {
        return false
      }
    },
    // 是否为新增
    isInsertModel () {
      if (
        this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT) {
        return true
      } else {
        return false
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
    },
    // 监听 order_id 查询可用库存
    bindModel () {
      const { order_id } = this.dataJson.tempJson
      return {
        order_id
      }
    }
  },
  // 监听器
  watch: {
    // 监听查询可用库存
    bindModel: {
      handler (newVal) {
        console.log(newVal)
        if (newVal.order_id !== null) {
          this.dataJson.searchScheduleForm.order_id = newVal.order_id
          // 查询可用库存
          this.getScheduleQty()
        }
      }
    }
  },
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
      // this.dataJson.tempJson = this.data
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.editStatus) {
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
    // 弹出框设置初始化
    initDialogStatus () {
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
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
      // 新增时中林时代环境默认选中 '中林时代控股有限公司'
      const href = window.location.href
      if (href.indexOf('shyiyuanth') !== -1) {
        this.getZLOwnerData()
        this.getZLCustomer()
        this.dataJson.isZhongLinEnvironment = true
      }
      // this.getZLOwnerData()
      // this.getZLCustomer()
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
      // this.dataJson.tempJson = deepCopy(this.data)

      // this.dataJson.tempJsonOriginal.out_plan_code = deepCopy(this.data.out_plan_code)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
      this.initViewModel()
    },
    // 查看时的初始化
    initViewModel () {
      // 给 收货地 和 发货地赋值
      this.dataJson.tempJson.out_warehouse_id = this.data.out_warehouse_id
      this.dataJson.tempJson.in_warehouse_id = this.data.in_warehouse_id
      // 数据初始化
      this.getData()
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

          if (this.dataJson.tempJson.out_type === this.CONSTANTS.DICT_MONITOR_TYPE_OUT_ONE) {
            this.settings.outRuleStatus = true
          } else {
            this.settings.outRuleStatus = false
          }
          if (this.dataJson.tempJson.in_type === this.CONSTANTS.DICT_MONITOR_TYPE_IN_ONE) {
            this.settings.inRuleStatus = true
          } else {
            this.settings.inRuleStatus = false
          }
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
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          if (this.dataJson.tempJson.detailListData.length > 1) {
            this.showErrorMsg('只能保留一条商品明细')
            return
          }
          if (this.dataJson.tempJson.detailListData[0].actual_count === undefined || this.dataJson.tempJson.detailListData[0].actual_count === null || this.dataJson.tempJson.detailListData[0].actual_count <= 0) {
            this.showErrorMsg('请输入运输数量')
            return
          }
          // if (this.dataJson.tempJson.detailListData[0].actual_count > this.dataJson.schedule_qty) {
          //   this.showErrorMsg('运输数量不能大于可调度数量')
          //   return
          // }
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.sku_id = this.dataJson.tempJson.detailListData[0].sku_id
          tempData.sku_code = this.dataJson.tempJson.detailListData[0].sku_code
          tempData.goods_code = this.dataJson.tempJson.detailListData[0].goods_code
          tempData.actual_count = this.dataJson.tempJson.detailListData[0].actual_count
          tempData.in_unit_id = this.dataJson.tempJson.detailListData[0].unit_id
          tempData.out_unit_id = this.dataJson.tempJson.detailListData[0].unit_id
          tempData.transport_type = '0' // 公路运输
          this.settings.loading = true
          insert3Api(tempData)
            .then(
              _data => {
                // this.$emit('closeMeOk', { return_flag: true, data: _data })
                this.$notify({
                  title: '新增处理成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })

                const operate_tab_data = {
                  // data: tempData
                  data: _data.data,
                  editStatus: this.PARAMETERS.STATUS_INSERT
                }

                this.$emit('emitReturn', operate_tab_data)
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

            })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          if (this.dataJson.tempJson.detailListData.length > 1) {
            this.showErrorMsg('只能保留一条商品明细')
            return
          }
          if (this.dataJson.tempJson.detailListData[0].actual_count === null || this.dataJson.tempJson.detailListData[0].actual_count <= 0) {
            this.showErrorMsg('请输入运输数量')
            return
          }
          // if (this.dataJson.tempJson.detailListData[0].actual_count > this.dataJson.schedule_qty) {
          //   this.showErrorMsg('运输数量不能大于可调度数量')
          //   return
          // }
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.sku_id = this.dataJson.tempJson.detailListData[0].sku_id
          tempData.sku_code = this.dataJson.tempJson.detailListData[0].sku_code
          tempData.goods_code = this.dataJson.tempJson.detailListData[0].goods_code
          tempData.actual_count = this.dataJson.tempJson.detailListData[0].actual_count
          tempData.in_unit_id = this.dataJson.tempJson.detailListData[0].unit_id
          tempData.out_unit_id = this.dataJson.tempJson.detailListData[0].unit_id
          tempData.transport_type = '0' // 公路运输
          this.settings.loading = true
          updateApi3(tempData)
            .then(
              _data => {
                // this.dataJson.tempJson = deepCopy(_data.data)
                // this.$emit('closeMeOk', { return_flag: true, data: _data })
                this.$notify({
                  title: '更新成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })

                const operate_tab_data = {
                  data: _data.data,
                  editStatus: this.PARAMETERS.STATUS_UPDATE
                }

                this.$emit('emitReturn', operate_tab_data)
              },
              _error => {
                // this.$emit('closeMeOk', { return_flag: false, error: _error })
                this.$notify({
                  title: '更新失败',
                  message: _error.error.message,
                  type: 'error',
                  duration: this.settings.duration
                })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    // 发货委托方
    handleOutConsignorDialog () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    // 发货委托方：关闭对话框：确定
    handleOutConsignorCloseOk (val) {
      this.popSettingsData.searchDialogDataOne.selectedDataJson = val
      this.dataJson.tempJson.out_consignor_name = val.name
      this.dataJson.tempJson.out_consignor_id = val.id
      this.dataJson.tempJson.out_consignor_code = val.code
      this.popSettingsData.searchDialogDataOne.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 发货委托方：关闭对话框：取消
    handleOutConsignorCloseCancel () {
      this.popSettingsData.searchDialogDataOne.visible = false
    },
    // 收委托方
    handleInConsignorDialog () {
      this.popSettingsData.searchDialogDataThree.visible = true
    },
    // 收货委托方：关闭对话框：确定
    handleInConsignorCloseOk (val) {
      this.popSettingsData.searchDialogDataThree.selectedDataJson = val
      this.dataJson.tempJson.in_consignor_name = val.name
      this.dataJson.tempJson.in_consignor_id = val.id
      this.dataJson.tempJson.in_consignor_code = val.code
      this.popSettingsData.searchDialogDataThree.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 收货委托方：关闭对话框：取消
    handleInConsignorCloseCancel () {
      this.popSettingsData.searchDialogDataThree.visible = false
    },
    // 发货货主
    handleOutOwnerDialog () {
      this.popSettingsData.searchDialogDataTwo.visible = true
    },
    // 发货货主：关闭对话框：确定
    handleOutOwnerCloseOk (val) {
      this.popSettingsData.searchDialogDataTwo.selectedDataJson = val
      this.dataJson.tempJson.out_owner_name = val.name
      this.dataJson.tempJson.out_owner_id = val.id
      this.dataJson.tempJson.out_owner_code = val.code
      this.popSettingsData.searchDialogDataTwo.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 发货货主：关闭对话框：取消
    handleOutOwnerCloseCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
    },
    // 收货货主
    handleInOwnerDialog () {
      this.popSettingsData.searchDialogDataFour.visible = true
    },
    // 收货货主：关闭对话框：确定
    handleInOwnerCloseOk (val) {
      this.popSettingsData.searchDialogDataFour.selectedDataJson = val
      this.dataJson.tempJson.in_owner_name = val.name
      this.dataJson.tempJson.in_owner_id = val.id
      this.dataJson.tempJson.in_owner_code = val.code
      this.popSettingsData.searchDialogDataFour.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 收货货主：关闭对话框：取消
    handleInOwnerCloseCancel () {
      this.popSettingsData.searchDialogDataFour.visible = false
    },

    // 发货仓库
    handleOutWarehouseDialog () {
      this.popSettingsData.searchDialogDataSix.visible = true
    },
    // 发货仓库：关闭对话框：确定
    handleOutWarehouseCloseOk (val) {
      this.popSettingsData.searchDialogDataSix.selectedDataJson = val
      this.dataJson.tempJson.out_warehouse_name = val.name
      this.dataJson.tempJson.out_warehouse_type_name = val.warehouse_type_name
      this.dataJson.tempJson.out_warehouse_id = val.id
      this.dataJson.tempJson.out_warehouse_address = val.address
      this.popSettingsData.searchDialogDataSix.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 发货仓库：关闭对话框：取消
    handleOutWarehouseCloseCancel () {
      this.popSettingsData.searchDialogDataSix.visible = false
    },

    // 收货仓库
    handleInWarehouseDialog () {
      this.popSettingsData.searchDialogDataSeven.visible = true
    },
    // 收货仓库：关闭对话框：确定
    handleInWarehouseCloseOk (val) {
      this.popSettingsData.searchDialogDataSeven.selectedDataJson = val
      this.dataJson.tempJson.in_warehouse_name = val.name
      this.dataJson.tempJson.in_warehouse_type_name = val.warehouse_type_name
      this.dataJson.tempJson.in_warehouse_id = val.id
      this.dataJson.tempJson.in_warehouse_address = val.address
      this.popSettingsData.searchDialogDataSeven.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 收货仓库：关闭对话框：取消
    handleInWarehouseCloseCancel () {
      this.popSettingsData.searchDialogDataSeven.visible = false
    },

    // 规格
    handleSpecDialog () {
      this.popSettingsData.searchDialogDataFive.visible = true
    },
    // 规格：关闭对话框：确定
    handleSpecCloseOk (val) {
      this.popSettingsData.searchDialogDataFive.selectedDataJson = val
      this.popSettingsData.searchDialogDataFive.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.spec = val.spec
      this.dataJson.tempJson.spec_code = val.code
      this.dataJson.tempJson.sku_code = val.code
      this.dataJson.tempJson.pm = val.pm
      this.dataJson.tempJson.goods_name = val.name
    },
    // 规格：关闭对话框：取消
    handleSpecCloseCancel () {
      this.popSettingsData.searchDialogDataFive.visible = false
    },
    // 订单
    handleOrderDialog () {
      if (!this.dataJson.tempJson.waybill_contract_no) {
        this.showErrorMsg('请先选择承运订单')
        return
      }
      this.popSettingsData.searchDialogDataEight.title = '订单选择页面'
      this.popSettingsData.searchDialogDataEight.data = {
        sales_contract_code: this.dataJson.tempJson.sales_contract_code,
        type: 'b_schedule_order'
      }
      this.popSettingsData.searchDialogDataEight.visible = true
    },
    // 订单：关闭对话框：确定
    handleOrderCloseOk (val) {
      this.popSettingsData.searchDialogDataEight.selectedDataJson = val
      this.dataJson.tempJson.contract_no = val.contract_no
      this.dataJson.tempJson.order_no = val.order_no
      this.dataJson.tempJson.order_detail_no = val.order_detail_no
      this.dataJson.tempJson.order_customer_name = val.customer_name
      this.dataJson.tempJson.bill_type = val.bill_type
      this.dataJson.tempJson.bill_type_name = val.bill_type_name
      this.dataJson.tempJson.serial_type_name = val.serial_type_name
      this.dataJson.tempJson.supplier_name = val.supplier_name
      this.dataJson.tempJson.owner_name = val.owner_name
      this.dataJson.tempJson.contract_dt = val.contract_dt
      this.dataJson.tempJson.contract_num = val.contract_num
      this.dataJson.tempJson.num = val.num
      this.dataJson.tempJson.ship_name = val.ship_name
      this.dataJson.tempJson.order_id = val.id
      this.dataJson.tempJson.in_unit_id = val.unit_id
      this.dataJson.tempJson.out_unit_id = val.unit_id
      this.dataJson.tempJson.out_schedule_qty = val.num
      this.dataJson.tempJson.in_schedule_qty = val.num
      this.dataJson.tempJson.sku_id = val.sku_id
      val.sku_name = val.goods_name
      val.actual_count = val.num
      const tempData = []
      tempData.push(val)
      this.dataJson.tempJson.detailListData = tempData
      this.detailListData = tempData
      this.popSettingsData.searchDialogDataEight.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.settings.topBtnShowStatus.showUpdate = false
      if (val.serial_type === 'b_out_order') {
        this.dataJson.searchForm.contract_no = val.contract_no
      }

      this.dataJson.searchScheduleForm.order_id = val.id
      this.getScheduleQty()
    },
    // 订单：关闭对话框：取消
    handleOrderCloseCancel () {
      this.popSettingsData.searchDialogDataEight.visible = false
    },
    // 出库计划
    handleOutPlanDialog () {
      this.popSettingsData.searchDialogDataNine.visible = true
    },
    // 出计划：关闭对话框：确定
    handleOutPlanCloseOk (val) {
      this.dataJson.tempJson.out_plan_code = val.plan_code
      this.dataJson.tempJson.out_plan_id = val.plan_id
      this.dataJson.tempJson.out_plan_detail_id = val.id
      this.dataJson.tempJson.out_owner_id = val.owner_id
      this.dataJson.tempJson.out_owner_code = val.owner_code
      this.dataJson.tempJson.out_owner_name = val.owner_name
      this.dataJson.tempJson.out_consignor_name = val.consignor_name
      this.dataJson.tempJson.out_consignor_id = val.consignor_id
      this.dataJson.tempJson.out_warehouse_id = val.warehouse_id
      this.dataJson.tempJson.out_warehouse_name = val.warehouse_name
      this.dataJson.tempJson.out_warehouse_type_name = val.warehouse_type_name
      this.dataJson.tempJson.out_warehouse_address = val.address
      this.dataJson.tempJson.out_contract_no = val.contract_no

      this.popSettingsData.searchDialogDataNine.visible = false

      // var tempData = {}
      // tempData.sku_code = val.sku_code
      // tempData.sku_id = val.sku_id
      // tempData.sku_name = val.goods_name
      // tempData.pm = val.pm
      // tempData.spec = val.spec
      // tempData.num = val.contract_num
      // tempData.unit_name = val.unit_name
      // tempData.unit_id = val.unit_id
      // tempData.actual_count = val.count
      //
      // this.dataJson.tempJson.detailListData = []
      // this.dataJson.tempJson.detailListData.push(tempData)

      this.settings.topBtnShowStatus.showUpdate = false
    },
    // 出库计划：关闭对话框：取消
    handleOutPlanCloseCancel () {
      this.popSettingsData.searchDialogDataNine.visible = false
    },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    },
    handleWarehouseReturnData (val) {
      // 仓库
      this.dataJson.tempJson.warehouse_id = val.warehouse_id
      this.dataJson.tempJson.warehouse_name = val.warehouse_name
      this.$set(this.dataJson.tempJson, 'warehouse_name', val.warehouse_name)

      // 库区
      this.dataJson.tempJson.location_id = val.location_id
      this.dataJson.tempJson.location_name = val.location_name

      // 库位
      this.dataJson.tempJson.bin_id = val.id
      this.dataJson.tempJson.bin_name = val.name
    },
    handleRowClick (row) {
      this.popSettingsData.goodsDialog.rowIndex = this.getRowIndex(row)
      this.dataJson.currentJson = Object.assign({}, row) // copy obj

      if (this.dataJson.currentJson !== undefined) {
        this.settings.topBtnShowStatus.showUpdate = true
      } else {
        this.settings.topBtnShowStatus.showUpdate = false
      }
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.tempJson.detailListData.lastIndexOf(row)
      return _index
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson !== undefined) {
        this.settings.topBtnShowStatus.showUpdate = true
      } else {
        this.settings.topBtnShowStatus.showUpdate = false
      }
    },
    handleRuleDictChange (val) {
      this.dataJson.tempJson.out_rule = val
      if (val === this.CONSTANTS.DICT_B_LOGISTICS_OUT_RULE_0) {
        this.settings.outPlanStatus = false
        this.dataJson.tempJson.out_plan_code = ''
        this.dataJson.tempJson.out_plan_detail_id = null
        this.dataJson.tempJson.out_warehouse_id = null
        this.dataJson.tempJson.detailListData = this.detailListData
        // 清空仓库
        // this.dataJson.tempJson.out_warehouse_type_name = null
        // this.dataJson.tempJson.out_warehouse_name = null
        // this.dataJson.tempJson.warehouse_id = null
      } else {
        this.settings.outPlanStatus = true
      }
    },
    handleInRuleChange (val) {
      this.dataJson.tempJson.in_rule = val
      if (val === this.CONSTANTS.DICT_B_LOGISTICS_IN_RULE_0) {
        this.settings.inPlanStatus = false
      } else {
        this.settings.inPlanStatus = true
      }
    },
    // 商品数据编辑
    handleGoodsEdit () {
      if (this.dataJson.rowIndex === null) {
        this.showErrorMsg('请选择一条数据')
        return
      }

      // 编辑
      this.popSettingsData.goodsDialog.data = Object.assign({}, this.dataJson.currentJson)
      this.popSettingsData.goodsDialog.data.order_id = this.dataJson.tempJson.order_id
      // 赋值可调度库存
      this.popSettingsData.goodsDialog.data.schedule_qty = this.dataJson.schedule_qty

      this.popSettingsData.goodsDialog.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettingsData.goodsDialog.visible = true
    },
    // 商品数据删除
    handleGoodsDelete () {
      if (this.dataJson.rowIndex === null) {
        this.showErrorMsg('请选择一条数据')
        return
      }

      // 删除
      this.$confirm('是否确认删除该条数据', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        if (this.dataJson.tempJson.detailListData.length === 1) {
          this.showErrorMsg('至少需要保留一条商品明细')
          return
        }

        // 设置到table中绑定的json数据源
        this.dataJson.tempJson.detailListData.splice(this.dataJson.rowIndex, 1)
        this.dataJson.currentJson = null
        this.settings.topBtnShowStatus.showUpdate = false
      }).catch(action => {

      })
    },
    // 商品：关闭对话框：确定
    handleGoodsCloseOk (val) {
      val.data.id = null
      // val.data.spec_code = val.data.code

      switch (this.popSettingsData.goodsDialog.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.doInsertModelCallBack(val)
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.doUpdateModelCallBack(val)
          break
      }
    },
    // 商品：关闭对话框：取消
    handleGoodsCloseCancel () {
      this.popSettingsData.goodsDialog.visible = false
    },
    // 编辑回调
    doUpdateModelCallBack (val) {
      if (val.return_flag) {
        this.popSettingsData.goodsDialog.visible = false
        // 设置到table中绑定的json数据源
        this.dataJson.tempJson.detailListData.splice(this.popSettingsData.goodsDialog.rowIndex, 1, val.data)
        this.dataJson.tempJson.out_schedule_qty = this.dataJson.tempJson.detailListData[0].actual_count
        this.dataJson.tempJson.in_schedule_qty = this.dataJson.tempJson.detailListData[0].actual_count
        // 设置到currentjson中
        this.dataJson.currentJson = Object.assign({}, val.data.data)
        this.$notify({
          title: '更新处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '更新处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    },
    // 承运商
    handleCustomerDialog () {
      this.popSettingsData.searchDialogDataTen.visible = true
      this.popSettingsData.searchDialogDataTen.title = '承运商选择页面'
    },
    // 承运商：关闭对话框：确定
    handleCustomerCloseOk (val) {
      if (val.enable === false) {
        this.showErrorMsg('该承运商已禁用，请重新选择')
        return
      }
      this.popSettingsData.searchDialogDataTen.selectedDataJson = val
      this.dataJson.tempJson.customer_name = val.name
      this.dataJson.tempJson.customer_id = val.id
      this.dataJson.tempJson.customer_code = val.code
      this.popSettingsData.searchDialogDataTen.visible = false
      // this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 承运商：关闭对话框：取消
    handleCustomerCloseCancel () {
      this.popSettingsData.searchDialogDataTen.visible = false
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        const data = response.data

        var tempData = {}
        // tempData.sku_code = this.data.sku_code
        // tempData.sku_id = this.data.sku_id
        // tempData.sku_name = this.data.goods_name
        // tempData.pm = this.data.pm
        // tempData.spec = this.data.spec
        // tempData.num = this.data.contract_num
        // tempData.unit_name = '吨'
        // tempData.actual_count = this.data.out_schedule_qty
        tempData.sku_code = data.sku_code
        tempData.goods_code = data.goods_code
        tempData.sku_id = data.sku_id
        tempData.sku_name = data.goods_name
        tempData.pm = data.pm
        tempData.spec = data.spec
        tempData.num = data.contract_num
        tempData.unit_name = '吨'
        tempData.actual_count = data.out_schedule_qty
        tempData.unit_id = data.in_unit_id

        if (data.out_rule === this.CONSTANTS.DICT_B_LOGISTICS_OUT_RULE_1) {
          this.settings.outPlanStatus = true
        }

        if (data.in_rule === this.CONSTANTS.DICT_B_LOGISTICS_IN_RULE_1) {
          this.settings.inPlanStatus = true
        }

        this.dataJson.tempJson.detailListData = []
        this.dataJson.tempJson.detailListData.push(tempData)
        // 更新是切换备用
        this.detailListData = this.dataJson.tempJson.detailListData
      }).finally(() => {
        this.settings.loading = false
      })
    },
    getZLOwnerData () {
      this.dataJson.searchZLOwner.pageCondition.current = 1
      this.dataJson.searchZLOwner.pageCondition.size = 10
      this.dataJson.searchZLOwner.name = '中林时代控股有限公司'
      getListApi(this.dataJson.searchZLOwner).then(response => {
        let listData = []
        listData = response.data.records
        console.log(response.data.records)
        listData.forEach(item => {
          if (item.name === '中林时代控股有限公司') {
            // 发货方
            this.dataJson.tempJson.out_owner_name = item.name
            this.dataJson.tempJson.out_owner_id = item.id
            this.dataJson.tempJson.out_owner_code = item.code
            // 收货方
            this.dataJson.tempJson.in_owner_name = item.name
            this.dataJson.tempJson.in_owner_id = item.id
            this.dataJson.tempJson.in_owner_code = item.code
          }
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    getZLCustomer () {
      this.dataJson.searchZLOwner.pageCondition.current = 1
      this.dataJson.searchZLOwner.pageCondition.size = 10
      this.dataJson.searchZLOwner.name = '中林时代控股有限公司'
      getListApi1(this.dataJson.searchZLOwner).then(response => {
        let listData = []
        listData = response.data.records
        console.log(response.data.records)
        listData.forEach(item => {
          if (item.name === '中林时代控股有限公司') {
            // 发货方
            this.dataJson.tempJson.out_consignor_name = item.name
            this.dataJson.tempJson.out_consignor_id = item.id
            this.dataJson.tempJson.out_consignor_code = item.code
            // 收获方
            this.dataJson.tempJson.in_consignor_name = item.name
            this.dataJson.tempJson.in_consignor_id = item.id
            this.dataJson.tempJson.in_consignor_code = item.code
          }
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 查询可调度库存
    getScheduleQty () {
      getScheduleQtyApi(this.dataJson.searchScheduleForm).then(response => {
        if (response.data === null) {
          this.dataJson.schedule_qty = this.dataJson.tempJson.num
        } else {
          this.dataJson.schedule_qty = this.dataJson.tempJson.num - response.data
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 选择发货仓库
    handleWarehouseOutReturnData (val) {
      if (val !== null) {
        this.popSettingsData.searchDialogDataSix.selectedDataJson = val
        this.dataJson.tempJson.out_warehouse_name = val.warehouse_name
        this.dataJson.tempJson.out_warehouse_id = val.warehouse_id
        this.dataJson.tempJson.out_warehouse_type_name = val.warehouse_type_name
        this.dataJson.tempJson.out_warehouse_address = val.warehouse_address
        this.popSettingsData.searchDialogDataSix.visible = false
        this.settings.btnDisabledStatus.disabledUpdate = false
      }
    },
    // 选择仓库
    handleWarehouseInReturnData (val) {
      if (val !== null) {
        this.popSettingsData.searchDialogDataSeven.selectedDataJson = val
        this.dataJson.tempJson.in_warehouse_name = val.warehouse_name
        this.dataJson.tempJson.in_warehouse_id = val.warehouse_id
        this.dataJson.tempJson.in_warehouse_address = val.warehouse_address
        this.dataJson.tempJson.in_warehouse_type_name = val.warehouse_type_name
        this.popSettingsData.searchDialogDataSeven.visible = false
        this.settings.btnDisabledStatus.disabledUpdate = false
      }
    },
    // 承运订单 弹窗
    handleCarriageOrderDialog () {
      this.popSettingsData.searchDialogDataEleven.visible = true
    },
    // 承运订单 弹窗 关闭
    handleCarriageCloseCancel () {
      this.popSettingsData.searchDialogDataEleven.visible = false
    },
    // 承运订单 弹窗 完成
    handleCarriageCloseOk (val) {
      this.popSettingsData.searchDialogDataEleven.visible = false
      this.dataJson.tempJson.waybill_contract_no = val.carriage_contract_code
      this.dataJson.tempJson.carriage_order_id = val.id
      this.dataJson.tempJson.carriage_order_no = val.order_no
      this.dataJson.tempJson.sales_contract_code = val.sales_contract_code
      this.dataJson.tempJson.customer_name = val.company_name
      this.dataJson.tempJson.customer_id = val.company_id
      this.dataJson.tempJson.customer_code = val.company_code
    },
    // 承运订单校验
    waybill_contract_no_validator (rule, value, callback) {
      if (this.dataJson.tempJson.waybill_contract_no === null || this.dataJson.tempJson.waybill_contract_no === undefined ||
        this.dataJson.tempJson.waybill_contract_no === '') {
        callback(new Error('请选择承运订单'))
      } else {
        callback()
      }
    },
    // 入库计划
    handleInPlanDialog () {
      this.popSettingsData.searchDialogDataTwelve.data = {
        status: this.CONSTANTS.DICT_B_IN_PLAN_STATUS_TG,
        type: this.CONSTANTS.DICT_B_IN_PLAN_TYPE_TIH
      }
      this.popSettingsData.searchDialogDataTwelve.visible = true
    },
    // 入库计划 OK
    handleInPlanCloseOk (val) {
      this.dataJson.tempJson.in_plan_code = val.plan_code
      this.dataJson.tempJson.in_plan_id = val.plan_id
      this.dataJson.tempJson.in_plan_detail_id = val.id
      this.dataJson.tempJson.in_owner_id = val.owner_id
      this.dataJson.tempJson.in_owner_code = val.owner_code
      this.dataJson.tempJson.in_owner_name = val.owner_name
      this.dataJson.tempJson.in_consignor_name = val.consignor_name
      this.dataJson.tempJson.in_consignor_id = val.consignor_id
      this.dataJson.tempJson.in_warehouse_id = val.warehouse_id
      this.dataJson.tempJson.in_warehouse_name = val.warehouse_name
      this.dataJson.tempJson.in_warehouse_type_name = val.warehouse_type_name
      this.dataJson.tempJson.in_warehouse_address = val.address
      this.dataJson.tempJson.in_contract_no = val.contract_no

      // 赋值采购订单
      this.dataJson.tempJson.contract_no = val.contract_no
      this.dataJson.tempJson.order_id = val.main_order_id

      // 应收货数量 = 入库计划数量
      this.dataJson.tempJson.in_schedule_qty = val.count
      this.dataJson.tempJson.out_schedule_qty = val.count

      this.settings.inWarehouseReset = !this.settings.inWarehouseReset
      this.popSettingsData.searchDialogDataTwelve.visible = false

      var tempData = {}
      tempData.sku_code = val.sku_code
      tempData.goods_code = val.goods_code
      tempData.sku_id = val.sku_id
      tempData.sku_name = val.goods_name
      tempData.pm = val.pm
      tempData.spec = val.spec
      tempData.num = val.contract_num
      tempData.unit_name = val.unit_name
      tempData.unit_id = val.unit_id
      tempData.actual_count = val.count
      this.dataJson.tempJson.detailListData = []
      this.dataJson.tempJson.detailListData.push(tempData)
    },
    // 入库计划 取消
    handleInPlanCloseCancel () {
      this.popSettingsData.searchDialogDataTwelve.visible = false
    }
  }

}
</script>
