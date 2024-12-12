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
            {{ dataJson.tempJson.type_name == null?'物流调度': dataJson.tempJson.type_name }}
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              物流合同号
            </div>
            <el-form-item
              prop="waybill_contract_no"
              label-width="0"
            >
              <el-input
                v-model.trim="dataJson.tempJson.waybill_contract_no"
                clearable
                show-word-limit
                :maxlength="dataJson.inputSettings.maxLength.waybill_contract_no"
                :placeholder="isPlaceholderShow('请输入')"
                :disabled="isViewModel"
              />
              <!--              <input-search-->
              <!--                v-model.trim="dataJson.tempJson.waybill_contract_no"-->
              <!--                :disabled="isViewModel"-->
              <!--                @onInputSearch="handleCarriageOrderDialog"-->
              <!--              />-->
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              承运商
            </div>
            <el-form-item
              prop="customer_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.customer_name"
                :disabled="isViewModel"
                @onInputSearch="handleCustomerDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              运输方式
            </div>
            <el-form-item
              prop="transport_type"
              label-width="0"
            >
              <select-dict
                v-model="dataJson.tempJson.transport_type"
                :para="CONSTANTS.DICT_B_SCHEDULE_TRANSPORT_TYPE"
                init-placeholder="请选择运输方式"
                :disabled="isViewModel"
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
        <el-alert
          title="采购/销售合同信息"
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

          <el-descriptions-item label="订单编号">
            {{ dataJson.tempJson.order_no == null?'-':dataJson.tempJson.order_no }}
          </el-descriptions-item>

          <el-descriptions-item label="合同类型">
            {{ dataJson.tempJson.serial_type_name == null?'-':dataJson.tempJson.serial_type_name }}
          </el-descriptions-item>

          <el-descriptions-item label="业务类型">
            {{ dataJson.tempJson.bill_type_name == null?'-':dataJson.tempJson.bill_type_name }}
          </el-descriptions-item>

          <el-descriptions-item label="合同日期">
            {{ dataJson.tempJson.contract_dt == null?'-':formatDate(dataJson.tempJson.contract_dt) }}
          </el-descriptions-item>

          <el-descriptions-item label="船名">
            {{ dataJson.tempJson.ship_name == null?'-':dataJson.tempJson.ship_name }}
          </el-descriptions-item>

          <el-descriptions-item label="供应商/客户">
            {{ dataJson.tempJson.order_customer_name == null?'-':dataJson.tempJson.order_customer_name }}
          </el-descriptions-item>

          <el-descriptions-item label="合同量">
            {{ dataJson.tempJson.contract_num == null?'-':dataJson.tempJson.contract_num }}
          </el-descriptions-item>

          <el-descriptions-item label="采购/销售企业">
            {{ dataJson.tempJson.owner_name == null?'-':dataJson.tempJson.owner_name }}
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
                :para="CONSTANTS.DICT_MONITOR_TYPE_OUT"
                :filter-para="dataJson.isZhongLinEnvironment ? ['1'] : []"
                init-placeholder="请选择单据类型"
                :disabled="isViewModel"
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
              prop="out_owner_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.out_owner_name"
                :disabled="!isUpdateModel || isViewModel || settings.outPlanStatus"
                @onInputSearch="handleOutOwnerDialog"
              />
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
              prop="out_consignor_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.out_consignor_name"
                :disabled="!isUpdateModel || isViewModel || settings.outPlanStatus"
                @onInputSearch="handleOutConsignorDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              发货地
            </div>
            <el-form-item
              prop="out_warehouse_name"
              label-width="0"
            >
              <select-warehouse
                v-if="(isUpdateModel && !settings.outPlanStatus) || (isInsertModel && !settings.outPlanStatus)"
                v-model.trim="dataJson.tempJson.out_warehouse_name"
                placement="left"
                :warehouse1="dataJson.tempJson.out_warehouse_id"
                :disabled="!((isUpdateModel && !settings.outPlanStatus) || (isInsertModel && !settings.outPlanStatus))"
                @onReturnData="
                  handleWarehouseOutReturnData"
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
            <div slot="label">
              出库计划单号
            </div>
            <input-search
              v-model.trim="dataJson.tempJson.out_plan_code"
              :disabled="!settings.outPlanStatus || isViewModel"
              @onInputSearch="handleOutPlanDialog"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              发货执行情况
            </div>
            {{ dataJson.tempJson.out_rate == null?'0.00%':formatNumber(dataJson.tempJson.out_rate) }}%
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
              :disabled="!settings.outRuleStatus || isViewModel"
              :para="CONSTANTS.DICT_B_LOGISTICS_OUT_RULE"
              @change="handleOutRuleDictChange"
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

          <el-descriptions-item v-if="isViewModel" label="退货数量">
            {{ dataJson.tempJson.return_qty == null ? '0' : dataJson.tempJson.return_qty }}
          </el-descriptions-item>

          <el-descriptions-item v-if="isViewModel" label="退货单位">
            {{ dataJson.tempJson.out_unit == null ? '吨' : dataJson.tempJson.out_unit == null }}
          </el-descriptions-item>
          <el-descriptions-item />

        </el-descriptions>

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
                init-placeholder="请选择单据类型"
                :disabled="isViewModel"
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
              prop="in_owner_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.in_owner_name"
                :disabled="isViewModel"
                @onInputSearch="handleInOwnerDialog"
              />
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
              prop="in_consignor_name"
              label-width="0"
            >
              <input-search
                v-model.trim="dataJson.tempJson.in_consignor_name"
                :disabled="isViewModel"
                @onInputSearch="handleInConsignorDialog"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              收货地
            </div>
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
                v-model.trim="dataJson.tempJson.in_warehouse_name"
                placement="left"
                :warehouse1="dataJson.tempJson.in_warehouse_id"
                :disabled="isViewModel"
                @onReturnData="handleWarehouseInReturnData"
              />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="仓库类型">
            {{ dataJson.tempJson.in_warehouse_type_name == null ? '-' : dataJson.tempJson.in_warehouse_type_name }}
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

          <el-descriptions-item label="入库计划单号">
            {{ dataJson.tempJson.in_plan_code == null ? '-' : dataJson.tempJson.in_plan_code }}
          </el-descriptions-item>

          <!-- <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              入库计划生成方式
            </div>
            <radio-dict
              v-model="dataJson.tempJson.in_rule"
              :disabled="!settings.inRuleStatus || isViewModel"
              :para="CONSTANTS.DICT_B_LOGISTICS_IN_RULE"
              @change="handleInRuleDictChange"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              入库计划单号
            </div>
            <input-search
              v-model.trim="dataJson.tempJson.in_plan_code"
              :disabled="!settings.inPlanStatus || isViewModel"
              @onInputSearch="handleInPlanDialog"
            />
          </el-descriptions-item> -->
          <el-descriptions-item label="收货执行情况">
            {{ dataJson.tempJson.in_rate == null?'0.00%':formatNumber(dataJson.tempJson.in_rate) }}%

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
        </el-descriptions>

        <br>
        <el-alert
          title="商品明细"
          type="info"
          :closable="false"
        />
        <br>

        <el-button-group>

          <el-button
            v-show="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
            :disabled="!settings.topBtnShowStatus.showInsert"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleSpecDialog"
          >新增</el-button>

          <el-button
            v-show="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
            :disabled="!settings.topBtnShowStatus.showUpdate"
            type="primary"
            icon="el-icon-edit-outline"
            :loading="settings.loading"
            @click="handleGoodsEdit"
          >编辑</el-button>

          <el-button
            v-show="settings.btnShowStatus.showInsert || settings.btnShowStatus.showUpdate"
            :disabled="!settings.topBtnShowStatus.showUpdate"
            type="primary"
            icon="el-icon-circle-close"
            :loading="settings.loading"
            @click="handleGoodsDelete"
          >删除</el-button>
        </el-button-group>
        <el-table
          ref="multipleTable"
          v-loading="settings.loading"
          :data="dataJson.tempJson.detailListData"
          :element-loading-text="'正在拼命加载中...'"
          element-loading-background="rgba(255, 255, 255, 0.5)"
          :height="settings.tableHeight"
          columns_index_key="false"
          stripe
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
            prop="sku_code"
            label="物料编码"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="sku_name"
            label="物料名称"
          />
          <el-table-column
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
            show-overflow-tooltip
            min-width="100"
            label="运输数量"
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
        v-permission="'P_LOGISTICS:SAVE'"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert"
        size="medium"
        @click="doInsert()"
      >保存</el-button>
      <el-button
        v-show="settings.btnShowStatus.showUpdate && !isViewModel"
        v-permission="'P_LOGISTICS:SAVE'"
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

    <inplan-dialog
      v-if="popSettingsData.searchDialogDataEleven.visible"
      :title="popSettingsData.searchDialogDataEleven.title"
      :visible="popSettingsData.searchDialogDataEleven.visible"
      @closeMeOk="handleInPlanCloseOk"
      @closeMeCancel="handleInPlanCloseCancel"
    />
    <CarriageOrder
      v-if="popSettingsData.searchDialogDataEleven.visible"
      :visible="popSettingsData.searchDialogDataEleven.visible"
      @closeMeOk="handleCarriageCloseOk"
      @closeMeCancel="handleCarriageCloseCancel"
    />
  </div>
