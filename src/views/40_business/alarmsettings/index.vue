<template>
  <div class="app-container">
    <FloatMenu />
    <el-form
      v-if="searchsetting.visible"
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
    >
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.name"
          clearable
          placeholder="规则名称"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.group_name"
          clearable
          placeholder="请输入预警组"
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
    <el-button-group v-if="searchsetting.visible">
      <el-button
        v-permission="'P_ALLOCATE_ORDER:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >新增</el-button>
      <el-button
        v-permission="'P_ALLOCATE_ORDER:UPDATE'"
        :disabled="!settings.btnStatus.showUpdate"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        v-permission="'P_ALLOCATE_ORDER:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :disabled="!settings.btnStatus.showUpdate"
        :loading="settings.loading"
        @click="handleEditGroupMember"
      >添加预警组</el-button>
      <el-button
        v-permission="'P_ALLOCATE_ORDER:ADD'"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        :disabled="!settings.btnStatus.showUpdate"
        @click="handleEditStaffMember"
      >添加预警人员</el-button>
    </el-button-group>

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
      :default-sort="{prop: 'u_time', order: 'descending'}"
      style="width: 100%"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @current-change="handleCurrentChange"
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
        :auto-fit="true"
        min-width="130"
        prop="name"
        label="规则名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="type_name"
        label="预警类型"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="rule_type_name"
        label="预警规则"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="job_name"
        label="定时任务名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="notice_time"
        label="发送间隔"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="notice_type_name"
        label="预警通知方式"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="alarm_group"
        label="预警组"
      >
        <template v-slot="column_lists">
          <el-tag
            v-for="item in column_lists.row.group_list"
            :key="item.id"
            class="position_tag"
            @click.stop="handlePositionClick(item.name)"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="150"
        prop="alarm_staff"
        label="预警人员"
      >
        <template v-slot="column_lists">
          <el-tag
            v-for="item in column_lists.row.staff_list"
            :key="item.id"
            class="position_tag"
            @click.stop="handlePositionClick(item.name)"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :sort-orders="settings.sortOrders"
        min-width="120"
        prop="is_using"
        label="启用状态"
      >
        <template v-slot:header>
          <span>
            启用状态
            <el-tooltip
              class="item"
              effect="dark"
              placement="bottom"
            >
              <div slot="content">
                启用状态提示：<br>
                绿色：已启用 <br>
                红色：未启用
              </div>
              <svg-icon
                icon-class="perfect-icon-question1_btn"
                style="margin-left: 5px"
              />
            </el-tooltip>
          </span>
        </template>
        <template v-slot="scope">
          <el-tooltip
            :content="scope.row.is_using === '1' ? '启用状态：已启用' : '启用状态：未启用' "
            placement="top"
            :open-delay="500"
          >
            <el-switch
              v-model="scope.row.is_using"
              active-color="#ff4949"
              inactive-color="#13ce66"
              :active-value="'0'"
              :inactive-value="'1'"
              :width="30"
              :disabled="meDialogStatus"
              @change="handleDel(scope.row)"
            />
          </el-tooltip>
        </template>

      </el-table-column>

      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        prop="c_name"
        label="创建人"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="190"
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
        min-width="190"
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

    <edit-dialog
      v-if="popSettings.one.visible"
      :id="popSettings.one.props.id"
      :data="popSettings.one.props.data"
      :visible="popSettings.one.visible"
      :dialog-status="popSettings.one.props.dialogStatus"
      @closeMeOk="handleCloseDialogOneOk"
      @closeMeCancel="handleCloseDialogOneCancel"
    />

    <set-staff-dialog
      v-if="popSettings.two.visible"
      :id="popSettings.two.props.id"
      :data="popSettings.two.props.data"
      :visible="popSettings.two.visible"
      :model="popSettings.two.props.model"
      @closeMeOk="handleCloseDialogTwoOk"
      @closeMeCancel="handleCloseDialogTwoCancel"
    />

    <set-group-dialog
      v-if="popSettings.three.visible"
      :id="popSettings.three.props.id"
      :data="popSettings.three.props.data"
      :visible="popSettings.three.visible"
      :model="popSettings.three.props.model"
      @closeMeOk="handleCloseDialogThreeOk"
      @closeMeCancel="handleCloseDialogThreeCancel"
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
.el-button-group {
  margin-bottom: 10px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
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
</style>

<script>
import { getListApi, enableApi } from '@/api/40_business/alarm/alarmsettings'
import resizeMixin from './mixin/resizeHandlerMixin'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import editDialog from '@/views/40_business/alarmsettings/dialog/edit'
import deepCopy from 'deep-copy'
import setStaffDialog from '@/views/40_business/alarmsettings/dialog/setStaff'
import setGroupDialog from '@/views/40_business/alarmsettings/dialog/setGroup'
import constants_para from '@/common/constants/constants_para'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: { Pagination, editDialog, setStaffDialog, setGroupDialog },
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
      searchsetting: {
        visible: true
      },
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          name: '',
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
        btnStatus: {
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
        },
        two: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        three: {
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
          this.settings.btnStatus.showDelete = true
          this.settings.btnStatus.showEnable = true
          this.settings.btnStatus.showDisable = true
        } else {
          this.settings.btnStatus.showDelete = false
          this.settings.btnStatus.showEnable = false
          this.settings.btnStatus.showDisable = false
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
      // this.searchsetting.visible = false
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
      getListApi(this.dataJson.searchForm).then(response => {
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
    renderHeaderIsEnabled: function (h, { column }) {
      return (
        <span>{column.label}
          <el-tooltip
            class='item'
            effect='dark'
            placement='bottom'
          >
            <div slot='content'>
              删除状态提示：<br />
              绿色：已启用  <br />
              红色：未启用
            </div>
            <svg-icon icon-class='perfect-icon-question1_btn' style='margin-left: 5px' />
          </el-tooltip>
        </span>
      )
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson.id !== undefined) {
        // this.settings.btnStatus.doInsert = true
        this.settings.btnStatus.showUpdate = true
      } else {
        // this.settings.btnStatus.doInsert = false
        this.settings.btnStatus.showUpdate = false
      }
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    // 规则设置员工
    handleEditStaffMember () {
      this.popSettings.two.props.id = this.dataJson.currentJson.id
      this.popSettings.two.props.data.name = this.dataJson.currentJson.name
      this.popSettings.two.props.model = constants_para.MODEL_EDIT
      this.popSettings.two.visible = true
    },
    // 规则设置员工 完成
    handleCloseDialogTwoOk () {
      this.popSettings.two.visible = false
    },
    // 规则设置员工 取消
    handleCloseDialogTwoCancel () {
      this.popSettings.two.visible = false
    },
    // 规则设置组
    handleEditGroupMember () {
      this.popSettings.three.props.id = this.dataJson.currentJson.id
      this.popSettings.three.props.data.name = this.dataJson.currentJson.name
      this.popSettings.three.props.model = constants_para.MODEL_EDIT
      this.popSettings.three.visible = true
    },
    // 规则设置组 完成
    handleCloseDialogThreeOk () {
      this.popSettings.three.visible = false
    },
    // 规则设置组 取消
    handleCloseDialogThreeCancel () {
      this.popSettings.three.visible = false
    },
    // 启用, 禁用
    handleDel (row) {
      let _message = ''
      const _value = row.is_using
      const selectionJson = []
      selectionJson.push({ 'id': row.id, 'is_using': _value })
      if (_value === '1') {
        _message = '是否要复原选择的数据？'
      } else {
        _message = '是否要禁用该条数据？'
      }
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.settings.loading = true
        enableApi(selectionJson).then((_data) => {
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
          row.is_using === '1' ? row.is_using = '0' : row.is_using = '1'
        }).finally(() => {
          this.settings.loading = false
        })
      }).catch(action => {
        row.is_using === '1' ? row.is_using = '0' : row.is_using = '1'
      })
    }
  }
}
</script>
