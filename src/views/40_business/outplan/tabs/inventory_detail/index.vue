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
          v-model="dataJson.searchForm.owner_id"
          placeholder="请选择货主"
          :disabled="settings.disabledOwner"
          filterable
          clearable
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
          :disabled="settings.disabledWarehouse"
          filterable
          :filter-method="handleWarehouseFilter"
          placeholder="请选择仓库"
          :loading="settings.warehouse_loading"
          loading-text="拼命加载..."
          multiple
          collapse-tags
          clearable
          style="width:200px"
        >
          <el-option
            v-for="item in dataJson.warehouseOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.sku_name"
          clearable
          placeholder="请输入物料名称"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.sku_code"
          clearable
          :disabled="settings.disabledSkuCode"
          placeholder="请输入物料编码"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <select-dicts
          v-if="!isZLEnvironment"
          v-model="dataJson.searchForm.warehouse_types"
          :para="CONSTANTS.DICT_M_WAREHOUSE_TYPE"
          init-placeholder="仓库类型"
        />
        <select-dicts
          v-if="isZLEnvironment"
          v-model="dataJson.searchForm.warehouse_types"
          :para="CONSTANTS.DICT_M_WAREHOUSE_TYPE"
          :filter-para="['4']"
          init-placeholder="仓库类型"
        />
      </el-form-item>
      <el-form-item>
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
          placeholder="请输入分类"
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
          :loading="settings.loading"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
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
      :default-sort="{prop: 'sku_name', order: 'ascending'}"
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
        label="No"
        prop="No"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="business_name"
        label="业务板块"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="industry_name"
        label="行业"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="category_name"
        label="分类"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="owner_short_name"
        label="货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="warehouse_short_name"
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
        prop="location_short_name"
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
        prop="sku_name"
        label="物料名称"
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
        prop="spec"
        label="规格"
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
        fixed="right"
        align="right"
        min-width="120"
        prop="qty_avaible"
        label="可用库存"
      >
        <template v-slot="scope">
          {{ scope.row.qty_avaible === null?'': isZLEnvironment ? formatNumber3(scope.row.qty_avaible) : formatNumber(scope.row.qty_avaible,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="qty_lock"
        label="锁定库存"
      >
        <template v-slot="scope">
          {{ scope.row.qty_lock === null?'': isZLEnvironment ? formatNumber3(scope.row.qty_lock) : formatNumber(scope.row.qty_lock,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="unit_name"
        label="库存单位"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="130"
        prop="price"
        label="实时单价"
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
        label="货值"
      >
        <template v-slot="scope">
          {{ scope.row.amount == null?'':formatCurrency(scope.row.amount, true) }}
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
import { queryInventory2OutPlanDetails } from '@/api/50_query/inventory_detail'
import resizeMixin from './mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'
import SelectDicts from '@/components/00_dict/select/SelectDicts'

export default {
  components: { Pagination, SelectDicts },
  directives: { elDragDialog },
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
            sort: 'sku_name' // 排序
          },
          category_name: null,
          // 是否是中林环境
          isZLEnvironment: false,
          // 货主名称
          owner_name: null,
          owner_id: null,
          owner_ids: [],
          // 仓库
          warehouse_ids: [],
          // 商品名称
          sku_name: null,
          sku_code: null,
          // 仓库类型
          warehouse_types: []
        },
        ownerComboList: [],
        warehouseComboList: [],
        warehouseOptions: [],
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        sumData: {
          qty_lock: 0,
          qty_avaible: 0,
          amount: 0
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
        disabledOwner: false,
        disabledWarehouse: false,
        btnStatus: {
          showUpdate: false,
          showCopyInsert: false,
          showExport: false
        },
        // loading 状态
        loading: true,
        warehouse_loading: true,
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
      }
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
    // 是否是中林环境
    isZLEnvironment () {
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
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnStatus.showExport = true
        } else {
          this.settings.btnStatus.showExport = false
        }
      }
    },

    // 清空货主选项时, 也清空owner_id
    'dataJson.searchForm.owner_name': {
      handler (newVal, oldVal) {
        if (newVal === null || newVal === undefined) {
          this.dataJson.searchForm.owner_id = null
        }
      }
    }
  },
  created () {
    // 初始化货主下拉框
    this.getOwnerData()
    // 判断是否是中林环境
    this.dataJson.searchForm.isZLEnvironment = this.isZLEnvironment
    // 初始化搜索条件
    if (this.data !== null) {
      this.dataJson.searchForm.warehouse_ids = []
      // if (this.meDialogStatus && this.data.warehouse_id !== undefined) {
      //   this.dataJson.searchForm.warehouse_ids.push(this.data.warehouse_id)
      // }

      this.dataJson.searchForm.owner_id = this.data.owner_id
      this.dataJson.searchForm.owner_name = this.data.owner_name
      if (this.meDialogStatus && this.dataJson.searchForm.owner_name !== undefined && this.dataJson.searchForm.owner_name !== '') {
        this.settings.disabledOwner = true
      }
      if (this.meDialogStatus && this.data.contract_no !== undefined && this.data.contract_no !== '') {
        this.settings.disabledSkuCode = true
        this.dataJson.searchForm.sku_code = this.data.sku_code
      }
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
      queryInventory2OutPlanDetails(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
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
    handleReturnDataName (val) {
      this.dataJson.searchForm.owner_name = val
    },
    getWarehouseData () {
      getWarehouseComboListApi().then((_data) => {
        this.dataJson.warehouseComboList = _data.data
        this.dataJson.warehouseOptions = _data.data
        this.settings.warehouse_loading = false
      }, (_error) => {
      })
    },
    warehouseFilter (val) {
      this.value = val // 给绑定值赋值

      if (val) {
        // val存在筛选数组
        this.options = this.dataJson.warehouseComboList.filter((i) => {
          let index = -1
          let reflag = true

          // 逐字对比筛选
          const valArr = val.split('')
          const len = valArr.length
          for (let k = 0; k < len; k++) {
            if (i.label.indexOf(valArr[k]) <= index) {
              reflag = false
              break
            }
            index = i.label.indexOf(valArr[k]) // 赋筛选的字在i中的索引
          }

          return reflag
        })
      } else {
        // val不存在还原数组
        this.options = this.list
      }
    },
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        // this.$set(this.dataJson, 'ownerComboList', _data.data)
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
    },
    handleWarehouseFilter (value) {
      const trimmedValue = value.trim() // 去掉空格
      console.log(trimmedValue + '==================')

      this.dataJson.warehouseOptions = this.dataJson.warehouseComboList.filter((item) => {
        if (item.name.includes(trimmedValue) || item.name.toUpperCase().includes(trimmedValue.toUpperCase())) {
          return true
        }
      })
    }
  }
}
</script>
