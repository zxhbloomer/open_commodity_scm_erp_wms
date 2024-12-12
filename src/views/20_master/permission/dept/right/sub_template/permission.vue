<template>
  <div>
    <el-alert
      :title="dataJson.head.info"
      type="info"
      show-icon
      effect="dark"
      :closable="false"
    />
    <br>
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
      class="floatRight"
      :disabled="!is_dept"
    >
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.name"
          clearable
          placeholder="权限名称"
        />
      </el-form-item>
      <el-form-item label="">
        <delete-type-normal v-model="dataJson.searchForm.is_del" />
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="!is_dept"
          type="primary"
          plain
          icon="el-icon-search"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="!is_dept"
          type="primary"
          plain
          icon="perfect-icon-reset"
          @click="handleResetSearch"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-button-group>
      <el-button
        v-permission="'P_PERMISSION_DEPT:ADD'"
        :disabled="!is_dept"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >新增</el-button>
      <el-button
        v-permission="'P_PERMISSION_DEPT:UPDATE'"
        :disabled="!is_dept || !settings.btnShowStatus.showUpdate"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        v-permission="'P_PERMISSION_DEPT:COPY_INSERT'"
        :disabled="!is_dept || !settings.btnShowStatus.showCopyInsert"
        type="primary"
        icon="el-icon-camera-solid"
        :loading="settings.loading"
        @click="handleCopyInsert"
      >复制新增</el-button>
      <el-button
        v-permission="'P_PERMISSION_DEPT:INFO'"
        :disabled="!is_dept || !settings.btnShowStatus.showUpdate"
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
      :height="height"
      stripe
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'u_time', order: 'descending'}"
      style="width: 100%"
      @row-click="handleRowClick"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="!meDialogStatus"
        type="selection"
        width="45"
        prop="id"
      />
      <!-- <el-table-column type="index" width="45" label="No" /> -->
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
        v-if="!meDialogStatus"
        header-align="center"
        show-overflow-tooltip
        sortable="custom"
        min-width="130"
        :sort-orders="settings.sortOrders"
        prop="name"
        label="权限名称"
      />
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="status"
        label="使用状态"
      />
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        sortable="custom"
        min-width="140"
        :sort-orders="settings.sortOrders"
        prop="descr"
        label="说明"
      />
      <el-table-column
        header-align="center"
        min-width="80"
        :sort-orders="settings.sortOrders"
        label="删除·启用"
      >
        <template v-slot:header>
          <span>
            删除
            <el-tooltip
              class="item"
              effect="dark"
              placement="bottom"
            >
              <div slot="content">
                状态提示：<br>
                绿色：未设置 <br>
                红色：已设置
              </div>
              <svg-icon
                icon-class="perfect-icon-question1_btn"
                style="margin-left: 5px"
              />
            </el-tooltip>
          </span>
        </template>

        <template v-slot="scope">
          <div class="switch">
            <el-tooltip
              :content="scope.row.is_del === 'false' ? '删除状态：已删除' : '删除状态：未删除' "
              placement="top"
              :open-delay="500"
            >
              <el-switch
                v-model="scope.row.is_del"
                active-color="#ff4949"
                inactive-color="#13ce66"
                :active-value="true"
                :inactive-value="false"
                :disabled="meDialogStatus"
                active-text="是"
                inactive-text="否"
                @change="handleDel(scope.row)"
              />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        min-width="160"
        prop="oper"
        label="权限操作"
      >
        <template v-slot="scope">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleSetUpOperation(scope.row)"
            >设置</el-button>
            <el-button
              type="info"
              icon="el-icon-search"
              @click="handleInfo(scope.row)"
            >查看</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        sortable="custom"
        min-width="100"
        :sort-orders="settings.sortOrders"
        prop="u_name"
        label="更新人"
      />
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        sortable="custom"
        min-width="180"
        :sort-orders="settings.sortOrders"
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.u_time) }}
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
      v-if="popSettings.one.visible"
      :id="popSettings.one.props.id"
      :data="popSettings.one.props.data"
      :visible="popSettings.one.visible"
      :dialog-status="popSettings.one.props.dialogStatus"
      @closeMeOk="handleCloseDialogOneOk"
      @closeMeCancel="handleCloseDialogOneCancel"
    />

    <!-- <operate-step-one-dialog
      v-if="popSettings.two.visible"
      :visible="popSettings.two.visible"
      :dialog-status="popSettings.two.props.dialogStatus"
      :data="popSettings.two.props.data"
      @closeMeOk="handleOperateStepOneDialogCloseMeOk"
      @closeMeCancel="handleOperateStepOneDialogCloseMeCancel"
    /> -->

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
.el-alert {
  padding: 7px 16px;
}
.el-alert--info.is-dark {
  background-color: #448aca;
}
.switch {
  text-align: center;
}
.switch ::v-deep .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}

