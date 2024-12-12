<template>
  <div>
    <el-tabs

      ref="inTabs"
      v-model="settings.tabs.activeName"
      @tab-click="handleTabsClick"
      @tab-remove="handleRemoveTab"
    >
      <el-tab-pane
        name="main"
      >
        <template slot="label">放货指令信息</template>
        <list-template
          :data="dataJson.data"
          @emitView="handleView"
          @emitInsert="handleInsert"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="dataJson.tab.show2"
        name="detail"
      >
        <template slot="label">{{ dataJson.tab.name }}</template>
        <!--        查看详情-->
        <detail-template
          :data="dataJson.data"
          :edit-status="dataJson.editStatus"
          :head-info="dataJson.operation_head_info"
          :can-edit="dataJson.canEdit"
          @emitReturn="handleReturn"
        />
      </el-tab-pane>

      <el-tab-pane
        v-if="dataJson.tab.show3"
        name="edit"
      >
        <template slot="label">{{ dataJson.tab.name }}</template>
        <!--        查看详情-->
        <edit-template
          :edit-status="dataJson.editStatus"
          :head-info="dataJson.operation_head_info"
          :data="dataJson.updateData"
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
import listTemplate from './table/list'
import editTemplate from './table/edit'
import detailTemplate from './table/detail'
import resizeMixin from '@/mixin/resizeHandlerMixin'

export default {
  components: { listTemplate, editTemplate, detailTemplate },
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
          show1: true,
          // 打开新增修改页面
          show2: false,
          show3: false,
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
      this.dataJson.tab.showInsert = false
      this.settings.tabs.activeName = 'main'
    },
    handleView (_data) {
      // 查看放货指令单

      this.dataJson.data = _data.data
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'detail'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.tab.show1 = false
      this.dataJson.tab.show2 = true
      this.dataJson.tab.show3 = false
    },
    handleInsert (_data) {
      // debugger
      // 查看放货指令单

      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.updateData = _data.data

      this.dataJson.tab.show1 = false
      this.dataJson.tab.show2 = false
      this.dataJson.tab.show3 = true
    },
    handleReturn (_data) {
      // 返回列表
      if (_data !== null && _data !== undefined) {
        this.dataJson.tab.data = _data.data
      }
      this.dataJson.tab.show1 = true
      this.dataJson.tab.show2 = false
      this.dataJson.tab.show3 = false
      this.settings.tabs.activeName = 'main'
    }

  }
}
</script>