</template>

<style scoped>
.edit-container {
  height: calc(100vh - 220px);
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
import { updateApi2, insert2Api, getApi, getScheduleQtyApi } from '@/api/40_business/logistics/logistics'
import inConsignorDialog from '@/views/30_wms/customer/dialog/dialog'
import inOwnerDialog from '@/views/30_wms/owner/dialog/dialog'
import outConsignorDialog from '@/views/30_wms/customer/dialog/dialog'
import outOwnerDialog from '@/views/30_wms/owner/dialog/dialog'
import orderDialog from '@/views/40_business/order/dialog/dialog'
import specDialog from '@/views/30_wms/spec/dialog/dialog'
import inWarehouseDialog from '@/views/30_wms/warehouse/dialog/dialog'
import outWarehouseDialog from '@/views/30_wms/warehouse/dialog/dialog'
import outplanDialog from '@/views/40_business/outplan/dialog/dialog'
import inplanDialog from '@/views/40_business/inplan/dialog/dialog'
import SelectDict from '@/components/00_dict/select/SelectDict'
import RadioDict from '@/components/00_dict/redio'
import goodsDialog from '@/views/40_business/logistics/tabs/dialog/goodsEdit2'
import customerDialog from '@/views/30_wms/customer/dialog/dialog'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { getListApi } from '@/api/30_wms/owner/owner'
import { getListApi1 } from '@/api/30_wms/customer/customer'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin'
import constants_type from '@/common/constants/constants_dict'
import CarriageOrder from '@/views/40_business/carriageorder/dialog/dialog.vue'

export default {
  components: { CarriageOrder, inplanDialog, customerDialog, goodsDialog, outplanDialog, RadioDict, SelectDict, InputSearch, inWarehouseDialog, outWarehouseDialog, orderDialog, inConsignorDialog, inOwnerDialog, outConsignorDialog, outOwnerDialog, specDialog, SelectWarehouse },
  directives: { elDragDialog, permission },
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
      detailListData: [
      ],
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
        // 弹出的商品查询框参数设置
        goodsDialog: {
          // 弹出框显示参数
          visible: false,
          data: {
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
          status: this.CONSTANTS.DICT_B_OUT_PLAN_STATUS_TG
        },
        // 查询可用库存参数
        searchScheduleForm: {
          // 查询条件
          out_owner_id: null,
          out_warehouse_id: null,
          sku_id: null
        },
        // 中林环境搜索条件
        searchZLOwner: {
          name: null,
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION)
        },
        // 可用库存量
        schedule_qty: 0,
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          contract_no: '',
          out_rule: '0',
          in_rule: '0',
          out_owner_name: '',
          out_consignor_name: '',
          out_warehouse_name: '',
          in_type: '',
          in_owner_name: '',
          in_consignor_name: '',
          in_warehouse_name: '',
          out_warehouse_address: '',
          in_warehouse_address: '',
          customer_name: '',
          out_warehouse_id: null,
          out_owner_id: null,
          _id: null
        },
        // 单条数据 json
        tempJson: {
          contract_no: '',
          out_rule: '0',
          in_rule: '0',
          out_owner_name: '',
          out_consignor_name: '',
          out_warehouse_name: '',
          in_type: '',
          in_owner_name: '',
          in_consignor_name: '',
          in_warehouse_name: '',
          out_warehouse_address: '',
          in_warehouse_address: '',
          customer_name: '',
          out_warehouse_id: null,
          out_owner_id: null,
          _id: null
        },
        inputSettings: {
          maxLength: {
            contract_num: 20,
            ship_name: 20,
            contract_no: 30,
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
        outPlanStatus: false,
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
          showInsert: true,
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

          ],
          transport_type: [
            { required: true, message: '请选择运输方式', trigger: 'change' }
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
    // 监听 sku_id, owner_id, warehouse_id 查询可用库存
    bindModel () {
      const { _id, out_owner_id, out_warehouse_id } = this.dataJson.tempJson
      return {
        _id,
        out_owner_id,
        out_warehouse_id
      }
    }
  },
  // 监听器
  watch: {
    // 监听查询可用库存
    bindModel: {
      handler (newVal) {
        console.log(newVal)
        if (newVal._id !== null && newVal._id !== '' && newVal._id !== undefined &&
          newVal.out_owner_id !== null && newVal.out_owner_id !== '' && newVal.out_owner_id !== undefined &&
          newVal.out_warehouse_id !== null && newVal.out_warehouse_id !== '' && newVal.out_warehouse_id !== undefined
        ) {
          this.dataJson.searchScheduleForm.sku_id = newVal._id
          this.dataJson.searchScheduleForm.out_owner_id = newVal.out_owner_id
          this.dataJson.searchScheduleForm.out_warehouse_id = newVal.out_warehouse_id
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
      if (href.indexOf('shyiyuanth') !== -1 || href.indexOf('localhost') !== -1 || href.indexOf('172.21.1.249') !== -1) {
        this.getZLOwnerData()
        this.getZLCustomer()
        this.dataJson.isZhongLinEnvironment = true
      }
      // this.getZLOwnerData()
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

      // this.dataJson.tempJsonOriginal = deepCopy(this.data)
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
      const operate_tab_data = {
        editStatus: ''
      }

      // if (history.state.pushState) {
      //   // 如果是列表页面过来的，可以直接返回
      //   window.history.go(-1)
      // } else {
      //   // 如果是直接打开的，返回查询页面
      //   // 全部
      //   this.$router.push({ name: constants_program.P_MONITOR })
      // }
      this.$router.push({
        query: {}
      })

      this.$emit('emitReturn', operate_tab_data)
    },
    // 插入逻辑
    doInsert () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          if (this.dataJson.tempJson.detailListData != null && this.dataJson.tempJson.detailListData.length > 1) {
            this.showErrorMsg('只能保留一条商品明细')
            return
          }
          if (this.dataJson.tempJson.detailListData == null || this.dataJson.tempJson.detailListData.length < 1) {
            this.showErrorMsg('至少保留一条商品明细')
            return
          }
          if (this.dataJson.tempJson.detailListData[0].actual_count === undefined || this.dataJson.tempJson.detailListData[0].actual_count === null || this.dataJson.tempJson.detailListData[0].actual_count <= 0) {
            this.showErrorMsg('请输入运输数量')
            return
          }
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.sku_id = this.dataJson.tempJson.detailListData[0].sku_id
          tempData.sku_code = this.dataJson.tempJson.detailListData[0].sku_code
          tempData.actual_count = this.dataJson.tempJson.detailListData[0].actual_count
          tempData.in_unit_id = this.dataJson.tempJson.detailListData[0].unit_id
          tempData.out_unit_id = this.dataJson.tempJson.detailListData[0].unit_id
          tempData._id = null
          this.settings.loading = true
          insert2Api(tempData)
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
                  data: _data.data,
                  editStatus: this.PARAMETERS.STATUS_INSERT
                }

                this.$router.push({
                  query: {}
                })

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
              this.settings.loading = false
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
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.sku_id = this.dataJson.tempJson.detailListData[0].sku_id
          tempData.sku_code = this.dataJson.tempJson.detailListData[0].sku_code
          tempData.actual_count = this.dataJson.tempJson.detailListData[0].actual_count
          tempData.in_unit_id = this.dataJson.tempJson.detailListData[0].unit_id
          tempData.out_unit_id = this.dataJson.tempJson.detailListData[0].unit_id
          tempData._id = null
          this.settings.loading = true
          updateApi2(tempData)
            .then(
              _data => {
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
      this.dataJson.tempJson.out_warehouse_id = val.id
      this.dataJson.tempJson.out_warehouse_type_name = val.warehouse_type_name
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
      this.dataJson.tempJson.in_warehouse_id = val.id
      this.dataJson.tempJson.in_warehouse_address = val.address
      this.dataJson.tempJson.in_warehouse_type_name = val.warehouse_type_name
      this.popSettingsData.searchDialogDataSeven.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
    },
    // 收货仓库：关闭对话框：取消
    handleInWarehouseCloseCancel () {
      this.popSettingsData.searchDialogDataSeven.visible = false
    },

    // 规格
    handleSpecDialog () {
      if (this.dataJson.tempJson.detailListData != null && this.dataJson.tempJson.detailListData.length >= 1) {
        this.showErrorMsg('只能添加一条商品明细')
        return
      }
      this.popSettingsData.searchDialogDataFive.visible = true
    },
    // 规格：关闭对话框：确定
    handleSpecCloseOk (val) {
      this.popSettingsData.searchDialogDataFive.selectedDataJson = val
      this.popSettingsData.searchDialogDataFive.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false

      const tempData = {}

      tempData.spec = val.spec
      tempData.spec_code = val.code
      tempData.sku_code = val.code
      tempData.sku_name = val.goods_name
      tempData.pm = val.pm
      tempData.goods_name = val.name

      tempData.sku_id = val.id
      this.dataJson.tempJson._id = val.id
      this.dataJson.tempJson.detailListData = []
      this.dataJson.tempJson.detailListData.push(tempData)
      this.detailListData = this.dataJson.tempJson.detailListData
      this.popSettingsData.searchDialogDataEight.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.settings.topBtnShowStatus.showUpdate = false
    },
    // 规格：关闭对话框：取消
    handleSpecCloseCancel () {
      this.popSettingsData.searchDialogDataFive.visible = false
    },
    // 库区
    handleLocationDialog () {
      if (this.dataJson.tempJson.warehouse_id === null || this.dataJson.tempJson.warehouse_id === undefined) {
        this.showErrorMsg('请先选择仓库')
        return
      }
      this.popSettingsData.searchDialogDataSix.visible = true
    },
    // 库区：关闭对话框：确定
    handleLocationCloseOk (val) {
      this.popSettingsData.searchDialogDataSix.selectedDataJson = val
      this.popSettingsData.searchDialogDataSix.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.location_name = val.name
      this.dataJson.tempJson.location_id = val.id
    },
    // 库区：关闭对话框：取消
    handleLocationCloseCancel () {
      this.popSettingsData.searchDialogDataSix.visible = false
    },
    // 库位
    handleBinDialog () {
      if (this.dataJson.tempJson.location_id === null || this.dataJson.tempJson.location_id === undefined) {
        this.showErrorMsg('请先选择库区')
        return
      }
      this.popSettingsData.searchDialogDataSeven.visible = true
    },
    // 库位：关闭对话框：确定
    handleBinCloseOk (val) {
      this.popSettingsData.searchDialogDataSeven.selectedDataJson = val
      this.popSettingsData.searchDialogDataSeven.visible = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.dataJson.tempJson.bin_name = val.name
      this.dataJson.tempJson.bin_id = val.id
    },
    // 库位：关闭对话框：取消
    handleBinCloseCancel () {
      this.popSettingsData.searchDialogDataSeven.visible = false
    },
    // 订单
    handleOrderDialog () {
      this.popSettingsData.searchDialogDataEight.title = '订单选择页面'
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
      this.dataJson.searchForm.filter_type = [this.CONSTANTS.DICT_B_OUT_PLAN_TYPE_ZC]
      this.popSettingsData.searchDialogDataNine.visible = true
    },
    // 出库计划：关闭对话框：确定
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

      this.popSettingsData.searchDialogDataNine.visible = false

      // this.dataJson.tempJson.contract_no = val.contract_no
      // this.dataJson.tempJson.order_no = val.order_no
      // this.dataJson.tempJson.order_customer_name = val.customer_name
      // this.dataJson.tempJson.bill_type = val.bill_type
      // this.dataJson.tempJson.bill_type_name = val.bill_type_name
      // this.dataJson.tempJson.serial_type_name = val.serial_type_name
      // this.dataJson.tempJson.supplier_name = val.customer_name
      // this.dataJson.tempJson.owner_name = val.owner_name
      // this.dataJson.tempJson.contract_dt = val.contract_dt
      // this.dataJson.tempJson.contract_num = val.contract_num
      // this.dataJson.tempJson.ship_name = val.ship_name
      // this.dataJson.tempJson.order_id = val.order_id
      // this.dataJson.tempJson.order_type = val.order_type
      // this.dataJson.tempJson.in_unit_id = val.unit_id
      // this.dataJson.tempJson.out_unit_id = val.unit_id

      var tempData = {}
      tempData.sku_code = val.sku_code
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

      this.settings.topBtnShowStatus.showUpdate = false
    },
    // 出库计划：关闭对话框：取消
    handleOutPlanCloseCancel () {
      this.popSettingsData.searchDialogDataNine.visible = false
    },

    // 入库计划
    handleInPlanDialog () {
      // this.dataJson.searchForm.contract_no = this.dataJson.tempJson.contract_no

      this.popSettingsData.searchDialogDataEleven.visible = true
    },
    // 入库计划：关闭对话框：确定
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

      this.popSettingsData.searchDialogDataEleven.visible = false
    },
    // 入库计划：关闭对话框：取消
    handleInPlanCloseCancel () {
      this.popSettingsData.searchDialogDataEleven.visible = false
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
    handleOutRuleDictChange (val) {
      this.dataJson.tempJson.out_rule = val
      if (val === this.CONSTANTS.DICT_B_LOGISTICS_OUT_RULE_0) {
        this.settings.outPlanStatus = false
        this.dataJson.tempJson.out_plan_code = ''
        this.dataJson.tempJson.out_plan_detail_id = null
        this.dataJson.tempJson.detailListData = this.detailListData
        this.dataJson.tempJson.out_warehouse_id = null
        this.settings.topBtnShowStatus.showInsert = true
      } else {
        this.settings.outPlanStatus = true
        this.settings.topBtnShowStatus.showInsert = false
      }
    },
    handleInRuleDictChange (val) {
      this.dataJson.tempJson.in_rule = val
      if (val === this.CONSTANTS.DICT_B_LOGISTICS_IN_RULE_0) {
        this.settings.inPlanStatus = false
        this.dataJson.tempJson.in_plan_code = ''
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

        var tempData = {}
        tempData.sku_code = this.data.sku_code
        tempData.sku_id = this.data.sku_id
        tempData.sku_name = this.data.goods_name
        tempData.pm = this.data.pm
        tempData.spec = this.data.spec
        tempData.num = this.data.contract_num
        tempData.unit_name = '吨'
        tempData.actual_count = this.data.out_schedule_qty

        if (response.data.out_rule === this.CONSTANTS.DICT_B_LOGISTICS_OUT_RULE_1) {
          this.settings.outPlanStatus = true
        }

        this.dataJson.tempJson._id = this.dataJson.tempJson.id
        this.dataJson.tempJson.detailListData = []
        this.dataJson.tempJson.detailListData.push(tempData)
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
            // 收获方
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
        // console.log(response.data.records)
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
        this.dataJson.tempJson.in_warehouse_type_name = val.warehouse_type_name
        this.dataJson.tempJson.in_warehouse_address = val.warehouse_address
        // 仓库类型是直属库、加工厂库、铁路码头虚拟库，则收货类型，默认是入库，可修改
        // 仓库类型是饲料厂库，则收货类型，默认是卸货，可修改
        if (val.warehouse_type === constants_type.DICT_M_WAREHOUSE_TYPE_ZX || val.warehouse_type === constants_type.DICT_M_WAREHOUSE_TYPE_WD || val.warehouse_type === constants_type.DICT_M_WAREHOUSE_TYPE_TL) {
          this.dataJson.tempJson.in_type = constants_type.DICT_MONITOR_TYPE_IN_ONE
        } else if (val.warehouse_type === constants_type.DICT_M_WAREHOUSE_TYPE_CL) {
          this.dataJson.tempJson.in_type = constants_type.DICT_MONITOR_TYPE_IN_TWO
        }
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
      this.dataJson.tempJson.waybill_contract_no = val.order_no
      this.dataJson.tempJson.carriage_order_id = val.id
    },
    // 承运订单校验
    waybill_contract_no_validator (rule, value, callback) {
      if (this.dataJson.tempJson.waybill_contract_no === null || this.dataJson.tempJson.waybill_contract_no === undefined ||
        this.dataJson.tempJson.waybill_contract_no === '') {
        callback(new Error('请选择承运订单'))
      } else {
        callback()
      }
    }
  }

}
</script>
