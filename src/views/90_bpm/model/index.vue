<template>
  <div>
    <el-tabs
      ref="inPlanTabs"
      v-model="settings.tabs.activeName"
      :v-show="dataJson.tab.show"
      @tab-click="handleTabsClick"
      @tab-remove="handleRemoveTab"
    >
      <el-tab-pane name="main">
        <template slot="label">业务流程模型</template>
        <Model-template
          :data="dataJson.returnData"
          :edit-status="dataJson.editStatus"
          @emitInsert="handleInsert"
          @emitView="handleView"
          @emitUpdate="handleUpdate"
        />
      </el-tab-pane>

      <el-tab-pane
        v-if="dataJson.tab.showEdit"
        name="edit_model"
        style="overflow-y:auto;overflow-x:hidden;"
        closable
      >
        <template slot="label">{{ dataJson.tab.name }}</template>
        <edit-template
          :data="dataJson.data"
          :edit-status="dataJson.editStatus"
          :head-info="dataJson.operation_head_info"
          :can-edit="dataJson.canEdit"
          @emitReturn="handleReturn"
          @closeMeOk="handleCloseMeOk"
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
/* .el-tabs__header {
  display: none!important;
} */
</style>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import ModelTemplate from './tabs/list'
import editTemplate from './tabs/edit'
import resizeMixin from '@/mixin/resizeHandlerMixin'

export default {
  components: { ModelTemplate, editTemplate },
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
        leftTreeData: null,
        tab: {
          show: false,
          showEdit: false,
          showMain: true,
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
    this.$nextTick(() => {
      // this.$refs.inPlanTabs.$children[0].$refs.tabs[0].style.display = 'none'
      // this.$refs.inPlanTabs.$children[0].$refs.tabs[0].style.setProperty('display', 'none', ' important')
      this.$refs.inPlanTabs.$el.children[0].style.margin = 0
      this.$refs.inPlanTabs.$el.children[0].style.display = 'none'
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
    },
    handleInsert (_data) {
      // 新增入库计划
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_model'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.tab.showEdit = true
      this.dataJson.tab.showMain = false
    },
    handleUpdate (_data) {
      // 修改入库计划
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_model'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showEdit = true
      this.dataJson.tab.showMain = false
    },
    handleView (_data) {
      // 查看入库计划
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_model'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showEdit = true
      this.dataJson.tab.showMain = false
    },
    handleReturn () {
      this.dataJson.tab.show = false
      this.settings.tabs.activeName = 'main'
      // this.dataJson.show = false
      this.dataJson.tab.showEdit = false
      this.dataJson.tab.showMain = true
    },
    handleCloseMeOk (val) {
      // 返回列表
      this.dataJson.tab.show = false
      this.dataJson.tab.showEdit = false
      this.dataJson.tab.showMain = true
      this.settings.tabs.activeName = 'main'
      this.dataJson.returnData = val.data.data
      this.dataJson.editStatus = val.edit_status
    }
  }
}
</script>
