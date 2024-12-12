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
          v-model="dataJson.searchForm.status"
          clearable
          placeholder="版本号"
        >
          <el-option
            v-for="item in dataJson.syncStatusList"
            :key="item.status"
            :label="item.status_name"
            :value="item.status"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.serial_type"
          clearable
          placeholder="业务类型"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.serial_code"
          clearable
          placeholder="业务单号"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="dataJson.searchForm.sync_time"
          value-format="yyyy-MM-dd"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="同步开始日期"
          end-placeholder="同步结束日期"
          :picker-options="pickerOptions"
        />
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
    <el-button-group>
      <el-button-group>
        <el-button
          v-permission="'P_OWNER:ADD'"
          type="primary"
          icon="el-icon-circle-plus-outline"
          :loading="settings.loading"
          @click="handleInsert"
        >新增</el-button>
        <el-button
          v-permission="'P_OWNER:UPDATE'"
          :disabled="!settings.btnShowStatus.showUpdate"
          type="primary"
          icon="el-icon-edit-outline"
          :loading="settings.loading"
          @click="handleUpdate"
        >修改</el-button>
      </el-button-group>
    </el-button-group>
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
      :default-sort="{prop: 'c_time', order: 'descending'}"
      style="width: 100%"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
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
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="title"
        label="通知标题"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="type_name"
        label="通知类型"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="status_name"
        label="发布状态"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="c_name"
        label="发布人"
      />
      <el-table-column
        :auto-fit="true"
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="c_time"
        label="发布时间"
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
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
a {
  color: #52b5f2;
}
.el-button-group {
  margin-bottom: 5px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>

<script>
import constants_program from '@/common/constants/constants_program'
import { getPageList } from '@/api/10_system/notice/systemnotice'
import resizeMixin from '../mixin/resizeHandlerMixin'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import constants_para from '@/common/constants/constants_para'

export default {
  components: { Pagination },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
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
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION_C_TIME),
          // 查询条件
          name: '',
          code: '',
          status: null
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
        constants_program: constants_program,
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
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
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnShowStatus: {
          showUpdate: false,
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
  },
  // 监听器
  watch: {
    'dataJson.multipleSelection': {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnShowStatus.showDelete = true
        } else {
          this.settings.btnShowStatus.showDelete = false
        }
      }
    }
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
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
    },
    // 行点击
    handleRowClick (row) {
      this.dataJson.tempJson = Object.assign({}, row) // copy obj
      this.dataJson.rowIndex = this.getRowIndex(row)
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
    handleCancel () {
      this.settings.popSettings.one.visible = false
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
      getPageList(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },
    // 点击按钮 新增
    handleInsert () {
      // 打开新增页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '新增通知' },
        canEdit: true,
        editStatus: constants_para.STATUS_INSERT
      }

      this.$emit('emitInsert', operate_tab_data)
    },
    // 点击按钮 更新
    handleUpdate () {
      // 打开新增页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '修改通知' },
        canEdit: true,
        data: this.dataJson.currentJson,
        editStatus: constants_para.STATUS_UPDATE
      }

      this.$emit('emitEdit', operate_tab_data)
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnShowStatus.showUpdate = true
      } else {
        this.settings.btnShowStatus.showUpdate = false
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    }
  }
}
</script>
