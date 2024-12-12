<template>
  <div>
    <el-tabs
      ref="transferTabs"
      v-model="settings.tabs.activeName"
      :v-show="dataJson.tab.show"
      @tab-click="handleTabsClick"
      @tab-remove="handleRemoveTab"
    >
      <el-tab-pane
        v-if="!dataJson.tab.showEdit"
        name="main"
      >
        <template slot="label">物料转换记录</template>
        <transfer-template
          @emitInsert="handleInsert"
          @emitView="handleView"
          @emitUpdate="handleUpdate"
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
</style>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import transferTemplate from './tabs/list'
import resizeMixin from '@/mixin/resizeHandlerMixin'

export default {
  components: { transferTemplate },
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
      this.$refs.transferTabs.$el.children[0].style.margin = 0
      this.$refs.transferTabs.$el.children[0].style.display = 'none'
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
      // 新增物料转换
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_transfer'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.tab.showEdit = true
    },
    handleUpdate (_data) {
      // 修改物料转换
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_transfer'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showEdit = true
    },
    handleView (_data) {
      // 查看物料转换
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_transfer'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showEdit = true
    },
    handleReturn () {
      this.dataJson.tab.show = false
      this.settings.tabs.activeName = 'main'
      // this.dataJson.show = false
      this.dataJson.tab.showEdit = false
    }
  }
}
</script>
