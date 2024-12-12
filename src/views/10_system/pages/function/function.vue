<template>
  <div class="app-container">
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
    >
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.name"
          clearable
          placeholder="按钮名称"
        />
      </el-form-item>
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.code"
          clearable
          placeholder="按钮编号"
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
        v-permission="'P_SYS_FUNCTIONS:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >新增</el-button>
      <el-button
        v-permission="'P_SYS_FUNCTIONS:UPDATE'"
        :disabled="!settings.btnShowStatus.showUpdate"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        v-permission="'P_SYS_FUNCTIONS:COPY_INSERT'"
        :disabled="!settings.btnShowStatus.showCopyInsert"
        type="primary"
        icon="el-icon-camera-solid"
        :loading="settings.loading"
        @click="handleCopyInsert"
      >复制新增</el-button>
      <el-button
        v-permission="'P_SYS_FUNCTIONS:REAL_DELETE'"
        :disabled="!settings.btnShowStatus.showExport"
        type="primary"
        icon="el-icon-circle-close"
        :loading="settings.loading"
        @click="handleRealyDelete"
      >物理删除</el-button>
      <el-button
        v-permission="'P_SYS_FUNCTIONS:INFO'"
        :disabled="!settings.btnShowStatus.showUpdate"
        type="primary"
        icon="el-icon-info"
        :loading="settings.loading"
        @click="handleView"
      >查看</el-button>
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
      fit
      highlight-current-row
      style="width: 100%"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="!meDialogStatus"
        type="selection"
        width="45"
        prop="id"
      />
      <el-table-column
        label="No"
        type="index"
        width="50"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ (dataJson.searchForm.pageCondition.current - 1) * dataJson.searchForm.pageCondition.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        header-align="center"
        show-overflow-tooltip
        min-width="150"
        prop="code"
        label="按钮编号"
      />
      <el-table-column
        :auto-fit="true"
        header-align="center"
        show-overflow-tooltip
        min-width="150"
        prop="name"
        label="按钮名称"
      />
      <el-table-column
        show-overflow-tooltip
        min-width="80"
        prop="sort"
        label="排序"
      >
        <template v-slot="scope">
          <span>{{ scope.row.sort }}</span>
          <div class="floatRight">
            <el-button
              class="el-icon-top"
              type="text"
              style="font-size: 16px"
              :disabled="scope.row.sort===scope.row.min_sort"
              @click="handleSortUp(scope, scope.$index)"
            />
            <el-button
              class="el-icon-bottom"
              type="text"
              style="font-size: 16px"
              :disabled="scope.row.sort===scope.row.max_sort"
              @click="handleSortDown(scope, scope.$index)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :auto-fit="true"
        header-align="center"
        show-overflow-tooltip
        min-width="150"
        prop="descr"
        label="说明"
      />
      <el-table-column
        :auto-fit="true"
        header-align="center"
        show-overflow-tooltip
        min-width="150"
        prop="u_name"
        label="更新人"
      />
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        min-width="200"
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.u_time) }}
        </template>
      </el-table-column>
    </el-table>

    <edit-dialog
      v-if="popSettings.one.visible"
      :id="popSettings.one.props.id"
      :data="popSettings.one.props.data"
      :visible="popSettings.one.visible"
      :dialog-status="popSettings.one.props.dialogStatus"
      @closeMeOk="handleCloseDialogOneOk"
      @closeMeCancel="handleCloseDialogOneCancel"
    />

    <iframe
      id="refIframe"
      ref="refIframe"
      scrolling="no"
      frameborder="0"
      style="display:none"
      name="refIframe"
    >x</iframe>
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
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>

