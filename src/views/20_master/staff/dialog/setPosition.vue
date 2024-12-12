<template>
  <el-dialog
    v-if="listenVisible"
    v-el-drag-dialog
    v-loading="settings.loading"
    element-loading-text="拼命加载中，请稍后..."
    element-loading-background="rgba(255, 255, 255, 0.7)"
    title="设置岗位员工"
    :visible="visible"
    :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
    :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
    :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
    :append-to-body="true"
    :modal-append-to-body="true"
    width="1100px"
    destroy-on-close
  >
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
      class="floatRight"
    >
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.position_name"
          clearable
          placeholder="岗位名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-popover:popover
          type="primary"
          plain
          icon="el-icon-zoom-in"
        >高级查询</el-button>
      </el-form-item>
    </el-form>

    <el-popover
      ref="popover"
      placement="top"
      width="420"
      title="高级查询"
      popper-class="perfect_popper"
    >
      <el-form
        :inline="true"
        :model="dataJson.searchForm"
        label-position="getLabelPosition()"
        class="search-form-senior"
      >
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.group_name"
            clearable
            placeholder="集团名称"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.company_name"
            clearable
            placeholder="企业名称"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model.trim="dataJson.searchForm.dept_name"
            clearable
            placeholder="部门名称"
          />
        </el-form-item>
        <el-divider />
        <div style="text-align: right; margin: 0">
          <el-button
            type="text"
            @click="doResetSearch()"
          >重置</el-button>
          <el-button
            type="primary"
            @click="handleSearch"
          >提交</el-button>
        </div>
      </el-form>
    </el-popover>

    <el-tabs
      type="card"
      class="floatLeft"
      @tab-click="handleTabsClick"
    >
      <el-tab-pane>
        <template slot="label">全部岗位
          <el-badge
            :value="dataJson.tabs.count.all"
            type="danger"
          />
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">已设置岗位
          <el-badge
            :value="dataJson.tabs.count.settled"
            type="danger"
          />
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">未设置岗位
          <el-badge
            :value="dataJson.tabs.count.unsettled"
            type="danger"
          />
        </template>
      </el-tab-pane>
    </el-tabs>
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="400"
      stripe
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'name', order: 'descending'}"
      style="width: 100%"
      @sort-change="handleSortChange"
      @current-change="handleCurrentChange"
      @row-click="handleRowClick"
    >
      <el-table-column
        type="index"
        width="45"
        label="No"
      />
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="group_full_simple_name"
        label="集团"
      />
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        sortable="custom"
        min-width="80"
        :sort-orders="settings.sortOrders"
        prop="company_simple_name"
        label="企业"
      />
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        sortable="custom"
        min-width="80"
        :sort-orders="settings.sortOrders"
        prop="dept_full_simple_name"
        label="部门"
      />
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        sortable="custom"
        min-width="100"
        :sort-orders="settings.sortOrders"
        prop="name"
        label="岗位"
      />
      <el-table-column
        header-align="center"
        align="center"
        min-width="50"
        :sort-orders="settings.sortOrders"
        label="删除"
      >
        <template v-slot:header>
          <span>
            设置
            <el-tooltip
              class="item"
              effect="dark"
              placement="bottom"
            >
              <div slot="content">
                岗位设置状态提示：<br>
                绿色：已设置 <br>
                红色：未设置
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
              v-model="scope.row.settled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
              :width="30"
              @change="handlePositionSettled(scope.row)"
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
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />
      <el-button
        plain
        @click="handleDoCancel()"
      >关闭</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.perfect_popper .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { getPositionStaffData, setPositionStaff } from '@/api/20_master/staff/staff'
import deepCopy from 'deep-copy'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  directives: { elDragDialog },
  props: {
    // 页面是否显示参数
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 分页控件的json
          pageCondition: deepCopy(this.PARAMETERS.PAGE_JSON),
          id: undefined,
          position_name: '',
          group_name: '',
          company_name: '',
          dept_name: '',
          active_tabs_index: 0
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // 页签cout数量
        tabs: {
          count: {
            all: 0,
            settled: 0,
            unsettled: 0
          },
          active_tabs_index: 0 // 当前被激活的页签
        },
        // table使用的json
        listData: null,
        // 当前表格中的索引，第几条
        rowIndex: 0
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true
      }
    }
  },
  computed: {
    listenVisible () {
      return this.visible
    }
  },
  // 监听器
  watch: {
  },
  created () {
    this.initShow()
  },
  methods: {
    initShow () {
      // 初始化查询
      this.getDataList()
    },
    getDataList () {
      // 查询逻辑
      this.settings.loading = true
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      this.dataJson.searchForm.id = this.data.id
      getPositionStaffData(this.dataJson.searchForm).then(response => {
        this.dataJson.tabs.count.all = response.data.all
        this.dataJson.tabs.count.settled = response.data.settled
        this.dataJson.tabs.count.unsettled = response.data.unsettled
        this.dataJson.listData = response.data.list.records
        this.dataJson.paging = response.data.list
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
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
    handleCurrentChange (row) {
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
    handleSearch () {
      this.getDataList()
    },
    // tabs点击事件
    handleTabsClick (tab, event) {
      if (this.dataJson.tabs.active_tabs_index === tab.index) {
        return
      }
      this.dataJson.tabs.active_tabs_index = tab.index
      this.dataJson.searchForm.active_tabs_index = tab.index
      this.initShow()
    },
    // 关闭
    handleDoCancel () {
      this.$emit('closeMeCancel')
    },
    // 设置岗位or取消岗位
    handlePositionSettled (row) {
      let _message = ''
      const _value = row.settled
      const selectionJson = { 'id': this.data.id, 'position_id': row.id, 'position_settled': row.settled }
      if (_value === true) {
        _message = '请确认，是否要在岗位【' + row.name + '】中，添加员工【' + this.data.name + '】？'
      } else {
        _message = '请确认，是否要在岗位【' + row.name + '】中，去除员工【' + this.data.name + '】？'
      }
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // loading
        this.settings.loading = true
        setPositionStaff(selectionJson).then((_data) => {
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
          row.settled = !row.settled
        }).finally(() => {
          this.settings.loading = false
        })
      }).catch(action => {
        row.settled = !row.settled
      })
    }
  }
}
</script>
