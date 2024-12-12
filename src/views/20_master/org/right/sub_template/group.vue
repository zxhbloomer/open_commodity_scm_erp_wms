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
      <!-- <el-table-column type="selection" width="45" prop="id" /> -->
      <el-table-column
        type="index"
        width="45"
        label="No"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="230"
        :sort-orders="settings.sortOrders"
        prop="parent_group_simple_name"
        label="上级集团"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="160"
        :sort-orders="settings.sortOrders"
        prop="name"
        label="集团名称"
      >
        <template v-slot="scope">
          <el-link
            style="float: right"
            type="primary"
            @click="handleView(scope.row)"
          ><i class="el-icon-info" /></el-link>
          <span> {{ scope.row.name }} </span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="160"
        :sort-orders="settings.sortOrders"
        prop="simple_name"
        label="集团简称"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="200"
        :sort-orders="settings.sortOrders"
        prop="code"
        label="集团编号"
      >
        <template v-slot="scope">
          <el-button-group style="float: right">
            <el-button
              type="primary"
              icon="el-icon-edit"
              style="padding:4px 4px; "
              @click="handleEdit(scope.row)"
            />
          </el-button-group>
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="80"
        :sort-orders="settings.sortOrders"
        label="删除"
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
                删除状态提示：<br>
                绿色：未删除 <br>
                红色：已删除
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
              :width="30"
              :disabled="true"
              @change="handleDel(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="100"
        :sort-orders="settings.sortOrders"
        prop="u_name"
        label="更新人"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="200"
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
import { EventBus } from '@/common/eventbus/eventbus'
import { getGroupsListApi } from '@/api/20_master/org/org'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import editDialog from '@/views/20_master/group/dialog/edit'
import deepCopy from 'deep-copy'

export default {
  components: { Pagination, editDialog },
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
    // this.$options.name = this.PROGRAMS.P_ORG_RIGHT_GROUP
    this.initShow()
  },
  mounted () {
    // 描绘完成
  },
  methods: {
    initShow () {
      this.handleSearch()
      // 初始化查询
      EventBus.$on(this.EMITS.EMIT_ORG_CHANGE, _data => {
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
      // this.$refs.multipleTable.clearSelection()
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
      EventBus.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
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
      // this.$off(this.EMITS.EMIT_ORG_LOADING)
      EventBus.$emit(this.EMITS.EMIT_ORG_LOADING)
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      // this.dataJson.searchForm.condition = Object.assign({}, val)
      const condition = {
        ...this.dataJson.searchForm.condition,
        ...{ pageCondition: this.dataJson.searchForm.pageCondition }
      }
      getGroupsListApi(condition).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
        // 通知兄弟组件
        // this.$off(this.EMITS.EMIT_ORG_LOADING_OK)
        EventBus.$emit(this.EMITS.EMIT_ORG_LOADING_OK)
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
    // --------------弹出查询框：开始--------------
    handleEdit (val) {
      this.popSettings.one.props.data = Object.assign({}, val)
      // 更新
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.one.visible = true
    },
    handleView (val) {
      this.popSettings.one.props.data = Object.assign({}, val)
      // 更新
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_VIEW
      this.popSettings.one.visible = true
    },
    handleCloseDialogOneOk (val) {
      // 通知兄弟组件
      // this.$off(this.EMITS.EMIT_ORG_LEFT)
      EventBus.$emit(this.EMITS.EMIT_ORG_LEFT)

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
  }
}
</script>
