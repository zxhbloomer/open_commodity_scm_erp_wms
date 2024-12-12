<template>
  <div class="app-container">
    <FloatMenu />
    <div>
      <el-form
        ref="minusForm"
        :inline="true"
        :model="dataJson.searchForm"
        label-position="getLabelPosition()"
      >

        <el-form-item label="">

          <el-input
            v-model.trim="dataJson.searchForm.code"
            clearable
            placeholder="任务单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.schedule_code"
            clearable
            placeholder="物流单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.contract_no"
            clearable
            placeholder="采购/销售合同号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.waybill_contract_no"
            clearable
            placeholder="物流合同单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="dataJson.searchForm.audit_year"
            style="width: 200px"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          />
        </el-form-item>
        <el-form-item style="float:right">
          <el-badge
            :value="screenNum"
            class="item"
          >
            <el-button
              v-popover:popover
              type="primary"
              plain
              :loading="settings.loading"
              icon="el-icon-search"
            >高级查询</el-button>
          </el-badge>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button
            type="primary"
            plain
            :loading="settings.loading"
            icon="el-icon-search"
            @click="handleSearch"
          >查询</el-button>
        </el-form-item>

      </el-form>
    </div>
    <el-popover
      ref="popover"
      placement="top"
      width="600"
      title="高级查询"
      popper-class="perfect_popper"
    >
      <el-form
        :inline="true"
        :model="dataJson.searchForm"
        label-position="top"
        class="search-form-senior"
      >
        <el-form-item label="出库计划单号">
          <el-input
            v-model.trim="dataJson.searchForm.out_plan_code"
            clearable
            placeholder="出库计划单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="入库计划单号">
          <el-input
            v-model.trim="dataJson.searchForm.in_plan_code"
            clearable
            placeholder="入库计划单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="运单号">
          <el-input
            v-model.trim="dataJson.searchForm.waybill_code"
            clearable
            placeholder="运单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="物料名称/物料编码">
          <el-input
            v-model.trim="dataJson.searchForm.goods_name"
            clearable
            placeholder="物料名称/物料编码"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item label="发货地">
          <select-out-warehouse
            v-model.trim="dataJson.searchForm.out_warehouse_name"
            :reset="settings.reset1"
            placement="left"
            @closeParentDialog="handleDialogClose"
            @onReturnData="handleOutWarehouseReturnData"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="发货仓库类型">
          <select-dicts
            v-model="dataJson.searchForm.out_warehouse_types"
            :para="CONSTANTS.DICT_M_WAREHOUSE_TYPE"
            init-placeholder="发货仓库类型"
          />
        </el-form-item>
        <el-form-item label="收货地">
          <select-in-warehouse
            v-model.trim="dataJson.searchForm.in_warehouse_name"
            :reset="settings.reset2"
            placement="left"
            @closeParentDialog="handleDialogClose"
            @onReturnData="handleInWarehouseReturnData"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="收货仓库类型">
          <select-dicts
            v-model="dataJson.searchForm.in_warehouse_types"
            :para="CONSTANTS.DICT_M_WAREHOUSE_TYPE"
            init-placeholder="收货仓库类型"
          />
        </el-form-item>

        <el-form-item label="承运商">
          <el-input
            v-model.trim="dataJson.searchForm.customer_name"
            clearable
            placeholder="承运商"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input
            v-model.trim="dataJson.searchForm.vehicle_no"
            clearable
            placeholder="车牌号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="发货类型">
          <select-dict
            v-model="dataJson.searchForm.out_type"
            :para="CONSTANTS.DICT_MONITOR_TYPE_OUT"
            init-placeholder="发货类型"
          />
        </el-form-item>
        <el-form-item label="收货类型">
          <select-dict
            v-model="dataJson.searchForm.in_type"
            :para="CONSTANTS.DICT_MONITOR_TYPE_IN"
            init-placeholder="收货类型"
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出库/提货时间起止">
              <el-date-picker
                v-model="dataJson.searchForm.daterange"
                value-format="yyyy-MM-dd"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入库/卸货时间起止">
              <el-date-picker
                v-model="dataJson.searchForm.daterange1"
                value-format="yyyy-MM-dd"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <div style="text-align: right; margin: 0">
          <el-button
            type="text"
            @click="doResetSearch"
          >重置</el-button>
          <el-button
            type="primary"
            :loading="settings.loading"
            @click="handleSearch"
          >提交</el-button>
        </div>
      </el-form>
    </el-popover>
    <el-button-group>

      <el-button
        v-permission="'P_MONITOR_HISTORY:INFO'"
        :disabled="!settings.btnShowStatus.showView"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
      <el-button
        v-permission="'P_MONITOR_HISTORY:EXPORT_FILE'"
        :disabled="!settings.btnShowStatus.showExport"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleExport"
      >影像导出</el-button>
      <el-button
        v-permission="'P_MONITOR_HISTORY:EXPORT'"
        :disabled="!settings.btnShowStatus.showExportData"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleExportData"
      >数据导出</el-button>
      <!--      <el-button-->
      <!--        v-permission="'P_MONITOR_HISTORY:RESTORE'"-->
      <!--        :disabled="!settings.btnShowStatus.showRestoreData"-->
      <!--        type="primary"-->
      <!--        icon="el-icon-zoom-in"-->
      <!--        :loading="settings.loading"-->
      <!--        @click="handleRestoreData"-->
      <!--      >数据恢复</el-button>-->
    </el-button-group>

    <div
      v-if="!meDialogStatus"
      class="div-sum"
    >
      <div class="right">
        <span class="count-title">发货数量：</span><span class="count-data">{{ dataJson.sumData.out_qty == null?'0':dataJson.sumData.out_qty>0? isZhongLin ? formatNumber3(dataJson.sumData.out_qty) : formatNumberTwo(dataJson.sumData.out_qty,true,2):0 }}</span>
        <span class="count-title">收货数量：</span><span class="count-data">{{ dataJson.sumData.in_qty == null?'0':dataJson.sumData.in_qty>0?isZhongLin ? formatNumber3(dataJson.sumData.in_qty) : formatNumberTwo(dataJson.sumData.in_qty,true,2):0 }}</span>
        <span class="count-title">损耗：</span><span class="count-data">{{ dataJson.sumData.qty_loss == null?'0': isZhongLin ? formatNumber3(dataJson.sumData.qty_loss) : formatNumberTwo(dataJson.sumData.qty_loss,true,2) }}</span>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      columns_index_key="true"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%"
      :cell-class-name="tableCellClassName"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="45"
        prop="id"
      />
      <el-table-column
        type="index"
        width="45"
        prop="No"
        label="No"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="150"
        prop="code"
        label="任务单号"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="100"
        prop="status_name"
        label="监管状态"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="100"
        prop="audit_status_name"
        label="审核状态"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="90"
        prop="settlement_status_name"
        label="结算状态"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="150"
        prop="schedule_code"
        label="物流订单号"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="170"
        prop="contract_no"
        label="采购/销售合同号"
        align="left"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="waybill_contract_no"
        label="物流合同号"
        align="center"
      />
      <el-table-column
        :auto-fit="true"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="out_plan_code"
        label="出库计划单号"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="140"
        prop="in_plan_code"
        label="入库计划单号"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="250"
        prop="waybill_code"
        label="运单号"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="90"
        prop="out_type_name"
        label="发货类型"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        min-width="160"
        :sort-orders="settings.sortOrders"
        prop="out_warehouse_short_name"
        label="发货地"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="100"
        prop="out_warehouse_type_name"
        label="发货地类型"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="130"
        prop="out_warehouse_address"
        label="发货详细地址"
        align="left"
      />
      <el-table-column
        min-width="190"
        :auto-fit="true"
        prop="out_time"
        :sort-orders="settings.sortOrders"
        label="出库/提货时间"
        align="left"
      >
        <template v-slot="scope">
          {{ scope.row.out_time == null?'':formatDateTime(scope.row.out_time) }}
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        min-width="90"
        :sort-orders="settings.sortOrders"
        prop="in_type_name"
        label="收货类型"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        min-width="160"
        :sort-orders="settings.sortOrders"
        prop="in_warehouse_short_name"
        label="收货地"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        min-width="100"
        :sort-orders="settings.sortOrders"
        prop="in_warehouse_type_name"
        label="收货地类型"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        min-width="160"
        :sort-orders="settings.sortOrders"
        prop="in_warehouse_address"
        label="收货详细地址"
        align="left"
      />
      <el-table-column
        min-width="190"
        :auto-fit="true"
        prop="in_time"
        :sort-orders="settings.sortOrders"
        label="入库/卸货时间"
        align="left"
      >
        <template v-slot="scope">
          {{ scope.row.in_time == null?'':formatDateTime(scope.row.in_time) }}
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="goods_name"
        label="物料名称"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="pm"
        label="品名"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="120"
        prop="sku_name"
        label="规格"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        min-width="150"
        prop="sku_code"
        align="left"
        :sort-orders="settings.sortOrders"
        label="规格编号"
      />
      <el-table-column
        :auto-fit="true"
        min-width="330"
        prop="customer_name"
        :sort-orders="settings.sortOrders"
        label="承运商"
        align="left"
      />
      <el-table-column
        :auto-fit="true"
        min-width="170"
        :sort-orders="settings.sortOrders"
        prop="driver_name"
        align="left"
        label="司机"
      >
        <template v-slot="scope">
          {{ scope.row.driver_name }}({{ scope.row.driver_mobile_phone }})
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="120"
        prop="vehicle_no"
        align="left"
        label="车牌号"
      />
      <el-table-column
        align="left"
        :auto-fit="true"
        :sort-orders="settings.sortOrders"
        min-width="120"
        prop="validate_vehicle"
        label="验车状态"
      >
        <template v-slot="scope">
          {{ scope.row.validate_vehicle == '1'?'验车通过':'验车未通过' }}
        </template>
      </el-table-column>

      <el-table-column
        align="right"
        :sort-orders="settings.sortOrders"
        min-width="120"
        prop="out_qty"
        label="发货数量"
      >
        <template v-slot="scope">
          {{ scope.row.out_qty == null?'0': isZhongLin ? formatNumber3(scope.row.out_qty) : formatNumberTwo(scope.row.out_qty, true, 2) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="85"
        prop="out_unit"
        label="发货单位"
        align="left"
      >
        <template v-slot="scope">吨</template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="in_qty"
        label="收货数量"
      >
        <template v-slot="scope">
          {{ scope.row.in_qty == null?'0': isZhongLin ? formatNumber3(scope.row.in_qty) : formatNumberTwo(scope.row.in_qty, true, 2) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="qty_loss"
        label="损耗"
      >
        <template v-slot="scope">
          <span :class="scope.row.qty_loss<0?'font-class-red':''">
            {{ scope.row.qty_loss == null?'0':formatNumber(Math.abs(scope.row.qty_loss)) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="85"
        prop="in_unit"
        label="收货单位"
        align="left"
      >
        <template v-slot="scope">吨</template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="cancel_remark"
        label="作废理由"
      />

      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_audit_name"
        label="出库审核人"
      />
      <el-table-column
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="out_audit_time"
        label="出库审核时间"
      >
        <template v-slot="scope">
          {{ scope.row.out_audit_time == null?'':formatDateTime(scope.row.out_audit_time) }}
        </template>
      </el-table-column>

      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_audit_name"
        label="入库审核人"
      />
      <el-table-column
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="in_audit_time"
        label="入库审核时间"
      >
        <template v-slot="scope">
          {{ scope.row.in_audit_time == null?'':formatDateTime(scope.row.in_audit_time) }}
        </template>
      </el-table-column>

      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="c_name"
        label="创建人"
      />
      <el-table-column
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="c_time"
        label="创建时间"
      >
        <template v-slot="scope">
          {{ scope.row.c_time == null?'':formatDateTime(scope.row.c_time) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="u_name"
        label="更新人"
      />
      <el-table-column
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ scope.row.u_time == null?'':formatDateTime(scope.row.u_time) }}
        </template>
      </el-table-column>

    </el-table>
    <pagination
      ref="minusPaging"
      :total="dataJson.paging.total"
      :page.sync="dataJson.paging.current"
      :limit.sync="dataJson.paging.size"
      @pagination="getDataList"
    />
  </div>
</template>

<style scoped>
::v-deep .el-tabs__item {
  height: 30px;
  line-height: 30px;
}
::v-deep .el-tabs__header {
  margin: 0 0 5px;
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
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 371px;
}
.el-button-group {
  margin-bottom: 10px;
}
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.el-input-group__append_reset {
  color: #ffffff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
a {
  color: #52b5f2;
}
.div-sum {
  width: 100%;
  height: 35px;
  padding: 5px 5px;
  margin: 0;
  box-sizing: border-box;
  border-radius: 4px;
  transition: opacity 0.2s;
  background-color: #fff;
  color: #666;
  font-size: 16px;
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
}
.count-data {
  color: #f00;
  font-size: 20px;
}
.count-title {
  margin-left: 10px;
}
.right {
  position: absolute;
  right: 10px;
  margin-right: 10px;
}
.font-class-red {
  color: #f00;
}
.perfect_popper .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-tabs {
  margin-bottom: 5px;
}
</style>
<style>
.el-table .warning-cell {
  background-color: #ffa4a4 !important;
}
</style>

<script>
import SelectDicts from '@/components/00_dict/select/SelectDicts'
import SelectDict from '@/components/00_dict/select/SelectDict'
import { getListApi, exportApi, exportAllApi, exportDataApi, exportAllDataApi, getListSumApi, restoreApi } from '@/api/40_business/monitor/monitorbackup'
import constants_para from '@/common/constants/constants_para'
import resizeMixin from './mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
import SelectOutWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBinForSearch'
import SelectInWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBinForSearch'
import urlUtil from '@/utils/urlUtil'

export default {
  components: { Pagination, SelectDicts, SelectInWarehouse, SelectOutWarehouse, SelectDict },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
  props: {
    data: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      meDialogStatus: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        tabs: {
          active: '0'
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          schedule_code: '',
          waybill_contract_no: null,
          daterange1: [],
          daterange: [],
          status_list: [],
          audit_ids: [],
          audit_year: null
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        sumData: {
          qty_loss: 0,
          in_qty: 0,
          out_qty: 0
        },
        customerComboList: [],
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          config_key: '',
          value: '',
          descr: ''
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 20,
            config_key: 20,
            value: 50,
            descr: 200
          }
        },
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      popSettingsData: {
        dialogFormVisible: false
      },
      // 页面设置json
      settings: {
        // 重置
        reset1: false,
        reset2: false,
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnShowStatus: {
          showEnable: false,
          showDisable: false,
          showUpdate: false,
          showView: false,
          showExport: false,
          showExportData: false,
          showRestoreData: false,
          showCancel: false,
          showSettle: false,
          showAudit: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000
      },
      popSettings: {
        // 弹出编辑页面
        one: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        }
      },
      screenNum: 0
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
    'dataJson.multipleSelection': {
      deep: true,
      handler (newVal, oldVal) {
        const screenKeys = ['out_plan_code', 'in_plan_code', 'waybill_code', 'goods_name', 'out_warehouse_name', 'in_warehouse_name', 'customer_name', 'driver_name', 'vehicle_no', 'out_type', 'in_type', 'daterange1', 'in_warehouse_types', 'out_warehouse_types']
        const { searchForm } = this.dataJson
        const data = Object.keys(searchForm).map(item => {
          if (screenKeys.includes(item)) {
            if (Array.isArray(searchForm[item])) {
              return searchForm[item].length > 0 ? searchForm[item] : undefined
            } else {
              return searchForm[item]
            }
          }
        })
        const len = data.filter(x => x).length || 0
        this.screenNum = len
      }
    }
  },
  created () {
    // 获取url参数
    const p1 = urlUtil.getHashQueryVariable(window.location.href, 'p1')
    this.init_List(p1)
    // 监管任务完成时间起止
    if (this.$route.query.start_time !== null && this.$route.query.start_time !== undefined) {
      this.dataJson.searchForm.daterange.push(this.$route.query.start_time)
      this.dataJson.searchForm.daterange.push(this.$route.query.start_time)

      this.dataJson.searchForm.over_time = this.$route.query.start_time
      this.dataJson.searchForm.start_time = this.$route.query.start_time
    } else {
      this.setDateRange()
    }
    // 物流单号
    if (this.$route.query.schedule_code !== null && this.$route.query.schedule_code !== undefined) {
      this.dataJson.searchForm.schedule_code = this.$route.query.schedule_code
      this.dataJson.searchForm.daterange = null
      this.dataJson.searchForm.start_time = null
      this.dataJson.searchForm.over_time = null
    }
    if (this.$route.query.status !== null && this.$route.query.status !== undefined) {
      this.dataJson.searchForm.status_list = []
      if (this.$route.query.status === '7') {
        this.dataJson.searchForm.status_list.push('7')
      } else {
        this.dataJson.searchForm.status_list.push('1')
        this.dataJson.searchForm.status_list.push('2')
        this.dataJson.searchForm.status_list.push('3')
        this.dataJson.searchForm.status_list.push('4')
        this.dataJson.searchForm.status_list.push('5')
        this.dataJson.searchForm.status_list.push('6')
        this.dataJson.searchForm.status_list.push('7')
      }
      // this.dataJson.searchForm.status = '7'
    }
    location.href = urlUtil.delParam(window.location.href, 'fullpath')
  },
  mounted () {
    // 描绘完成

  },
  beforeUpdate () {
    // 重新布局表格
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout()
    })
  },
  destroyed () {
  },
  methods: {
    // 初始化查询页面
    init_List (para) {
      switch (para) {
        case '1':
          this.dataJson.tabs.active = '1'
          // 待出/待提
          this.dataJson.searchForm.status_list = ['0', '1', '2']
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
          break
        case '2':
          this.dataJson.tabs.active = '2'
          // 待入/待卸货
          this.dataJson.searchForm.status_list = ['4', '5', '6']
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
          break
        case '3':
          this.dataJson.tabs.active = '3'
          // 已完成
          this.dataJson.searchForm.status_list = ['7']
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
          break
        case '4':
          // 待出库审核
          this.dataJson.tabs.active = '4'
          this.dataJson.searchForm.settlement_status = ''
          this.dataJson.searchForm.audit_status_list = ['0', '4']
          this.dataJson.searchForm.audit_status = ''
          // this.dataJson.searchForm.status_list = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
          this.dataJson.searchForm.status_list = []

          break
        case '5':
          // 待入库审核
          this.dataJson.tabs.active = '5'
          this.dataJson.searchForm.settlement_status = ''
          this.dataJson.searchForm.audit_status_list = ['0', '3']
          this.dataJson.searchForm.audit_status = ''
          this.dataJson.searchForm.status_list = []
          // this.dataJson.searchForm.status_list = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
          break
        case '6':
          // 审核通过
          this.dataJson.tabs.active = '6'
          this.dataJson.searchForm.settlement_status = ''
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = '2'
          this.dataJson.searchForm.status_list = []
          // this.dataJson.searchForm.status_list = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
          break
        case '7':
          // 已结算
          this.dataJson.tabs.active = '7'
          this.dataJson.searchForm.settlement_status = '1'
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
          this.dataJson.searchForm.status_list = []
          // this.dataJson.searchForm.status_list = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
          break
        default:
          this.dataJson.tabs.active = '0'
          // 全部
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
          // this.dataJson.searchForm.status_list = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
          this.dataJson.searchForm.status_list = []
          break
      }

      // 接收url参数
      if (this.data !== undefined && this.data.searchForm !== undefined) {
        this.dataJson.searchForm = this.data.searchForm
      } else {
        this.dataJson.searchForm.schedule_code = this.$route.query.schedule_code
      }
      // 初始化watch
      this.setWatch()
      // 初始化查询
      this.getDataList()
      // 数据初始化
      this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
    },
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.multipleSelection', (newVal, oldVal) => {
        if (newVal.length > 0) {
          this.settings.btnShowStatus.showEnable = true
          this.settings.btnShowStatus.showDisable = true
          this.settings.btnShowStatus.showExport = true
          this.settings.btnShowStatus.showExportData = true
          this.settings.btnShowStatus.showSettle = true
          this.settings.btnShowStatus.showRestoreData = true
        } else {
          this.settings.btnShowStatus.showEnable = false
          this.settings.btnShowStatus.showDisable = false
          this.settings.btnShowStatus.showExport = false
          this.settings.btnShowStatus.showExportData = false
          this.settings.btnShowStatus.showSettle = false
          this.settings.btnShowStatus.showRestoreData = false
        }

        const _this = this
        _this.dataJson.multipleSelection.forEach(function (value, index, array) {
          if (value.audit_status !== '2') {
            _this.settings.btnShowStatus.showSettle = false
          }

          if (value.settlement_status === '1') {
            // 非审核通过状态不可提交
            _this.settings.btnShowStatus.showSettle = false
          }
        })
      }, { deep: true }
      )

      this.watch.unwatch_tempJson1 = this.$watch('dataJson.searchForm', (newVal, oldVal) => {
        if (this.dataJson.searchForm.daterange === null) {
          this.dataJson.searchForm.start_time = null
          this.dataJson.searchForm.over_time = null
        }

        if (this.dataJson.searchForm.daterange1 === null) {
          this.dataJson.searchForm.in_time_start = null
          this.dataJson.searchForm.in_time_end = null
        }
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
    },
    // 行点击
    handleRowClick (row) {
      this.dataJson.rowIndex = this.getRowIndex(row)
    },
    // 行双点击，仅在dialog中有效
    handleRowDbClick (row) {
      this.dataJson.rowIndex = this.getRowIndex(row)
      var _data = deepCopy(row)
      if (this.meDialogStatus) {
        this.$emit('rowDbClick', _data)
      }
    },
    handleSearch () {
      this.$refs.popover.doClose()

      if (this.dataJson.searchForm.daterange !== null && this.dataJson.searchForm.daterange !== undefined && this.dataJson.searchForm.daterange !== '') {
        this.dataJson.searchForm.start_time = this.dataJson.searchForm.daterange[0]
        this.dataJson.searchForm.over_time = this.dataJson.searchForm.daterange[1]
      }
      // 完成时间
      if (this.dataJson.searchForm.daterange1 !== null && this.dataJson.searchForm.daterange1 !== undefined && this.dataJson.searchForm.daterange1 !== '') {
        this.dataJson.searchForm.in_time_start = this.dataJson.searchForm.daterange1[0]
        this.dataJson.searchForm.in_time_end = this.dataJson.searchForm.daterange1[1]
      }
      // 查询
      this.dataJson.searchForm.pageCondition.current = 1
      this.dataJson.paging.current = 1
      this.getDataList()
      // 清空选择
      this.dataJson.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    handleSortChange (column) {
      // 服务器端排序
      if (column.order === 'ascending') {
        this.dataJson.searchForm.pageCondition.sort = column.prop
      } else if (column.order === 'descending') {
        this.dataJson.searchForm.pageCondition.sort = '-' + column.prop
      }
      this.getDataList()
    },
    getDataList () {
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      this.dataJson.searchForm.id = null
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.listData = response.data.content
        this.dataJson.paging.total = response.data.totalElements
        this.dataJson.paging.current = response.data.pageable.pageNumber + 1
        this.dataJson.paging.size = response.data.pageable.pageSize
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
      // // 查询合计信息
      getListSumApi(this.dataJson.searchForm).then(response => {
        if (response.data !== null) {
          this.dataJson.sumData = response.data
        } else {
          this.dataJson.sumData.qty_loss = 0
          this.dataJson.sumData.in_qty = 0
          this.dataJson.sumData.out_qty = 0
        }
      }).finally(() => {
      })
    },
    // 重置查询区域
    doResetSearch () {
      const audit_status_list = this.dataJson.searchForm.audit_status_list
      const audit_status = this.dataJson.searchForm.audit_status
      const settlement_status = this.dataJson.searchForm.settlement_status

      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.dataJson.searchForm.audit_status_list = audit_status_list
      this.dataJson.searchForm.audit_status = audit_status
      this.dataJson.searchForm.settlement_status = settlement_status

      // 重置货主、客户、仓库等组件
      this.settings.reset1 = !this.settings.reset1
      this.settings.reset2 = !this.settings.reset2

      // 默认查询近一个月内的数据
      this.setDateRange()
    },

    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },

    // 点击按钮 查看
    handleView () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }

      this.popSettings.one.props.data.searchForm = this.dataJson.searchForm
      this.dataJson.searchForm.id = this.popSettings.one.props.data.id
      const operate_tab_data = {
        operate_tab_info: { showEdit: true, name: '查看监管任务' },
        canEdit: false,
        editStatus: constants_para.STATUS_VIEW,
        data: this.dataJson.searchForm
      }
      this.$router.push({
        query: {
          p2: this.dataJson.currentJson.id
        }
      })

      this.$emit('emitView', operate_tab_data)
    },

    // 点击按钮 审核
    handleAudit () {
      // 打开第一条数据
      const ids = []
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      } else {
        this.dataJson.listData.forEach(item => {
          ids.push(item.id)
        })
        this.dataJson.searchForm.audit_ids = ids
        console.log('list_ids', ids)
      }
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_VIEW
      this.popSettings.one.props.data.searchForm = this.dataJson.searchForm
      this.dataJson.searchForm.id = this.popSettings.one.props.data.id
      const operate_tab_data = {
        operate_tab_info: { showEdit: true, name: '审核监管任务' },
        canEdit: false,
        editStatus: constants_para.STATUS_AUDIT,
        data: this.dataJson.searchForm
      }

      window.history.pushState({ pushState: true }, '', `#${this.$route.path}?p2=${this.popSettings.one.props.data.id}`)

      this.$emit('emitView', operate_tab_data)
    },

    handleExport () {
      // 部分数据导出
      this.handleExportSelectionData()
      // }
    },
    // 导出所有数据
    handleExportAllData () {
      this.showLoading('正在导出，请稍后...')
      this.settings.loading = true

      exportAllApi().then(response => {

      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
      })
    },
    // 导出选中数据
    handleExportSelectionData () {
      this.showLoading('正在导出，请稍后...')
      this.settings.loading = true

      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })

      exportApi(selectionJson).then(response => {
        const a = document.createElement('a')
        a.href = response.data
        a.click()
      }, (_error) => {
        // this.showErrorMsg('发生了异常，请联系管理员！', _error.data)
        console.log('发生了异常，请联系管理员！:' + JSON.stringify(_error))
      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
      })
    },
    // 点击按钮 维护
    handleEdit () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      this.popSettings.one.props.data.searchForm = this.dataJson.searchForm
      this.dataJson.searchForm.id = this.popSettings.one.props.data.id
      this.dataJson.searchForm.no = this.dataJson.currentJson.no
      const operate_tab_data = {
        operate_tab_info: { showEdit: true, name: '维护监管任务' },
        canEdit: false,
        editStatus: constants_para.STATUS_EDIT,
        data: this.dataJson.searchForm
      }

      window.history.pushState({ pushState: true }, '', `#${this.$route.path}?p3=${this.dataJson.currentJson.id}`)

      this.$emit('emitEdit', operate_tab_data)
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnShowStatus.showView = true
        this.settings.btnShowStatus.showUpdate = true
        this.settings.btnShowStatus.showCancel = true
      } else {
        this.settings.btnShowStatus.showView = false
        this.settings.btnShowStatus.showUpdate = false
        this.settings.btnShowStatus.showCancel = false
      }

      if (this.dataJson.currentJson.status === '0' || this.dataJson.currentJson.status === '8') {
        this.settings.btnShowStatus.showUpdate = false
      }

      if (this.dataJson.currentJson.status === '8') {
        this.settings.btnShowStatus.showCancel = false
      }

      // 装货完成才能审核
      if (this.dataJson.currentJson.status === '3' || this.dataJson.currentJson.status === '4' || this.dataJson.currentJson.status === '5' || this.dataJson.currentJson.status === '6' || this.dataJson.currentJson.status === '7') {
        this.settings.btnShowStatus.showAudit = true
      } else {
        this.settings.btnShowStatus.showAudit = false
      }

      if (this.dataJson.currentJson.audit_status === '2') {
        this.settings.btnShowStatus.showAudit = false
      }

      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    },
    // 发货仓库
    handleOutWarehouseReturnData (val) {
      if (val === null) {
        // 仓库
        this.dataJson.searchForm.out_warehouse_id = null
        this.dataJson.searchForm.out_warehouse_name = null
      } else {
        // 仓库
        this.dataJson.searchForm.out_warehouse_id = val.warehouse_id
        this.dataJson.searchForm.out_warehouse_name = val.warehouse_name
      }
    },
    // 收货仓库
    handleInWarehouseReturnData (val) {
      if (val === null) {
        // 仓库
        this.dataJson.searchForm.in_warehouse_id = null
        this.dataJson.searchForm.in_warehouse_name = null
      } else {
        // 仓库
        this.dataJson.searchForm.in_warehouse_id = val.warehouse_id
        this.dataJson.searchForm.in_warehouse_name = val.warehouse_name
      }
    },
    handleTabsClick (tab, event) {
      if (this.dataJson.searchForm.active_tabs_index === tab.index) {
        return
      }

      let status_list

      switch (tab.index) {
        case '0':
          // 全部
          status_list = []
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
          this.dataJson.searchForm.settlement_status = ''
          window.history.pushState({ pushState: true }, '', `#${this.$route.path}`)
          break
        case '1':
          // 待出库审核

          this.dataJson.searchForm.audit_status_list = ['0', '4']
          this.dataJson.searchForm.settlement_status = ''
          this.dataJson.searchForm.audit_status = ''
          status_list = []
          window.history.pushState({ pushState: true }, '', `#${this.$route.path}?p1=4`)
          break
        case '2':
          // 待入库审核

          this.dataJson.searchForm.audit_status_list = ['0', '3']
          this.dataJson.searchForm.settlement_status = ''
          this.dataJson.searchForm.audit_status = ''
          status_list = []
          window.history.pushState({ pushState: true }, '', `#${this.$route.path}?p1=5`)
          break
        case '3':
          // 审核通过
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = '2'
          this.dataJson.searchForm.settlement_status = ''
          status_list = []
          window.history.pushState({ pushState: true }, '', `#${this.$route.path}?p1=6`)
          break
        case '4':
          // 已结算
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.settlement_status = '1'
          this.dataJson.searchForm.audit_status = ''
          status_list = []
          window.history.pushState({ pushState: true }, '', `#${this.$route.path}?p1=7`)
          break
      }

      this.dataJson.searchForm.status_list = status_list
      this.getDataList()
      this.dataJson.searchForm.active_tabs_index = tab.index
    },
    // 导出按钮
    handleExportData () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行导出', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showExportData = false
        })
      } else if (this.dataJson.multipleSelection.length === this.dataJson.listData.length) {
        if (this.getOperaPerm('P_MONITOR:EXPORT_ALL')) {
          // 选择全部的时候
          this.$confirm('请选择：当前页数据导出，全数据导出？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '全部导出',
            cancelButtonText: '当前页数据导出'
          }).then(() => {
            this.handleExportDataAll()
          }).catch(action => {
            // 右上角X
            if (action !== 'close') {
              // 当前页所选择的数据导出
              this.handleExportDataSelection()
            }
          })
        } else {
          // 选择全部的时候
          this.$confirm('请选择：当前页数据导出，全数据导出？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '全部导出',
            cancelButtonText: '当前页数据导出'
          }).then(() => {
            this.handleExportDataAll()
          }).catch(action => {
            // 右上角X
            if (action !== 'close') {
              // 当前页所选择的数据导出
              this.handleExportDataSelection()
            }
          })
        }
      } else {
        // 部分数据导出
        this.handleExportDataSelection()
      }
    },
    // 全部数据导出
    handleExportDataAll () {
      // loading
      this.settings.loading = true
      // 开始导出
      exportAllDataApi(this.dataJson.searchForm).then(response => {
        this.settings.loading = false
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 部分数据导出
    handleExportDataSelection () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始导出
      exportDataApi(selectionJson).then(response => {
        this.settings.loading = false
      })
    },
    tableCellClassName ({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'validate_vehicle' && row.validate_vehicle !== '1') {
        return 'warning-cell'
      }
      return ''
    },
    setDateRange () {
    },
    // 数据恢复
    handleRestoreData () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行恢复', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showRestoreData = false
        })
      } else {
        // if (this.getOperaPerm('P_MONITOR:EXPORT_ALL')) {
        //   // 选择全部的时候
        //   this.$confirm('确认恢复选中的监管任务吗？', '确认信息', {
        //     distinguishCancelAndClose: true,
        //     confirmButtonText: '恢复',
        //     cancelButtonText: '取消'
        //   }).then(() => {
        //     // this.handleRestoreDataSelection()
        //     // this.handleExportDataAll()
        //   }).catch(action => {
        //     // 右上角X
        //     if (action !== 'close') {
        //       // 当前页所选择的数据导出
        //       // this.handleRestoreDataSelection()
        //     }
        //   })
        // } else {
        // 选择部分的时候
        this.$confirm('确认恢复选中的监管任务吗？', '确认信息', {
          distinguishCancelAndClose: true,
          cancelButtonText: '取消',
          confirmButtonText: '恢复'
        }).then(() => {
          this.handleRestoreDataSelection()
          // this.handleExportDataAll()
        }).catch(action => {
          // 右上角X
          if (action !== 'close') {
            // 当前页所选择的数据导出
            // this.handleRestoreDataSelection()
          }
        })
        // }
      }
    },
    // 部分数据恢复
    handleRestoreDataSelection () {
      // loading
      const param = {}
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push(value.id)
      })
      param.ids = selectionJson
      // 开始导出
      restoreApi(param).then(response => {
        this.$notify({
          title: '数据恢复中',
          // message: response.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.getDataList()
      }, (_error) => {
        this.$notify({
          title: '数据恢复失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
      // 刷新页面
    }

  }

}
</script>
