<template>
  <div>
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
        prop="warehouse_group_name"
        label="仓库组名称"
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
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="130"
        :sort-orders="settings.sortOrders"
        prop="code"
        label="仓库编码"
        :auto-fit="true"
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
// import { getAllWarehouseListByPositionApi } from '@/api/20_master/relation/relation'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { EventBus } from '@/common/eventbus/eventbus'
// import { isNotEmpty } from '@/utils'

export default {
  components: { Pagination },
  directives: { elDragDialog },
  mixins: [],
  props: {
    height: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      dataJson: {
        // 左侧树元数据
        tempJsons: [],
        // 左侧树的多选数据
        datas: null,
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

      }
    }
  },
  created () {
    // this.$options.name = this.PROGRAMS.P_ORG_RIGHT_GROUP
    this.initShow()
  },
  mounted () {
    // 描绘完成
    // 当左侧树checkbox有变化时
    EventBus.$on(this.EMITS.EMIT_RELATION_LEFT_CHECKED, _data => {
      this.dataJson.tempJsons = deepCopy(_data)
      this.getDataList()
    })
  },
  methods: {
    initShow () {
      this.getDataList()
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

      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      const codes = ['']
      this.dataJson.tempJsons.forEach(function (value, index, array) {
        codes.push(value.code)
      })

      const condition = {
        ...{ codes: codes },
        ...{ pageCondition: this.dataJson.searchForm.pageCondition }
      }
      getWarehouseListApi(condition).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
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
    getAllCheckCode (_data) {
      this.dataJson.datas = []
      if (_data.is_enable) {
        this.dataJson.datas.push({ code: _data.code })
      }
      if (_data.children) {
        this.getChecktwo(_data.children)
      }
    },
    getChecktwo (children) {
      for (const _child of children) {
        if (_child.is_enable) {
          this.dataJson.datas.push({ code: _child.code })
        }
        if (_child.children) {
          this.getCheckthree(_child.children)
        }
      }
    },
    getCheckthree (children) {
      for (const _child of children) {
        if (_child.is_enable) {
          this.dataJson.datas.push({ code: _child.code })
        }
        if (_child.children) {
          this.getCheckfour(_child.children)
        }
      }
    },
    getCheckfour (children) {
      for (const _child of children) {
        if (_child.is_enable) {
          this.dataJson.datas.push({ code: _child.code })
        }
      }
    }
  }
}
</script>
