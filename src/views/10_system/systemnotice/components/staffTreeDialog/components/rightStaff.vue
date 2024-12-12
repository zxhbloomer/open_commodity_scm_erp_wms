<template>
  <div>
    <el-tabs
      type="card"
      class="floatLeft"
      @tab-click="handleTabsClick"
    >
      <el-tab-pane>
        <template slot="label">当前组织下员工
          <el-badge
            :value="dataJson.tabsCount.currentOrgStaffCount"
            type="danger"
          />
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">所有员工
          <el-badge
            :value="dataJson.tabsCount.allOrgStaffCount"
            type="danger"
          />
        </template>
      </el-tab-pane>
    </el-tabs>
    <el-button
      type="primary"
      size="mini"
      :disabled="!settings.btnShowStatus.showInsert"
      icon="el-icon-circle-plus-outline"
      :loading="settings.loading"
      @click="handleSelectInsert"
    >添加选择</el-button>
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      type="org_staff"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      height="500px"
      stripe
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'u_time', order: 'descending'}"
      style="width: 100%"
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
        show-overflow-tooltip
        sortable="custom"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="name"
        label="员工姓名"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="simple_name"
        label="姓名简称"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="sex_text"
        label="性别"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="150"
        prop="company_simple_name"
        label="所属公司"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="150"
        prop="dept_simple_name"
        label="默认部门"
      />
      <el-table-column
        sortable="custom"
        min-width="220"
        :sort-orders="settings.sortOrders"
        show-overflow-tooltip
        prop="u_time"
        label="更新时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.u_time) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStaffTabListApi } from '@/api/20_master/org/org'
import deepCopy from 'deep-copy'
import { EventBus } from '@/common/eventbus/eventbus'

export default {
  data () {
    return {
      dataJson: {
        searchForm: {
          active_tabs_index: 0, // 当前被激活的页签
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION)
        },
        tabsCount: {
          currentOrgStaffCount: 0,
          allOrgStaffCount: 0
        },
        listData: [],
        currentJson: null,
        multipleSelection: []
      },
      settings: {
        loading: false,
        btnShowStatus: {
          showInsert: false
        }
      }
    }
  },
  // 监听器
  watch: {
    // 选中的数据，使得导出按钮可用，否则就不可使用
    'dataJson.multipleSelection': {
      handler (newVal) {
        if (newVal.length > 0) {
          this.settings.btnShowStatus.showInsert = true
        } else {
          this.settings.btnShowStatus.showInsert = false
        }
      }
    }
  },
  mounted () {
    this.initShow()
    // 描绘完成
    EventBus.$on(this.EMITS.EMIT_ORG_DIALOG_CHANGE, _data => {
      this.dataJson.searchForm.code = _data.code
      this.dataJson.searchForm.original_code = _data.code
      this.initShow()
    })
  },
  methods: {
    // tabs点击事件
    handleTabsClick (tab, event) {
      if (this.dataJson.searchForm.active_tabs_index === tab.index) {
        return
      }
      switch (tab.index) {
        case '0':
          // 当组织下员工
          this.initShow()
          break
        case '1':
          // 所有员工
          this.initShow()
          break
      }
      this.dataJson.searchForm.active_tabs_index = tab.index
    },
    initShow () {
      // 初始化查询
      this.getStaffDataList()
    },
    getStaffDataList () {
      // 查询逻辑
      this.settings.loading = true
      Object.assign(this.$data.dataJson.tabsCount, this.$options.data.call(this).dataJson.tabsCount)
      getStaffTabListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.tabsCount.currentOrgStaffCount = response.data.currentOrgStaffCount
        this.dataJson.tabsCount.allOrgStaffCount = response.data.allOrgStaffCount
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        const recorders = response.data.list
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
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },
    handleSelectInsert () {
      // 插入选择的
      EventBus.$emit(this.EMITS.EMIT_ORG_DIALOG_STAFF_SELECT, this.dataJson.multipleSelection)
      // 清空选择框
      this.dataJson.multipleSelection = []
      // 清空表格选择
      this.$refs.multipleTable.clearSelection()
    }
  }
}
</script>

<style scoped>
::v-deep .el-tabs__header {
  margin: 0 0 3px;
}
</style>