<script>
import { getListApi, realDeleteSelectionApi, saveSortApi } from '@/api/10_system/pages/function'
import resizeMixin from './functionResizeHandlerMixin'
import editDialog from '@/views/10_system/pages/function/dialog/edit'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  // name: constants_program.P_SYS_PAGES, // 页面id，和router中的name需要一致，作为缓存
  components: { editDialog },
  directives: { permission },
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
    }
  },
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          name: '',
          code: '',
          is_del: '0', // 未删除
          id: this.id,
          dataModel: this.dataModel // 弹出框模式
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
    this.initShow()
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
    // 导出按钮
    handleExport () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行导出', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnShowStatus.showExport = false
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
    getDataList () {
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.listData = response.data
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
    },

    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },

    // 点击按钮 新增
    handleInsert () {
      // 新增
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_INSERT
      this.popSettings.one.visible = true
    },

    // 点击按钮 复制新增
    handleCopyInsert () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      // 复制新增
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_COPY_INSERT
      this.popSettings.one.visible = true
    },
    // 点击按钮 更新
    handleUpdate () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 更新
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.one.visible = true
    },
    // 查看
    handleView () {
      this.popSettings.one.props.data = Object.assign({}, this.dataJson.currentJson)
      if (this.popSettings.one.props.data.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_VIEW
      this.popSettings.one.visible = true
    },
    // 删除按钮
    handleRealyDelete () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行删除', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnShowStatus.showDelete = false
        })
      } else {
        // 选中数据删除
        this.handleRealDeleteSelectionData()
      }
    },
    // 选中数据删除
    handleRealDeleteSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, array) {
        selectionJson.push({ 'id': value.id })
      })
      var _message = '是否要删除选择的数据？'
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.settings.loading = true
        // 开始删除
        realDeleteSelectionApi(selectionJson).then((_data) => {
          this.$notify({
            title: '删除成功',
            message: _data.message,
            type: 'success',
            duration: this.settings.duration
          })
          this.getDataList()
          // loading
          this.settings.loading = false
        }, (_error) => {
          this.$notify({
            title: '删除错误',
            message: _error.message,
            type: 'error',
            duration: this.settings.duration
          })
          this.settings.loading = false
        })
      }).catch(action => {
        // 右上角X
        this.settings.loading = false
      })
    },
    // ------------------排序 start--------------------
    // 排序上
    handleSortUp (scope, index) {
      // loading
      this.settings.loading = true
      // 1：位置互换，数组对象中
      const index1 = index
      const index2 = index - 1
      this.dataJson.listData.splice(index2, 1, ...this.dataJson.listData.splice(index1, 1, this.dataJson.listData[index2]))
      // 2：计算sort
      this.doReIndexSort()
      // 3：提交更新
      this.doSortUpdate(this.getSortedDataList())
    },
    // 排序下
    handleSortDown (scope, index) {
      // loading
      this.settings.loading = true
      // 1：位置互换，数组对象中
      const index1 = index
      const index2 = index + 1
      this.dataJson.listData.splice(index2, 1, ...this.dataJson.listData.splice(index1, 1, this.dataJson.listData[index2]))
      // 2：计算sort
      this.doReIndexSort()
      // 3：提交更新
      this.doSortUpdate(this.getSortedDataList())
    },
    // sort重新计算
    doReIndexSort () {
      this.dataJson.listData.forEach(function (item, index, arr) {
        // 开始排序
        item.sort = index
      })
    },
    // sort重新计算
    getSortedDataList () {
      const rtnList = []
      this.dataJson.listData.forEach(function (item, index, arr) {
        rtnList.push(item)
      })
      return rtnList
    },
    // 更新逻辑
    doSortUpdate (listData) {
      saveSortApi(listData).then((_data) => {
        this.$notify({
          title: '更新处理成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        // 返回替换json
        this.doUpdateSortJson(_data.data)
        // loading
        this.settings.loading = false
      }, (_error) => {
        this.$notify({
          title: '更新处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 更新完毕后，把最新的数据更新回去
    doUpdateSortJson (updatedData) {
      let startIndex = 0
      this.dataJson.listData.forEach(function (item, index, arr) {
        // 位置互换，数组对象中
        const index1 = index
        const index2 = startIndex
        arr.splice(index1, 1, ...updatedData.splice(index1, 1, updatedData[index2]))
        startIndex++
      })
    },
    // ------------------排序 end--------------------
    // ------------------编辑弹出框 start--------------------
    handleCloseDialogOneOk (val) {
      switch (this.popSettings.one.props.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.doInsertModelCallBack(val)
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.doUpdateModelCallBack(val)
          break
        case this.PARAMETERS.STATUS_COPY_INSERT:
          this.doCopyInsertModelCallBack(val)
          break
        case this.PARAMETERS.STATUS_VIEW:
          break
      }
    },
    handleCloseDialogOneCancel () {
      this.popSettings.one.visible = false
    },
    // 处理插入回调
    doInsertModelCallBack (val) {
      if (val.return_flag) {
        this.popSettings.one.visible = false

        // 设置到table中绑定的json数据源
        this.dataJson.listData.unshift(val.data.data)
        this.$notify({
          title: '新增处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '新增处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    },
    // 处理复制新增回调
    doCopyInsertModelCallBack (val) {
      if (val.return_flag) {
        this.popSettings.one.visible = false
        // 设置到table中绑定的json数据源
        this.dataJson.listData.unshift(val.data.data)
        // 设置到currentjson中
        this.dataJson.currentJson = Object.assign({}, val.data.data)
        this.$notify({
          title: '复制新增处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '复制新增处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    },
    // 处理更新回调
    doUpdateModelCallBack (val) {
      if (val.return_flag) {
        this.popSettings.one.visible = false

        // 设置到table中绑定的json数据源
        this.dataJson.listData.splice(this.dataJson.rowIndex, 1, val.data.data)
        // 设置到currentjson中
        this.dataJson.currentJson = Object.assign({}, val.data.data)
        this.$notify({
          title: '更新处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '更新处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    }
    // ------------------编辑弹出框 end--------------------
  }
}
</script>
