<template>
  <div>
    <el-form
      ref="dataSubmitForm"
      :rules="settings.rules"
      :model="dataJson.tempJson"
      label-position="right"
      label-width="150px"
      status-icon
    >
      <el-button-group>
        <el-button
          v-show="true"
          type="primary"
          icon="el-icon-circle-plus-outline"
          :loading="settings.loading"
          :disabled="!settings.editWarehouse"
          @click="handleInsert"
        >新增关联</el-button>
      </el-button-group>
      <div style="margin-bottom: 18px;" />
      <el-table
        ref="multipleTable"
        v-loading="settings.loading"
        type="org_group"
        :data="dataJson.listData"
        :element-loading-text="'正在拼命加载中...'"
        element-loading-background="rgba(255, 255, 255, 0.5)"
        :height="height"
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
        <!-- <el-table-column type="selection" width="45" prop="id" /> -->
        <el-table-column
          type="index"
          width="45"
          label="No"
        />
        <el-table-column
          show-overflow-tooltip
          sortable="custom"
          min-width="130"
          :sort-orders="settings.sortOrders"
          prop="b_warehouse_group_type"
          label="仓库组"
          :auto-fit="true"
        >
          <template v-slot="scope">
            <span class="org_png">
              {{ scope.row.warehouse_group_name }}
              <el-tag
                v-if="scope.row.b_warehouse_group_type === CONSTANTS.DICT_B_WAREHOUSE_GROUP_1"
                size="mini"
                effect="dark"
                type="success"
              >一级</el-tag>
              <el-tag
                v-if="scope.row.b_warehouse_group_type === CONSTANTS.DICT_B_WAREHOUSE_GROUP_2"
                size="mini"
                effect="dark"
                type="info"
              >二级</el-tag>
              <el-tag
                v-if="scope.row.b_warehouse_group_type === CONSTANTS.DICT_B_WAREHOUSE_GROUP_3"
                size="mini"
                effect="dark"
                type="warning"
              >三级</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          sortable="custom"
          min-width="130"
          :sort-orders="settings.sortOrders"
          prop="code"
          label="仓库编码"
          :auto-fit="true"
        />
        <el-table-column
          show-overflow-tooltip
          sortable="custom"
          min-width="160"
          :sort-orders="settings.sortOrders"
          prop="name"
          label="仓库名称"
          :auto-fit="true"
        />
        <el-table-column
          show-overflow-tooltip
          sortable="custom"
          min-width="180"
          :sort-orders="settings.sortOrders"
          prop="short_name"
          label="仓库简称"
        />
      </el-table>
      <pagination
        ref="minusPaging"
        :total="dataJson.paging.total"
        :page.sync="dataJson.paging.current"
        :limit.sync="dataJson.paging.size"
        @pagination="getDataList"
      />

    </el-form>
    <set-warehouse
      v-if="popSettings.one.visible"
      :id="popSettings.one.props.id"
      :data="popSettings.one.props.data.code"
      :name="popSettings.one.props.data.name"
      :visible="popSettings.one.visible"
      :model="CONSTANTS.DICT_ORG_USED_TYPE_SHOW_UNUSED"
      @closeMeOk="handleSetWarehouseOk"
      @closeMeCancel="handleSetWarehouseCancel"
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

<script>
import { getWarehouseListApi } from '@/api/20_master/relation/relation'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import setWarehouse from '@/views/30_wms/warehouse/dialog/setWarehouse'

export default {
  components: { Pagination, setWarehouse },
  directives: { elDragDialog },
  mixins: [],
  props: {
    height: {
      type: Number,
      default: undefined
    }
  },
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          condition: null,
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION)
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 单条数据 json
        currentJson: null,
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
        editWarehouse: true,
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
        duration: 4000
      },
      popSettings: {
        // 弹出编辑页面
        one: {
          visible: false,
          props: {
            id: undefined,
            data: {}
          }
        }
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
    // 选中的数据，使得导出按钮可用，否则就不可使用
    'dataJson.multipleSelection': {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnShowStatus.showExport = true
        } else {
          this.settings.btnShowStatus.showExport = false
        }
      }
    }
  },
  created () {
    // this.$options.name = this.PROGRAMS.P_ORG_RIGHT_GROUP
    this.initShow()
  },
  mounted () {
    // 描绘完成
  },
  methods: {
    initShow () {
      // 初始化查询
      this.$on(this.EMITS.EMIT_RELATION_CHANGE, _data => {
        if (_data.code.length === 4) {
          this.settings.editWarehouse = false
        } else {
          this.settings.editWarehouse = true
        }
        this.dataJson.searchForm.condition = _data
        this.getDataList()
      })
    },
    // 下拉选项控件事件
    handleSelectChange (val) {
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
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        // this.settings.btnShowStatus.doInsert = true
        this.settings.btnShowStatus.showUpdate = true
        this.settings.btnShowStatus.showCopyInsert = true
      } else {
        // this.settings.btnShowStatus.doInsert = false
        this.settings.btnShowStatus.showUpdate = false
        this.settings.btnShowStatus.showCopyInsert = false
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
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
      // 通知兄弟组件
      this.$off(this.EMITS.EMIT_RELATION_LOADING)
      this.$emit(this.EMITS.EMIT_RELATION_LOADING)
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      // this.dataJson.searchForm.condition = Object.assign({}, val)
      const condition = {
        ...this.dataJson.searchForm.condition,
        ...{ pageCondition: this.dataJson.searchForm.pageCondition }
      }
      getWarehouseListApi(condition).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
        // 通知兄弟组件
        this.$off(this.EMITS.EMIT_RELATION_LOADING_OK)
        this.$emit(this.EMITS.EMIT_RELATION_LOADING_OK)
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },
    handleInsert () {
      // getDataByIdApi({ id: this.dataJson.currentJson.serial_id }).then(response => {
      //   this.popSettings.one.props.id = response.data.id
      //   this.popSettings.one.props.data = response.data
      //   this.popSettings.one.visible = true
      // }).finally(() => {
      // })
      this.popSettings.one.props.id = this.dataJson.searchForm.condition.serial_id
      this.popSettings.one.props.data = { code: this.dataJson.searchForm.condition.code, name: this.dataJson.searchForm.condition.name }
      this.popSettings.one.visible = true
    },
    // 穿梭框ok
    handleSetWarehouseOk (val) {
      this.popSettings.one.visible = false
      this.getDataList()
    },
    handleSetWarehouseCancel () {
      this.popSettings.one.visible = false
    }
  }
}
</script>
