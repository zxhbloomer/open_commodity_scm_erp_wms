<template>
  <div class="app-container">
    <FloatMenu />
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
    >
      <!-- <el-form-item>
        <select-owner
          v-model.trim="dataJson.searchForm.owner_name"
          :placeholder="isPlaceholderShow('请选择货主')"
          :type="CONSTANTS.DICT_OWNER"
          :reset="settings.reset"
          @onReturnDataName="handleReturnDataName"
        />
      </el-form-item> -->

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
        <el-input
          v-model.trim="dataJson.searchForm.sku_name"
          clearable
          placeholder="请输入物料名称/编码"
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
    <!-- <el-button-group>

      <el-button
        style="visibility:hidden"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
      />

    </el-button-group> -->

    <div
      v-if="!meDialogStatus"
      class="div-sum"
    >
      <div class="right">
        <span class="count-title">可用库存：</span><span class="count-data">{{ dataJson.sumData.qty_avaible == null?'': isZhongLin ? formatNumber3(dataJson.sumData.qty_avaible) : formatNumber(dataJson.sumData.qty_avaible,true,4) }}</span>
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
      :default-sort="{prop: 'sku_name', order: 'ascending'}"
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
        prop="No"
        label="No"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="120"
        :auto-fit="true"
        prop="owner_name"
        label="货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="130"
        :auto-fit="true"
        prop="business_name"
        label="业务板块"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="130"
        :auto-fit="true"
        prop="industry_name"
        label="行业"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="130"
        :auto-fit="true"
        prop="category_name"
        label="物料类别"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="130"
        :auto-fit="true"
        prop="goods_name"
        label="物料名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="130"
        :auto-fit="true"
        prop="pm"
        label="品名"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="160"
        align="right"
        :auto-fit="true"
        prop="qty"
        label="可用库存"
      >
        <template v-slot="scope">
          <!-- {{ formatNumber(scope.row.qty,true,4) }} -->
          <router-link :to="{name:dataJson.constants_program.P_INVENTORY_DETAIL,query:{owner_id:scope.row.owner_id,owner_name:scope.row.owner_name, sku_code:scope.row.goods_code, goods_name:scope.row.goods_name, fullpath:true}}"><a href="javascript:void(0)"> {{ isZhongLin ? formatNumber3(scope.row.qty) : formatNumber(scope.row.qty,true,4) }}</a></router-link>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="120"
        :auto-fit="true"
        prop="unit"
        label="单位"
      />

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
import { getListSumApi, getListByOwnerApi } from '@/api/40_business/inventory/inventory'
import resizeMixin from './mixin/listResizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'
import constants_program from '@/common/constants/constants_program'

export default {
  components: { Pagination },
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
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          owner_name: '',
          owner_ids: []
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        constants_program: constants_program,
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {

        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        sumData: {
          qty_avaible: 0
        },
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
        reset: false,
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
    // 初始化货主下拉框
    this.getOwnerData()
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
      if (this.dataJson.searchForm.sku_name === '') {
        this.dataJson.searchForm.sku_name = null
      }
      // 查询逻辑
      this.settings.loading = true
      getListByOwnerApi(this.dataJson.searchForm).then(response => {
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
    getWarehouseData () {
      getWarehouseComboListApi().then((_data) => {
        this.dataJson.warehouseComboList = _data.data
        this.settings.loading = false
      }, (_error) => {
      })
    },
    handleReturnDataName (val) {
      this.dataJson.searchForm.owner_name = val
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      return val
    },
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
    }

  }
}
</script>
