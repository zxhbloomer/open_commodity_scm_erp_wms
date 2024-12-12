<template>

  <div class="app-container">
    <FloatMenu />
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
    >
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.convert_code"
          clearable
          placeholder="转换单号"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
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
          v-model.trim="dataJson.searchForm.target_goods_name"
          clearable
          placeholder="转换后物料名称/规格/编号"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.source_goods_name"
          clearable
          placeholder="转换源物料名称/规格/编号"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <select-dict
          v-model="dataJson.searchForm.type"
          :para="CONSTANTS.DICT_B_MATERIAL_CONVERT_TYPE"
          init-placeholder="转换类型"
        />
      </el-form-item>
      <el-form-item>
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
          :loading="settings.loading"
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
      :default-sort="{prop: 'c_time', order: 'descending'}"
      columns_index_key="true"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%"
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
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="170"
        prop="convert_code"
        label="转换单号"
      />
      <!-- <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="100"
        prop="data_version"
        label="版本号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="convert_name"
        label="转换名称"
      /> -->
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="160"
        prop="owner_name"
        label="货主"
      />
      <!-- <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="is_effective"
        label="启用状态"
      >
        <template v-slot="scope">
          {{ scope.row.is_effective ? '启用' : '未启用' }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="type_name"
        label="转换类型"
      /> -->
      <el-table-column
        align="center"
        label="转换前"
      >
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="150"
          prop="source_sku_code"
          label="物料编码"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="150"
          prop="source_goods_name"
          label="物料名称"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="150"
          prop="source_sku_name"
          label="物料规格"
        />
      </el-table-column>
      <el-table-column
        align="center"
        label="转换后"
      >
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="150"
          prop="target_sku_code"
          label="物料编码"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="150"
          prop="target_goods_name"
          label="物料名称"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="150"
          prop="target_sku_name"
          label="物料规格"
        />
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="120"
        prop="calc"
        align="right"
        label="转换比例"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="180"
        prop="source_qty"
        align="right"
        label="转换源物料可用库存"
      >
        <template v-slot="scope">
          {{ scope.row.source_qty == null ? 0 : isZhongLin ? formatNumber3(scope.row.source_qty) : formatNumber(scope.row.source_qty, true, 4) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="175"
        align="right"
        prop="target_qty"
        label="转换源物料转换库存"
      >
        <template v-slot="scope">
          {{ scope.row.target_qty == null ? 0 : isZhongLin ? formatNumber3(scope.row.target_qty) : formatNumber(scope.row.target_qty, true, 4) }}
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="c_time"
        label="转换时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.c_time) }}
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
.perfect_popper .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
</style>

<script>
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import SelectDict from '@/components/00_dict/select/SelectDict'
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'
import { getListApi } from '@/api/40_business/materialconvertrecord/materialconvertrecord'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import mixin from './mixin/listResizeHandlerMixin'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: { Pagination, SelectDict },
  directives: { elDragDialog, permission },
  mixins: [mixin],
  props: {
    height: {
      type: Number,
      default: 200
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
      },
      dataJson: {
        tabsCount: {
          all: 0,
          todo: 0
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION_C_TIME),
          todo_status: '0',
          active_tabs_index: 0, // 当前被激活的页签
          convert_name: null,
          is_effective: null,
          owner_id: null,
          warehouse_id: null,
          target_goods_name: null,
          source_goods_name: null,
          type: null

        },
        todoSearchForm: {},
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
        // 启用状态
        // effectiveList: [
        //   { id: 1, value: '已启用' },
        //   { id: 0, value: '未启用' }
        // ]
      },
      popSettingsData: {
        dialogFormVisible: false
      },
      // 页面设置json
      settings: {
        reset1: false,
        reset2: false,
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnStatus: {
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000
      },
      popSettings: {
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
        // const screenKeys = ['source_goods_name', 'target_goods_name', 'type', 'daterange']
        // const { searchForm } = this.dataJson
        // const data = Object.keys(searchForm).map(item => {
        //   if (screenKeys.includes(item)) {
        //     if (searchForm[item] || searchForm[item] === 0) {
        //       return searchForm[item]
        //     }
        //   }
        // })
        // const len = data.filter(x => x).length || 0
        // this.screenNum = len

        if (this.dataJson.searchForm.daterange === null) {
          this.dataJson.searchForm.start_time = null
          this.dataJson.searchForm.end_time = null
        }
      }
    }
  },
  created () {
    if (this.$route.query.code !== null && this.$route.query.code !== undefined) {
      this.dataJson.searchForm.convert_code = this.$route.query.code
    }
    // 初始化货主下拉框
    this.getOwnerData()
    // 初始化查询
    this.getDataList()
    // 初始化仓库下拉框
    this.getWarehouseData()
  },
  mounted () {
    // 描绘完成
    // 接收兄弟消息
    this.$on(this.EMITS.EMIT_INPLAN_CHANGE, _data => {
      this.$off(this.EMITS.EMIT_INPLAN_LOADING_OK)
      this.$emit(this.EMITS.EMIT_INPLAN_LOADING_OK)
      this.getDataList()
    })
  },
  destroyed () {
  },
  methods: {
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
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
      getListApi(this.dataJson.searchForm).then(response => {
        if (this.dataJson.searchForm.todo_status === '0') {
          this.dataJson.tabsCount.todo = response.data.total
        }
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.dataJson.searchForm.end_time = ''
      this.dataJson.searchForm.consignor_name = ''
      this.dataJson.searchForm.supplier_name = ''
      this.settings.reset1 = !this.settings.reset1
      this.settings.reset2 = !this.settings.reset2
    },

    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },
    getWarehouseData () {
      getWarehouseComboListApi().then((_data) => {
        this.dataJson.warehouseComboList = _data.data
        this.settings.loading = false
      }, (_error) => {
      })
    },
    // 货主下拉框
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
    }
  }
}
</script>
