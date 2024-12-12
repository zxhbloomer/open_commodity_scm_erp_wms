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
          placeholder="名称"
        />
      </el-form-item>
      <!-- <el-form-item label="">
        <select-dict v-model="dataJson.searchForm.visible" :para="CONSTANTS.DICT_SYS_VISIBLE_TYPE" init-placeholder="请选择菜单类型" />
      </el-form-item> -->
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
    <el-button-group v-show="!meDialogStatus.dialogStatus">
      <el-button
        v-permission="'P_MENUS:MENU_ADD'"
        :disabled="!settings.btnShowStatus.showInsert"
        type="primary"
        icon="el-icon-circle-plus-outline"
        :loading="settings.loading"
        @click="handleInsert"
      >新增菜单组</el-button>
      <el-button
        v-permission="'P_MENUS:MENU_ADD_TOP_NAV'"
        :disabled="!settings.btnShowStatus.showAddTopNav"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleAddTopNav"
      >添加顶部导航栏</el-button>
      <el-button
        v-permission="'P_MENUS:MENU_ADD_SON_NODE'"
        :disabled="!settings.btnShowStatus.showAddSubNode"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleAddSubNode"
      >添加子菜单-结点</el-button>
      <el-button
        v-permission="'P_MENUS:MENU_ADD_SON_PAGE'"
        :disabled="!settings.btnShowStatus.showAddSubMenu"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleAddSubMenu"
      >添加子菜单-页面</el-button>
      <el-button
        v-permission="'P_MENUS:UPDATE'"
        :disabled="!settings.btnShowStatus.showUpdate"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleUpdate"
      >修改</el-button>
      <el-button
        v-permission="'P_MENUS:MENU_ADJUST_ORDER'"
        type="primary"
        icon="el-icon-edit-outline"
        :loading="settings.loading"
        @click="handleSort"
      >调整菜单顺序</el-button>
      <el-button
        v-permission="'P_MENUS:REAL_DELETE'"
        :disabled="!settings.btnShowStatus.showRealyDelete"
        type="primary"
        icon="el-icon-circle-close"
        :loading="settings.loading"
        @click="handleRealyDelete"
      >物理删除</el-button>
    </el-button-group>
    <el-table
      v-cloak
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%"
      default-expand-all
      row-key="id"
      @row-click="handleRowClick"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        header-align="center"
        type="index"
        width="45"
        fixed
      />
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        min-width="150"
        prop="name"
        label="菜单名称"
        fixed
      >
        <template v-slot="scope">
          <svg-icon
            v-if="scope.row.meta_icon"
            :icon-class="scope.row.meta_icon"
            :class="scope.row.meta_icon"
          />
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        min-width="100"
        prop="type_name"
        label="类型"
        fixed
      >
        <template v-slot="scope">
          <span class="menu_png">
            <em
              v-if="scope.row.type ===CONSTANTS.DICT_SYS_MENU_TYPE_ROOT"
              class="root"
            >根结点</em>
            <em
              v-if="scope.row.type ===CONSTANTS.DICT_SYS_MENU_TYPE_TOPNAV"
              class="top_nav"
            >顶部导航栏</em>
            <em
              v-if="scope.row.type ===CONSTANTS.DICT_SYS_MENU_TYPE_NODE"
              class="node"
            >结点</em>
            <em
              v-if="scope.row.type ===CONSTANTS.DICT_SYS_MENU_TYPE_PAGE"
              class="page"
            >页面</em>
            <em
              v-if="scope.row.is_default"
              class="default"
            >默认菜单</em>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        min-width="110"
        prop="path"
        label="请求地址"
        fixed
      >
        <template v-slot="scope">
          {{ scope.row.path }}
          <br>
          <el-link
            v-if="scope.row.path ==='/'"
            type="primary"
            @click="handleRedirect()"
          >
            <span v-if="dataJson.redirect.name === ''">
              设置跳转页面
            </span>
            <span v-else>
              跳转页面为：{{ dataJson.redirect.name }}
            </span>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        min-width="210"
        prop="code"
        label="编号"
        fixed
      />
      <!-- <el-table-column header-align="center" show-overflow-tooltip min-width="150" prop="code" label="菜单编号" /> -->
      <!-- <el-table-column header-align="center" show-overflow-tooltip min-width="80" prop="type_name" label="菜单类型" /> -->
      <!-- <el-table-column
          header-align="center"
          label="按钮"
        >
          <el-table-column
            v-for="button_column in dataJson.menu_buttons"
            :key="button_column.code"
            align="center"
            :prop="button_column.code"
            :label="button_column.name"
            min-width="100"
          >
            <template v-slot="column_lists">
              <div v-if="column_lists.row.function_info.filter(item => item.code===button_column.code)[0]">
                〇
              </div>
              <div v-else>
                -
              </div>

            </template>
            -
          </el-table-column> -->
      <!-- </el-table-column> -->
    </el-table>

    <!-- 新增菜单组 dialog -->
    <edit-group-dialog
      v-if="popSettings.one.visible"
      :visible="popSettings.one.visible"
      :dialog-status="popSettings.one.props.dialogStatus"
      :data="popSettings.one.props.data"
      @closeMeOk="handleEditGroupDialogCloseMeOk"
      @closeMeCancel="handleEditGroupDialogCloseMeCancel"
    />

    <!-- 顶部导航栏 dialog editTopNavDialog-->
    <edit-top-nav-dialog
      v-if="popSettings.six.visible"
      :visible="popSettings.six.visible"
      :dialog-status="popSettings.six.props.dialogStatus"
      :data="popSettings.six.props.data"
      @closeMeOk="handleEditTopNavDialogCloseMeOk"
      @closeMeCancel="handleEditTopNavDialogCloseMeCancel"
    />

    <!-- 添加子菜单-结点 dialog editSubNodeDialog-->
    <edit-sub-node-dialog
      v-if="popSettings.two.visible"
      :visible="popSettings.two.visible"
      :dialog-status="popSettings.two.props.dialogStatus"
      :data="popSettings.two.props.data"
      @closeMeOk="handleEditSubNodeDialogCloseMeOk"
      @closeMeCancel="handleEditSubNodeDialogCloseMeCancel"
    />

    <!-- 添加子菜单-页面 dialog editSubMenuDialog-->
    <edit-sub-menu-dialog
      v-if="popSettings.three.visible"
      :visible="popSettings.three.visible"
      :dialog-status="popSettings.three.props.dialogStatus"
      :data="popSettings.three.props.data"
      @closeMeOk="handleEditSubMenuDialogCloseMeOk"
      @closeMeCancel="handleEditSubMenuDialogCloseMeCancel"
    />

    <edit-sort-dialog
      v-if="popSettings.four.visible"
      :visible="popSettings.four.visible"
      :dialog-status="popSettings.four.props.dialogStatus"
      :sort-data="popSettings.four.props.data"
      :height="setUIheight()-200"
      @closeMeCancel="handleEditSortDialogCloseMeCancel"
    />

    <select-root-node-dialog
      v-if="popSettings.five.visible"
      :visible="popSettings.five.visible"
      :dialog-status="popSettings.five.props.dialogStatus"
      :data="popSettings.five.props.data"
      @closeMeOk="handleSelectRootNodeDialogCloseMeOk"
      @closeMeCancel="handleSelectRootNodeDialogCloseMeCancel"
    />

    <edit-redirect-page-dialog
      v-if="popSettings.seven.visible"
      :visible="popSettings.seven.visible"
      :dialog-status="popSettings.seven.props.dialogStatus"
      :tree-data="popSettings.seven.props.data"
      :height="setUIheight()-200"
      @closeMeOk="handleRedirectPageDialogCloseMeOk"
      @closeMeCancel="handleRedirectPageDialogCloseMeCancel"
    />
  </div>