/*打开时文字位置设置*/
.switch ::v-deep .el-switch__label--right {
  z-index: 1;
  right: 19px;
}
/*关闭时文字位置设置*/
.switch ::v-deep .el-switch__label--left {
  z-index: 1;
  left: 19px;
}
/*显示文字*/
.switch ::v-deep .el-switch__label.is-active {
  display: block;
}

.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
</style>

<script>
import '@/styles/org_png.scss'
import elDragDialog from '@/directive/el-drag-dialog'
import { getListApi, deleteApi, enableApi } from '@/api/20_master/permission/dept/permission'
// import { setSystemMenuData2PermissionDataApi } from '@/api/20_master/permission/operation/operation'
import deepCopy from 'deep-copy'
import DeleteTypeNormal from '@/components/00_dict/select/SelectDeleteTypeNormal'
import Pagination from '@/components/Pagination'
import editDialog from '../sub_template/dialog/permission_edit'
// import operateStepOneDialog from '../sub_template/dialog/operate_step_one'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: { Pagination, DeleteTypeNormal, editDialog },
  directives: { elDragDialog, permission },
  mixins: [],
  props: {
    height: {
      type: Number,
      default: 200
    },
    // 自己作为弹出框时的参数
    meDialogStatus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataJson: {
        // 头部提示栏
        head: {
          info: '',
          is_dept: false
        },
        // 查询使用的json
        searchForm: {
          condition: null,
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          name: '',
          is_del: '0' // 未删除
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
        loading: false,
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
        // two: {
        //   visible: false,
        //   props: {
        //     id: undefined,
        //     data: {},
        //     dialogStatus: ''
        //   }
        // }
      }
    }
  },
  computed: {
    is_dept () {
      return this.dataJson.head.is_dept
    }
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
    },
    // 当前行的选中
    'dataJson.currentJson': {
      handler (newVal, oldVal) {
        if (this.dataJson.currentJson.id !== undefined) {
          // this.settings.btnShowStatus.doInsert = true
          this.settings.btnShowStatus.showUpdate = true
          this.settings.btnShowStatus.showCopyInsert = true
          this.settings.btnShowStatus.showExport = true
        } else {
          // this.settings.btnShowStatus.doInsert = false
          this.settings.btnShowStatus.showUpdate = false
          this.settings.btnShowStatus.showCopyInsert = false
          this.settings.btnShowStatus.showExport = false
        }
      },
      deep: true
    }
  },
  created () {
    // 作为独立页面，通过route路由打开时
    this.$options.name = this.$route.meta.page_code
    this.initShow()
  },
  mounted () {
    // 描绘完成
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_CHANGE, _data => {
      this.dataJson.searchForm.condition = _data
      // 初始化头部提示数据
      if (_data.type !== this.CONSTANTS.DICT_ORG_SETTING_TYPE_DEPT) {
        this.dataJson.head.info = '请选择部门组织，设置部门权限！！'
        this.dataJson.head.is_dept = false
        this.dataJson.listData = null
      } else {
        this.dataJson.head.info = '当前选择部门：' + _data.name
        this.dataJson.head.is_dept = true
        this.getDataList(_data)
      }
    })
  },
  methods: {
    initShow () {
      this.dataJson.searchForm.is_del = this.CONSTANTS.DICT_SYS_DELETE_MAP_ALL
    },
    // 下拉选项控件事件
    handleSelectChange (val) {
    },
    // 获取行索引
    getRowIndex (row) {
      if (this.dataJson.listData !== null) {
        const _index = this.dataJson.listData.lastIndexOf(row)
        return _index
      }
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
    handleRowUpdate (row, _rowIndex) {
      this.dataJson.rowIndex = _rowIndex
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // 重置查询区域
    handleResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
    },
    getDataList (val) {
      // 通知兄弟组件
      this.$off(this.EMITS.EMIT_PERMISSION_DEPT_LOADING)
      this.$emit(this.EMITS.EMIT_PERMISSION_DEPT_LOADING)

      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size

      // 查询逻辑
      this.settings.loading = true
      const condition = {
        ...{ type: this.dataJson.searchForm.condition !== null ? this.dataJson.searchForm.condition.type : null },
        ...{ serial_type: this.dataJson.searchForm.condition !== null ? this.dataJson.searchForm.condition.serial_type : null },
        ...{ serial_id: this.dataJson.searchForm.condition !== null ? this.dataJson.searchForm.condition.serial_id : null },
        ...{ pageCondition: this.dataJson.searchForm.pageCondition },
        ...{ name: this.dataJson.searchForm.name },
        ...{ is_del: this.dataJson.searchForm.is_del }
      }
      getListApi(condition).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
        // 通知兄弟组件
        this.$off(this.EMITS.EMIT_PERMISSION_DEPT_LOADING_OK)
        this.$emit(this.EMITS.EMIT_PERMISSION_DEPT_LOADING_OK)
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (arr) {
      arr.forEach(function (val, index, arr) {
        // console.log(val, index, arr)
      })
      this.dataJson.multipleSelection = arr
    },
    renderHeaderIsDel: function (h, { column }) {
      return (
        <span>{column.label}
          <el-tooltip
            class='item'
            effect='dark'
            placement='bottom'
          >
            <div slot='content'>
              可见状态提示：<br />
              绿色：可见  <br />
              红色：不可见
            </div>
            <svg-icon icon-class='perfect-icon-question1_btn' style='margin-left: 5px' />
          </el-tooltip>
        </span>
      )
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
    // 点击按钮 新增
    handleInsert () {
      // 新增
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_INSERT
      this.popSettings.one.props.data = {
        serial_type: this.dataJson.searchForm.condition.serial_type,
        serial_id: this.dataJson.searchForm.condition.serial_id
      }
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
    // 删除操作
    handleDel (row) {
      let _message = ''
      const _value = row.is_del
      const selectionJson = []
      selectionJson.push({ 'id': row.id })
      if (_value === true) {
        _message = '是否要删除选择的数据？'
      } else {
        _message = '是否要复原该条数据？'
      }
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.settings.loading = true
        deleteApi(selectionJson).then((_data) => {
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
          row.is_del = !row.is_del
        }).finally(() => {
          this.popSettings.dialogFormVisible = false
          this.settings.loading = false
        })
      }).catch(action => {
        row.is_del = !row.is_del
      })
    },
    // 启用禁用操作
    handleEnable (row) {
      let _message = ''
      const _value = row.is_enable
      if (_value === true) {
        _message = '是否要禁用选择的数据？'
      } else {
        _message = '是否要启用该条数据？'
      }
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.settings.loading = true
        enableApi({ 'id': row.id }).then((_data) => {
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
          this.popSettings.dialogFormVisible = false
          this.settings.loading = false
        })
      }).catch(action => {
        row.is_enable = !row.is_enable
      })
    },
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
    },
    // ------------------编辑弹出框 end--------------------
    // -----------------选择根目录 start------------------
    handleInfo (val) {
      this.openPermissionInfoTab(val)
    },
    handleSetUpOperation (val) {
      this.openPermissionEditTab(val)
    },
    // 打开权限查看页面
    openPermissionInfoTab (val) {
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '正在查看操作权限：【' + val.name + '】' },
        operate_tab_header_info: { info: this.dataJson.head.info },
        permission: { permissionId: val.id }
      }
      // 通知兄弟组件
      this.$off(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_INFO)
      this.$emit(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_INFO, operate_tab_data)
    },
    // 打开权限编辑页面
    openPermissionEditTab (val) {
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '正在编辑操作权限：【' + val.name + '】' },
        operate_tab_header_info: { info: this.dataJson.head.info },
        permission: { permissionId: val.id }
      }
      // 通知兄弟组件
      this.$off(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_EDIT)
      this.$emit(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_EDIT, operate_tab_data)
    }
    // // 页面关闭后操作
    // handleOperateStepOneDialogCloseMeOk(val) {
    //   // 执行复制逻辑
    //   this.settings.loading = true
    //   setSystemMenuData2PermissionDataApi({ 'permission_id': this.dataJson.currentJson.id, 'root_id': val.select }).then((_data) => {
    //     // 处理成功后，打开权限编辑页面
    //     this.handleSetUpOperation(this.dataJson.currentJson)
    //   }, (_error) => {
    //     this.$notify({
    //       title: '处理失败',
    //       message: _error.message,
    //       type: 'error',
    //       duration: this.settings.duration
    //     })
    //   }).finally(() => {
    //     this.settings.loading = false
    //   })
    //   // 关闭页面
    //   this.popSettings.two.visible = false
    // },
    // handleOperateStepOneDialogCloseMeCancel() {
    //   this.popSettings.two.visible = false
    // }
    // -----------------选择根目录 end------------------
  }
}
</script>
