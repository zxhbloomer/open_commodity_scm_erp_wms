<template>
  <div>
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
      class="search-form-floatRight"
    >
      <el-form-item label="">
        <el-input
          v-model.trim="dataJson.searchForm.name"
          clearable
          placeholder="员工名称"
        />
      </el-form-item>
      <el-form-item label="">
        <delete-type-normal v-model="dataJson.searchForm.is_del" />
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
          icon="perfect-icon-reset"
          @click="doResetSearch"
        >重置</el-button>
      </el-form-item>
    </el-form>
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
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      type="org_staff"
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
      @sort-change="handleSortChange"
    >
      <el-table-column
        type="index"
        width="45"
        label="No"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="name"
        label="员工姓名"
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
        min-width="80"
        :sort-orders="settings.sortOrders"
        prop="birthday"
        label="生日"
      />
      <el-table-column
        show-overflow-tooltip
        sortable="custom"
        min-width="120"
        :sort-orders="settings.sortOrders"
        prop="email"
        label="邮箱地址"
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
        header-align="center"
        label="岗位信息"
        min-width="150"
      >
        <template v-slot="column_lists">
          <el-tag
            v-for="item in column_lists.row.positions"
            :key="item.position_id"
            class="position_tag"
            @click.stop="handlePositionClick(item.position_name)"
          >
            {{ item.position_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        min-width="90"
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
.position_tag {
  cursor: pointer;
}
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
<style >
.el-input-group__append_select {
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
import { EventBus } from '@/common/eventbus/eventbus'
// import constants_program from '@/common/constants/constants_program'
import { getStaffTabListApi } from '@/api/20_master/org/org'
import elDragDialog from '@/directive/el-drag-dialog'
import DeleteTypeNormal from '@/components/00_dict/select/SelectDeleteTypeNormal'
import deepCopy from 'deep-copy'
import editDialog from '@/views/20_master/staff/dialog/edit'

export default {
  components: { DeleteTypeNormal, editDialog },
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
        // 页签cout数量
        tabsCount: {
          currentOrgStaffCount: 0,
          allOrgStaffCount: 0
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          id: null,
          name: '',
          code: '', // 左边树种的结点code
          original_code: '', // 左边树种的结点code
          active_tabs_index: 0, // 当前被激活的页签
          is_del: '0' // 未删除
        },
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
    /**
     * 考虑所有员工的方法
     * 1:根据code的定义规则，0001xxxx|xxxx|，每4位为一个层，所以找到第一组的4个
     * 2：并设置回code中去
     */
    getRootOrg () {
      return this.dataJson.searchForm.code.substring(0, 4)
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
    }
  },
  created () {
    // this.$options.name = this.PROGRAMS.P_ORG_RIGHT_STAFF
  },
  mounted () {
    this.initShow()
    // 描绘完成
    EventBus.$on(this.EMITS.EMIT_ORG_CHANGE, _data => {
      this.dataJson.searchForm.code = _data.code
      this.dataJson.searchForm.original_code = _data.code
      this.initShow()
    })
    // 当岗位成员有发生变更，接收通知
    EventBus.$on(this.EMITS.EMIT_ORG_POSITION_UPDATED, _data => {
      this.initShow()
    })
  },
  methods: {
    initShow () {
      // 初始化查询
      this.getDataList()
    },
    // 弹出框设置初始化
    initDialogStatus () {
    },
    // 下拉选项控件事件
    handleSelectChange (val) {
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
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
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
    },
    // 关闭弹出窗口
    handlCloseDialog () {
      this.popSettingsImport.dialogFormVisible = false
      this.popSettingsData.dialogFormVisible = false
    },
    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    handleView (val) {
      this.popSettings.one.props.data = (val)
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_VIEW
      this.popSettings.one.visible = true
    },
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
    handleCloseDialogOneCancel () {
      this.popSettings.one.visible = false
    },
    handleCloseDialogOneOk () {
      this.popSettings.one.visible = false
    },
    handlePositionClick (val) {
      // 通知路由，打开岗位页面
      this.$router.push({
        name: this.PROGRAMS.P_POSITION, query: { name: val }
      })
    }
  }
}
</script>
