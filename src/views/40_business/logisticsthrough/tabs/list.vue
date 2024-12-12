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
            placeholder="物流单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <select-dict
            v-model="dataJson.searchForm.type"
            :para="CONSTANTS.DICT_B_SCHEDULE_TYPE"
            init-placeholder="单据类型"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.waybill_contract_no"
            clearable
            placeholder="物流合同号"
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
          <select-dicts
            v-model="dataJson.searchForm.status_list"
            :para="CONSTANTS.DICT_B_SCHEDULE_STATUS"
            init-placeholder="单据状态"
          />
        </el-form-item>
        <el-form-item>
          <select-dict
            v-model="dataJson.searchForm.batch"
            :para="CONSTANTS.DICT_BUSINESS_START_TIME"
            init-placeholder="业务启动日期"
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

        <el-form-item label="物料名称/物料编码">
          <el-input
            v-model.trim="dataJson.searchForm.goods_name"
            clearable
            placeholder="物料名称/物料编码"
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
        <el-form-item label="发货委托方">
          <select-out-consignor
            v-model.trim="dataJson.searchForm.out_consignor_name"
            :placeholder="isPlaceholderShow('请选择委托方')"
            :type="CONSTANTS.DICT_CONSIGNOR"
            :reset="settings.reset1"
            placement="left"
            @onReturnDataName="handleOutConsignorReturnDataName"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="发货货主">
          <el-select
            v-model="dataJson.searchForm.out_owner_name"
            :placeholder="isPlaceholderShow('发货货主')"
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
        <el-form-item label="发货仓库类型">
          <select-dicts
            v-model="dataJson.searchForm.out_warehouse_types"
            :para="CONSTANTS.DICT_M_WAREHOUSE_TYPE"
            init-placeholder="发货仓库类型"
          />
        </el-form-item>
        <el-form-item label="发货地">
          <select-out-warehouse
            v-model.trim="dataJson.tempJson.out_warehouse_name"
            :disabled="isViewModel"
            :reset="settings.reset3"
            placement="left"
            @closeParentDialog="handleDialogClose"
            @onReturnData="handleOutWarehouseReturnData"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="出库计划单号">
          <el-input
            v-model.trim="dataJson.searchForm.out_plan_code"
            clearable
            placeholder="出库计划单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="收货类型">
          <select-dict
            v-model="dataJson.searchForm.in_type"
            :para="CONSTANTS.DICT_MONITOR_TYPE_IN"
            init-placeholder="收货类型"
          />
        </el-form-item>
        <el-form-item label="收货委托方">
          <select-in-consignor
            v-model.trim="dataJson.searchForm.in_consignor_name"
            :placeholder="isPlaceholderShow('请选择委托方')"
            :type="CONSTANTS.DICT_CONSIGNOR"
            :reset="settings.reset4"
            placement="left"
            @onReturnDataName="handleInConsignorReturnDataName"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="收货货主">
          <el-select
            v-model="dataJson.searchForm.in_owner_name"
            :placeholder="isPlaceholderShow('收货货主')"
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
        <el-form-item label="收货仓库类型">
          <select-dicts
            v-model="dataJson.searchForm.in_warehouse_types"
            :para="CONSTANTS.DICT_M_WAREHOUSE_TYPE"
            init-placeholder="收货仓库类型"
          />
        </el-form-item>
        <el-form-item label="收货地">
          <select-in-warehouse
            v-model.trim="dataJson.searchForm.in_warehouse_name"
            :disabled="isViewModel"
            :reset="settings.reset6"
            placement="left"
            @closeParentDialog="handleDialogClose"
            @onReturnData="handleInWarehouseReturnData"
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
        <el-form-item label="承运商">
          <select-customer
            v-model.trim="dataJson.searchForm.customer_name"
            :placeholder="isPlaceholderShow('请选择承运商')"
            :type="CONSTANTS.DICT_CONSIGNOR"
            :reset="settings.reset5"
            placement="left"
            @onReturnDataName="handleCustomerReturnDataName"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间起止">
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
        v-permission="'P_LOGISTICSTHROUGH:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >
        新增
      </el-button>
      <el-button
        v-permission="'P_LOGISTICSTHROUGH:SUBMIT'"
        :disabled="!settings.btnStatus.showSubmit"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleSubmit"
      >提交</el-button>
      <el-button
        v-permission="'P_LOGISTICSTHROUGH:AUDIT'"
        :disabled="!settings.btnStatus.showAudit"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleAudit"
      >审核</el-button>
      <el-button
        v-permission="'P_LOGISTICSTHROUGH:REJECT'"
        :disabled="!settings.btnStatus.showReject"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleReject"
      >驳回</el-button>
      <el-button
        v-permission="'P_LOGISTICSTHROUGH:FINISH'"
        :disabled="!settings.btnStatus.showFinish"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleFinish"
      >完成</el-button>
      <el-button
        v-permission="'P_LOGISTICSTHROUGH:ENABLE'"
        :disabled="!settings.btnStatus.showEnable"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleEnable"
      >重启</el-button>
      <el-button
        v-permission="'P_LOGISTICSTHROUGH:INFO'"
        :disabled="!settings.btnStatus.showView"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
      <el-button
        v-permission="'P_LOGISTICSTHROUGH:EXPORT'"
        :disabled="!settings.btnStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>
      <el-button
        v-permission="'P_LOGISTICSTHROUGH:UPDATE'"
        :disabled="!settings.btnStatus.showUpdate"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        v-permission="'P_LOGISTICSTHROUGH:CANCEL'"
        :disabled="!settings.btnStatus.showCancel"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleCancel"
      >作废</el-button>
      <el-button
        v-permission="'P_LOGISTICSTHROUGH:DELETE'"
        :disabled="!settings.btnStatus.showDelete"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleDelete"
      >删除</el-button>

    </el-button-group>

    <div
      v-if="!meDialogStatus"
      class="div-sum"
    >
      <div class="right">
        <span class="count-title">已发货数量：</span><span class="count-data">{{ dataJson.sumData.out_operated_qty == null?'0':dataJson.sumData.out_operated_qty>0? isZhongLin ? formatNumber3(dataJson.sumData.out_operated_qty) : formatNumber(dataJson.sumData.out_operated_qty,true,4):0 }}</span>
        <span class="count-title">已收货数量：</span><span class="count-data">{{ dataJson.sumData.in_operated_qty == null?'0':dataJson.sumData.in_operated_qty>0? isZhongLin ? formatNumber3(dataJson.sumData.in_operated_qty) : formatNumber(dataJson.sumData.in_operated_qty,true,4):0 }}</span>
        <span class="count-title">超收数量：</span><span class="count-data">{{ dataJson.sumData.in_over_qty == null?'0':dataJson.sumData.in_over_qty>0? isZhongLin ? formatNumber3(dataJson.sumData.in_over_qty) : formatNumber(dataJson.sumData.in_over_qty,true,4):0 }}</span>
        <span class="count-title">超发数量：</span><span class="count-data">{{ dataJson.sumData.out_over_qty == null?'0':dataJson.sumData.out_over_qty>0? isZhongLin ? formatNumber3(dataJson.sumData.out_over_qty) : formatNumber(dataJson.sumData.out_over_qty,true,4):0 }}</span>
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
        label="No"
        prop="No"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="code"
        label="物流订单单号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="monitor_count"
        label="派车数"
      >
        <!--        <template v-slot="scope">-->
        <!--          <router-link :to="{name:constants_program.P_MONITOR,query:{schedule_code:scope.row.code, fullpath:true}}"><a href="javascript:void(0)">{{ scope.row.monitor_count == null?0:scope.row.monitor_count }}</a></router-link>-->
        <!--        </template>-->
        <template v-slot="scope">
          <a href="javascript:void(0)" @click="toMonitorDetail(scope.row.type_name,scope.row.id,scope.row.code)">{{ scope.row.monitor_count == null?0:scope.row.monitor_count }}</a>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="type_name"
        label="单据类型"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="status_name"
        label="单据状态"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="waybill_contract_no"
        label="物流合同"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="carriage_order_no"
        label="关联承运订单号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="customer_name"
        label="承运商"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="contract_no"
        label="采购/销售合同号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="out_plan_code"
        label="出库计划单号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_consignor_name"
        label="发货委托方"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_owner_name"
        label="发货货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_warehouse_name"
        label="发货仓库（简称）"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="out_warehouse_full_name"
        label="发货仓库（全称）"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="140"
        prop="out_warehouse_type_name"
        label="发货仓库类型"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="out_rate"
        label="发货执行情况"
      >
        <template v-slot="scope">
          {{ scope.row.out_rate == null?'': formatNumber(scope.row.out_rate, true, 2) }}%
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="in_plan_code"
        label="入库计划单号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_consignor_name"
        label="收货委托方"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_owner_name"
        label="收货货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_warehouse_name"
        label="收货仓库（简称）"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="in_warehouse_full_name"
        label="收货仓库（全称）"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="140"
        prop="in_warehouse_type_name"
        label="收货仓库类型"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="in_rate"
        label="收货执行情况"
      >
        <template v-slot="scope">
          {{ scope.row.in_rate == null?'': formatNumber(scope.row.in_rate, true, 2) }}%
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="140"
        prop="in_transit"
        align="right"
        label="在途数量"
      >
        <template v-slot="scope">
          {{ scope.row.in_transit == null?'': isZhongLin ? formatNumber3(scope.row.in_transit) : formatNumber(scope.row.in_transit, true, 4) }}
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
        prop="sku_code"
        align="center"
        label="规格编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="out_schedule_qty"
        label="应发货数量"
      >
        <template v-slot="scope">
          {{ scope.row.out_schedule_qty == null?'': isZhongLin ? formatNumber3(scope.row.out_schedule_qty) : formatNumber(scope.row.out_schedule_qty, true, 4) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="out_operated_qty"
        label="已发货数量"
      >
        <template v-slot="scope">
          {{ scope.row.out_operated_qty == null?'':isZhongLin ? formatNumber3(scope.row.out_operated_qty) : formatNumber(scope.row.out_operated_qty, true, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="out_balance_qty"
        label="待发货数量"
      >
        <template v-slot="scope">
          {{ scope.row.out_balance_qty == null?'':isZhongLin ? formatNumber3(scope.row.out_balance_qty) : formatNumber(scope.row.out_balance_qty, true, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="out_over_qty"
        label="超发数量"
      >
        <template v-slot="scope">
          {{ scope.row.out_over_qty == null? '0': isZhongLin ? formatNumber3(scope.row.out_over_qty) : formatNumber(scope.row.out_over_qty, true, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="out_unit"
        label="出库单位"
      >
        <template>吨</template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="in_schedule_qty"
        label="应收货数量"
      >
        <template v-slot="scope">
          {{ scope.row.in_schedule_qty == null?'': isZhongLin ? formatNumber3(scope.row.in_schedule_qty) : formatNumber(scope.row.in_schedule_qty, true, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="in_operated_qty"
        label="已收货数量"
      >
        <template v-slot="scope">
          {{ scope.row.in_schedule_qty == null?'': isZhongLin ? formatNumber3(scope.row.in_operated_qty) : formatNumber(scope.row.in_operated_qty, true, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="in_balance_qty"
        label="待收货数量"
      >
        <template v-slot="scope">
          {{ scope.row.in_balance_qty == null?'': isZhongLin ? formatNumber3(scope.row.in_balance_qty) : formatNumber(scope.row.in_balance_qty, true, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="in_over_qty"
        label="超收数量"
      >
        <template v-slot="scope">
          {{ scope.row.in_over_qty == null? '0' : isZhongLin ? formatNumber3(scope.row.in_over_qty) : formatNumber(scope.row.in_over_qty, true, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="in_unit"
        label="入库单位"
      >
        <template>吨</template>
      </el-table-column>
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
    <pagination
      ref="minusPaging"
      :total="dataJson.paging.total"
      :page.sync="dataJson.paging.current"
      :limit.sync="dataJson.paging.size"
      @pagination="getDataList"
    />

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
.perfect_popper .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>
<style>
.el-table .warning-cell {
  background-color: #ffa4a4 !important;
}
</style>

<script>
import SelectDict from '@/components/00_dict/select/SelectDict'
import SelectDicts from '@/components/00_dict/select/SelectDicts'
import {
  getListApi,
  finishApi,
  submitApi,
  auditApi,
  returnApi,
  exportApi,
  exportAllApi,
  getListSumApi,
  cancelApi,
  deleteApi,
  isBackupApi,
  enableApi
} from '@/api/40_business/logistics/logistics'
import constants_para from '@/common/constants/constants_para'
import resizeMixin from './mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
import constants_program from '@/common/constants/constants_program'
import SelectOutConsignor from '@/views/30_wms/customer/selectgrid/selectCustomer'
import SelectInConsignor from '@/views/30_wms/customer/selectgrid/selectCustomer'
import SelectCustomer from '@/views/30_wms/customer/selectgrid/selectCustomer'
import SelectOutWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBinForSearch'
import SelectInWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBinForSearch'
import constants_type from '@/common/constants/constants_dict'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import cancelConfirmDialog from '@/views/40_business/logistics/tabs/dialog/cancelconfirm'
import { mapState } from 'vuex'
import Constants_dict from '@/common/constants/constants_dict'
import urlUtil from '@/utils/urlUtil'
import constants_dict from '@/common/constants/constants_dict'

export default {
  components: { Pagination, SelectDict, SelectOutConsignor, SelectInConsignor, SelectOutWarehouse, SelectInWarehouse, SelectCustomer, SelectDicts, cancelConfirmDialog },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
  props: {
    data: {
      type: Object,
      default: null
    },
    editStatus: {
      type: String,
      default: ''
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
      constants_program: constants_program,
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          contract_no: '',
          out_owner_name: '',
          in_owner_name: '',
          customer_name: null,
          in_warehouse_types: [],
          out_warehouse_types: [],
          status_list: [],
          type: null,
          batch: ''
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        sumData: {
          out_over: 0,
          in_over: 0,
          in_operated_qty: 0,
          out_operated_qty: 0
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
        },
        tempJson: null,
        // 单条数据 json
        currentJson: null,
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
        reset3: false,
        reset4: false,
        reset5: false,
        reset6: false,
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnStatus: {
          showFinish: false,
          showView: false,
          showSubmit: false,
          showAudit: false,
          showReject: false,
          showExport: false,
          showCancel: false,
          showDelete: false,
          showUpdate: false
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
    ...mapState('dictDefaultValue', ['dict_value']),
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
    'data': {
      deep: true,
      handler (newVal) {
        if (this.editStatus === this.PARAMETERS.STATUS_UPDATE) {
          this.dataJson.listData.forEach((item, index) => {
            if (item.id === newVal.id) {
              this.dataJson.listData.splice(index, 1, newVal)
            }
          })
        }
        if (this.editStatus === this.PARAMETERS.STATUS_INSERT) {
          this.dataJson.listData.unshift(newVal)
        }
      }
    }
  },
  created () {
    // 接收url参数
    if (this.$route.query.contract_no != null && this.$route.query.contract_no !== undefined) {
      this.dataJson.searchForm.contract_no = this.$route.query.contract_no
    }
    this.dataJson.searchForm.batch = this.dict_value

    // 数据看板穿透 累计运输合同量
    var date = new Date()
    const time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    if (this.$route.query.batch_date !== null && this.$route.query.batch_date !== undefined &&
      this.$route.query.logistics_status === Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_ZERO) {
      this.dataJson.searchForm.daterange = []
      this.dataJson.searchForm.daterange.push(this.$route.query.batch_date)
      this.dataJson.searchForm.daterange.push(time)
      this.dataJson.searchForm.batch = ''
      this.dataJson.searchForm.status_list = ['0', '1']
      this.dataJson.searchForm.start_time = this.$route.query.batch_date
      this.dataJson.searchForm.over_time = time
    }

    location.href = urlUtil.delParam(window.location.href, 'fullpath')

    // 初始化货主下拉框
    this.getOwnerData()
    // 初始化watch
    this.setWatch()
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
      this.watch.unwatch_tempJson = this.$watch('dataJson.multipleSelection', (newVal, oldVal) => {
        if (newVal.length > 0) {
          _this.settings.btnStatus.showFinish = true
          _this.settings.btnStatus.showSubmit = true
          _this.settings.btnStatus.showAudit = true
          _this.settings.btnStatus.showReject = true
          _this.settings.btnStatus.showSync = true
          _this.settings.btnStatus.showExport = true
          _this.settings.btnStatus.showDelete = true
          _this.settings.btnStatus.showEnable = true
        } else {
          _this.settings.btnStatus.showFinish = false
          _this.settings.btnStatus.showSubmit = false
          _this.settings.btnStatus.showAudit = false
          _this.settings.btnStatus.showReject = false
          _this.settings.btnStatus.showSync = false
          _this.settings.btnStatus.showExport = false
          _this.settings.btnStatus.showDelete = false
          _this.settings.btnStatus.showEnable = false
        }

        _this.dataJson.multipleSelection.forEach(function (value, index, array) {
          if (value.status !== constants_type.DICT_B_SCHEDULE_STATUS_TWO && value.status !== constants_type.DICT_B_SCHEDULE_STATUS_FOUR) {
            // 非制单状态不可提交
            _this.settings.btnStatus.showSubmit = false
          }

          // 制单、已提交、已驳回状态的物流订单可以删除, 为 true 可以删除
          if (value.status !== constants_type.DICT_B_SCHEDULE_STATUS_TWO && value.status !== constants_type.DICT_B_SCHEDULE_STATUS_THREE && value.status !== constants_type.DICT_B_SCHEDULE_STATUS_FOUR) {
            _this.settings.btnStatus.showDelete = false
          } else {
            _this.settings.btnStatus.showDelete = true
          }

          if (value.status !== constants_type.DICT_B_SCHEDULE_STATUS_THREE) {
            // 非已提交状态不可审核/驳回
            _this.settings.btnStatus.showAudit = false
            _this.settings.btnStatus.showReject = false
          }

          if (value.status !== constants_type.DICT_B_SCHEDULE_STATUS_ZERO) {
            // 非待调度状态不可完成
            _this.settings.btnStatus.showFinish = false
          }

          if (value.status !== constants_type.DICT_B_SCHEDULE_STATUS_ONE) {
            // 非完成状态不可重启
            _this.settings.btnStatus.showEnable = false
          }
        })
      }, { deep: true }
      )

      // 清空时间选择器
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
      // 查询
      if (this.dataJson.searchForm.daterange !== null && this.dataJson.searchForm.daterange !== undefined && this.dataJson.searchForm.daterange !== '') {
        this.dataJson.searchForm.start_time = this.dataJson.searchForm.daterange[0]
        this.dataJson.searchForm.over_time = this.dataJson.searchForm.daterange[1]
      }
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
      // 只查询物流直达的物流单
      this.dataJson.searchForm.type_list = [constants_dict.DICT_B_SCHEDULE_STATUS_THREE]

      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
      // 查询合计信息
      getListSumApi(this.dataJson.searchForm).then(response => {
        if (response.data !== null) {
          this.dataJson.sumData = response.data
        } else {
          this.dataJson.sumData = this.$options.data.call(this).dataJson.sumData
        }
      }).finally(() => {
      })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm

      // 重置货主、客户、仓库等组件
      this.settings.reset1 = !this.settings.reset1
      this.settings.reset2 = !this.settings.reset2
      this.settings.reset3 = !this.settings.reset3
      this.settings.reset4 = !this.settings.reset4
      this.settings.reset5 = !this.settings.reset5
      this.settings.reset6 = !this.settings.reset6
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
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '新增' },
        canEdit: true,
        editStatus: constants_para.STATUS_INSERT
      }

      this.$emit('emitInsert', operate_tab_data)
    },
    // 点击按钮 更新
    handleUpdate () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      if (this.popSettings.one.props.data.status === constants_type.DICT_B_SCHEDULE_STATUS_ZERO) {
        this.showErrorMsg('待调度的数据不允许操作')
        return
      }
      if (this.popSettings.one.props.data.status === constants_type.DICT_B_SCHEDULE_STATUS_ONE) {
        this.showErrorMsg('已完成的数据不允许操作')
        return
      }
      if (this.popSettings.one.props.data.status === constants_type.DICT_B_SCHEDULE_STATUS_THREE) {
        this.showErrorMsg('已提交的数据不允许操作')
        return
      }

      // 更新
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '修改' },
        canEdit: true,
        editStatus: constants_para.STATUS_UPDATE,
        data: this.popSettings.one.props.data
      }
      this.$emit('emitUpdate', operate_tab_data)
    },
    // 点击按钮 查看
    handleView () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }

      const operate_tab_data = {
        operate_tab_info: { show: true, name: '查看' },
        canEdit: false,
        editStatus: constants_para.STATUS_VIEW,
        data: this.popSettings.one.props.data
      }

      this.$router.push({
        query: {
          p1: this.dataJson.currentJson.id
        }
      })

      this.$emit('emitView', operate_tab_data)
    },
    // 完成按钮
    handleFinish () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行完成', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
        })
      } else {
        // 选中数据提交
        this.handleFinishSelectionData()
      }
    },
    // 重新启用
    handleEnable () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行重启', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
        })
      } else {
        // 选中数据提交
        this.handleEnableSelectionData()
      }
    },
    // 提交数据
    handleFinishSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始提交
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

    // 重新启用数据
    handleEnableSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始提交
      enableApi(selectionJson).then((_data) => {
        this.$notify({
          title: '启用成功',
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

    // 提交按钮
    handleSubmit () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行提交', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
        })
      } else {
        // 选中数据提交
        this.handleSubmitSelectionData()
      }
    },
    // 提交数据
    handleSubmitSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
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
    // 审核按钮
    handleAudit () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行审核', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
        })
      } else {
        // 选中数据审核
        this.handleAuditSelectionData()
      }
    },
    // 审核数据
    handleAuditSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始审核
      auditApi(selectionJson).then((_data) => {
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
    },
    // 驳回按钮
    handleReject () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行驳回', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
        })
      } else {
        // 选中数据驳回
        this.handleRejectSelectionData()
      }
    },
    // 驳回数据
    handleRejectSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始驳回
      returnApi(selectionJson).then((_data) => {
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
    },

    // ------------------编辑弹出框 start--------------------
    handleCloseDialogOneOk (val) {
      this.settings.loading = true
      // 作废
      // 设置到table中绑定的json数据源
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      const selectionJson = {}
      selectionJson.id = this.popSettings.one.props.data.id
      selectionJson.remark = val.remark

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
    // 处理插入回调
    doInsertModelCallBack (val) {
      if (val.return_flag) {
        this.popSettings.one.visible = false

        // 设置到table中绑定的json数据源
        this.dataJson.listData.unshift(val.data.data)
        this.$notify({
          title: '新增处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '新增处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    },
    // 处理更新回调
    doUpdateModelCallBack (val) {
      if (val.return_flag) {
        this.popSettings.one.visible = false

        // 设置到table中绑定的json数据源
        this.dataJson.listData.splice(this.dataJson.rowIndex, 1, val.data.data)
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

    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnStatus.showView = true
        // 已驳回状态可修改, 制单状态也可修改
        if (this.dataJson.currentJson.status === constants_type.DICT_B_SCHEDULE_STATUS_FOUR || this.dataJson.currentJson.status === constants_type.DICT_B_SCHEDULE_STATUS_TWO) {
          this.settings.btnStatus.showUpdate = true
        } else {
          this.settings.btnStatus.showUpdate = false
        }
        // 只有待调度状态可以作废
        if (this.dataJson.currentJson.status === constants_type.DICT_B_SCHEDULE_STATUS_ZERO) {
          this.settings.btnStatus.showCancel = true
        } else {
          this.settings.btnStatus.showCancel = false
        }
      } else {
        this.settings.btnStatus.showView = false
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

    handleConsignorReturnData (val) {
      this.dataJson.searchForm.consignor_id = val.id
    },
    handleSupplierReturnData (val) {
      this.dataJson.searchForm.supplier_id = val.id
    },
    // 弹出框关闭
    handleDialogClose () {
      this.settings.visible = false
    },
    // 发货委托方
    handleOutConsignorReturnDataName (val) {
      this.dataJson.searchForm.out_consignor_name = val
    },
    // 收货委托方
    handleInConsignorReturnDataName (val) {
      this.dataJson.searchForm.in_consignor_name = val
    },
    // 承运商
    handleCustomerReturnDataName (val) {
      this.dataJson.searchForm.customer_name = val
    },
    // 发货货主
    handleOutOwnerReturnDataName (val) {
      this.dataJson.searchForm.out_owner_name = val
    },
    // 收货货主
    handleInOwnerReturnDataName (val) {
      this.dataJson.searchForm.in_owner_name = val
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
          confirmButtonText: '全数据导出',
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
      }).finally(() => {
        this.settings.loading = false
      })
    },
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
    },
    tableCellClassName ({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'out_rate' && row.out_rate >= 95) {
        return 'warning-cell'
      }
      return ''
    },
    // 作废
    handleCancel () {
      this.popSettings.one.visible = true
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.one.props.data = this.dataJson.currentJson
      this.popSettings.one.visible = true
    },
    // 删除
    handleDelete () {
      this.$confirm('确认删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.settings.loading = true
        const selectionJson = []
        this.dataJson.multipleSelection.forEach(function (value, index, array) {
          selectionJson.push({ 'id': value.id })
        })
        // 开始删除
        deleteApi(selectionJson).then((_data) => {
          this.$notify({
            title: '删除成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          this.getDataList()
          // loading
        }, (_error) => {
          this.$notify({
            title: '删除错误',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      })
    },
    // 点击派车数
    toMonitorDetail (type_name, id, code) {
      const _this = this
      isBackupApi({ schedule_id: id }).then(response => {
        console.log(response + '=================')
        console.log(response.data.is_backup + '=================')
        if (response.data.is_backup === '1') {
          // 1未备份
          // 通知路由，打开监管任务页面
          _this.$router.push({
            path: '/monitor/index', query: { schedule_code: code, fullpath: true }
          })
        } else if (response.data.is_backup === '2') {
          // 2部分备份
          _this.$confirm(type_name + '【' + code + '】下已有部分数据已备份，请选择需要查看的数据', '提示', {
            confirmButtonText: '监管任务',
            cancelButtonText: '历史记录',
            distinguishCancelAndClose: true,
            type: 'warning'
          }).then(() => {
            // 监管任务
            // 通知路由，打开监管任务页面
            _this.$router.push({
              path: '/monitor/index', query: { schedule_code: code, fullpath: true }
            })
          }).catch((action) => {
            // 历史记录
            if (action === 'cancel') {
              _this.$router.push({
                path: '/monitorbackup/index', query: { schedule_code: code, fullpath: true }
              })
            }
          })
        } else if (response.data.is_backup === '3') {
          // 2全部备份
          // 通知路由，打开监管任务页面
          _this.$router.push({
            path: '/monitorbackup/index', query: { schedule_code: code, fullpath: true }
          })
        }
      }, (_error) => {

      }).finally(() => {

      })
    }
  }

}
</script>