</template>

<style >
[v-cloak] {
  display: none !important;
}
</style>

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
.grid-content {
  border-radius: 2px;
  min-height: 36px;
  margin-bottom: 10px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.el-button-group {
  margin-bottom: 10px;
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
import constants_program from '@/common/constants/constants_program'
import { getListApi, realDeleteSelectionApi, saveRedirectApi } from '@/api/20_master/menus/menu'
import resizeMixin from './menuResizeHandlerMixin'
import elDragDialog from '@/directive/el-drag-dialog'
// import SelectDict from '@/components/00_dict/select/SelectDict'
import editGroupDialog from '@/views/20_master/menus/dialog/editGroup'
import editTopNavDialog from '@/views/20_master/menus/dialog/editTopNav'
import editSubNodeDialog from '@/views/20_master/menus/dialog/editSubNode'
import editSubMenuDialog from '@/views/20_master/menus/dialog/editSubMenu'
import editSortDialog from '@/views/20_master/menus/dialog/editSort'
import selectRootNodeDialog from '@/views/20_master/menus/dialog/selectRootNode'
import editRedirectPageDialog from '@/views/20_master/menus/dialog/editRedirectPage'
import deepCopy from 'deep-copy'
import '@/styles/menu_png.scss'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: constants_program.P_MENU, // 页面id，和router中的name需要一致，作为缓存
  components: {
    editGroupDialog,
    editTopNavDialog,
    editSubNodeDialog,
    editSubMenuDialog,
    editSortDialog,
    selectRootNodeDialog,
    editRedirectPageDialog
  },
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
    }
  },
  data () {
    return {
      dataJson: {
        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION),
          // 查询条件
          name: '',
          code: '',
          visible: 'null',
          is_del: '0' // 未删除
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        // 按钮json
        menu_buttons: null,
        // 单条数据 json
        currentJson: null,
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: [],
        redirect: {
          name: '',
          data: undefined
        }
      },
      // 页面设置json
      settings: {
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnShowStatus: {
          showInsert: false,
          showUpdate: false,
          showAddTopNav: false,
          // 添加子菜单-结点：按钮
          showAddSubNode: false,
          showAddSubMenu: false,
          showRealyDelete: false
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
        },
        four: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        five: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        six: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        seven: {
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
    // 当前行的选中
    'dataJson.currentJson': {
      handler (newVal, oldVal) {
        if (this.dataJson.currentJson !== undefined && this.dataJson.currentJson.id !== undefined) {
          // 根据菜单类型，设置按钮是否可用
          switch (this.dataJson.currentJson.type) {
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_ROOT:
              // 根结点
              this.settings.btnShowStatus.showAddTopNav = true
              this.settings.btnShowStatus.showAddSubNode = false
              this.settings.btnShowStatus.showAddSubMenu = false
              this.settings.btnShowStatus.showUpdate = true
              this.settings.btnShowStatus.showRealyDelete = true
              break
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_TOPNAV:
              // 顶部导航栏
              this.settings.btnShowStatus.showAddTopNav = false
              this.settings.btnShowStatus.showAddSubNode = true
              this.settings.btnShowStatus.showAddSubMenu = true
              this.settings.btnShowStatus.showUpdate = true
              this.settings.btnShowStatus.showRealyDelete = true
              break
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_NODE:
              // 结点
              this.settings.btnShowStatus.showAddTopNav = false
              this.settings.btnShowStatus.showAddSubNode = true
              this.settings.btnShowStatus.showAddSubMenu = true
              this.settings.btnShowStatus.showUpdate = true
              this.settings.btnShowStatus.showRealyDelete = true
              break
            case this.CONSTANTS.DICT_SYS_MENU_TYPE_PAGE:
              // 页面
              this.settings.btnShowStatus.showAddTopNav = false
              this.settings.btnShowStatus.showAddSubNode = false
              this.settings.btnShowStatus.showAddSubMenu = false
              this.settings.btnShowStatus.showUpdate = true
              this.settings.btnShowStatus.showRealyDelete = true
              break
          }
        } else {
          this.settings.btnShowStatus.showAddTopNav = false
          this.settings.btnShowStatus.showAddSubNode = false
          this.settings.btnShowStatus.showAddSubMenu = false
          this.settings.btnShowStatus.showUpdate = false
          this.settings.btnShowStatus.showRealyDelete = false
        }
      },
      deep: true
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
      this.settings.btnShowStatus.showInsert = true
      // 初始化查询
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
    // 点击按钮 新增
    handleInsert () {
      // 新增
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_INSERT
      this.popSettings.one.visible = true
    },
    // 点击按钮 更新
    handleUpdate () {
      // 没有选择任何数据的情况
      if (this.dataJson.currentJson.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      switch (this.dataJson.currentJson.type) {
        // 根结点编辑
        case this.CONSTANTS.DICT_SYS_MENU_TYPE_ROOT:
          this.popSettings.one.props.data = deepCopy(this.dataJson.currentJson)
          this.popSettings.one.visible = true
          this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
          break
        // 顶部导航栏编辑
        case this.CONSTANTS.DICT_SYS_MENU_TYPE_TOPNAV:
          this.popSettings.six.props.data = deepCopy(this.dataJson.currentJson)
          this.popSettings.six.visible = true
          this.popSettings.six.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
          break
        // 结点编辑
        case this.CONSTANTS.DICT_SYS_MENU_TYPE_NODE:
          this.popSettings.two.props.data = deepCopy(this.dataJson.currentJson)
          this.popSettings.two.visible = true
          this.popSettings.two.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
          break
        // 菜单编辑
        case this.CONSTANTS.DICT_SYS_MENU_TYPE_PAGE:
          this.popSettings.three.props.data = deepCopy(this.dataJson.currentJson)
          this.popSettings.three.visible = true
          this.popSettings.three.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
          break
      }
    },
    // 点击按钮 添加顶部导航栏
    handleAddTopNav () {
      this.popSettings.six.props.dialogStatus = this.PARAMETERS.STATUS_INSERT
      this.popSettings.six.props.data = deepCopy(this.dataJson.currentJson)
      this.popSettings.six.visible = true
    },
    // 点击按钮 添加子菜单-结点
    handleAddSubNode () {
      this.popSettings.two.props.dialogStatus = this.PARAMETERS.STATUS_INSERT
      this.popSettings.two.props.data = deepCopy(this.dataJson.currentJson)
      this.popSettings.two.visible = true
    },
    // 点击按钮 添加子菜单-页面
    handleAddSubMenu () {
      this.popSettings.three.props.dialogStatus = this.PARAMETERS.STATUS_INSERT
      this.popSettings.three.props.data = deepCopy(this.dataJson.currentJson)
      this.popSettings.three.visible = true
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
      // 设置dialog的返回
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', Object.assign({}, row))
    },
    getDataList () {
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        const recorders = response.data.menu_data

        this.dataJson.listData = recorders
        this.dataJson.menu_buttons = response.data.menu_buttons
        this.dataJson.paging = response.data.menu_data
        this.dataJson.paging.records = {}
        // 设置重定向
        this.dataJson.redirect.data = deepCopy(response.data.menu_redirect)
        this.dataJson.redirect.name = this.dataJson.redirect.data.name
      }).finally(() => {
        // if (this.dataJson.listData && this.dataJson.listData.length) {
        //   // 考虑当且仅当每个租户只能有一个系统菜单
        //   this.settings.btnShowStatus.showInsert = false
        // }
        this.dataJson.currentJson = undefined
        this.settings.loading = false
        this.$refs.multipleTable.setCurrentRow()
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
    handleSelectionChange (arr) {
      arr.forEach(function (val, index, arr) {
        console.log(val, index, arr)
      })
      this.dataJson.multipleSelection = arr
    },
    // 删除按钮
    handleRealyDelete () {
      // 没有选择任何数据的情况
      if (this.dataJson.currentJson.id === undefined) {
        this.showErrorMsg('请选择一条数据')
        return
      }
      // 选择
      this.$confirm('请注意：将会删除当前结点以及子结点数据！！', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.settings.loading = true
        this.handleRealDeleteData()
      }).catch(action => {
        // 右上角X
        if (action !== 'close') {
          // 当前页所选择的数据导出
        }
      })
    },
    // 选中数据删除
    handleRealDeleteData () {
      // loading
      this.settings.loading = true
      const tempData = Object.assign({}, this.dataJson.currentJson)
      // 开始删除
      realDeleteSelectionApi(tempData).then((_data) => {
        this.$notify({
          title: '删除成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.getDataList()
        this.dataJson.multipleSelection = []
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
    },
    // -----------------新增菜单组 start------------------
    handleEditGroupDialogCloseMeOk (val) {
      switch (this.popSettings.one.props.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.doInsertEditGrouplCallBack(val)
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.doUpdateEditGroupCallBack(val)
          break
      }
    },
    handleEditGroupDialogCloseMeCancel () {
      this.popSettings.one.visible = false
    },
    // 处理插入回调
    doInsertEditGrouplCallBack (val) {
      if (val.return_flag) {
        this.popSettings.one.visible = false

        // 设置到currentjson中
        this.dataJson.currentJson = deepCopy(val.data.data)
        this.getDataList()
        this.$notify({
          title: '新增菜单组处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '新增菜单组处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    },
    // 处理更新回调
    doUpdateEditGroupCallBack (val) {
      if (val.return_flag) {
        this.popSettings.one.visible = false

        // 设置到currentjson中
        this.dataJson.currentJson = deepCopy(val.data.data)
        this.getDataList()
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
    // -----------------新增菜单组 end------------------
    // -----------------添加顶部导航栏 start------------------
    handleEditTopNavDialogCloseMeOk (val) {
      switch (this.popSettings.six.props.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.doInsertTopNavCallBack(val)
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.doUpdateTopNavCallBack(val)
          break
      }
    },
    handleEditTopNavDialogCloseMeCancel () {
      this.popSettings.six.visible = false
    },
    // 处理插入回调
    doInsertTopNavCallBack (val) {
      if (val.return_flag) {
        this.popSettings.six.visible = false
        this.getDataList()
        this.$notify({
          title: '添加顶部导航栏处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '添加顶部导航栏处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    },
    // 处理更新回调
    doUpdateTopNavCallBack (val) {
      if (val.return_flag) {
        this.popSettings.six.visible = false
        // 设置到currentjson中
        this.dataJson.currentJson = deepCopy(val.data.data)
        this.getDataList()
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
    // -----------------添加顶部导航栏 end------------------
    // -----------------添加子菜单-结点 start------------------
    handleEditSubNodeDialogCloseMeOk (val) {
      switch (this.popSettings.two.props.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.doInsertEditSubNodeCallBack(val)
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.doUpdateEditSubNodeCallBack(val)
          break
      }
    },
    handleEditSubNodeDialogCloseMeCancel () {
      this.popSettings.two.visible = false
    },
    // 处理插入回调
    doInsertEditSubNodeCallBack (val) {
      if (val.return_flag) {
        this.popSettings.two.visible = false
        this.getDataList()
        this.$notify({
          title: '添加子菜单-结点处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '添加子菜单-结点处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    },
    // 处理更新回调
    doUpdateEditSubNodeCallBack (val) {
      if (val.return_flag) {
        this.popSettings.two.visible = false
        // 设置到currentjson中
        this.dataJson.currentJson = deepCopy(val.data.data)
        this.getDataList()
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
    // -----------------添加子菜单-结点 end------------------
    // -----------------添加子菜单-页面 start------------------
    handleEditSubMenuDialogCloseMeOk (val) {
      switch (this.popSettings.three.props.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.doInsertEditSubMenuCallBack(val)
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.doUpdateEditSubMenuCallBack(val)
          break
      }
    },
    handleEditSubMenuDialogCloseMeCancel () {
      this.popSettings.three.visible = false
    },
    // 处理插入回调
    doInsertEditSubMenuCallBack (val) {
      if (val.return_flag) {
        this.popSettings.three.visible = false
        this.getDataList()
        this.$notify({
          title: '添加子菜单-页面处理成功',
          message: val.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      } else {
        this.$notify({
          title: '添加子菜单-页面处理失败',
          message: val.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }
    },
    // 处理更新回调
    doUpdateEditSubMenuCallBack (val) {
      if (val.return_flag) {
        this.popSettings.three.visible = false
        // 设置到currentjson中
        this.dataJson.currentJson = deepCopy(val.data.data)
        this.getDataList()
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
    // -----------------添加子菜单-页面 end------------------
    // -----------------菜单排序 start------------------
    handleEditSortDialogCloseMeCancel () {
      this.popSettings.four.visible = false
    },
    // -----------------菜单排序 end------------------
    // -----------------选择根目录 start------------------
    handleSort () {
      this.popSettings.five.props.data = this.dataJson.listData
      this.popSettings.five.visible = true
    },
    handleSelectRootNodeDialogCloseMeOk (val) {
      this.popSettings.five.visible = false
      // 打开菜单排序 dialog
      const _data = [val]
      this.popSettings.four.props.data = _data
      this.popSettings.four.visible = true
    },
    handleSelectRootNodeDialogCloseMeCancel () {
      this.popSettings.five.visible = false
    },
    // -----------------选择根目录 end------------------
    // -----------------设置重定向 start------------------
    handleRedirect () {
      this.popSettings.seven.props.data = this.dataJson.listData
      this.popSettings.seven.visible = true
    },
    handleRedirectPageDialogCloseMeOk (val) {
      // 重定向数据更新至数据库中
      const redirect_id = this.dataJson.redirect.data === undefined ? undefined : this.dataJson.redirect.data.id
      saveRedirectApi({ id: redirect_id, root_id: val.root_id, page_id: val.page_id, menu_page_id: val.id }).then((_data) => {
        this.dataJson.redirect.data = deepCopy(_data.data)
        this.dataJson.redirect.name = this.dataJson.redirect.data.name
      }, (_error) => {
      }).finally(() => {
        this.settings.loading = false
      })

      this.popSettings.seven.visible = false
    },
    handleRedirectPageDialogCloseMeCancel () {
      this.popSettings.seven.visible = false
    }
    // -----------------设置重定向 end------------------
  }
}
</script>
