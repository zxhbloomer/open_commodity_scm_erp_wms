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
          v-model.trim="dataJson.searchForm.goods_name"
          clearable
          placeholder="物料名称"
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
          :loading="settings.loading"
          icon="el-icon-search"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>

    <el-button-group>
      <el-button
        v-permission="'P_MATERIAL_PRICE:SYNCALL'"
        type="primary"
        :disabled="!settings.btnStatus.showSync"
        icon="el-icon-circle-close"
        :loading="settings.loading"
        @click="handleSyncAll"
      >同步</el-button>
      <el-button
        v-permission="'P_MATERIAL_PRICE:RECOUNT'"
        :disabled="!settings.btnStatus.showRecreate"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleRecreate"
      >重新计算</el-button>
    </el-button-group>

    <!-- <div class="div-sum">
      <div class="right">
        <span class="count-title">合计到货数量：</span><span class="count-data">{{ dataJson.sumData.qty == null?'0':dataJson.sumData.qty>0?formatNumber(dataJson.sumData.qty,true,4):0 }}</span>
        <span class="count-title">合计货值：</span><span class="count-data">{{ dataJson.sumData.amount == null?'0':dataJson.sumData.amount>0?formatNumber(dataJson.sumData.amount,true,4):0 }}</span>
      </div>
    </div> -->

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
      @row-click="handleRowClick"
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
        min-width="150"
        :auto-fit="true"
        prop="goods_name"
        label="物料名称"
      />
      <el-table-column
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        sortable="custom"
        min-width="180"
        prop="goods_code"
        label="物料编码"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="sku_name"
        label="规格名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="sku_code"
        label="规格编码"
      />
      <el-table-column
        :auto-fit="true"
        sortable="custom"
        :sort-orders="settings.sortOrders"
        min-width="150"
        align="right"
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
        :auto-fit="true"
        min-width="180"
        prop="c_time"
        label="日期"
      >
        <template v-slot="scope">
          {{ scope.row.c_time == null?'':formatDateTime(scope.row.c_time) }}
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
.left {
  position: absolute;
  left: 10px;
  margin-left: 10px;
}
.perfect_popper .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
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
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>

<script>
// import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
// import constants_para from '@/common/constants/constants_para'
// import constants_type from '@/common/constants/constants_dict'
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'
import { getListApi, syncAllApi, recreateApi } from '@/api/40_business/materialprice/materialprice'
import deepCopy from 'deep-copy'
import mixin from './mixin/listResizeHandlerMixin'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  directives: { permission },
  mixins: [mixin],
  props: {},
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: {
            current: 1,
            size: 20,
            sort: 'c_time' // 排序
          },
          warehouse_id: null,
          goods_name: null
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: [],
        // 合计值
        sumData: {
          qty: 0,
          amount: 0
        }
      },
      // 页面设置json
      settings: {
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnStatus: {
          showExport: false,
          showSync: false,
          showRecreate: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight()
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
  },
  created () {
    // 初始化watch
    this.setWatch()
    // 初始化查询
    this.getDataList()
    // 初始化仓库下拉框
    this.getWarehouseData()
  },
  mounted () {
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.multipleSelection', (newVal, oldVal) => {
        if (newVal.length > 0) {
          this.settings.btnStatus.showExport = true
          // this.settings.btnStatus.showRecreate = true
        } else {
          this.settings.btnStatus.showExport = false
          // this.settings.btnStatus.showRecreate = false
        }
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
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
      getListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
        // 如果有数据, 重新计算按钮高亮
        if (this.dataJson.listData !== null) {
          this.settings.btnStatus.showSync = true
          this.settings.btnStatus.showRecreate = true
        }
      }).finally(() => {
        this.settings.loading = false
      })
      // 查询合计信息
      // getListSumApi(this.dataJson.searchForm).then(response => {
      //   if (response.data !== null) {
      //     this.dataJson.sumData = response.data
      //   }
      // }).finally(() => {
      // })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
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
    // 重新生成按钮
    handleRecreate () {
      this.$confirm('确认重新生成？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.settings.loading = true
        // 开始同步
        recreateApi().then((_data) => {
          this.$notify({
            title: '生成成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          this.getDataList()
          // loading
        }, (_error) => {
          this.$notify({
            title: '生成失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
        }).finally(() => {
          this.settings.loading = false
        })
      })
    },

    handleSyncAll () {
      this.$confirm('确认同步？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
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
      })
    }

    // 同步所有数据按钮
    // handleSyncAll () {
    //   this.settings.loading = true
    //   var tempData = {}
    //   // 开始同步
    //   syncAllApi(tempData).then((_data) => {
    //     this.$notify({
    //       title: '同步成功',
    //       message: _data.message,
    //       type: 'success',
    //       duration: this.settings.duration
    //     })
    //     this.getDataList()
    //     // loading
    //   }, (_error) => {
    //     this.$notify({
    //       title: '同步错误',
    //       message: _error.message,
    //       type: 'error',
    //       duration: this.settings.duration
    //     })
    //   }).finally(() => {
    //     this.settings.loading = false
    //   })
    // }
  }
}
</script>
