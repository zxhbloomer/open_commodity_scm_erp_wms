<template>
  <div>
    <el-tabs
      ref="inTabs"
      v-model="settings.tabs.activeName"
      @tab-remove="handleRemoveTab"
    >
      <el-tab-pane name="main">
        <template slot="label">生产配方表</template>
        <in-template
          :edit-status="dataJson.editStatus"
          :data="dataJson.returnData"
          @emitInsert="handleInsert"
          @emitView="handleView"
          @emitEdit="handleEdit"
        />
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
import urlUtil from '@/utils/urlUtil'
import constants_para from '@/common/constants/constants_para'

export default {
  components: { inTemplate, editTemplate },
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
    // 获取url

    // 新增:p1=放货指令code

    // 获取url指定的参数
    location.href = urlUtil.delParam(window.location.href, 'fullpath')
    const p1 = urlUtil.getHashQueryVariable(window.location.href, 'p1')
    if (p1) {
      // 打开新增页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '新增生产' },
        canEdit: true,
        editStatus: constants_para.STATUS_INSERT,
        data: { delivery_order_detail_id: p1 }
      }
      this.handleInsert(operate_tab_data)
    }
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
      // 新增
      this.dataJson.tab.show = true
      this.dataJson.data = _data.data
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
    },
    handleView (_data) {
      // 查看
      this.dataJson.tab.show = true
      this.dataJson.data = _data.data
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
    },
    handleEdit (_data) {
      // 编辑
      this.dataJson.tab.show = true
      this.dataJson.data = _data.data
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
    },
    handleReturn (_data) {
      this.dataJson.tab.show = false
      this.dataJson.editStatus = ''
      this.settings.tabs.activeName = 'main'
    },
    handleCloseMeOk (val) {
      // 返回列表
      this.dataJson.tab.show = false
      this.dataJson.mainTab.show = true
      this.settings.tabs.activeName = 'main'
      this.dataJson.returnData = val.data.data
      this.dataJson.editStatus = val.edit_status
    }
  }
}
</script>
