<!--
url说明：
查询-我的待办:p1=1
查询-我的已办 :p1=2
查询-全部:p1=3
查看:p2=id
入库操作:p3=id
-->
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
        <template slot="label">入库计划</template>
        <inplan-template
          @emitOperate="handleOperate"
          @emitOperateDelivery="handleOperateDelivery"
          @emitInsert="handleInsert"
          @emitView="handleView"
          @emitUpdate="handleUpdate"
        />
      </el-tab-pane>

      <el-tab-pane
        v-if="dataJson.tab.showOperate"
        name="operate_inplan"
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
        v-if="dataJson.tab.showEdit"
        name="edit_inplan"
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
        />
      </el-tab-pane>

      <el-tab-pane
        v-if="dataJson.tab.showOperate"
        name="operate_delivery"
        closable
      >
        <template slot="label">{{ dataJson.tab.name }}</template>
        <operate-delivery-template
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
</style>
<style >
/* .el-tabs__header {
  display: none!important;
} */
</style>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import inplanTemplate from './tabs/list'
import editTemplate from './tabs/edit'
import operateTemplate from './tabs/operate'
import resizeMixin from '@/mixin/resizeHandlerMixin'
import urlUtil from '@/utils/urlUtil'
import constants_para from '@/common/constants/constants_para'
import operateDeliveryTemplate from './tabs/operateDelivery'

export default {
  components: { operateDeliveryTemplate, inplanTemplate, editTemplate, operateTemplate },
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
          showEdit: false,
          showOperate: false,
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
      // this.$refs.inPlanTabs.$children[0].$refs.tabs[0].style.display = 'none'
      // this.$refs.inPlanTabs.$children[0].$refs.tabs[0].style.setProperty('display', 'none', ' important')
      this.$refs.inPlanTabs.$el.children[0].style.margin = 0
      this.$refs.inPlanTabs.$el.children[0].style.display = 'none'
    })
  },
  created () {
    // 获取url

    // 查询-我的待办:p1=1
    // 查询-我的已办 :p1=2
    // 查询-全部:p1=3
    // 查看:p2=id
    // 入库操作:p3=id

    // 获取url指定的参数
    location.href = urlUtil.delParam(window.location.href, 'fullpath')
    const p1 = urlUtil.getHashQueryVariable(window.location.href, 'p1')
    const p2 = urlUtil.getHashQueryVariable(window.location.href, 'p2')
    const p3 = urlUtil.getHashQueryVariable(window.location.href, 'p3')
    const p4 = urlUtil.getHashQueryVariable(window.location.href, 'p4')
    const sku_code = urlUtil.getHashQueryVariable(window.location.href, 'sku_code')
    if (p1) {
      // 不用处理
    }
    if (p2) {
      // 打开查看页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '查看入库计划' },
        canEdit: true,
        editStatus: constants_para.STATUS_VIEW,
        data: { id: p2 }
      }
      this.handleView(operate_tab_data)
    }
    if (p3) {
      // 打开入库操作页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '正在入库操作' },
        canEdit: true,
        editStatus: constants_para.STATUS_UPDATE,
        data: { id: p3 }
      }
      this.handleUpdate(operate_tab_data)
    }
    if (p4) {
      // 打开入库计划新增页面
      const operate_tab_data = {
        operate_tab_info: { show: true, name: '新增入库计划' },
        canEdit: true,
        editStatus: constants_para.STATUS_INSERT,
        data: { order_id: p4, sku_code: sku_code }
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
      // 新增入库计划
      this.dataJson.mainTab.show = false
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_inplan'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showOperate = false
      this.dataJson.tab.showEdit = true
    },
    handleUpdate (_data) {
      // 修改入库计划
      this.dataJson.mainTab.show = false
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_inplan'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showOperate = false
      this.dataJson.tab.showEdit = true
    },
    handleView (_data) {
      // 查看入库计划
      this.dataJson.mainTab.show = false
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'edit_inplan'
      this.dataJson.canEdit = false
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showOperate = false
      this.dataJson.tab.showEdit = true
    },
    handleOperate (_data) {
      // 入库操作
      this.dataJson.mainTab.show = false
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'operate_inplan'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showOperate = true
      this.dataJson.tab.showEdit = false
    },

    handleOperateDelivery (_data) {
      // 提货操作
      this.dataJson.mainTab.show = false
      this.dataJson.tab = _data.operate_tab_info
      this.settings.tabs.activeName = 'operate_delivery'
      this.dataJson.canEdit = true
      this.dataJson.editStatus = _data.editStatus
      this.dataJson.data = _data.data
      this.dataJson.tab.showOperate = true
      this.dataJson.tab.showEdit = false
    },
    handleReturn (_data) {
      // 返回列表
      this.dataJson.data = _data.data
      this.dataJson.tab.show = false
      this.dataJson.mainTab.show = true
      this.settings.tabs.activeName = 'main'
      // this.dataJson.show = false
      this.dataJson.tab.showOperate = false
      this.dataJson.tab.showEdit = false
    }
  }
}
</script>
