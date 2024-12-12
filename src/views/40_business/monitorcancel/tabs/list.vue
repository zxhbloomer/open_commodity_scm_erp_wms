<template>
  <div class="app-container">
    <FloatMenu />
    <el-tabs
      ref="minusTabs"
      v-model="dataJson.tabs.active"
      type="card"
      class=""
      @tab-click="handleTabsClick"
    >
      <el-tab-pane name="0">
        <template slot="label">全部
        </template>
      </el-tab-pane>
      <el-tab-pane name="4">
        <template slot="label">待出库审核
        </template>
      </el-tab-pane>
      <el-tab-pane name="5">
        <template slot="label">待入库审核
        </template>
      </el-tab-pane>
      <el-tab-pane name="6">
        <template slot="label">审核通过
        </template>
      </el-tab-pane>
      <el-tab-pane name="7">
        <template slot="label">已结算
        </template>
      </el-tab-pane>
    </el-tabs>
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
            v-model.trim="dataJson.searchForm.waybill_contract_no"
            clearable
            placeholder="物流合同单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.contract_no"
            clearable
            placeholder="合同号"
            @keyup.enter.native="handleSearch"
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
        <el-form-item label="箱号">
          <el-input
            v-model.trim="dataJson.searchForm.container_code"
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
        <el-form-item label="结算状态">
          <select-dict
            v-model="dataJson.searchForm.settlement_status"
            :para="CONSTANTS.DICT_B_MONITOR_SETTLEMENT_STATUS"
            init-placeholder="结算状态"
          />
        </el-form-item>
        <el-form-item label="出库审核人">
          <el-input
            v-model.trim="dataJson.searchForm.out_audit_name"
            clearable
            placeholder="出库审核人"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="入库审核人">
          <el-input
            v-model.trim="dataJson.searchForm.in_audit_name"
            clearable
            placeholder="入库审核人"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间起止">
              <el-date-picker
                v-model="dataJson.searchForm.daterange4"
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="出库审核时间起止">
              <el-date-picker
                v-model="dataJson.searchForm.daterange2"
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
            <el-form-item label="入库审核时间起止">
              <el-date-picker
                v-model="dataJson.searchForm.daterange3"
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
        v-permission="'P_MONITOR_CANCEL:INFO'"
        :disabled="!settings.btnShowStatus.showView"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
      <el-button
        v-permission="'P_MONITOR_CANCEL:EXPORT_FILE'"
        :disabled="!settings.btnShowStatus.showExport"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleExport"
      >影像导出</el-button>
      <el-button
        v-permission="'P_MONITOR_CANCEL:EXPORT'"
        :disabled="!settings.btnShowStatus.showExportData"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleExportData"
      >数据导出</el-button>
      <el-button
        v-permission="'P_MONITOR_CANCEL:SYNC'"
        type="primary"
        icon="el-icon-zoom-in"
        :disabled="!settings.btnShowStatus.showSync"
        :loading="settings.loading"
        @click="handleSync"
      >同步</el-button>

      <el-button
        v-permission="'P_MONITOR_CANCEL:SYNCALL'"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleSyncAll"
      >全部同步</el-button>

      <el-button
        v-permission="'P_MONITOR_CANCEL:DELETE'"
        :disabled="!settings.btnShowStatus.showDelete"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleDelete"
      >删除</el-button>

    </el-button-group>

    <div
      v-if="!meDialogStatus"
      v-loading="settings.sumLoading"
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
      :default-sort="{prop: 'u_time', order: 'descending'}"
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
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="code"
        label="任务单号"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="status_name"
        label="监管状态"
        align="center"
      />

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="audit_status_name"
        label="审核状态"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="settlement_status_name"
        label="结算状态"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="schedule_code"
        label="物流订单号"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="contract_no"
        label="采购/销售合同号"
        align="center"
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
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_plan_code"
        label="出库计划单号"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_plan_code"
        label="入库计划单号"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="waybill_code"
        label="运单号"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_type_name"
        label="发货类型"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_warehouse_name"
        label="发货地"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_warehouse_type_name"
        label="发货地类型"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="out_warehouse_address"
        label="发货详细地址"
        align="center"
      />
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="out_time"
        label="出库/提货时间"
        align="center"
      >
        <template v-slot="scope">
          {{ scope.row.out_time == null?'':formatDateTime(scope.row.out_time) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_type_name"
        label="收货类型"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_warehouse_name"
        label="收货地"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_warehouse_type_name"
        label="收货地类型"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="in_warehouse_address"
        label="收货详细地址"
        align="center"
      />
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="in_time"
        label="入库/卸货时间"
        align="center"
      >
        <template v-slot="scope">
          {{ scope.row.in_time == null?'':formatDateTime(scope.row.in_time) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="goods_name"
        label="物料名称"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="pm"
        label="品名"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="sku_name"
        label="规格"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="sku_code"
        align="left"
        label="规格编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="customer_name"
        label="承运商"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="driver_name"
        align="center"
        label="司机"
      >
        <template v-slot="scope">
          {{ scope.row.driver_name }}({{ scope.row.driver_mobile_phone }})
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="vehicle_no"
        align="center"
        label="车牌号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="left"
        min-width="120"
        prop="validate_vehicle"
        label="验车状态"
      >
        <template v-slot="scope">
          {{ scope.row.validate_vehicle == '1'?'验车通过':'验车未通过' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="container_code"
        align="left"
        label="箱号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
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
        align="center"
      >
        <template v-slot="scope">吨</template>
      </el-table-column>
      <el-table-column
        sortable="custom"
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
        sortable="custom"
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
        align="center"
      >
        <template v-slot="scope">吨</template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="cancel_remark"
        label="作废理由"
      />

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_audit_name"
        label="出库审核人"
      />
      <el-table-column
        sortable="custom"
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
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_audit_name"
        label="入库审核人"
      />
      <el-table-column
        sortable="custom"
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
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="backup_status_name"
        label="备份状态"
        align="center"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="backup_flag"
        label="备份结果"
        align="center"
      />

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="c_name"
        label="创建人"
      />
      <el-table-column
        sortable="custom"
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
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="u_name"
        label="更新人"
      />
      <el-table-column
        sortable="custom"
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
    <el-skeleton
      :rows="2"
      animated
      :loading="settings.skeletonLoading"
    >
      <pagination
        ref="minusPaging"
        :total="dataJson.paging.total"
        :page.sync="dataJson.paging.current"
        :limit.sync="dataJson.paging.size"
        @pagination="getDataList"
      />
    </el-skeleton>

    <ExportFileSettings
      v-if="popSettings.three.visible"
      :visible="popSettings.three.visible"
      @closeMeCancel="handleCloseExportFileSettingCancel"
      @closeMeOk="handleCloseExportFileSettingOk"
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

.el-skeleton__paragraph {
  /* 设置骨架单元格的样式 */
  margin-top: 1px; /* 调整骨架之间的水平间距 */
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
import SelectDict from '@/components/00_dict/select/SelectDict'
import { getListApi, exportApi, exportAllApi, exportDataApi, exportAllDataApi, getListSumApi, getCountApi, syncApi, syncAllApi, deleteApi } from '@/api/40_business/monitor/monitor'
import constants_para from '@/common/constants/constants_para'
import resizeMixin from './mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
import SelectOutWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBinForSearch'
import SelectInWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBinForSearch'
import urlUtil from '@/utils/urlUtil'
import ExportFileSettings from '@/views/40_business/monitor/tabs/dialog/exportFileSettings.vue'

export default {
  components: { ExportFileSettings, Pagination, SelectInWarehouse, SelectOutWarehouse, SelectDict },
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
          // settlement_status: null,
          waybill_contract_no: null,
          daterange1: [],
          daterange2: [],
          daterange3: [],
          daterange4: [],
          daterange: [],
          audit_ids: [],
          code: null
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
          showView: false,
          showExport: false,
          showExportData: false,
          showSync: false,
          // 删除按钮
          showDelete: false
        },
        // 分页插件骨架 loading 状态
        skeletonLoading: true,
        sumLoading: false,
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
        },
        // 文件导出弹出编辑页面
        three: {
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
        const screenKeys = ['out_plan_code', 'in_plan_code', 'waybill_code', 'goods_name', 'out_warehouse_name', 'in_warehouse_name', 'customer_name', 'driver_name', 'vehicle_no', 'out_type', 'in_type', 'daterange1', 'daterange2', 'daterange3', 'daterange4', 'settlement_status', 'in_audit_name', 'out_audit_name']
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
    // 物流单号
    if (this.$route.query.code !== null && this.$route.query.code !== undefined) {
      this.dataJson.searchForm.code = this.$route.query.code
      this.dataJson.searchForm.daterange = null
      this.dataJson.searchForm.start_time = null
      this.dataJson.searchForm.over_time = null
    }
    // 监管任务预警
    if (this.$route.query.sync_status !== null && this.$route.query.sync_status !== undefined) {
      this.dataJson.tabs.active = '8'
      this.dataJson.searchForm.active_tabs_index = '5'
      this.dataJson.searchForm.daterange = null
      this.dataJson.searchForm.start_time = null
      this.dataJson.searchForm.over_time = null
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
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
          break
        case '2':
          this.dataJson.tabs.active = '2'
          // 待入/待卸货
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
          break
        case '3':
          this.dataJson.tabs.active = '3'
          // 已完成
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
          break
        case '4':
          // 待出库审核
          this.dataJson.tabs.active = '4'
          this.dataJson.searchForm.settlement_status = ''
          this.dataJson.searchForm.audit_status_list = ['0', '4']
          this.dataJson.searchForm.audit_status = ''

          break
        case '5':
          // 待入库审核
          this.dataJson.tabs.active = '5'
          this.dataJson.searchForm.settlement_status = ''
          this.dataJson.searchForm.audit_status_list = ['0', '3']
          break
        case '6':
          // 审核通过
          this.dataJson.tabs.active = '6'
          this.dataJson.searchForm.settlement_status = ''
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = '2'
          break
        case '7':
          // 已结算
          this.dataJson.tabs.active = '7'
          this.dataJson.searchForm.settlement_status = '1'
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
          break
        default:
          this.dataJson.tabs.active = '0'
          // 全部
          this.dataJson.searchForm.audit_status_list = []
          this.dataJson.searchForm.audit_status = ''
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
          this.settings.btnShowStatus.showSync = true
          this.settings.btnShowStatus.showDelete = true
        } else {
          this.settings.btnShowStatus.showEnable = false
          this.settings.btnShowStatus.showDisable = false
          this.settings.btnShowStatus.showExport = false
          this.settings.btnShowStatus.showExportData = false
          this.settings.btnShowStatus.showSync = false
          this.settings.btnShowStatus.showDelete = false
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

          // 卸货完成 和 审核通过才能同步
          if (value.audit_status !== '2' || value.status !== '7') {
            _this.settings.btnShowStatus.showSync = false
          }

          // 只有作废的可以删除
          if (value.status !== '8') {
            _this.settings.btnShowStatus.showDelete = false
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
        if (this.dataJson.searchForm.daterange2 === null) {
          this.dataJson.searchForm.out_audit_start = null
          this.dataJson.searchForm.out_audit_end = null
        }
        if (this.dataJson.searchForm.daterange3 === null) {
          this.dataJson.searchForm.in_audit_start = null
          this.dataJson.searchForm.in_audit_end = null
        }
        if (this.dataJson.searchForm.daterange4 === null) {
          this.dataJson.searchForm.c_time_start = null
          this.dataJson.searchForm.c_time_end = null
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
      // 出库审核时间
      if (this.dataJson.searchForm.daterange2 !== null && this.dataJson.searchForm.daterange2 !== undefined && this.dataJson.searchForm.daterange2 !== '') {
        this.dataJson.searchForm.out_audit_start = this.dataJson.searchForm.daterange2[0]
        this.dataJson.searchForm.out_audit_end = this.dataJson.searchForm.daterange2[1]
      }
      // 入库审核时间
      if (this.dataJson.searchForm.daterange3 !== null && this.dataJson.searchForm.daterange3 !== undefined && this.dataJson.searchForm.daterange3 !== '') {
        this.dataJson.searchForm.in_audit_start = this.dataJson.searchForm.daterange3[0]
        this.dataJson.searchForm.in_audit_end = this.dataJson.searchForm.daterange3[1]
      }
      // 创建时间
      if (this.dataJson.searchForm.daterange4 !== null && this.dataJson.searchForm.daterange4 !== undefined && this.dataJson.searchForm.daterange4 !== '') {
        this.dataJson.searchForm.c_time_start = this.dataJson.searchForm.daterange4[0]
        this.dataJson.searchForm.c_time_end = this.dataJson.searchForm.daterange4[1]
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
      this.dataJson.searchForm.status = '8'
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.listData = response.data
        // this.dataJson.listData = response.data.records
        // this.dataJson.paging = response.data
        // this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
      // 查询总条数
      this.settings.skeletonLoading = true
      getCountApi(this.dataJson.searchForm).then(response => {
        this.dataJson.paging.total = response.data.count
        this.dataJson.paging.current = response.data.pageCondition.current
        this.dataJson.paging.size = response.data.pageCondition.size
      }).finally(() => {
        this.settings.skeletonLoading = false
      })
      // 查询合计信息, 查询前先初始化合计数据为 0
      this.dataJson.sumData = this.$options.data.call(this).dataJson.sumData
      this.settings.sumLoading = true
      getListSumApi(this.dataJson.searchForm).then(response => {
        if (response.data !== null) {
          this.dataJson.sumData = response.data
        } else {
          this.dataJson.sumData = this.$options.data.call(this).dataJson.sumData
        }
      }).finally(() => {
        this.settings.sumLoading = false
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
    handleExport () {
      this.popSettings.three.visible = true
      // 部分数据导出
      // this.handleExportSelectionData()
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
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnShowStatus.showView = true
      } else {
        this.settings.btnShowStatus.showView = false
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
          // this.$router.push({ name: constants_program.P_MONITOR })
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
        selectionJson.push(value.id)
      })
      const selection = { ids: selectionJson }
      // 开始导出
      exportDataApi(selection).then(response => {
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
      // // 默认查询近一个月内的数据
      // const end = new Date()
      // const start = new Date()
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      // this.dataJson.searchForm.daterange.push(start)
      // this.dataJson.searchForm.daterange.push(end)
      // this.dataJson.searchForm.start_time = start
      // this.dataJson.searchForm.over_time = end
    },
    // 同步
    handleSync () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行同步', '提示信息', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          // this.settings.btnStatus.showDelete = false
        })
      } else {
        // 选中数据同步
        this.handleSyncSelectionData()
      }
    },
    // 同步数据
    handleSyncSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始同步
      syncApi(selectionJson).then((_data) => {
        this.$notify({
          title: '同步成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        // this.getDataList()
        // loading
      }, (_error) => {
        this.$notify({
          title: '提交错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 全部同步
    handleSyncAll () {
      const temp = {}
      syncAllApi(temp).then((_data) => {
        this.$notify({
          title: '同步成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
      }, (_error) => {
        this.$notify({
          title: '提交错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 删除
    handleDelete () {
      this.$confirm('是否要删除选择的数据', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.settings.loading = true
        const selectionJson = []
        this.dataJson.multipleSelection.forEach(function (value, index, array) {
          selectionJson.push({ 'id': value.id })
        })
        // 开始同步
        deleteApi(selectionJson).then((_data) => {
          this.$notify({
            title: '删除成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          this.getDataList()
        }, (_error) => {
          this.$notify({
            title: '删除失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      })
    },
    // 附件导出 配置 取消
    handleCloseExportFileSettingCancel () {
      this.popSettings.three.visible = false
    },
    // 附件导出 配置 保存
    handleCloseExportFileSettingOk () {
      this.popSettings.three.visible = false
      this.handleExportSelectionData()
    }
  }
}
</script>
