<template>
  <div>
    <el-tabs
      ref="inTabs"
      v-model="settings.tabs.activeName"
      @tab-click="handleTabsClick"
      @tab-remove="handleRemoveTab"
    >
      <el-tab-pane name="main">
        <template slot="label">监管任务</template>
        <in-template
          :data="dataJson.data"
          @emitView="handleView"
          @emitEdit="handleEdit"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="dataJson.tab.showView"
        name="view"
        closable
      >
        <template slot="label">{{ dataJson.tab.name }}</template>

      </el-tab-pane>
      <el-tab-pane
        v-if="dataJson.tab.showEdit"
        name="edit"
        closable
      >
        <template slot="label">{{ dataJson.tab.name }}</template>

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
import resizeMixin from '@/mixin/resizeHandlerMixin'
import urlUtil from '@/utils/urlUtil'
import constants_para from '@/common/constants/constants_para'

export default {
  components: { inTemplate },
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
        tab: {
          showEdit: false,
          showView: false,
          showMain: true,
          showView1: true
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

    // url说明：
    // 查询-全部:
    // 查询-待出/待提:p1=1
    // 查询-待入/待卸 :p1=2
    // 查询-已完成:p1=3
    // 查看:p2=id
    // 维护:p3=id

    // 获取url指定的参数
    const p1 = urlUtil.getHashQueryVariable(window.location.href, 'p1')
    const p2 = urlUtil.getHashQueryVariable(window.location.href, 'p2')
    const p3 = urlUtil.getHashQueryVariable(window.location.href, 'p3')
    if (p1) {
      // 不用处理
    }
    if (p2) {
      // 打开查看页面
      const operate_tab_data = {
        operate_tab_info: { showEdit: true, name: '查看监管任务' },
        canEdit: false,
        editStatus: constants_para.STATUS_VIEW,
        data: { id: p2 }
      }
      this.handleView(operate_tab_data)
    }
    if (p3) {
      // 打开维护页面
      const operate_tab_data = {
        operate_tab_info: { showEdit: true, name: '维护监管任务' },
        canEdit: false,
        editStatus: constants_para.STATUS_EDIT,
        data: { id: p3 }
      }
      this.handleEdit(operate_tab_data)
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
      this.dataJson.tab.showEdit = false
      this.dataJson.tab.showView = false
      this.dataJson.tab.showMain = true
      this.settings.tabs.activeName = 'main'
    },
    handleView (_data) {
      // 查看监管任务

      this.dataJson.data = _data.data
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'view'
      this.dataJson.tab.showView = true
      this.dataJson.tab.showMain = false
      this.dataJson.tab.showEdit = false
      this.dataJson.canEdit = false

      this.dataJson.editStatus = _data.editStatus
    },
    handleEdit (_data) {
      // 编辑监管任务

      this.dataJson.data = _data.data
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit'
      this.dataJson.tab.showEdit = true
      this.dataJson.tab.showView = false
      this.dataJson.tab.showMain = false
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
    },
    handleReturn (_data) {
      // 返回列表
      this.dataJson.data = _data.data
      this.dataJson.tab.showEdit = false
      this.dataJson.tab.showView = false

      // this.dataJson.tab.showMain = true

      this.settings.tabs.activeName = 'main'
    }
  }
}
</script>
