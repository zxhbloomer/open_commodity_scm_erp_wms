<template>
  <div>
    <el-tabs
      ref="outPlanTabs"
      v-model="settings.tabs.activeName"
      @tab-click="handleTabsClick"
      @tab-remove="handleRemoveTab"
    >
      <el-tab-pane
        name="main"
        :disabled="dataJson.tab.show"
      >
        <template slot="label">出库计划</template>
        <outplan-template
          @emitOperate="handleOperate"
          @emitInsert="handleInsert"
          @emitView="handleView"
          @emitUpdate="handleUpdate"
          @emitOperateReceive="handOperateReceive"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="dataJson.tab.showEdit"
        name="edit_outplan"
        closable
      >
        <template slot="label">{{ dataJson.tab.name }}</template>
        <edit-template
          :data="dataJson.data"
          :edit-status="dataJson.editStatus"
          :head-info="dataJson.operation_head_info"
          :can-edit="dataJson.canEdit"
          @emitReturn="handleReturn"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="dataJson.tab.showOperate"
        name="operate_outplan"
        closable
      >
        <template slot="label">{{ dataJson.tab.name }}</template>
        <operate-template
          :data="dataJson.data"
          :edit-status="dataJson.editStatus"
          :head-info="dataJson.operation_head_info"
          :can-edit="dataJson.canEdit"
          @emitReturn="handleReturn"
        />
      </el-tab-pane>

      <el-tab-pane
        v-if="dataJson.tab.showOperate"
        name="operate_receive"
        closable
      >
        <template slot="label">{{ dataJson.tab.name }}</template>
        <operate-receive-template
          :data="dataJson.data"
          :edit-status="dataJson.editStatus"
          :head-info="dataJson.operation_head_info"
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
import outplanTemplate from './tabs/list'
import editTemplate from './tabs/edit'
import operateTemplate from './tabs/operate'
import resizeMixin from '@/mixin/resizeHandlerMixin'
import urlUtil from '@/utils/urlUtil'
import constants_para from '@/common/constants/constants_para'
import operateReceiveTemplate from './tabs/operateReceive.vue'

export default {
  components: { outplanTemplate, editTemplate, operateTemplate, operateReceiveTemplate },
  directives: { elDragDialog },
  mixins: [resizeMixin],
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
          name: '',
          showEdit: false,
          showOperate: false,
          showMain: true
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
    this.$nextTick(() => {
      this.$refs.outPlanTabs.$el.children[0].style.margin = 0
      this.$refs.outPlanTabs.$el.children[0].style.display = 'none'
    })
  },
  created () {
    location.href = urlUtil.delParam(window.location.href, 'fullpath')
    const p4 = urlUtil.getHashQueryVariable(window.location.href, 'p4')
    const sku_code = urlUtil.getHashQueryVariable(window.location.href, 'sku_code')
    if (p4) {
      // 打开入库计划新增页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '新增出库计划' },
        canEdit: true,
        editStatus: constants_para.STATUS_INSERT,
        data: { order_id: p4, sku_code: sku_code }
      }
      this.handleInsert(operate_tab_data)
    }
  },
  methods: {
    handleTabsClick (tab, event) {
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
    handleInsert (_data) {
      // 新增出库计划
      this.dataJson.data = _data.data
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_outplan'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.tab.showOperate = false
      this.dataJson.tab.showMain = false
      this.dataJson.tab.showEdit = true
    },
    handleUpdate (_data) {
      // 修改出库计划
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_outplan'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showOperate = false
      this.dataJson.tab.showMain = false
      this.dataJson.tab.showEdit = true
    },
    handleView (_data) {
      // 查看出库计划
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_outplan'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showOperate = false
      this.dataJson.tab.showMain = false
      this.dataJson.tab.showEdit = true
    },
    handleOperate (_data) {
      // 出库操作
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'operate_outplan'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showOperate = true
      this.dataJson.tab.showMain = false
      this.dataJson.tab.showEdit = false
    },
    handleReturn () {
      // 返回列表
      this.dataJson.tab.show = false
      this.settings.tabs.activeName = 'main'
      // this.dataJson.show = false
      this.dataJson.tab.showOperate = false
      this.dataJson.tab.showEdit = false
      this.dataJson.tab.showMain = true
    },

    handOperateReceive (_data) {
      // 查看出库计划
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'operate_receive'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showOperate = true
      this.dataJson.tab.showMain = false
      this.dataJson.tab.showEdit = false
    }
  }
}
</script>
