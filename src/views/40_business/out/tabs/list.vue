<template>
  <div class="app-container">
    <FloatMenu />
    <el-tabs
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
            placeholder="合同号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.code"
            clearable
            placeholder="出库单号"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.plan_code"
            clearable
            placeholder="出库计划单号"
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
        <el-form-item label="">
          <select-dict
            v-model="dataJson.searchForm.bill_type"
            :para="CONSTANTS.DICT_B_IN_PLAN_BUSINESS_TYPE"
            init-placeholder="单据类型"
          />
        </el-form-item>
        <el-form-item>
          <select-dicts
            v-model="dataJson.searchForm.status_list"
            :para="CONSTANTS.DICT_B_OUT_STATUS"
            init-placeholder="请选择状态"
            :disabled="isViewModel"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dataJson.searchForm.create_dt"
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
              icon="el-icon-search"
              :loading="settings.loading"
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
            :reset="settings.reset2"
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
            :warehouse1="dataJson.searchForm.warehouse_id"
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

        <el-form-item label="船名">
          <el-input
            v-model.trim="dataJson.searchForm.ship_name"
            clearable
            placeholder="船名"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>

        <el-form-item label="出库类型">
          <select-dicts
            v-model="dataJson.searchForm.type_list"
            :para="CONSTANTS.DICT_B_OUT_TYPE"
            init-placeholder="出库类型"
            :disabled="isViewModel"
          />
        </el-form-item>
        <el-form-item label="货物名称或编码">
          <el-input
            v-model.trim="dataJson.searchForm.goods_name"
            clearable
            placeholder="货物名称或编码"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="商品属性">
          <el-input
            v-model.trim="dataJson.searchForm.prop"
            clearable
            placeholder="商品属性"
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
        <el-form-item label="客户">
          <select-supplier
            v-model.trim="dataJson.searchForm.client_name"
            :placeholder="isPlaceholderShow('请选择客户')"
            :type="CONSTANTS.DICT_SUPPLIER"
            :reset="settings.reset4"
            placement="left"
            @onReturnDataName="handleSupplierReturnDataName"
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

        <el-form-item label="是否包含放货指令">
          <select-dict
            v-model="dataJson.searchForm.out_release_status"
            :para="CONSTANTS.DICT_B_OUT_RELEASE_STATUS"
            init-placeholder="是否包含放货指令"
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出库时间起止">
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
                @keyup.enter.native="handleSearch"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="审核时间起止">
              <el-date-picker
                v-model="dataJson.searchForm.ed_dt"
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
        v-permission="'P_OUT:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >
        新增
      </el-button>
      <el-button
        v-permission="'P_OUT:UPDATE'"
        :disabled="!settings.btnStatus.showUpdate"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        v-permission="'P_OUT:SUBMIT'"
        :disabled="!settings.btnStatus.showSubmit"
        type="primary"
        icon="el-icon-circle-check"
        :loading="settings.loading"
        @click="handleSubmit"
      >提交</el-button>
      <el-button
        v-permission="'P_OUT:AUDIT'"
        :disabled="!settings.btnStatus.showAudit"
        type="primary"
        icon="el-icon-check"
        :loading="settings.loading"
        @click="handleAudit"
      >审核</el-button>
      <el-button
        v-permission="'P_OUT:REJECT'"
        :disabled="!settings.btnStatus.showReject"
        type="primary"
        icon="el-icon-close"
        :loading="settings.loading"
        @click="handleReject"
      >驳回</el-button>
      <el-button
        v-permission="'P_OUT:CANCEL'"
        :disabled="!settings.btnStatus.showCancel"
        type="primary"
        icon="el-icon-circle-close"
        :loading="settings.loading"
        @click="handleCancel"
      >作废</el-button>
      <el-button
        v-permission="'P_OUT:IMPORT'"
        type="primary"
        icon="el-icon-upload"
        :loading="settings.loading"
        @click="handleOpenImportDialog"
      >导入</el-button>
      <el-button
        v-permission="'P_OUT:EXPORT'"
        :disabled="!settings.btnStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>
      <el-button
        v-permission="'P_OUT:INFO'"
        :disabled="!settings.btnStatus.showView"
        type="primary"
        icon="el-icon-zoom-in"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
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
        <span class="count-title">出库数量：</span><span class="count-data">{{ dataJson.sumData.actual_count == null?'0': isZhongLin ? formatNumber3(dataJson.sumData.actual_count) : formatNumber(dataJson.sumData.actual_count,true,4) }}</span>
        <span class="count-title">出库金额：</span><span class="count-data">{{ dataJson.sumData.amount== null?'0':formatCurrency(dataJson.sumData.amount, true) }}</span>
        <span class="count-title">退货数量：</span><span class="count-data">{{ dataJson.sumData.count_return_qty== null?'0':formatNumber3(dataJson.sumData.count_return_qty, true) }}</span>
        <span class="count-title">实际出库数量：</span><span class="count-data">{{ dataJson.sumData.actual_count_return== null?'0':formatNumber3(dataJson.sumData.actual_count_return, true) }}</span>
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
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="code"
        label="出库单号"
      />
      <el-table-column
        label="计划单号"
        align="center"
      >
        <el-table-column
          sortable="custom"
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="150"
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
        prop="type_name"
        label="出库类型"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="160"
        prop="warehouse_name"
        label="出货仓库（简称）"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="160"
        prop="warehouse_full_name"
        label="出货仓库（全称）"
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
        :auto-fit="true"
        min-width="180"
        prop="client_name"
        label="客户"
      />

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
        align="right"
        min-width="120"
        prop="contract_num"
        label="合同量"
      >
        <template v-slot="scope">
          {{ isZhongLin ? formatNumber3(scope.row.contract_num) : formatNumber(scope.row.contract_num,true,4) }}
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
        align="right"
        min-width="150"
        prop="gross_weight"
        label="毛重"
      >
        <template v-slot="scope">
          {{ scope.row.gross_weight == null?'':isZhongLin ? formatNumber3(scope.row.gross_weight) :formatNumber(scope.row.gross_weight,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="tare_weight"
        label="皮重"
      >
        <template v-slot="scope">
          {{ scope.row.tare_weight == null?'':isZhongLin ? formatNumber3(scope.row.tare_weight) :formatNumber(scope.row.tare_weight,true,4) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="actual_count"
        label="出库数量"
      >
        <template v-slot="scope">
          {{ scope.row.tare_weight == null?'':isZhongLin ? formatNumber3(scope.row.tare_weight) :formatNumber(scope.row.tare_weight,true,4) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="return_qty"
        label="退货数量"
      >
        <template v-slot="scope">
          {{ scope.row.return_qty == null?'':isZhongLin ? formatNumber3(scope.row.return_qty) :formatNumber(scope.row.return_qty,true,4) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="actual_count_return"
        label="实际出库数量"
      >
        <template v-slot="scope">
          {{ isZhongLin ? formatNumber3(scope.row.actual_count_return) : formatNumber(scope.row.actual_count_return,true,4) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        label="换算比例"
        prop="src_unit"
      >
        <template v-slot="scope">
          {{ scope.row.src_unit }}:{{ scope.row.tgt_unit }}[{{ scope.row.calc }}]
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="150"
        prop="actual_weight_return"
        label="实际换算后数量"
      >
        <template v-slot="scope">
          {{ isZhongLin ? formatNumber3(scope.row.actual_weight_return) : formatNumber(scope.row.actual_weight_return,true,4) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="unit_name"
        label="出库单位"
      />
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
        align="right"
        min-width="100"
        prop="price"
        label="单价"
      >
        <template v-slot="scope">
          {{ scope.row.price == null?'':formatCurrency(scope.row.price, true) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="130"
        prop="amount"
        label="出库金额"
      >
        <template v-slot="scope">
          {{ scope.row.amount == null?'':formatCurrency(scope.row.amount, true) }}
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        sortable="custom"
        :auto-fit="true"
        min-width="150"
        prop="vehicle_no"
        label="车牌号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="200"
        prop="outbound_time"
        label="出库时间"
      >
        <template v-slot="scope">
          {{ scope.row.outbound_time == null?'':formatDateTime(scope.row.outbound_time) }}
        </template>
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
        sortable="custom"
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
        prop="e_dt"
        label="审核时间"
      >
        <template v-slot="scope">
          {{ scope.row.e_dt == null?'':formatDateTime(scope.row.e_dt) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
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
      <el-table-column
        sortable="custom"
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
    <!-- pop窗口 数据批量导入：模版导出、excel导入-->
    <el-dialog
      v-el-drag-dialog
      title="数据批量导入"
      :visible="popSettingsImport.dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :append-to-body="true"
      :modal-append-to-body="false"
      width="620px"
    >
      <el-form
        ref="dataForm"
        label-position="right"
        label-width="120px"
        status-icon
      >
        <el-form-item label="点击下载：">
          <el-link
            type="primary"
            target="_blank"
            :href="popSettingsImport.templateFilePath"
            download="模版文件下载"
          > 模版文件下载</el-link>
        </el-form-item>
        <el-form-item label="选择导入文件：">
          <simple-upload
            :accept="'.xls,.xlsx'"
            @upload-success="handleUploadFileSuccess"
            @upload-error="handleUploadFileError"
          />
          <el-link
            v-show="!(popSettingsImport.errorFileUrl =='')"
            type="danger"
            :href="popSettingsImport.errorFileUrl"
          >
            <i class="el-icon-view el-icon--right" />错误信息
          </el-link>
        </el-form-item>
      </el-form>
      <p><strong>说明：</strong></p>
      <ul>
        <li>请先下载模版文件，在模版文件中进行修改后再上传</li>
        <li>支持上传的文件类型：xls、xlsx</li>
        <li>请避免excel文件格式错误</li>
        <li>文件中存在任何错误，整个文件上传都将失败</li>
        <li>如果上传失败，会自动下载错误信息，请修改完毕后再次上传</li>
      </ul>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <el-button
          plain
          :disabled="settings.loading"
          @click="handlCloseDialog"
        >关 闭</el-button>
      </div>
    </el-dialog>
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
  max-width: 50%;
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
import { getTodoCountApi, getListSumApi, exportAllBOutApi, exportBOutApi, importBOutApi, getListApi, auditApi, submitApi, returnApi, cancelApi, syncApi, syncAllApi, getListCountApi, cancelAuditApi, cancelReturnApi } from '@/api/40_business/out/out'
import constants_para from '@/common/constants/constants_para'
import constants_type from '@/common/constants/constants_dict'
import { getPageApi } from '@/api/10_system/pages/page'
import SelectConsignor from '@/views/30_wms/customer/selectgrid/selectCustomer'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import mixin from './mixin/listResizeHandlerMixin'
import permission from '@/directive/permission/index.js' // 权限判断指令
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBinForSearch'
import SimpleUpload from '@/components/10_file/SimpleUpload'
import cancelConfirmDialog from '@/views/40_business/out/tabs/dialog/cancelconfirm'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import SelectSupplier from '@/views/30_wms/customer/selectgrid/selectCustomer'
import urlUtil from '@/utils/urlUtil'
import { mapState } from 'vuex'
import Constants_dict from '@/common/constants/constants_dict'

export default {
  components: { Pagination, SelectDict, SelectDicts, SelectConsignor, SelectWarehouse, SimpleUpload, cancelConfirmDialog, SelectSupplier },
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
      // 导入窗口的状态
      popSettingsImport: {
        // 弹出窗口会否显示
        dialogFormVisible: false,
        // 模版文件地址
        templateFilePath: '',
        // 错误数据文件
        errorFileUrl: ''
      },
      dataJson: {
        tabsCount: {
          all: 0,
          todo: 0
        },
        tabs: {
          active: '2'
        },
        // 查询使用的json
        searchForm: {
          code: '',
          plan_code: '',
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          consignor_id: '',
          supplier_id: '',
          warehouse_id: null,
          owner_id: '',
          ed_dt: [],
          type: null,
          status: null,
          todo_status: '2',
          client_name: null,
          goods_name: null,
          prop: '',
          sync_status: null,
          warehouse_type: null,
          status_list: ['0', '1', '2', '6', '3', '7'],
          daterange: [],
          create_dt: [],
          type_list: [],
          // 启动日期
          batch: '',
          active_tabs_index: 2, // 当前被激活的页签
          // 是否包含放货指令
          out_release_status: ''
        },
        todoSearchForm: {},
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        sumData: {
          actual_count: 0,
          actual_weight: 0,
          sync_error_count: 0,
          primary_quantity: 0
        },
        // 同步状态
        syncStatusList: [
          { 'status_name': '同步成功', 'sync_status': '1' },
          { 'status_name': '同步失败', 'sync_status': '0' }
        ],
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
    // 监听高级查询个数
    'dataJson.searchForm': {
      deep: true,
      handler (newVal, oldVal) {
        const screenKeys = ['consignor_Name', 'ship_name', 'bill_type', 'type', 'goods_name', 'ed_dt', 'prop', 'client_name', 'sync_status', 'vehicle_no', 'warehouse_type', 'type_list', 'out_release_status']
        if (this.isZhongLin) {
          screenKeys.push('owner_name')
        } else {
          screenKeys.push('warehouse_name')
        }
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
    // 默认查询近一个月内的数据
    this.setDateRange() // 初始化watch\
    // 初始化货主下拉框
    this.getOwnerData()
    // 接收url参数
    if (this.$route.query.code !== null && this.$route.query.code !== undefined) {
      this.dataJson.searchForm.code = this.$route.query.code
      this.dataJson.tabs.active = '2'
    }
    if (this.$route.query.plan_code !== null && this.$route.query.plan_code !== undefined) {
      this.dataJson.searchForm.plan_code = this.$route.query.plan_code
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
      this.dataJson.tabs.active = '2'
      // 清空时间选择
      this.dataJson.searchForm.daterange = []
      this.dataJson.searchForm.start_time = null
      this.dataJson.searchForm.over_time = null

      // this.dataJson.searchForm.create_dt = []
      // this.dataJson.searchForm.c_time_start = null
      // this.dataJson.searchForm.c_time_end = null
    }
    // 审核时间起止
    if (this.$route.query.start_time !== null && this.$route.query.start_time !== undefined) {
      this.dataJson.searchForm.ed_dt.push(this.$route.query.start_time)
      this.dataJson.searchForm.ed_dt.push(this.$route.query.start_time)
      this.dataJson.searchForm.ed_dt_start = this.$route.query.start_time
      this.dataJson.searchForm.ed_dt_end = this.$route.query.start_time
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
      this.dataJson.searchForm.status_list.push(constants_type.DICT_B_OUT_STATUS_TG)
      this.dataJson.tabs.active = '2'
    }
    // 报表业务起始时间
    // if (this.$route.query.batch !== null && this.$route.query.batch !== undefined) {
    //   this.dataJson.searchForm.batch = this.$route.query.batch
    //   this.dataJson.searchForm.todo_status = '2'
    //   this.dataJson.searchForm.active_tabs_index = '2'
    //   this.dataJson.searchForm.status = '2'
    //   this.dataJson.tabs.active = '2'
    // } else {
    //   if (this.$route.query.plan_code !== null && this.$route.query.plan_code !== undefined) {
    //     this.dataJson.searchForm.batch = ''
    //   } else {
    // this.dataJson.searchForm.batch = this.dict_value
    // }
    // }
    // 出库类型
    if (this.$route.query.type !== null && this.$route.query.type !== undefined) {
      this.dataJson.searchForm.type_list.push(this.$route.query.type)
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
      this.dataJson.searchForm.status = '2'
      this.dataJson.tabs.active = '2'
      // 清空时间选择
      this.dataJson.searchForm.daterange = []
      this.dataJson.searchForm.start_time = null
      this.dataJson.searchForm.over_time = null

      // this.dataJson.searchForm.create_dt = []
      // this.dataJson.searchForm.c_time_start = null
      // this.dataJson.searchForm.c_time_end = null
    }
    // 商品属性
    if (this.$route.query.prop !== null && this.$route.query.prop !== undefined) {
      this.dataJson.searchForm.prop = this.$route.query.prop
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
      this.dataJson.searchForm.status = '2'
      this.dataJson.tabs.active = '2'
    }
    // 合同单号
    if (this.$route.query.supplier_name !== null && this.$route.query.supplier_name !== undefined) {
      this.dataJson.searchForm.client_name = this.$route.query.supplier_name
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
      this.dataJson.searchForm.status = '2'
    }
    if (this.$route.query.sync_status !== null && this.$route.query.sync_status !== undefined) {
      this.dataJson.searchForm.sync_status = this.$route.query.sync_status
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
      this.dataJson.searchForm.status = '2'
    }
    // 货主
    if (this.$route.query.owner_name !== null && this.$route.query.owner_name !== undefined) {
      this.dataJson.searchForm.owner_name = this.$route.query.owner_name
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
      this.dataJson.searchForm.status = '2'
    }
    // 合同号
    if (this.$route.query.contract_no !== null && this.$route.query.contract_no !== undefined) {
      this.dataJson.searchForm.contract_no = this.$route.query.contract_no
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
    }
    // 入库单号
    if (this.$route.query.serial_code !== null && this.$route.query.serial_code !== undefined) {
      this.dataJson.searchForm.code = this.$route.query.serial_code
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
    }

    if (this.$route.query.goods_name !== null && this.$route.query.goods_name !== undefined) {
      this.dataJson.searchForm.goods_name = this.$route.query.goods_name
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
      this.dataJson.searchForm.status = '2'
      this.dataJson.tabs.active = '2'

      // this.dataJson.searchForm.create_dt = []
      // this.dataJson.searchForm.c_time_start = null
      // this.dataJson.searchForm.c_time_end = null

      // 清空时间选择
      this.dataJson.searchForm.daterange = []
      this.dataJson.searchForm.start_time = null
      this.dataJson.searchForm.over_time = null
    }
    if (this.$route.query.warehouse_id !== null && this.$route.query.warehouse_id !== undefined) {
      this.dataJson.searchForm.warehouse_id = this.$route.query.warehouse_id
      this.dataJson.searchForm.todo_status = '2'
      this.dataJson.searchForm.active_tabs_index = '2'
      this.dataJson.searchForm.status = '2'
      this.dataJson.tabs.active = '2'
    }
    if (this.$route.query.warehouse_type !== null && this.$route.query.warehouse_type !== undefined) {
      this.dataJson.searchForm.warehouse_type = this.$route.query.warehouse_type
    }

    if (this.$route.query.status !== null && this.$route.query.status !== undefined) {
      this.dataJson.searchForm.status_list = []
      this.dataJson.searchForm.status_list.push(this.$route.query.status)
    }

    if (this.$route.query.warehouse_type_ll !== null && this.$route.query.warehouse_type_ll !== undefined && this.$route.query.warehouse_type_ll === '2') {
      this.dataJson.searchForm.type_list.push('5')
      this.dataJson.searchForm.type_list.push('3')
      this.dataJson.searchForm.type_list.push('0')
      this.dataJson.searchForm.type_list.push('6')
    }

    // 数据看板穿透 原料累计出库
    var date = new Date()
    const time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    if (this.$route.query.batch_date !== null && this.$route.query.batch_date !== undefined &&
      this.$route.query.logistics_status === Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_ZERO) {
      this.dataJson.searchForm.create_dt = []
      this.dataJson.searchForm.create_dt.push(this.$route.query.batch_date)
      this.dataJson.searchForm.create_dt.push(time)
      this.dataJson.searchForm.batch = ''
      this.dataJson.searchForm.status_list = ['2']
      this.dataJson.searchForm.warehouse_type = '1'
      this.dataJson.searchForm.c_time_start = this.$route.query.batch_date
      this.dataJson.searchForm.c_time_end = time
    }

    // 数据看板穿透 销售累计出库
    if (this.$route.query.batch_date !== null && this.$route.query.batch_date !== undefined &&
      this.$route.query.logistics_status === Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_SIX) {
      this.dataJson.searchForm.create_dt = []
      this.dataJson.searchForm.create_dt.push(this.$route.query.batch_date)
      this.dataJson.searchForm.create_dt.push(time)
      this.dataJson.searchForm.batch = ''
      this.dataJson.searchForm.status_list = ['2']
      this.dataJson.searchForm.type_list.push('5')
      this.dataJson.searchForm.out_release_status = '1'
      this.dataJson.searchForm.c_time_start = this.$route.query.batch_date
      this.dataJson.searchForm.c_time_end = time
    }

    // 报表业务起始时间
    if (this.$route.query.batch !== null && this.$route.query.batch !== undefined) {
      this.dataJson.searchForm.create_dt = []
      this.dataJson.searchForm.create_dt.push(this.$route.query.batch)
      this.dataJson.searchForm.create_dt.push(time)
      this.dataJson.searchForm.batch = ''
      this.dataJson.searchForm.c_time_start = this.$route.query.batch
      this.dataJson.searchForm.c_time_end = time
    }

    location.href = urlUtil.delParam(window.location.href, 'fullpath')

    this.setWatch()
    // 初始化查询
    this.getDataList()

    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)

    // 获取模板文件
    this.getTemplate()
  },
  activated () {
    // this.getDataList()
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
          if (value.status !== constants_type.DICT_B_OUT_STATUS_ZD) {
            if (value.status === constants_type.DICT_B_OUT_STATUS_BH) {
              // 审核驳回后可再次提交
              _this.settings.btnStatus.showSubmit = true
            } else {
              // 非制单状态不可提交
              _this.settings.btnStatus.showSubmit = false
            }
          }

          if (value.status !== constants_type.DICT_B_OUT_STATUS_YTJ && value.status !== constants_type.DICT_B_OUT_STATUS_CANCEL_BEING_AUDITED) {
            // 非已提交状态不可审核/驳回
            _this.settings.btnStatus.showAudit = false
            _this.settings.btnStatus.showReject = false
          }

          if (value.status !== constants_type.DICT_B_OUT_STATUS_TG) {
            // 非审核通过状态不可完成
            _this.settings.btnStatus.showFinish = false
          }
        })
      }, { deep: true }
      )

      this.watch.unwatch_tempJson1 = this.$watch('dataJson.searchForm', (newVal, oldVal) => {
        if (this.dataJson.searchForm.daterange === null) {
          this.dataJson.searchForm.start_time = null
          this.dataJson.searchForm.over_time = null
        }

        if (this.dataJson.searchForm.ed_dt === null) {
          this.dataJson.searchForm.ed_dt_end = null
          this.dataJson.searchForm.ed_dt_start = null
        }

        if (this.dataJson.searchForm.create_dt === null) {
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
      if (this.dataJson.searchForm.ed_dt !== null && this.dataJson.searchForm.ed_dt !== undefined && this.dataJson.searchForm.ed_dt !== '') {
        this.dataJson.searchForm.ed_dt_start = this.dataJson.searchForm.ed_dt[0]
        this.dataJson.searchForm.ed_dt_end = this.dataJson.searchForm.ed_dt[1]
      }
      if (this.dataJson.searchForm.create_dt !== null && this.dataJson.searchForm.create_dt !== undefined && this.dataJson.searchForm.create_dt !== '') {
        this.dataJson.searchForm.c_time_start = this.dataJson.searchForm.create_dt[0]
        this.dataJson.searchForm.c_time_end = this.dataJson.searchForm.create_dt[1]
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
      getListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data
        // this.dataJson.paging = response.data
        // this.dataJson.paging.records = {}
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
          this.dataJson.sumData.amount = 0
          this.dataJson.sumData.actual_count = 0
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
        // this.settings.loading = false
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
      // 重置货主、客户、仓库等组件
      this.settings.reset1 = !this.settings.reset1
      this.settings.reset2 = !this.settings.reset2
      this.settings.reset3 = !this.settings.reset3
      this.settings.reset4 = !this.settings.reset4

      // 默认查询近一个月内的数据
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
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '修改出库单' },
        canEdit: true,
        editStatus: constants_para.STATUS_UPDATE,
        data: this.popSettings.one.props.data
      }

      this.$emit('emitUpdate', operate_tab_data)
    },
    // 点击按钮 新增
    handleInsert () {
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '新增出库单' },
        canEdit: true,
        editStatus: constants_para.STATUS_INSERT
      }

      this.$emit('emitInsert', operate_tab_data)
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
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '查看出库单' },
        canEdit: true,
        editStatus: constants_para.STATUS_VIEW,
        data: this.popSettings.one.props.data
      }

      this.$router.push({
        query: {}
      })

      // this.$emit(this.EMITS.EMIT_OUT_INFO, operate_tab_data)
      this.$emit('emitView', operate_tab_data)
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        // this.settings.btnStatus.doInsert = true
        this.settings.btnStatus.showUpdate = true
        this.settings.btnStatus.showView = true
        this.settings.btnStatus.showCancel = true
        if (this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_ZF || this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_EXPIRES || this.dataJson.currentJson.monitor_out_id !== null ||
          this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_CANCEL_BEING_AUDITED || this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_YTJ) {
          // 已作废的状态不可重复作废, 来自监管任务的不可作废, 已过期的状态不可作废, 已提交的不可作废
          this.settings.btnStatus.showCancel = false
        }
        // 选中已提交、审核通过、作废、作废审核状态中的出库单，修改按钮不亮
        if (this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_ZF || this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_YTJ ||
          this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_TG || this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_CANCEL_BEING_AUDITED) {
          this.settings.btnStatus.showUpdate = false
        }
      } else {
        this.settings.btnStatus.showCancel = false
        this.settings.btnStatus.showUpdate = false
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
        this.handleAuditSelectionData()
      }
    },
    // 审核数据
    handleAuditSelectionData () {
      // loading
      this.settings.loading = true
      // const selectionJson = []
      const auditSelectionJson = []
      const cancelAuditSelectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        // selectionJson.push({ 'id': value.id, 'dbversion': value.dbversion })
        // 若状态未待审核,则加入到auditSelectionJson,若状态未作废待审核，则加入到cancelAuditSelectionJson
        if (value.status === constants_type.DICT_B_OUT_STATUS_CANCEL_BEING_AUDITED) {
          cancelAuditSelectionJson.push({ 'id': value.id })
        } else if (value.status === constants_type.DICT_B_OUT_STATUS_YTJ) {
          auditSelectionJson.push({ 'id': value.id })
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
        this.handleRejectSelectionData()
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
        // selectionJson.push({ 'id': value.id })
        if (value.status === constants_type.DICT_B_OUT_STATUS_CANCEL_BEING_AUDITED) {
          cancelAuditSelectionJson.push({ 'id': value.id })
        } else if (value.status === constants_type.DICT_B_OUT_STATUS_YTJ) {
          auditSelectionJson.push({ 'id': value.id })
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
      if (this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_ZD || this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_BH) {
        let msg = '该单据为制单状态，点击作废将直接更新状态为作废，请谨慎操作。确定要作废吗？'
        if (this.dataJson.currentJson.status === constants_type.DICT_B_OUT_STATUS_BH) {
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
    // 作废按钮确认
    handleCancelOk () {
      this.popSettings.one.visible = true
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.one.props.data = this.dataJson.currentJson
      this.popSettings.one.props.data.remark = null
      this.popSettings.one.visible = true
    },
    handleCloseDialogOneOk (val) {
      // 作废
      // 设置到table中绑定的json数据源
      this.settings.loading = true
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      const selectionJson = []
      selectionJson.push({ 'id': this.popSettings.one.props.data.id, 'remark': val.remark })

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
        this.handleSubmitSelectionData()
      }
    },
    // 提交数据
    handleSubmitSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id, 'dbversion': value.dbversion })
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
    handleConsignorReturnDataName (val) {
      this.dataJson.searchForm.consignor_Name = val
    },
    handleSupplierReturnDataName (val) {
      this.dataJson.searchForm.client_name = val
    },
    handleOwnerReturnDataName (val) {
      this.dataJson.searchForm.owner_Name = val
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
    // 文件上传成功
    handleUploadFileSuccess (res) {
      this.settings.loading = true
      this.showLoading('正在上传，请稍后...')
      // 开始导入
      const tempData = res.response.data
      tempData.page_code = this.$route.meta.page_code
      importBOutApi(tempData).then(response => {
        this.popSettingsImport.errorFileUrl = ''
        if (response.system_code !== 0) {
          this.popSettingsImport.errorFileUrl = response.data.url
          this.showErrorMsg('您上传的excel数据有错误，请点击错误信息进行查看！')
        } else if (response.system_code === 0) {
          const successList = '成功导入 ' + response.data.length + ' 条数据'
          this.$alert(successList, '导入成功', {
            confirmButtonText: '关闭',
            type: 'success'
          }).then(() => {
            this.popSettingsImport.dialogFormVisible = false
          })
        }
      }, (_error) => {
        // this.showErrorMsg('发生了异常，请联系管理员！', _error.data)
        console.log('发生了异常，请联系管理员！:' + JSON.stringify(_error))
      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
      })
    },
    // 文件上传失败
    handleUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '导入错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 数据批量导入按钮
    handleOpenImportDialog () {
      this.popSettingsImport.dialogFormVisible = true
    },
    // 关闭弹出窗口
    handlCloseDialog () {
      this.popSettingsImport.dialogFormVisible = false
      this.popSettingsData.dialogFormVisible = false
    },
    getTemplate () {
      const tempData = {}
      tempData.code = this.$route.meta.page_code
      getPageApi(tempData).then(response => {
        this.settings.loading = false
        this.popSettingsImport.templateFilePath = response.data.template_url
      }, (_error) => {
        // this.showErrorMsg('发生了异常，请联系管理员！', _error.data)
        console.log('发生了异常，请联系管理员！:' + JSON.stringify(_error))
      }).finally(() => {
        this.settings.loading = false
      })
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
      exportAllBOutApi(this.dataJson.searchForm).then(response => {
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
      exportBOutApi(selectionJson).then(response => {
        this.settings.loading = false
      })
    },
    // 货主下拉框
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
    },
    // 点击查询, 同步状态为同步失败
    searchSyncError () {
      this.dataJson.searchForm.sync_status = '0'
      this.handleSearch()
    },
    setDateRange () {
      const end = new Date()

      // const href = window.location.href
      // if (href.indexOf('shyiyuanth') !== -1) {
      //   const start = new Date()
      //   // 默认查询近一个月内的数据
      //   start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      //   this.dataJson.searchForm.daterange.push(start)
      //   this.dataJson.searchForm.daterange.push(end)
      //   this.dataJson.searchForm.start_time = start
      //   this.dataJson.searchForm.over_time = end
      // }

      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      this.dataJson.searchForm.create_dt.push(start)
      this.dataJson.searchForm.create_dt.push(end)
      this.dataJson.searchForm.c_time_start = start
      this.dataJson.searchForm.c_time_end = end
    }
  }
}
</script>
