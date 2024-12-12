<template>
  <div class="app-container">
    <!--    <FloatMenu />-->
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
    >
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
      <el-form-item>
        <select-dict
          v-model="dataJson.searchForm.batch"
          :para="CONSTANTS.DICT_BUSINESS_START_TIME"
          init-placeholder="业务启动日期"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
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

    <el-button-group>
      <el-button
        v-permission="'P_PRODUCT_DAILY:EXPORT'"
        :disabled="!settings.btnStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>

    </el-button-group>
    <br>
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
      show-summary
      :summary-method="getSummaries"
      highlight-current-row
      :default-sort="{prop: 'date', order: 'descending'}"
      style="width: 100%"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="100"
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
        prop="date"
        label="日期"
      >
        <template v-slot="scope">
          {{ scope.row.date == null?'':formatDate(scope.row.date) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="140"
        prop="warehouse_name"
        label="掺混/加工库点"
      />
      <el-table-column
        :auto-fit="true"
        min-width="100"
        label="加工方式"
        align="center"
        prop="product_type"
      />

      <el-table-column
        :auto-fit="true"
        min-width="130"
        align="center"
        label="稻谷"
      >
        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="a_in_qty"
          align="right"
          label="定向入库"
        >
          <template v-slot="scope">
            {{ scope.row.a_in_qty === null?'': isZhongLin ? formatNumber3(scope.row.a_in_qty) : formatNumber(scope.row.a_in_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="a_product_qty"
          align="right"
          label="掺混/加工使用"
        >
          <template v-slot="scope">
            {{ scope.row.a_product_qty === null?'': isZhongLin ? formatNumber3(scope.row.a_product_qty) : formatNumber(scope.row.a_product_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="a_out_qty"
          align="right"
          label="出库数量"
        >
          <template v-slot="scope">
            {{ scope.row.a_out_qty === null?'': isZhongLin ? formatNumber3(scope.row.a_out_qty) : formatNumber(scope.row.a_out_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="a_inventory_qty"
          align="right"
          label="库存数量"
        >
          <template v-slot="scope">
            {{ scope.row.a_inventory_qty === null?'': isZhongLin ? formatNumber3(scope.row.a_inventory_qty) : formatNumber(scope.row.a_inventory_qty,true,4) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="130"
        label="糙米"
      >
        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="b_in_qty"
          align="right"
          label="加工入库"
        >
          <template v-slot="scope">
            {{ scope.row.b_in_qty === null?'': isZhongLin ? formatNumber3(scope.row.b_in_qty) : formatNumber(scope.row.b_in_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="b_cost_qty"
          align="right"
          label="掺混数量"
        >
          <template v-slot="scope">
            {{ scope.row.b_cost_qty === null?'': isZhongLin ? formatNumber3(scope.row.b_cost_qty) : formatNumber(scope.row.b_cost_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="b_out_qty"
          align="right"
          label="出库数量"
        >
          <template v-slot="scope">
            {{ scope.row.b_out_qty === null?'': isZhongLin ? formatNumber3(scope.row.b_out_qty) : formatNumber(scope.row.b_out_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="b_inventory_qty"
          align="right"
          label="库存数量"
        >
          <template v-slot="scope">
            {{ scope.row.b_inventory_qty === null?'': isZhongLin ? formatNumber3(scope.row.b_inventory_qty) : formatNumber(scope.row.b_inventory_qty,true,4) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        min-width="130"
        align="center"
        label="玉米"
      >
        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="c_in_qty"
          align="right"
          label="入库数量"
        >
          <template v-slot="scope">
            {{ scope.row.c_in_qty === null?'': isZhongLin ? formatNumber3(scope.row.c_in_qty) : formatNumber(scope.row.c_in_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="c_cost_qty"
          align="right"
          label="掺混使用"
        >
          <template v-slot="scope">
            {{ scope.row.c_cost_qty === null?'': isZhongLin ? formatNumber3(scope.row.c_cost_qty) : formatNumber(scope.row.c_cost_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="c_inventory_qty"
          align="right"
          label="库存数量"
        >
          <template v-slot="scope">
            {{ scope.row.c_inventory_qty === null?'': isZhongLin ? formatNumber3(scope.row.c_inventory_qty) : formatNumber(scope.row.c_inventory_qty,true,4) }}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        :auto-fit="true"
        min-width="130"
        align="right"
        prop="router"
        label="掺混比例(玉米)"
      />

      <el-table-column
        :auto-fit="true"
        min-width="130"
        align="center"
        label="混合物"
      >
        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="d_in_qty"
          align="right"
          label="入库数量(掺混)"
        >
          <template v-slot="scope">
            {{ scope.row.d_in_qty === null?'': isZhongLin ? formatNumber3(scope.row.d_in_qty) : formatNumber(scope.row.d_in_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="d_out_qty"
          align="right"
          label="出库数量"
        >
          <template v-slot="scope">
            {{ scope.row.d_out_qty === null?'': isZhongLin ? formatNumber3(scope.row.d_out_qty) : formatNumber(scope.row.d_out_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="loss_qty"
          align="right"
          label="损耗"
        >
          <template v-slot="scope">
            {{ scope.row.loss_qty === null?'': isZhongLin ? formatNumber3(scope.row.loss_qty) : formatNumber(scope.row.loss_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="d_residue_qty"
          align="right"
          label="剩余库存"
        >
          <template v-slot="scope">
            {{ scope.row.d_residue_qty === null?'': isZhongLin ? formatNumber3(scope.row.d_residue_qty) : formatNumber(scope.row.d_residue_qty,true,4) }}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        :auto-fit="true"
        align="center"
        min-width="130"
        label="稻壳"
      >
        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="e_in_qty"
          align="right"
          label="入库数量"
        >
          <template v-slot="scope">
            {{ scope.row.e_in_qty === null?'': isZhongLin ? formatNumber3(scope.row.e_in_qty) : formatNumber(scope.row.e_in_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="e_out_qty"
          align="right"
          label="出库数量"
        >
          <template v-slot="scope">
            {{ scope.row.e_out_qty === null?'': isZhongLin ? formatNumber3(scope.row.e_out_qty) : formatNumber(scope.row.e_out_qty,true,4) }}
          </template>
        </el-table-column>

        <el-table-column
          :auto-fit="true"
          min-width="130"
          prop="e_residue_qty"
          align="right"
          label="剩余库存"
        >
          <template v-slot="scope">
            {{ scope.row.e_residue_qty === null?'': isZhongLin ? formatNumber3(scope.row.e_residue_qty) : formatNumber(scope.row.e_residue_qty,true,4) }}
          </template>
        </el-table-column>
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
import { getPageListApi, exportApi, getListSumApi } from '@/api/50_query/productdaily'
import resizeMixin from './mixin/listResizeHandlerMixin'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'
import SelectDict from '@/components/00_dict/select/SelectDict.vue'
import { mapState } from 'vuex'

export default {
  components: { SelectDict, Pagination },
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
            sort: '-date' // 排序
          },
          // 仓库
          warehouse_ids: [],
          batch: '',
          daterange: []

        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 合计
        sumData: [],
        // 合计返回值
        sums: [],
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {},
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
      }
    }
  },
  computed: {
    ...mapState('dictDefaultValue', ['dict_value']),
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
      }
    },
    'dataJson.searchForm': {
      deep: true,
      handler () {
        if (this.dataJson.searchForm.daterange === null) {
          this.dataJson.searchForm.init_time = null
          this.dataJson.searchForm.end_time = null
        }
      }
    }
  },
  updated () {
    // 加上之后, 合计的 summary-method 方法每次都会显示出数据了.
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout()
    })
  },
  created () {
    // 设置 创建时间默认值
    this.setDateRange()
    this.dataJson.searchForm.batch = this.dict_value
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
        this.dataJson.searchForm.init_time = this.dataJson.searchForm.daterange[0]
        this.dataJson.searchForm.end_time = this.dataJson.searchForm.daterange[1]
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
    async getDataList () {
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      getPageListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
      getListSumApi(this.dataJson.searchForm).then(response => {
        this.dataJson.sumData = response.data
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
      const param = { 'warehouse_type': '2', enable: true }
      getWarehouseComboListApi(param).then((_data) => {
        this.dataJson.warehouseComboList = _data.data
        this.settings.loading = false
      }, (_error) => {
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
      exportApi(this.dataJson.searchForm).then(response => {
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
        selectionJson.push(value.id)
      })
      const param = {}
      param.ids = selectionJson
      // 开始导出
      exportApi(param).then(response => {
        this.settings.loading = false
      })
    },
    // 求和
    getSummaries (param) {
      const { columns, data } = param
      console.log(data)
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = this.dataJson.sumData.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return this.formatNumber(prev + curr, true, 3)
            } else {
              return this.formatNumber(prev, true, 3)
            }
          }, 0)
          // sums[index] += ''
        } else {
          // sums[index] = '0'
        }
      })
      // 部分字段不合计
      sums[2] = ''
      sums[3] = ''
      sums[4] = ''
      sums[8] = ''
      sums[12] = ''
      sums[15] = ''
      sums[16] = ''
      sums[20] = ''
      sums[23] = ''
      return sums
    },
    // 设置创建时间的默认时间
    setDateRange () {
      const end = this.formatDate(new Date(), 3)
      this.dataJson.searchForm.daterange.push(end)
      this.dataJson.searchForm.daterange.push(end)
      this.dataJson.searchForm.init_time = end
      this.dataJson.searchForm.end_time = end
    }

  }
}
</script>
