<template>
  <div class="app-container">
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
    >
      <el-form-item>
        <el-select
          v-model="dataJson.searchForm.warehouse_id"
          placeholder="请选择仓库"
          filterable
          :loading="settings.loading"
          loading-text="拼命加载..."
          collapse-tags
          clearable
          style="width:200px"
        >
          <el-option
            v-for="item in dataJson.warehouseComboList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select
          v-model="dataJson.searchForm.owner_id"
          placeholder="请选择货主"
          filterable
          clearable
        >
          <el-option
            v-for="item in dataJson.ownerComboList"
            :key="item.id"
            :label="item.short_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.sku_name"
          clearable
          placeholder="请输入商品名称货编码"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-popover:popover
          type="primary"
          plain
          icon="perfect-icon-reset"
          @click="doResetSearch"
        >重置</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-button-group />
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      stripe
      border
      highlight-current-row
      :default-sort="{prop: 'sum_avaible', order: 'descending'}"
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column
        type="index"
        width="45"
        label="No"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="warehouse_name"
        label="仓库"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="owner_name"
        label="货主"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="sku_name"
        label="商品名称"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="sku_code"
        label="商品编码"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        align="right"
        :sort-orders="settings.sortOrders"
        prop="in_weight"
        label="入库数量"
      >
        <template v-slot="scope">
          {{ scope.row.in_weight == null?0:formatNumber(scope.row.in_weight,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        align="right"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="out_weight"
        label="出库数量"
      >
        <template v-slot="scope">
          {{ scope.row.out_weight == null?0:formatNumber(scope.row.out_weight,true,4) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :auto-fit="true"
        align="right"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="qty_diff"
        label="调整数量"
      >
        <template v-slot="scope">
          {{ scope.row.qty_diff == null?0:formatNumber(scope.row.qty_diff,true,4) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        align="right"
        :sort-orders="settings.sortOrders"
        prop="qty_avaible"
        label="库存"
      >
        <template v-slot="scope">
          {{ scope.row.qty_avaible == null?0:formatNumber(scope.row.qty_avaible,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        sortable="custom"
        align="right"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="qty_lock"
        label="锁定库存"
      >
        <template v-slot="scope">
          {{ scope.row.qty_lock == null?0:formatNumber(scope.row.qty_lock,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        sortable="custom"
        align="right"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="calculation_avaible"
        label="计算库存"
      >
        <template v-slot="scope">
          {{ scope.row.calculation_avaible == null?0:formatNumber(scope.row.calculation_avaible,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        sortable="custom"
        min-width="150"
        align="right"
        :sort-orders="settings.sortOrders"
        prop="sum_avaible"
        label="合计库存"
      >
        <template v-slot="scope">
          {{ scope.row.sum_avaible == null?0:formatNumber(scope.row.sum_avaible,true,4) }}
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
.el-form-item .el-select {
  width: 100%;
}
.el-button-group {
  margin-bottom: 0px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
</style>

<script>
import { getListApi } from '@/api/10_system/inventorymonitor/inventorymonitor.js'
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import resizeMixin from './mixin/resizeHandlerMixin'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: {
            current: 1,
            size: 20,
            sort: 'sum_avaible' // 排序
          },
          // 查询条件
          warehouse_id: null,
          owner_id: null,
          sku_nane: null
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          code: '',
          descr: '',
          dbversion: 0
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnShowStatus: {
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
  },
  created () {
    this.initShow()
  },
  mounted () {
    // 描绘完成
  },
  methods: {
    initTempJsonOriginal () {

    },
    initShow () {
      // 初始化查询
      this.getDataList()
      // 初始化仓库下拉框
      this.getWarehouseData()
      // 初始化货主下拉框
      this.getOwnerData()
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
    },
    handleSearch () {
      if (this.dataJson.searchForm.sync_time !== null && this.dataJson.searchForm.sync_time !== undefined && this.dataJson.searchForm.sync_time !== '') {
        this.dataJson.searchForm.c_time_start = this.dataJson.searchForm.sync_time[0]
        this.dataJson.searchForm.c_time_end = this.dataJson.searchForm.sync_time[1]
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
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 选择仓库
    getWarehouseData () {
      getWarehouseComboListApi().then((_data) => {
        this.dataJson.warehouseComboList = _data.data
        this.settings.loading = false
      }, (_error) => {
      })
    },
    // 选择货主
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
    }

  }
}
</script>
