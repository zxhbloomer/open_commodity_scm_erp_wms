<template>
  <div>
    <el-alert
      ref="minusAlert"
      :title="headInfo"
      type="info"
      effect="dark"
      show-icon
      :closable="false"
    />
    <br>
    <el-form
      ref="minusForm"
      :inline="true"
    >
      <el-form-item label="">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            :disabled="settings.loading || settings.btnDisabledStatus.disabledSave "
            :loading="settings.loading"
            @click="handleSave"
          >保存</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <el-table
      v-cloak
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :height="height"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%"
      default-expand-all
      row-key="menu_id"
      @row-click="handleRowClick"
      @current-change="handleCurrentChange"
      @select-all="handleCheckAllMenu()"
    >
      <el-table-column
        v-if="dataJson.canEdit"
        ref="column_head_selection"
        type="selection"
        min-width="45"
      >
        <template v-slot="scope">
          <el-checkbox
            v-model="scope.row.is_enable"
            :disabled="!dataJson.canEdit"
            @change="handleCheckMenu(scope.row.is_enable, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        type="index"
        width="45"
      />
      <el-table-column
        header-align="center"
        show-overflow-tooltip
        min-width="120"
        prop="name"
        label="菜单名称"
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
        min-width="50"
        prop="type_name"
        label="类型"
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
        label="权限"
        min-width="260"
      >
        <template v-slot:header>
          <span>
            权限
            <el-tooltip
              class="item"
              effect="dark"
              placement="bottom"
            >
              <div slot="content">
                权限状态提示： <br>
                已勾选：已授权 <br>
                未勾选：未授权 <br>
              </div>
              <svg-icon
                icon-class="perfect-icon-question1_btn"
                style="margin-left: 5px"
              />
            </el-tooltip>
          </span>
        </template>
        <template v-slot="operations">
          <el-row>
            <el-col
              v-for="item in operations.row.function_info"
              :key="item.id"
            >
              <el-checkbox
                v-model="item.is_enable"
                :disabled="!dataJson.canEdit"
                @change="handleCheck(operations.row)"
              >{{ item.name }}</el-checkbox>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        label="全选"
        min-width="30"
      >
        <template v-slot:header>
          <span>
            全选
            <el-tooltip
              class="item"
              effect="dark"
              placement="bottom"
            >
              <div slot="content">
                全选提示： <br>
                勾选全选时，左侧对应的权限将会全部自动勾选。<br>
              </div>
              <svg-icon
                icon-class="perfect-icon-question1_btn"
                style="margin-left: 5px"
              />
            </el-tooltip>
          </span>
        </template>
        <template v-slot="operations">
          <div v-if="operations.row.function_info.length > 0">
            <el-checkbox
              v-model="operations.row.check_all"
              :indeterminate="operations.row.indeterminate"
              :disabled="!dataJson.canEdit"
              @change="handleCheckAllChange(operations.row)"
            />
          </div>
        </template>
        <template />
      </el-table-column>
    </el-table>

  </div>
</template>

