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
        <el-select
          v-model="dataJson.searchForm.owner_ids"
          :placeholder="isPlaceholderShow('请选择货主')"
          :disabled="isViewModel"
          filterable
          clearable
          multiple
          collapse-tags
          style="width:200px"
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
        <el-select
          v-model="dataJson.searchForm.warehouse_ids"
          placeholder="请选择仓库"
          :loading="settings.loading"
          loading-text="拼命加载..."
          filterable
          multiple
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
      <el-form-item>
        <select-dicts
          v-model="dataJson.searchForm.warehouse_types"
          :para="CONSTANTS.DICT_M_WAREHOUSE_TYPE"
          :filter-para="['4']"
          init-placeholder="仓库类型"
        />
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.sku_name"
          clearable
          placeholder="请输入物料名称或编码"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>

      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.goods_prop"
          clearable
          placeholder="请输入商品属性"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.category_name"
          clearable
          placeholder="请输入物料类别"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          v-show="false"
          type="primary"
          plain
          icon="el-icon-search"
          @click="handleReCreate"
        >重新生成</el-button>
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
    <el-popover
      ref="popover"
      placement="bottom"
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

        <el-row>
          <el-col :span="12">
            <el-form-item label="日期">
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
            @click="handleSearch"
          >提交</el-button>
        </div>
      </el-form>
    </el-popover>
    <el-button-group>
      <el-button
        v-permission="'P_INVENTORY_DAILY:EXPORT'"
        :disabled="!settings.btnStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>

    </el-button-group>

    <br>

    <div
      v-if="!meDialogStatus"
      class="div-sum"
    >
      <div class="right">
        <span class="count-title">总入库量：</span><span class="count-data">{{ dataJson.sumData.qty_in == null?'': isZhongLin ? formatNumber3(dataJson.sumData.qty_in) : formatNumber(dataJson.sumData.qty_in,true,4) }}</span>
        <span class="count-title">总出库量：</span><span class="count-data">{{ dataJson.sumData.qty_out== null?'': isZhongLin ? formatNumber3(dataJson.sumData.qty_out) : formatNumber(dataJson.sumData.qty_out,true,4) }}</span>
        <span class="count-title">总调整量：</span><span class="count-data">{{ dataJson.sumData.qty_adjust == null?'':isZhongLin ? formatNumber3(dataJson.sumData.qty_adjust) : formatNumber(dataJson.sumData.qty_adjust,true,4) }}</span>
        <!-- <span class="count-title">库存：</span><span class="count-data">{{ dataJson.sumData.qty == null?'':formatNumber(dataJson.sumData.qty,true,4) }}</span>
        <span class="count-title">货值：</span><span class="count-data">{{ dataJson.sumData.realtime_amount == null?'':formatCurrency(dataJson.sumData.realtime_amount, true) }}</span> -->
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
      :default-sort="{prop: 'dt', order: 'descending'}"
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
        min-width="200"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="dt"
        label="日期"
      >
        <template v-slot="scope">
          {{ scope.row.dt == null?'':formatDate(scope.row.dt) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="owner_name"
        label="货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="business_type_name"
        label="业务板块"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="industry_name"
        label="行业"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="category_name"
        label="类别"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="goods_prop"
        label="商品属性"
      />

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="sku_code"
        label="物料编号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="goods_name"
        label="物料名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="pm"
        label="品名"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="sku_name"
        label="规格"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="warehouse_name"
        label="仓库"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="warehouse_type_name"
        label="仓库类型"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="location_name"
        label="库区"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="bin_name"
        label="库位"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="qty"
        label="库存"
      >
        <template v-slot="scope">
          {{ scope.row.qty === null?'': isZhongLin ? formatNumber3(scope.row.qty) : formatNumber(scope.row.qty,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="qty_in"
        label="入库量"
      >
        <template v-slot="scope">
          {{ scope.row.qty_in === null?'0': isZhongLin ? formatNumber3(scope.row.qty_in) : formatNumber(scope.row.qty_in,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="qty_out"
        label="出库量"
      >
        <template v-slot="scope">
          {{ scope.row.qty_out === null?'0':isZhongLin ? formatNumber3(scope.row.qty_out) : formatNumber(scope.row.qty_out,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="qty_adjust"
        label="调整量"
      >
        <template v-slot="scope">
          {{ scope.row.qty_adjust === null?'0': isZhongLin ? formatNumber3(scope.row.qty_adjust) : formatNumber(scope.row.qty_adjust,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="qty_diff"
        label="变动量"
      >
        <template v-slot="scope">
          {{ scope.row.qty_diff === null?'0':isZhongLin ? formatNumber3(scope.row.qty_diff) : formatNumber(scope.row.qty_diff,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="unit_name"
        label="库存单位"
      >
        <template v-slot="scope">
          {{ '吨' }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="130"
        prop="realtime_price"
        label="实时单价"
      >
        <template v-slot="scope">
          {{ scope.row.realtime_price == null?'':formatCurrency(scope.row.realtime_price, true) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="130"
        prop="realtime_amount"
        label="实时货值"
      >
        <template v-slot="scope">
          {{ scope.row.realtime_amount == null?'':formatCurrency(scope.row.realtime_amount, true) }}
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
/* .el-button-group {
  margin-bottom: 10px;
} */
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
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>

<script>
import { getListSumApi, exportAllApi, exportApi, queryInventoryDaily } from '@/api/50_query/inventory_daily'
import resizeMixin from './mixin/listResizeHandlerMixin'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import SelectDicts from '@/components/00_dict/select/SelectDicts'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'
import { reCreateDailyInventoryApi } from '@/api/40_business/inventory/inventory'

export default {
  components: { Pagination, SelectDicts },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
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
      searchsetting: {
        visible: true
      },
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: {
            current: 1,
            size: 20,
            sort: '-dt' // 排序
          },
          // 货主名称
          owner_name: null,
          // 仓库
          warehouse_ids: [],
          // 商品名称
          sku_name: null,
          owner_ids: [],
          category_name: null

        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        sumData: {
          qty: 0,
          qty_in: 0,
          qty_out: 0,
          qty_adjust: 0,
          realtime_amount: 0
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          value: '',
          descr: '',
          wlb_data: null
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 20
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
        reset: false,
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnStatus: {
          showUpdate: false,
          showCopyInsert: false,
          showExport: false
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
      // 高级查询
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
    // 选中的数据，使得导出按钮可用，否则就不可使用
    'dataJson.multipleSelection': {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnStatus.showExport = true
        } else {
          this.settings.btnStatus.showExport = false
        }
        const screenKeys = ['daterange']
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
    // 初始化货主下拉框
    this.getOwnerData()
    // 初始化搜索条件
    if (this.data !== null) {
      this.dataJson.searchForm.warehouse_ids = []
      this.dataJson.searchForm.warehouse_ids.push(this.data.warehouse_id)
      this.dataJson.searchForm.owner_id = this.data.owner_id
      this.dataJson.searchForm.owner_name = this.data.owner_name
    }
    // 初始化仓库下拉框
    this.getWarehouseData()
    // 初始化查询
    this.getDataList()
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
    if (this.meDialogStatus) {
      this.searchsetting.visible = false
    }
  },
  mounted () {
    // 描绘完成

  },
  methods: {
    initShow () {
      // 初始化查询
      this.getDataList()
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
      this.dataJson.searchForm.pageCondition.current = 1
      this.dataJson.paging.current = 1
      if (this.dataJson.searchForm.daterange !== null && this.dataJson.searchForm.daterange !== undefined && this.dataJson.searchForm.daterange !== '') {
        this.dataJson.searchForm.start_time = this.dataJson.searchForm.daterange[0]
        this.dataJson.searchForm.over_time = this.dataJson.searchForm.daterange[1]
      }
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
      queryInventoryDaily(this.dataJson.searchForm).then(response => {
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
      this.settings.reset = !this.settings.reset
    },

    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      return val
    },
    getWarehouseData () {
      getWarehouseComboListApi({ enable: true }).then((_data) => {
        this.dataJson.warehouseComboList = _data.data
        this.settings.loading = false
      }, (_error) => {
      })
    },
    handleReCreate () {
      reCreateDailyInventoryApi().then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.getDataList()
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
