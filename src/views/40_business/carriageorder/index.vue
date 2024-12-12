<template>
  <div>
    <el-tabs
      ref="inTabs"
      v-model="settings.tabs.activeName"
      @tab-click="handleTabsClick"
      @tab-remove="handleRemoveTab"
    >
      <el-tab-pane
        v-if="dataJson.mainTab.show"
        name="main"
      >
        <template slot="label">订单</template>
        <in-template ref="searchList" @emitInsert="handleInsert" />
      </el-tab-pane>
      <el-tab-pane
        v-if="dataJson.tab.show"
        name="edit"
        closable
      >
        <template slot="label">{{ dataJson.tab.name }}</template>
        <edit-template
          :data="dataJson.data"
          :edit-status="dataJson.editStatus"
          :head-info="dataJson.operation_head_info"
          :can-edit="dataJson.canEdit"
          @emitReturn="handleReturn"
          @emitReturnOK="handleReturnOk"
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
import inTemplate from './tabs/list'
import editTemplate from './tabs/edit'
import resizeMixin from '@/mixin/resizeHandlerMixin'

export default {
  components: { inTemplate, editTemplate },
  directives: { elDragDialog },
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
    },
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
        mainTab: {
          show: true,
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
      this.$refs.inTabs.$el.children[0].style.margin = 0
      this.$refs.inTabs.$el.children[0].style.display = 'none'
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
      // 新增入库单
      this.dataJson.tab.show = true
      this.dataJson.data = _data.data
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
    },
    handleView (_data) {
      // 查看入库单
      this.dataJson.tab.show = true
      this.dataJson.data = _data.data
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'view'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
    },
    handleReturn () {
      // 返回列表
      this.dataJson.tab.show = false
      this.settings.tabs.activeName = 'main'
    },
    // 新增, 更新成功
    handleReturnOk (val) {
      // 返回列表
      this.$refs.searchList.handleCloseDialogOneOk(val)
      this.dataJson.tab.show = false
      this.settings.tabs.activeName = 'main'
    }
  }
}
</script>