<style scoped>
.el-alert--info.is-dark {
  background-color: #448aca;
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
.grid-content {
  border-radius: 2px;
  min-height: 36px;
  margin-bottom: 10px;
}
.bg-purple-light {
  background: #e5e9f2;
}
</style>

<script>
import '@/styles/menu_png.scss'
import { getOperationListApi, savePermissionApi } from '@/api/20_master/permission/operation/operation'
import deepCopy from 'deep-copy'

export default {
  components: {},
  directives: {},
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
    },
    headInfo: {
      type: String,
      default: ''
    },
    permissionId: {
      type: Number,
      default: null
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null,
        unwatch_is_edit: null
      },
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 查询条件
          permission_id: this.permissionId
        },
        // table使用的json
        listData: null,
        listDataCount: 0,
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 菜单全选checkbox状态
        check_all: {
          checked: false,
          indeterminate: false
        },
        canEdit: this.canEdit
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        duration: 4000,
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledSave: true
        }
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
  },
  created () {
    this.initShow()
  },
  mounted () {
  },
  methods: {
    initShow () {
      // 初始化查询
      this.getDataList()
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.listData', (newVal, oldVal) => {
        this.settings.btnDisabledStatus.disabledSave = false
      }, { deep: true })
      this.watch.unwatch_is_edit = this.$watch('settings.btnDisabledStatus.disabledSave', (newVal, oldVal) => {
        // 通知兄弟组件
        this.$off(this.EMITS.EMIT_PERMISSION_DEPT_IS_EDIT)
        this.$emit(this.EMITS.EMIT_PERMISSION_DEPT_IS_EDIT, !newVal)
      })
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
      if (this.watch.unwatch_is_edit) {
        this.watch.unwatch_is_edit()
      }
    },
    // 行点击
    handleRowClick (row) {
      this.dataJson.rowIndex = this.getRowIndex(row)
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = deepCopy(row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
    },
    getDataList () {
      // 查询逻辑
      this.settings.loading = true
      getOperationListApi(this.dataJson.searchForm).then(response => {
        const recorders = response.data.menu_data
        this.dataJson.listData = recorders
        this.dataJson.listDataCount = response.data.data_count
      }).finally(() => {
        this.dataJson.currentJson = undefined
        this.settings.loading = false
        this.$refs.multipleTable.setCurrentRow()

        // 初始化watch
        this.setWatch()
      })
    },
    // 当前行的权限全部勾选
    handleCheckAllChange (val) {
      val.function_info.forEach(item => {
        item.is_enable = val.check_all
      })
    },
    // 勾选某一权限时，判断全选组件的状态
    handleCheck (val) {
      const _checked_count = val.function_info.filter(item => item.is_enable === true).length
      const _operation_count = val.function_info.length
      val.check_all = _checked_count === _operation_count
      val.indeterminate = _checked_count > 0 && _checked_count < _operation_count
    },
    handleSave () {
      this.settings.loading = true
      // 获取权限数据
      const operation_data = this.getJsonObjects(this.dataJson.listData, 'function_info')
      // 获取菜单数据
      const menu_data = this.getJsonObjectsKeyFiledAndValueField(this.dataJson.listData, 'id', 'is_enable', 'function_info')
      savePermissionApi({ menu_data: menu_data, operation_data: operation_data }).then((_data) => {
        this.$notify({
          title: '权限保存处理成功',
          message: _data.data.message,
          type: 'success',
          duration: this.settings.duration
        })
      }, (_error) => {
        this.$notify({
          title: '权限保存处理失败',
          message: _error.error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.btnDisabledStatus.disabledSave = true
        this.settings.loading = false
      })
    },
    // 全选
    handleCheckAllMenu (selection) {
      // tableData 第一层只要有在 selection 里面就是全选 dataJson.check_all.checked
      const head_checkbox = this.$refs.multipleTable.$children[6].$children[0]
      if (head_checkbox.isChecked) {
        // checked --> unchecked
        this.setFieldValue2JsonObjects(this.dataJson.listData, 'is_enable', false, 'function_info')
      } else {
        // unchecked -->checked
        // 所有的is_enable都设置为checked，递归设置
        this.setFieldValue2JsonObjects(this.dataJson.listData, 'is_enable', true, 'function_info')
      }
    },
    handleCheckMenu (val, row) {
      // 所有的is_enable都设置为传入的值，递归设置，选择父节点，自动选中所有的子节点，反之则为撤销
      this.setFieldValue2JsonObjects(row, 'is_enable', val, 'function_info')
      this.setParentNodeIsEnable(val, 'menu_id', 'parent_id', 'is_enable', row, this.dataJson.listData, 'function_info')

      // 查找已经勾选的数据
      const _checked_count = this.getJsonObjects(this.dataJson.listData, 'is_enable', true, 'function_info')
      // tableData 第一层只要有在 selection 里面就是全选 dataJson.check_all.checked
      const head_checkbox = this.$refs.multipleTable.$children[6].$children[0]
      head_checkbox.$vnode.componentOptions.propsData.value = _checked_count.length === this.dataJson.listDataCount
      head_checkbox.$vnode.componentOptions.propsData.indeterminate = _checked_count.length > 0 && _checked_count.length < this.dataJson.listDataCount
      // 下面会引起vue的警告，暂时没有办法，需要用户体验
      head_checkbox.$vnode.componentInstance.value = _checked_count.length === this.dataJson.listDataCount
      head_checkbox.$vnode.componentInstance.indeterminate = _checked_count.length > 0 && _checked_count.length < this.dataJson.listDataCount
    }

  }
}
</script>
