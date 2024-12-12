<template>
  <div class="app-container">
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
      class="search-form-floatRight"
    >
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.contract_no"
          :disabled="searchDisable.contract_no"
          clearable
          placeholder="合同号"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.order_no"
          clearable
          placeholder="订单号"
        />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="dataJson.searchForm.start_time"
          value-format="yyyy-MM-dd"
          type="date"
          clearable
          :placeholder="isPlaceholderShow('合同日期起')"
        />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="dataJson.searchForm.over_time"
          value-format="yyyy-MM-dd"
          type="date"
          clearable
          :placeholder="isPlaceholderShow('合同日间止')"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-popover:popover
          type="primary"
          plain
          icon="el-icon-search"
        >高级查询</el-button>
      </el-form-item>
    </el-form>
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
        class="floatRight"
      >
        <el-form-item label="分类">
          <select-dict
            v-model="dataJson.searchForm.serial_type"
            :para="CONSTANTS.DICT_B_ORDER_TYPE"
            init-placeholder="分类"
          />
        </el-form-item>

        <el-form-item label="业务类型">
          <select-dict
            v-model="dataJson.searchForm.bill_type"
            :para="CONSTANTS.DICT_B_IN_BUSINESS_TYPE"
            init-placeholder="业务类型"
          />
        </el-form-item>
        <el-form-item label="物料名称/物料编码">
          <el-input
            v-model.trim="dataJson.searchForm.goods_name"
            clearable
            placeholder="物料名称/物料编码"
          />
        </el-form-item>

        <el-form-item label="供应商/客户">
          <select-customer
            v-model.trim="dataJson.searchForm.customer_name"
            :placeholder="isPlaceholderShow('请选择供应商/客户')"
            :type="CONSTANTS.DICT_SUPPLIER"
            :reset="dataJson.searchForm.reset1"
            placement="left"
            @onReturnDataName="handleCustomerReturnDataName"
          />
        </el-form-item>

        <el-form-item label="采购/销售企业">
          <select-owner
            v-model.trim="dataJson.searchForm.owner_name"
            :placeholder="isPlaceholderShow('请选择采购/销售企业')"
            :type="CONSTANTS.DICT_OWNER"
            :reset="dataJson.searchForm.reset2"
            @onReturnDataName="handleOwnerReturnDataName"
          />
        </el-form-item>

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
    <el-button-group v-if="searchsetting.visible" />

    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
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
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="index"
        width="45"
        label="No"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="serial_type_name"
        label="类型"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="contract_no"
        label="合同编号"
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
        prop="order_no"
        label="订单编号"
      />
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="55"
        prop="idx"
        label="序号"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="bill_type_name"
        label="单据类型"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="contract_dtf"
        label="合同日期"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="customer_name"
        label="供应商/客户名称"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="owner_name"
        label="货主名称"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="goods_name"
        label="商品名称"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="pm"
        label="品名"
      />
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="spec"
        label="规格"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="num"
        label="合同量"
      >
        <template v-slot="scope">
          {{ scope.row.num == null?'':formatNumber(scope.row.num,true,4) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="price"
        label="合同价格"
      >
        <template v-slot="scope">
          {{ scope.row.price == null?'':formatNumber(scope.row.price) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="delivery_type_name"
        label="交货方式"
      />

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="180"
        prop="delivery_date"
        label="交货日期"
      >
        <template v-slot="scope">
          {{ scope.row.delivery_date == null?'0':formatDate(scope.row.delivery_date) }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        align="right"
        min-width="120"
        prop="rate"
        label="税率"
      >
        <template v-slot="scope">
          {{ scope.row.rate == null?'0':formatNumber(scope.row.rate*10) }}%
        </template>
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
        min-width="180"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="c_time"
        label="创建时间"
      >
        <template v-slot="scope">
          {{ scope.row.c_time==null||scope.row.c_time==''?'-':formatDateTime(scope.row.c_time) }}
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
        min-width="180"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ scope.row.u_time==null||scope.row.u_time==''?'-':formatDateTime(scope.row.u_time) }}
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
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
</style>
<style >
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
</style>

<script>
import { getList2Api } from '@/api/40_business/order/order'
import resizeMixin from '@/mixin/resizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import SelectCustomer from '@/views/30_wms/customer/selectgrid/selectCustomer'
import SelectOwner from '@/views/30_wms/owner/selectgrid/selectOwner'
import SelectDict from '@/components/00_dict/select/SelectDict'

export default {
  components: { Pagination, SelectOwner, SelectCustomer, SelectDict },
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
      // 查询区域是否可修改
      searchDisable: {
        contract_no: false
      },
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          reset1: false,
          reset2: false,
          config_key: ''
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
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
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnShowStatus: {
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
    }
  },
  // 监听器
  watch: {
    // 选中的数据，使得导出按钮可用，否则就不可使用
    'dataJson.multipleSelection': {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnShowStatus.showUpdate = true
          this.settings.btnShowStatus.showDelete = true
          this.settings.btnShowStatus.showEnable = true
          this.settings.btnShowStatus.showDisable = true
        } else {
          this.settings.btnShowStatus.showUpdate = false
          this.settings.btnShowStatus.showDelete = false
          this.settings.btnShowStatus.showEnable = false
          this.settings.btnShowStatus.showDisable = false
        }
      }
    }
  },
  created () {
    // 初始化查询
    this.getDataList()
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
    if (this.meDialogStatus) {
      this.searchsetting.visible = false
      if (this.data && this.data.type === 'b_schedule_order') {
        this.dataJson.searchForm.contract_no = this.data.sales_contract_code
        this.searchDisable.contract_no = true
      }
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
      getList2Api(this.dataJson.searchForm).then(response => {
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
      this.dataJson.searchForm.reset1 = true
      this.dataJson.searchForm.reset2 = true
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

      if (this.dataJson.currentJson.id !== undefined) {
        // this.settings.btnShowStatus.doInsert = true
        this.settings.btnShowStatus.showUpdate = true
      } else {
        // this.settings.btnShowStatus.doInsert = false
        this.settings.btnShowStatus.showUpdate = false
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      return val
    },
    handleCustomerReturnDataName (val) {
      this.dataJson.searchForm.customer_name = val
      this.dataJson.searchForm.reset1 = false
    },
    handleOwnerReturnDataName (val) {
      this.dataJson.searchForm.owner_name = val
      this.dataJson.searchForm.reset2 = false
    }

  }
}
</script>
