<template>
  <div class="app-container">
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
    >
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.page_code"
          clearable
          placeholder="页面编码"
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
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-button-group>
      <el-button
        v-permission="'P_COLUMN:ADD'"
        :disabled="settings.btnShowStatus.showInsert"
        type="primary"
        icon="el-icon-info"
        :loading="settings.loading"
        @click="handleInsert"
      >新增</el-button>
      <el-button
        v-permission="'P_COLUMN:UPDATE'"
        :disabled="!settings.btnShowStatus.showUpdate"
        type="primary"
        icon="el-icon-info"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
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
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="page_code"
        label="页面编码"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="name"
        label="列属性"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="label"
        label="列名称"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="sort"
        label="顺序"
      >
        <template v-slot="scope">
          <span>{{ scope.row.sort }}</span>
          <div class="floatRight">
            <el-button
              class="el-icon-top"
              type="text"
              style="font-size: 16px"
              @click="handleSortUp(scope.row)"
            />
            <el-button
              class="el-icon-bottom"
              type="text"
              style="font-size: 16px"
              @click="handleSortDown(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="fix"
        label="是否固定"
      >
        <template v-slot="scope">
          <el-tooltip
            :content="scope.row.fix === false ? '固定状态：不固定' : '固定状态：固定' "
            placement="top"
            :open-delay="500"
          >
            <el-switch
              v-model="scope.row.fix"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
              :width="30"
              @change="handledUpdateFixApi(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="is_enable"
        label="是否显示"
      >
        <template v-slot="scope">
          <el-tooltip
            :content="scope.row.is_enable === false ? '显示状态：不显示' : '显示' "
            placement="top"
            :open-delay="500"
          >
            <el-switch
              v-model="scope.row.is_enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
              :width="30"
              @change="handledEnableUpdateApi(scope.row)"
            />
          </el-tooltip>
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

    <edit-dialog
      v-if="settings.popSettings.one.visible"
      :id="settings.popSettings.one.props.id"
      :data="settings.popSettings.one.props.data"
      :visible="settings.popSettings.one.visible"
      :dialog-status="settings.popSettings.one.props.dialogStatus"
      @closeMeCancel="handleCancel"
      @closeMeOk="handleCloseOk"
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
  margin-bottom: 10px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>

<script>
import constants_program from '@/common/constants/constants_program'
import { getListApi, updateApi, sortApi } from '@/api/10_system/columnsetting/columnsetting'
import resizeMixin from './mixin/resizeHandlerMixin'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import editDialog from '@/views/10_system/columnsetting/dialog/edit'

export default {
  components: { Pagination, editDialog },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION_ID),
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
        inputSettings: {
          maxLength: {
            name: 20,
            simple_name: 20,
            prefex: 5
          }
        },
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
          showInsert: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000
      },
      popSettingsData: {
        // 弹出窗口状态名称
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
    'dataJson.searchForm': {
      deep: true,
      handler () {
        if (this.dataJson.searchForm.sync_time === null) {
          this.dataJson.searchForm.c_time_start = null
          this.dataJson.searchForm.c_time_end = null
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
      // 查询
      this.dataJson.searchForm.pageCondition.current = 1
      this.dataJson.paging.current = 1
      this.getDataList()
      // 清空选择
      this.dataJson.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    handleInsert () {
      this.settings.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_INSERT
      this.settings.popSettings.one.visible = true
    },
    // 修改
    handleUpdate () {
      this.settings.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.settings.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      this.settings.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.settings.popSettings.one.visible = true
    },
    handleCancel () {
      this.settings.popSettings.one.visible = false
    },
    handleCloseOk () {
      this.settings.popSettings.one.visible = false
      this.handleSearch()
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
      this.dataJson.tempJsonOriginal = Object.assign({}, row) // copy obj

      if (this.dataJson.currentJson.id !== undefined) {
        this.settings.btnShowStatus.showUpdate = true
      } else {
        this.settings.btnShowStatus.showUpdate = false
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
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        const recorders = response.data.records
        const newRecorders = recorders.map(v => {
          return { ...v, columnTypeShowIcon: false, columnNameShowIcon: false }
        })
        this.dataJson.listData = newRecorders
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
    // 更新是否固定
    handledUpdateFixApi (row) {
      let _message = ''
      const _value = row.fix
      const tempJson = row
      if (_value === true) {
        _message = '是否要取消固定该条数据？'
      } else {
        _message = '是否要固定该条数据？'
      }
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.settings.loading = true
        updateApi(tempJson).then((_data) => {
          this.$notify({
            title: '更新处理成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
        }, (_error) => {
          this.$notify({
            title: '更新处理失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
          row.fix = !row.fix
        }).finally(() => {
          this.popSettingsData.dialogFormVisible = false
          this.settings.loading = false
        })
      }).catch(action => {
        row.fix = !row.fix
      })
    },
    // 更新是否固定
    handledEnableUpdateApi (row) {
      let _message = ''
      const _value = row.is_enable
      const tempJson = row
      if (_value === true) {
        _message = '是否要取消显示该列？'
      } else {
        _message = '是否要显示该列？'
      }
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.settings.loading = true
        updateApi(tempJson).then((_data) => {
          this.$notify({
            title: '更新处理成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
        }, (_error) => {
          this.$notify({
            title: '更新处理失败',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
          row.is_enable = !row.is_enable
        }).finally(() => {
          this.popSettingsData.dialogFormVisible = false
          this.settings.loading = false
        })
      }).catch(action => {
        row.is_enable = !row.is_enable
      })
    },

    // 排序上
    handleSortUp (row) {
      // loading
      this.settings.loading = true
      // 1：位置互换，数组对象中
      const tempJson = row
      tempJson.sort_type = 'up'
      this.doSortUpdate(tempJson)
    },

    // 排序下
    handleSortDown (row) {
      // loading
      this.settings.loading = true
      // 1：位置互换，数组对象中
      const tempJson = row
      tempJson.sort_type = 'down'
      this.doSortUpdate(tempJson)
    },

    doSortUpdate (tempJson) {
      sortApi(tempJson).then((_data) => {
        this.$notify({
          title: '更新处理成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
      }, (_error) => {
        this.$notify({
          title: '更新处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.popSettingsData.dialogFormVisible = false
        this.settings.loading = false
        this.handleSearch()
      })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
    }

  }
}
</script>
