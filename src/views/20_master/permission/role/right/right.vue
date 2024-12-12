<template>
  <div>
    <el-tabs
      ref="tabs"
      v-model="settings.tabs.activeName"
      @tab-click="handleTabsClick"
      @tab-remove="handleRemoveTab"
    >
      <el-tab-pane
        name="main"
        :style="{height: height + 'px'}"
        style="overflow-y:auto;overflow-x:hidden;"
        :disabled="dataJson.tab.show"
      >
        <template slot="label">权限列表</template>
        <permission-template
          :height="height - 142"
          @emitEdit="handleEdit"
          @emitView="handleView"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="dataJson.tab.show"
        name="edit_permission"
        :style="{height: height + 'px'}"
        style="overflow-y:auto;overflow-x:hidden;"
        closable
      >
        <template slot="label">{{ dataJson.tab.name }}</template>
        <operation-template
          :height="height - 102"
          :head-info="dataJson.operation_head_info"
          :permission-id="dataJson.permissionId"
          :can-edit="dataJson.canEdit"
          @emitReturn="handleReturn"
        />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<style scoped>
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-cascader {
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
.el-alert--info.is-light {
  background: #eee;
}
.corner {
  position: absolute;
  top: 0px;
  border: 0;
  right: 0;
}
</style>
<style >
.buttonSearch {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.buttonReset {
  color: #ffffff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
</style>
<script>
import elDragDialog from '@/directive/el-drag-dialog'
import permissionTemplate from '../right/sub_template/permission'
import operationTemplate from '../right/sub_template/operation'

export default {
  components: { permissionTemplate, operationTemplate },
  directives: { elDragDialog },
  props: {
    height: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      dataJson: {
        // 左侧树的数据
        leftTreeData: null,
        tab: {
          show: false,
          name: ''
        },
        operation_head_info: '',
        permissionId: null,
        canEdit: null
      },
      // 页面设置json
      settings: {
        tabs: {
          activeName: 'main',
          is_edit: false
        },
        // loading 状态
        loading: true,
        duration: 4000
      }
    }
  },
  // 监听器
  watch: {
  },
  mounted () {
    // 描绘完成
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_CHANGE, _data => {
      this.dataJson.leftTreeData = _data
    })
    // 开始编辑操作权限时，接收兄弟消息，激活新tab开始编辑权限操作
    this.$on(this.EMITS.EMIT_PERMISSION_ROLE_OPERATE_EDIT, _data => {
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_permission'
      this.dataJson.operation_head_info = _data.operate_tab_header_info.info
      this.dataJson.permissionId = _data.permission.permissionId
      this.dataJson.canEdit = true
      this.settings.tabs.is_edit = false
    })
    this.$on(this.EMITS.EMIT_PERMISSION_ROLE_OPERATE_EDIT_OK, _data => {
      this.settings.tabs.activeName = 'main'
      this.dataJson.tab.show = false
    })

    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_INFO, _data => {
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_permission'
      this.dataJson.operation_head_info = _data.operate_tab_header_info.info
      this.dataJson.permissionId = _data.permission.permissionId
      this.dataJson.canEdit = false
      this.settings.tabs.is_edit = false
    })
    // 是否编辑
    this.$on(this.EMITS.EMIT_PERMISSION_DEPT_IS_EDIT, _data => {
      this.settings.tabs.is_edit = _data
    })
  },
  created () {
  },
  methods: {
    handleTabsClick (tab, event) {
      // console.log(tab, event)
    },
    // 点击tabs的关闭
    handleRemoveTab (targetName) {
      if (this.settings.tabs.is_edit === false) {
        this.doCloseTab()
      } else {
        if (targetName === 'edit_permission' && this.settings.tabs.is_edit) {
          this.$confirm('您点击了关闭当前页签的操作，请注意保存当前数据。', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '取消',
            cancelButtonText: '确认关闭'
          }).then(() => {
          }).catch(action => {
            // 右上角X
            if (action === 'cancel') {
              this.doCloseTab()
            }
          })
        }
      }
    },
    doCloseTab () {
      this.dataJson.tab.show = false
      this.settings.tabs.activeName = 'main'
      this.$off(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_EDIT_OK)
      this.$emit(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_EDIT_OK, null)
      this.$off(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_INFO_OK)
      this.$emit(this.EMITS.EMIT_PERMISSION_DEPT_OPERATE_INFO_OK, null)
    },
    handleEdit (_data) {
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_permission'
      this.dataJson.operation_head_info = _data.operate_tab_header_info.info
      this.dataJson.permissionId = _data.permission.permissionId
      this.dataJson.canEdit = true
      this.settings.tabs.is_edit = false
    },
    handleView (_data) {
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_permission'
      this.dataJson.operation_head_info = _data.operate_tab_header_info.info
      this.dataJson.permissionId = _data.permission.permissionId
      this.dataJson.canEdit = false
      this.settings.tabs.is_edit = false
    },
    handleReturn () {
      this.dataJson.tab.show = false
      this.settings.tabs.activeName = 'main'
    }
  }
}
</script>
