<template>
  <div class="app-container">
    <FloatMenu />
    <el-tabs
      v-if="!meDialogStatus"
      ref="minusTabs"
      v-model="dataJson.tabs.active"
      type="card"
      @tab-click="handleTabsClick"
    >
      <el-tab-pane>
        <template slot="label">我的待办
          <el-badge
            :value="dataJson.tabsCount.todo"
            type="danger"
          />
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">我的已办

        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">全部
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
        <el-form-item>
          <el-input
            v-model.trim="dataJson.searchForm.contract_no"
            clearable
            placeholder="合同编号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.plan_code"
            clearable
            placeholder="计划单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-if="!isZhongLin"
            v-model="dataJson.searchForm.owner_name"
            :placeholder="isPlaceholderShow('请选择货主')"
            :disabled="isViewModel"
            filterable
            clearable
          >
            <el-option
              v-for="item in dataJson.ownerComboList"
              :key="item.id"
              :label="item.short_name"
              :value="item.short_name"
            />
          </el-select>

          <select-warehouse
            v-if="isZhongLin"
            v-model.trim="dataJson.searchForm.warehouse_name"
            :disabled="isViewModel"
            :reset="settings.reset3"
            placement="left"
            @closeParentDialog="handleDialogClose"
            @onReturnData="handleWarehouseReturnData"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <select-dicts
            v-model="dataJson.searchForm.status_list"
            :para="CONSTANTS.DICT_B_OUT_PLAN_STATUS"
            init-placeholder="请选择单据状态"
            :disabled="isViewModel"
          />
        </el-form-item>
        <el-form-item>
          <select-dict
            v-model="dataJson.searchForm.bill_type"
            :para="CONSTANTS.DICT_B_OUT_PLAN_BUSINESS_TYPE"
            init-placeholder="请选择单据类型"
            :disabled="isViewModel"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dataJson.searchForm.daterange"
            style="width: 285px"
            value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
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
            icon="el-icon-search"
            :loading="settings.loading"
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
        <el-form-item label="委托方">
          <select-consignor
            v-model.trim="dataJson.searchForm.consignor_name"
            :placeholder="isPlaceholderShow('请选择委托方')"
            :type="CONSTANTS.DICT_CONSIGNOR"
            :reset="settings.reset1"
            placement="left"
            @onReturnDataName="handleConsignorReturnDataName"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item
          v-if="!isZhongLin"
          label="仓库"
        >
          <select-warehouse
            v-model.trim="dataJson.searchForm.warehouse_name"
            :disabled="isViewModel"
            :reset="settings.reset3"
            placement="left"
            @closeParentDialog="handleDialogClose"
            @onReturnData="handleWarehouseReturnData"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item
          v-if="isZhongLin"
          label="货主"
        >
          <el-select
            v-model="dataJson.searchForm.owner_name"
            :placeholder="isPlaceholderShow('请选择货主')"
            :disabled="isViewModel"
            filterable
            clearable
          >
            <el-option
              v-for="item in dataJson.ownerComboList"
              :key="item.id"
              :label="item.short_name"
              :value="item.short_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出库类型">
          <select-dict
            v-model="dataJson.searchForm.type"
            :para="CONSTANTS.DICT_B_OUT_PLAN_TYPE"
            init-placeholder="出库类型"
            :filter-para="dataJson.searchForm.filter_type"
            :disabled="isViewModel || settings.isTypeFlag"
          />
        </el-form-item>
        <el-form-item label="物料编码或名称">
          <el-input
            v-model.trim="dataJson.searchForm.goods_name"
            clearable
            placeholder="物料编码或名称"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="客户">
          <select-supplier
            v-model.trim="dataJson.searchForm.customer_name"
            :placeholder="isPlaceholderShow('请选择客户')"
            :type="CONSTANTS.DICT_SUPPLIER"
            :disabled="isViewModel"
            :reset="settings.reset4"
            placement="left"
            @onReturnDataName="handleSupplierReturnDataName"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="型规">
          <el-input
            v-model.trim="dataJson.searchForm.type_gauge"
            clearable
            placeholder="型规"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item label="别称">
          <el-input
            v-model.trim="dataJson.searchForm.alias"
            clearable
            placeholder="别称"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="仓库类型">
          <select-dict
            v-model="dataJson.searchForm.warehouse_type"
            :para="CONSTANTS.DICT_M_WAREHOUSE_TYPE"
            init-placeholder="请选择仓库类型"
          />
        </el-form-item>
        <el-form-item label="同步状态">
          <el-select
            v-model="dataJson.searchForm.sync_status"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in dataJson.syncStatusList"
              :key="item.sync_status"
              :label="item.status_name"
              :value="item.sync_status"
            />
          </el-select>
        </el-form-item>
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
    <el-button-group v-if="!meDialogStatus">

      <el-button
        v-permission="'P_OUT_PLAN:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >
        新增
      </el-button>
      <el-button
        v-permission="'P_OUT_PLAN:UPDATE'"
        type="primary"
        :disabled="!settings.btnStatus.showUpdate"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleUpdate"
      >
        修改
      </el-button>
      <el-button
        v-permission="'P_OUT_PLAN:OUT_OPERATE'"
        type="primary"
        :disabled="!settings.btnStatus.showOperate"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleOut"
      >
        出库/收货操作
      </el-button>
      <el-button
        v-permission="'P_OUT_PLAN:SUBMIT'"
        :disabled="!settings.btnStatus.showSubmit"
        type="primary"
        icon="el-icon-circle-check"
        :loading="settings.loading"
        @click="handleSubmit"
      >提交</el-button>
      <el-button
        v-permission="'P_OUT_PLAN:AUDIT'"
        :disabled="!settings.btnStatus.showAudit"
        type="primary"
        icon="el-icon-check"
        :loading="settings.loading"
        @click="handleAudit"
      >审核</el-button>
      <el-button
        v-permission="'P_OUT_PLAN:REJECT'"
        :disabled="!settings.btnStatus.showReject"
        type="primary"
        icon="el-icon-close"
        :loading="settings.loading"
        @click="handleReject"
      >驳回</el-button>
      <el-button
        v-permission="'P_OUT_PLAN:CANCEL'"
        :disabled="!settings.btnStatus.showCancel"
        type="primary"
        icon="el-icon-circle-close"
        :loading="settings.loading"
        @click="handleCancel"
      >作废</el-button>
      <el-button
        v-permission="'P_OUT_PLAN:INFO'"
        :disabled="!settings.btnStatus.showView"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
      <el-button
        v-permission="'P_OUT_PLAN:FINISH'"
        :disabled="!settings.btnStatus.showFinish"
        type="primary"
        icon="el-icon-check"
        :loading="settings.loading"
        @click="handleFinish"
      >完成</el-button>
      <el-button
        v-permission="'P_OUT_PLAN:EXPORT'"
        :disabled="!settings.btnStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>
      <el-button
        :disabled="!settings.btnStatus.showSync"
        type="primary"
        icon="el-icon-circle-close"
        :loading="settings.loading"
        @click="handleSync"
      >同步</el-button>
      <!-- <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleSyncAll"
      >
        同步所有数据
      </el-button> -->

    </el-button-group>

    <div
      v-if="!meDialogStatus"
      class="div-sum"
    >
      <div class="right">
        <span class="count-title">计划出库数量：</span><span class="count-data">{{ dataJson.sumData.count >0? isZhongLin ? formatNumber3(dataJson.sumData.count) : formatNumber(dataJson.sumData.count,true,4):'0' }}</span>
        <span class="count-title">已出库数量：</span><span class="count-data">{{ dataJson.sumData.has_handle_count== null?'':isZhongLin ? formatNumber3(dataJson.sumData.has_handle_count) :formatNumber(dataJson.sumData.has_handle_count,true,4) }}</span>
        <span class="count-title">待出库数量：</span><span class="count-data">{{ dataJson.sumData.pending_count == null?'':dataJson.sumData.pending_count>0?isZhongLin ? formatNumber3(dataJson.sumData.pending_count) :formatNumber(dataJson.sumData.pending_count,true,4):'0' }}</span>
        <span class="count-title">退货数量：</span><span class="count-data">{{ dataJson.sumData.count_return_qty == null?'':dataJson.sumData.count_return_qty>0?isZhongLin ? formatNumber3(dataJson.sumData.count_return_qty) :formatNumber(dataJson.sumData.count_return_qty,true,4):'0' }}</span>

        <el-link
          v-if="dataJson.sumData.sync_error_count !== 0 && dataJson.sumData.sync_error_count != null"
          @click="searchSyncError"
        ><span class="count-title">同步失败数据：</span><span class="count-data">{{ dataJson.sumData.sync_error_count > 0?formatNumber(dataJson.sumData.sync_error_count):' - ' }}</span></el-link>

      </div>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      columns_index_key="true"
      stripe
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'u_time', order: 'descending'}"
      style="width: 100%"
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
        label="计划单号"
        :sort-orders="settings.sortOrders"
        :is_enable="true"
        align="center"
      >
        <el-table-column
          sortable="custom"
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="170"
          prop="plan_code"
          label="单号"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="55"
          prop="no"
          label="序号"
        />
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="130"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="plan_time"
        label="计划日期"
      >
        <template v-slot="scope">
          {{ scope.row.plan_time == null?'':formatDate(scope.row.plan_time) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="status_name"
        label="状态"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_counts"
        label="出库单数量"
      >
        <template v-slot="scope">
          <router-link v-if="scope.row.type !== '8'" :to="{name:constants_program.P_OUT,query:{plan_code:scope.row.plan_code, fullpath:true}}"><a href="javascript:void(0)">{{ scope.row.out_counts == null?0:scope.row.out_counts }}</a></router-link>
          <router-link v-if="scope.row.type === '8'" :to="{name:constants_program.P_RECEIVE,query:{plan_code:scope.row.plan_code, fullpath:true}}"><a href="javascript:void(0)">{{ scope.row.out_counts == null?0:scope.row.out_counts }}</a></router-link>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="contract_no"
        label="合同编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="order_no"
        label="订单编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="160"
        prop="extra_code"
        label="外部关联单号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="160"
        prop="release_order_code"
        label="放货指令编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="type_name"
        label="出库类型"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="warehouse_name"
        label="出货仓库"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="consignor_name"
        label="委托方"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="owner_name"
        label="货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="120"
        prop="customer_name"
        label="客户"
        :auto-fit="true"
      />

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="bill_type_name"
        label="单据类型"
      />
      <el-table-column
        sortable="custom"
        min-width="130"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="contract_dt"
        label="合同日期"
      >
        <template v-slot="scope">
          {{ scope.row.contract_dt == null?'':formatDate(scope.row.contract_dt) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="120"
        prop="contract_num"
        label="合同量"
        align="right"
      >
        <template v-slot="scope">
          {{ scope.row.contract_num == null ? '' : isZhongLin ? formatNumber3(scope.row.contract_num) :formatNumber(scope.row.contract_num,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="goods_name"
        label="物料名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="pm"
        label="品名"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="spec"
        label="规格"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="type_gauge"
        label="型规"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="alias"
        label="别称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="sku_code"
        label="规格编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="count"
        label="计划出库数量"
      >
        <template v-slot="scope">
          {{ isZhongLin ? formatNumber3(scope.row.count) : formatNumber(scope.row.count,true,4) }}
        </template>
      </el-table-column>

      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="unit_name"
        label="单位"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="weight"
        label="换算后数量"
      >
        <template v-slot="scope">
          {{ isZhongLin ? formatNumber3(scope.row.weight) : formatNumber(scope.row.weight,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="unit"
        label="单位"
      >
        <template>吨</template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="150"
        prop="has_handle_count"
        label="已出库数量"
        align="right"
      >
        <template v-slot="scope">
          {{ scope.row.has_handle_count == null? '': isZhongLin ? formatNumber3(scope.row.has_handle_count) : formatNumber(scope.row.has_handle_count,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="pending_count"
        label="待出库数量"
      >
        <template v-slot="scope">
          {{ scope.row.pending_count >0 ? isZhongLin ? formatNumber3(scope.row.pending_count) : formatNumber(scope.row.pending_count,true,4):'0' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="return_qty"
        label="退货数量"
      >   <template v-slot="scope"> {{ scope.row.return_qty > 0 ? scope.row.return_qty : '0' }}  </template></el-table-column>
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
        prop="remark"
        label="备注"
      />
      <el-table-column
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
          {{ formatDateTime(scope.row.c_time) }}
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
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.u_time) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="e_name"
        label="审核人"
      />
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="audit_dt"
        label="审核时间"
      >
        <template v-slot="scope">
          {{ scope.row.audit_dt == null?'':formatDateTime(scope.row.audit_dt) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="cancel_audit_name"
        label="作废审核人"
      />
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="cancel_audit_dt"
        label="作废审核时间"
      >
        <template v-slot="scope">
          {{ scope.row.cancel_audit_dt == null?'':formatDateTime(scope.row.cancel_audit_dt) }}
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
    <cancel-confirm-dialog
      v-if="popSettings.one.visible"
      :data="popSettings.one.props.data"
      :visible="popSettings.one.visible"
      :dialog-status="popSettings.one.props.dialogStatus"
      @closeMeOk="handleCloseDialogOneOk"
      @closeMeCancel="handleCloseDialogOneCancel"
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
  background-color: #f5f7fa;
  color: #666;
  font-size: 16px;
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
}
.right {
  position: absolute;
  right: 10px;
  margin-right: 10px;
}
.left {
  position: absolute;
  left: 10px;
  margin-left: 10px;
}
.count-data {
  color: #f00;
  font-size: 20px;
}
.count-title {
  margin-left: 10px;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
.perfect_popper .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
/* sumData处的 el-link */
.el-link.el-link--default {
  font-size: 16px;
  vertical-align: top;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-tabs {
  margin-bottom: 5px;
}
</style>

<script>
import SelectDict from '@/components/00_dict/select/SelectDict'
import SelectDicts from '@/components/00_dict/select/SelectDicts'
import constants_para from '@/common/constants/constants_para'
import constants_type from '@/common/constants/constants_dict'
import SelectConsignor from '@/views/30_wms/customer/selectgrid/selectCustomer'
import SelectSupplier from '@/views/30_wms/customer/selectgrid/selectCustomer'
import constants_program from '@/common/constants/constants_program'
import { getTodoCountApi, getListSumApi, exportAllApi, exportApi, getListApi, auditApi, submitApi, returnApi, cancelApi, syncApi, syncAllApi, finishApi, getDetailCountAPi, getListCountApi, cancelAuditApi, cancelReturnApi } from '@/api/40_business/outplan/outplan'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import mixin from './mixin/listResizeHandlerMixin'
import permission from '@/directive/permission/index.js' // 权限判断指令
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBinForSearch'
import cancelConfirmDialog from '@/views/40_business/outplan/tabs/dialog/cancelconfirm'
import Constants_dict from '@/common/constants/constants_dict'

export default {
  components: { Pagination, SelectDict, SelectDicts, SelectConsignor, SelectWarehouse, SelectSupplier, cancelConfirmDialog },
  directives: { elDragDialog, permission },
  mixins: [mixin],
  props: {
    // 自己作为弹出框时的参数
    meDialogStatus: {
      type: Boolean,
      default: false
    },
    dataModel: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
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
      constants_program: constants_program,
      dataJson: {
        tabsCount: {
          all: 0,
          todo: 0
        },
        // 判断出库计划的明细条数
        detail_count: 1,
        tabs: {
          active: '2'
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          contract_no: null,
          plan_code: '',
          daterange: [],
          // 查询条件
          consignor_id: '',
          owner_name: '',
          owner_id: '',
          status_list: ['0', '1', '2', '3', '5', '6', '7', '8'],
          warehouse_id: '',
          sync_status: null,
          warehouse_type: null,
          todo_status: '2',
          active_tabs_index: 2, // 当前被激活的页签
          // 不包含的类型
          filter_type: [],
          isFlag: false
        },
        // 同步状态
        syncStatusList: [
          { 'status_name': '同步成功', 'sync_status': '1' },
          { 'status_name': '同步失败', 'sync_status': '0' }
        ],
        todoSearchForm: {},
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        sumData: {
          pending_count: 0,
          weight: 0,
          sync_error_count: 0,
          count: 0
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
        // 分页插件骨架 loading 状态
        skeletonLoading: true,
        // 重置
        reset1: false,
        reset2: false,
        reset3: false,
        reset4: false,
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnStatus: {
          showEnable: false,
          showDisable: false,
          showUpdate: false,
          showOperate: false,
          showView: false,
          showSubmit: false,
          showExport: false,
          showAudit: false,
          showReject: false,
          showCancel: false,
          showFinish: false,
          showSync: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000,
        isTypeFlag: false
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
        two: {
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
    // 是否为查看模式
    isViewModel () {
      if ((this.popSettingsData.dialogStatus === 'view') && (this.popSettingsData.dialogFormVisible === true)) {
        // 查看模式
        return true
      } else {
        // 非查看模式
        return false
      }
    },
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
    // 全屏loading
    'settings.loading': {
      handler (newVal, oldVal) {
        switch (newVal) {
          case true:
            this.showLoading('正在查询，请稍后...')
            break
          case false:
            this.closeLoading()
            break
        }
      }
    },
    'dataJson.multipleSelection': {
      deep: true,
      handler (newVal, oldVal) {
        const screenKeys = ['consignor_name', 'type', 'goods_name', 'customer_name', 'sync_status', 'warehouse_type']
        const { searchForm } = this.dataJson
        const data = Object.keys(searchForm).map(item => {
          if (screenKeys.includes(item)) {
            if (searchForm[item] || searchForm[item] === 0) {
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
    this.setDateRange()
    // 接收url参数
    if (this.$route.query.code !== null && this.$route.query.code !== undefined) {
      this.dataJson.searchForm.plan_code = this.$route.query.code
      this.dataJson.tabs.active = '2'

      this.dataJson.searchForm.daterange = []
      this.dataJson.searchForm.start_time = null
      this.dataJson.searchForm.over_time = null
    }
    // 接收url参数
    if (this.$route.query.contract_no != null && this.$route.query.contract_no !== undefined) {
      this.dataJson.searchForm.contract_no = this.$route.query.contract_no
      this.dataJson.tabs.active = '2'
    }
    // 出库计划单号
    if (this.$route.query.serial_code !== null && this.$route.query.serial_code !== undefined) {
      this.dataJson.searchForm.plan_code = this.$route.query.serial_code
      this.dataJson.tabs.active = '2'

      this.dataJson.searchForm.daterange = []
      this.dataJson.searchForm.start_time = null
      this.dataJson.searchForm.over_time = null
    }
    if (this.meDialogStatus) {
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.contract_no = this.data.contract_no
      this.dataJson.searchForm.status = this.data.status
      this.dataJson.tabs.active = '2'

      if (this.data.type !== null && this.data.type === this.CONSTANTS.DICT_B_OUT_PLAN_TYPE_ZC) {
        this.dataJson.searchForm.contract_no = ''
        this.dataJson.searchForm.status_list = [this.data.status]
        this.dataJson.searchForm.type = this.data.type
        this.settings.isTypeFlag = true
      }
      // 物流订单查询不包含类型
      if (this.data.filter_type !== null && this.data.filter_type !== undefined) {
        this.dataJson.searchForm.filter_type = this.data.filter_type
      }
    }
    if (this.$route.query.sync_status !== null && this.$route.query.sync_status !== undefined) {
      this.dataJson.searchForm.sync_status = this.$route.query.sync_status + ''
      this.dataJson.tabs.active = '2'

      this.dataJson.searchForm.daterange = []
      this.dataJson.searchForm.start_time = null
      this.dataJson.searchForm.over_time = null
    }

    // 初始化watch
    this.setWatch()
    // 初始化货主下拉框
    this.getOwnerData()
    // 初始化仓库下拉框
    this.getWarehouseData()
    // 初始化查询
    this.getDataList()
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      const _this = this
      _this.watch.unwatch_tempJson = _this.$watch('dataJson.multipleSelection', (newVal, oldVal) => {
        if (newVal.length > 0) {
          _this.settings.btnStatus.showEnable = true
          _this.settings.btnStatus.showDisable = true
          _this.settings.btnStatus.showSubmit = true
          _this.settings.btnStatus.showAudit = true
          _this.settings.btnStatus.showReject = true
          _this.settings.btnStatus.showFinish = true
          _this.settings.btnStatus.showSync = true
          _this.settings.btnStatus.showExport = true
        } else {
          _this.settings.btnStatus.showEnable = false
          _this.settings.btnStatus.showDisable = false
          _this.settings.btnStatus.showSubmit = false
          _this.settings.btnStatus.showAudit = false
          _this.settings.btnStatus.showReject = false
          _this.settings.btnStatus.showFinish = false
          _this.settings.btnStatus.showSync = false
          _this.settings.btnStatus.showExport = false
        }

        _this.dataJson.multipleSelection.forEach(function (value, index, array) {
          if (value.status !== constants_type.DICT_B_OUT_PLAN_STATUS_ZD) {
            if (value.status === constants_type.DICT_B_OUT_PLAN_STATUS_BH) {
              // 审核驳回后可再次提交
              _this.settings.btnStatus.showSubmit = true
            } else {
              // 非制单状态不可提交
              _this.settings.btnStatus.showSubmit = false
            }
          }

          if (value.status !== constants_type.DICT_B_OUT_PLAN_STATUS_YTJ && value.status !== constants_type.DICT_B_OUT_PLAN_STATUS_CANCEL_BEING_AUDITED) {
            // 非已提交状态不可审核/驳回
            _this.settings.btnStatus.showAudit = false
            _this.settings.btnStatus.showReject = false
          }

          if (value.status !== constants_type.DICT_B_OUT_PLAN_STATUS_TG) {
            // 非审核通过状态不可完成
            _this.settings.btnStatus.showFinish = false
          }
        })
      }, { deep: true }
      )
      this.watch.unwatch_tempJson1 = this.$watch('dataJson.searchForm.daterange', (newVal, oldVal) => {
        if (this.dataJson.searchForm.daterange === null) {
          this.dataJson.searchForm.start_time = null
          this.dataJson.searchForm.over_time = null
        }
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }

      if (this.watch.unwatch_tempJson1) {
        this.watch.unwatch_tempJson1()
      }
    },
    // 弹出框设置初始化
    initDialogStatus () {

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
      if (this.dataJson.searchForm.daterange !== null && this.dataJson.searchForm.daterange !== undefined && this.dataJson.searchForm.daterange !== '') {
        this.dataJson.searchForm.start_time = this.dataJson.searchForm.daterange[0]
        this.dataJson.searchForm.over_time = this.dataJson.searchForm.daterange[1]
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
      // 查询逻辑
      this.settings.loading = true
      // 第一版, 列表和 数量查询不分开
      // getListApi(this.dataJson.searchForm).then(response => {
      //   this.dataJson.listData = response.data.records
      //   this.dataJson.paging = response.data
      //   this.dataJson.paging.records = {}
      // }).finally(() => {
      //   this.settings.loading = false
      // })
      // 第二版 列表 和 数量查询分开
      getListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data
      }).finally(() => {
        this.settings.loading = false
      })
      // 查询总数量
      this.settings.skeletonLoading = true
      getListCountApi(this.dataJson.searchForm).then(response => {
        this.dataJson.paging.total = response.data.total_count
        this.dataJson.paging.current = response.data.pageCondition.current
        this.dataJson.paging.size = response.data.pageCondition.size
      }).finally(() => {
        this.settings.skeletonLoading = false
      })

      // 查询合计信息
      getListSumApi(this.dataJson.searchForm).then(response => {
        if (response.data !== null) {
          this.dataJson.sumData = response.data
        } else {
          this.dataJson.sumData.pending_count = 0
          this.dataJson.sumData.has_handle_count = 0
          this.dataJson.sumData.count = 0
          this.dataJson.sumData.sync_error_count = 0
        }
      }).finally(() => {
      })

      // 查询逻辑
      getTodoCountApi(this.dataJson.searchForm).then(response => {
        if (response.data !== null) {
          this.dataJson.tabsCount.todo = response.data
        } else {
          this.dataJson.tabsCount.todo = 0
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 重置查询区域
    doResetSearch () {
      const todo_status = this.dataJson.searchForm.todo_status
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.dataJson.searchForm.todo_status = todo_status
      this.dataJson.searchForm.warehouse_name = ''
      this.dataJson.searchForm.owner_name = ''
      this.dataJson.searchForm.consignor_name = ''
      this.dataJson.searchForm.customer_name = ''

      // 不重置过滤属性
      this.dataJson.searchForm.filter_type = this.data.filter_type

      // 重置货主、客户、仓库等组件
      this.settings.reset1 = !this.settings.reset1
      this.settings.reset2 = !this.settings.reset2
      this.settings.reset3 = !this.settings.reset3
      this.settings.reset4 = !this.settings.reset4

      this.setDateRange()
    },

    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },

    // 点击按钮 新增
    handleInsert () {
      // 新增
      // this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_INSERT
      // this.popSettings.one.visible = true
      // this.$router.push({
      //   name: 'P00000113', params: { routeParams: this.popSettings.one.props.data, canEdit: true, editStatus: constants_para.STATUS_INSERT }
      // })
      // 打开新增页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '正在新增出库计划' },
        canEdit: true,
        editStatus: constants_para.STATUS_INSERT
      }

      this.$emit('emitInsert', operate_tab_data)
    },
    // 点击按钮 更新
    handleUpdate () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.status === '1') {
        this.showErrorMsg('已提交的数据不允许操作')
        return
      }
      if (this.popSettings.one.props.data.status === '2') {
        this.showErrorMsg('已审核通过的数据不允许操作')
        return
      }
      if (this.popSettings.one.props.data.status === '4') {
        this.showErrorMsg('已作废的数据不允许操作')
        return
      }
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 更新
      // this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      // this.popSettings.one.visible = true
      // this.$router.push({
      //   name: 'P00000113', params: { routeParams: this.popSettings.one.props.data, canEdit: true, editStatus: constants_para.STATUS_UPDATE }
      // })
      // 打开编辑页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '正在编辑出库计划' },
        canEdit: true,
        editStatus: constants_para.STATUS_UPDATE,
        data: this.popSettings.one.props.data
      }

      this.$emit('emitUpdate', operate_tab_data)
    },
    handleOut () {
      this.popSettings.two.props.data = Object.assign({}, this.dataJson.currentJson)

      if (this.popSettings.two.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 提库操作
      if (this.popSettings.two.props.data.type === Constants_dict.DICT_B_RECEIVE_TYPE_EIGHT) {
        const operate_tab_data = {
          operate_tab_info: { show: true, name: '正在收货库操作' },
          canEdit: true,
          editStatus: constants_para.STATUS_UPDATE,
          data: this.popSettings.two.props.data
        }

        this.$emit('emitOperateReceive', operate_tab_data)
      } else {
        const operate_tab_data = {
          operate_tab_info: { show: true, name: '正在出库操作' },
          canEdit: true,
          editStatus: constants_para.STATUS_UPDATE,
          data: this.popSettings.two.props.data
        }

        this.$emit('emitOperate', operate_tab_data)
      }
    },
    // 点击按钮 查看
    handleView () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_VIEW
      // this.popSettings.one.visible = true
      // this.$router.push({
      //   name: 'P00000113', params: { routeParams: this.popSettings.one.props.data, canEdit: true, editStatus: constants_para.STATUS_VIEW }
      // })
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '查看出库计划' },
        canEdit: false,
        editStatus: constants_para.STATUS_VIEW,
        data: this.popSettings.one.props.data
      }

      this.$router.push({
        query: {}
      })

      this.$emit('emitView', operate_tab_data)
    },
    // ------------------编辑弹出框 end--------------------
    renderHeaderIsEnabled: function (h, { column }) {
      return (
        <span>{column.label}
          <el-tooltip
            class='item'
            effect='dark'
            placement='bottom'
          >
            <div slot='content'>
              删除状态提示：<br />
              绿色：已启用  <br />
              红色：未启用
            </div>
            <svg-icon icon-class='perfect-icon-question1_btn' style='margin-left: 5px' />
          </el-tooltip>
        </span>
      )
    },

    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnStatus.showUpdate = true
        this.settings.btnStatus.showView = true
        this.settings.btnStatus.showCancel = true

        if (this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_ZF || this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_EXPIRES ||
          this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_CANCEL_BEING_AUDITED || this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_YTJ) {
          // 已作废的状态不可重复作废, 已提交的不作废
          this.settings.btnStatus.showCancel = false
        }
      } else {
        this.settings.btnStatus.showUpdate = false
        this.settings.btnStatus.showView = false
        this.settings.btnStatus.showCancel = false
      }

      // 制单，驳回可修改
      if ((this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_ZD || this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_BH)) {
        this.settings.btnStatus.showUpdate = true
      } else {
        this.settings.btnStatus.showUpdate = false
      }

      // 中止 不可操作
      // if (this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_DISCONTINUE) {
      //   this.settings.btnStatus.showCancel = false
      // }

      // 审核通过可入库操作,并且来源不为调度任务
      if (this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_TG && this.dataJson.currentJson.allocate_detail_id === null) {
        this.settings.btnStatus.showOperate = true
      } else {
        this.settings.btnStatus.showOperate = false
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
    // ------------------出库操作弹出框 start--------------------
    handleCloseDialogTwoOk (val) {
      this.popSettings.two.visible = false
    },
    handleCloseDialogTwoCancel () {
      this.popSettings.two.visible = false
    },
    // 审核按钮
    handleAudit () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行审核', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showDelete = false
        })
      } else {
        // 选中数据审核
        // this.handleAuditSelectionData()
        this.handleDetailCountAudit()
      }
    },
    // 审核数据明细条数
    handleDetailCountAudit () {
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'plan_id': value.plan_id, 'dbversion': value.dbversion })
      })
      getDetailCountAPi(selectionJson).then(response => {
        this.dataJson.detail_count = response.data

        if (this.dataJson.detail_count !== 1) {
          this.$confirm('确定要审核该计划单号吗？该计划单号下存在' + this.dataJson.detail_count + '条明细, 审核会更新所有出库计划明细的状态(审核通过).', '未选择数据错误', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认',
            cancelButtonText: '关闭'
          }).then(() => {
            // 选中数据提交
            this.handleAuditSelectionData()
          }).catch(action => {
            // 右上角X
            if (action !== 'close') {
              // 当前页所选择的数据导出
              return
            }
          })
        } else {
          // 选中数据提交
          this.handleAuditSelectionData()
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 审核数据
    handleAuditSelectionData () {
      // loading
      this.settings.loading = true
      // const selectionJson = []
      const auditSelectionJson = []
      const cancelAuditSelectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        // selectionJson.push({ 'id': value.id, 'plan_id': value.plan_id })
        // 若状态未待审核,则加入到auditSelectionJson,若状态未作废待审核，则加入到cancelAuditSelectionJson
        if (value.status === constants_type.DICT_B_OUT_PLAN_STATUS_CANCEL_BEING_AUDITED) {
          cancelAuditSelectionJson.push({ 'id': value.id, 'plan_id': value.plan_id })
        } else if (value.status === constants_type.DICT_B_OUT_PLAN_STATUS_YTJ) {
          auditSelectionJson.push({ 'id': value.id, 'plan_id': value.plan_id })
        }
      })

      if (auditSelectionJson.length > 0) {
        // 开始审核
        auditApi(auditSelectionJson).then((_data) => {
          this.$notify({
            title: '审核成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          this.getDataList()
          // loading
        }, (_error) => {
          this.$notify({
            title: '审核错误',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      }

      if (cancelAuditSelectionJson.length > 0) {
        // 开始审核
        cancelAuditApi(cancelAuditSelectionJson).then((_data) => {
          this.$notify({
            title: '审核成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          this.getDataList()
          // loading
        }, (_error) => {
          this.$notify({
            title: '审核错误',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      }
    },
    // 驳回数据前, 判断是否有多个明细
    handDetailCountReject () {
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'plan_id': value.plan_id })
      })
      getDetailCountAPi(selectionJson).then(response => {
        this.dataJson.detail_count = response.data

        let _message = '确定要驳回该计划单号吗？ '
        if (this.dataJson.detail_count !== 1) {
          _message = '确定要驳回该计划单号吗？ 该计划单号下存在' + this.dataJson.detail_count + '条明细, 驳回会更新所有出库计划明细的状态(审核驳回)。'
        }

        this.$confirm(_message, '提示信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '关闭'
        }).then(() => {
          // 选中数据提交
          this.handleRejectSelectionData()
        }).catch(action => {
          // 右上角X
          if (action !== 'close') {
            return
          }
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 驳回按钮
    handleReject () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行驳回', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showDelete = false
        })
      } else {
        // 选中数据驳回
        // this.handleRejectSelectionData()
        this.handDetailCountReject()
      }
    },
    // 驳回数据
    handleRejectSelectionData () {
      // loading
      this.settings.loading = true
      // const selectionJson = []
      const auditSelectionJson = []
      const cancelAuditSelectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        // selectionJson.push({ 'id': value.id, 'plan_id': value.plan_id })
        if (value.status === constants_type.DICT_B_OUT_PLAN_STATUS_CANCEL_BEING_AUDITED) {
          cancelAuditSelectionJson.push({ 'id': value.id, 'plan_id': value.plan_id })
        } else if (value.status === constants_type.DICT_B_OUT_PLAN_STATUS_YTJ) {
          auditSelectionJson.push({ 'id': value.id, 'plan_id': value.plan_id })
        }
      })

      if (auditSelectionJson.length > 0) {
        // 开始驳回
        returnApi(auditSelectionJson).then((_data) => {
          this.$notify({
            title: '驳回成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          this.getDataList()
          // loading
        }, (_error) => {
          this.$notify({
            title: '驳回错误',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      }

      if (cancelAuditSelectionJson.length > 0) {
        // 开始驳回
        cancelReturnApi(cancelAuditSelectionJson).then((_data) => {
          this.$notify({
            title: '驳回成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          this.getDataList()
          // loading
        }, (_error) => {
          this.$notify({
            title: '驳回错误',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      }
    },
    // 作废按钮
    handleCancel () {
      // 状态为制单或驳回的数据才弹窗
      if (this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_ZD || this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_BH) {
        let msg = '该单据为制单状态，点击作废将直接更新状态为作废，请谨慎操作。确定要作废吗？'
        if (this.dataJson.currentJson.status === constants_type.DICT_B_OUT_PLAN_STATUS_BH) {
          msg = '该单据为驳回状态，点击作废将直接更新状态为作废，请谨慎操作。确定要作废吗？'
        }

        this.$confirm(msg, '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.handleCancelOk()
        }).catch(action => {
          // 右上角X
          if (action !== 'close') {
            // 当前页所选择的数据导出
            // this.handleExportSelectionData()
          }
        })
      } else {
        this.handleCancelOk()
      }
    },
    // 确认作废
    handleCancelOk () {
      this.popSettings.one.visible = true
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.one.props.data = this.dataJson.currentJson
      this.popSettings.one.visible = true
    },
    // 查询作废的出库计划单存在多少个详情
    handleCloseDialogOneOk (val) {
      this.settings.loading = true
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      const selectionJson = []
      selectionJson.push({ 'id': this.popSettings.one.props.data.id, 'remark': val.remark, 'plan_id': this.popSettings.one.props.data.plan_id })
      getDetailCountAPi(selectionJson).then(response => {
        this.dataJson.detail_count = response.data
        if (this.dataJson.detail_count !== 1) {
          this.$confirm('确定要作废该计划单号吗？该计划单号下存在' + this.dataJson.detail_count + '条明细, 作废会更新所有出库计划明细的状态(已作废).', '未选择数据错误', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认',
            cancelButtonText: '关闭'
          }).then(() => {
            // 选中数据提交
            this.handleCancelData(val)
          }).catch(action => {
            // 右上角X
            if (action !== 'close') {
              // 当前页所选择的数据导出
              return
            }
          })
        } else {
          // 选中数据提交
          this.handleCancelData(val)
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    handleCancelData (val) {
      // 作废
      // 设置到table中绑定的json数据源
      this.settings.loading = true
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      const selectionJson = []
      selectionJson.push({ 'id': this.popSettings.one.props.data.id, 'remark': val.remark, 'plan_id': this.popSettings.one.props.data.plan_id })
      this.showLoading('正在保存，请稍后...')
      // 开始作废
      cancelApi(selectionJson).then((_data) => {
        this.$notify({
          title: '作废成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.popSettings.one.visible = false
        this.getDataList()
        // loading
      }, (_error) => {
        this.$notify({
          title: '作废错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
      })
    },
    handleCloseDialogOneCancel () {
      this.popSettings.one.visible = false
    },
    // 提交按钮
    handleSubmit () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行提交', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showDelete = false
        })
      } else {
        // 选中数据提交
        this.handDetailCountSubmit()
      }
    },
    // 提交数据前, 判断是否有多个明细
    handDetailCountSubmit () {
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'plan_id': value.plan_id, 'dbversion': value.dbversion })
      })
      getDetailCountAPi(selectionJson).then(response => {
        this.dataJson.detail_count = response.data

        if (this.dataJson.detail_count !== 1) {
          this.$confirm('确定要提交该计划单号吗？该计划单号下存在' + this.dataJson.detail_count + '条明细, 提交会更新所有出库计划明细的状态(已提交).', '未选择数据错误', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认',
            cancelButtonText: '关闭'
          }).then(() => {
            // 选中数据提交
            this.handleSubmitSelectionData()
          }).catch(action => {
            // 右上角X
            if (action !== 'close') {
              // 当前页所选择的数据导出
              return
            }
          })
        } else {
          // 选中数据提交
          this.handleSubmitSelectionData()
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 提交数据
    handleSubmitSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id, 'plan_id': value.plan_id })
      })
      // 开始提交
      submitApi(selectionJson).then((_data) => {
        this.$notify({
          title: '提交成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.getDataList()
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
    // 同步按钮
    handleSync () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行同步', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showDelete = false
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
        this.getDataList()
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
    // 同步所有数据按钮
    handleSyncAll () {
      this.handleSyncAllData()
    },
    // 同步所有数据
    handleSyncAllData () {
      // loading
      this.settings.loading = true
      var tempData = {}
      // 开始同步
      syncAllApi(tempData).then((_data) => {
        this.$notify({
          title: '同步成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.getDataList()
        // loading
      }, (_error) => {
        this.$notify({
          title: '同步错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
        // 默认选中第一条
        // this.dataJson.searchForm.owner_name = deepCopy(_data.data[0].short_name)
      }, (_error) => {
      })
    },
    getWarehouseData () {
      getWarehouseComboListApi().then((_data) => {
        this.dataJson.warehouseComboList = _data.data
      }, (_error) => {
      })
    },
    handleConsignorReturnDataName (val) {
      this.dataJson.searchForm.consignor_name = val
    },
    handleSupplierReturnDataName (val) {
      this.dataJson.searchForm.customer_name = val
    },
    handleTabsClick (tab, event) {
      if (this.dataJson.searchForm.active_tabs_index === tab.index) {
        return
      }
      switch (tab.index) {
        case '0':
          // 待办
          this.dataJson.searchForm.todo_status = '0'

          break
        case '1':
          // 已办
          this.dataJson.searchForm.todo_status = '1'

          break
        case '2':
          // 所有数据
          this.dataJson.searchForm.todo_status = '2'

          break
      }
      this.getDataList()
      this.dataJson.searchForm.active_tabs_index = tab.index
    },
    // 仓库
    handleWarehouseReturnData (val) {
      if (val === null) {
        // 仓库
        this.dataJson.searchForm.warehouse_id = null
        this.dataJson.searchForm.warehouse_name = null
      } else {
        // 仓库
        this.dataJson.searchForm.warehouse_id = val.warehouse_id
        this.dataJson.searchForm.warehouse_name = val.warehouse_name
      }
    },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    },
    // 导出按钮
    handleExport () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行导出', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showExport = false
        })
      } else if (this.dataJson.multipleSelection.length === this.dataJson.listData.length) {
        // 选择全部的时候
        this.$confirm('请选择：当前页数据导出，全数据导出？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '全部导出',
          cancelButtonText: '当前页数据导出'
        }).then(() => {
          this.handleExportAllData()
        }).catch(action => {
          // 右上角X
          if (action !== 'close') {
            // 当前页所选择的数据导出
            this.handleExportSelectionData()
          }
        })
      } else {
        // 部分数据导出
        this.handleExportSelectionData()
      }
    },
    // 全部数据导出
    handleExportAllData () {
      // loading
      this.settings.loading = true
      // 开始导出
      exportAllApi(this.dataJson.searchForm).then(response => {
        this.settings.loading = false
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 部分数据导出
    handleExportSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始导出
      exportApi(selectionJson).then(response => {
        this.settings.loading = false
      })
    },
    // 完成按钮
    handleFinish () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行完成', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showDelete = false
        })
      } else {
        // 选中数据完成
        // this.handleFinishSelectionData()
        this.handleDetailCountFinish()
      }
    },
    // 查询完成时有多少条详情数据
    handleDetailCountFinish () {
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'plan_id': value.plan_id })
      })
      getDetailCountAPi(selectionJson).then(response => {
        this.dataJson.detail_count = response.data
        if (this.dataJson.detail_count !== 1) {
          this.$confirm('确定要完成该计划单号吗？该计划单号下存在' + this.dataJson.detail_count + '条明细, 完成会更新所有出库计划明细的状态(已完成).', '未选择数据错误', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认',
            cancelButtonText: '关闭'
          }).then(() => {
            // 选中数据提交
            this.handleFinishSelectionData()
          }).catch(action => {
            // 右上角X
            if (action !== 'close') {
              // 当前页所选择的数据导出
              return
            }
          })
        } else {
          // 选中数据提交
          this.handleFinishSelectionData()
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 完成数据
    handleFinishSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id, 'plan_id': value.plan_id })
      })
      // 开始完成
      finishApi(selectionJson).then((_data) => {
        this.$notify({
          title: '完成成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.getDataList()
        // loading
      }, (_error) => {
        this.$notify({
          title: '完成错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 点击查询, 同步状态为同步失败
    searchSyncError () {
      this.dataJson.searchForm.sync_status = '0'
      this.handleSearch()
    },
    // 设置创建时间的默认时间
    setDateRange () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      this.dataJson.searchForm.daterange.push(start)
      this.dataJson.searchForm.daterange.push(end)
      this.dataJson.searchForm.start_time = start
      this.dataJson.searchForm.over_time = end
    }
  }
}
</script>
