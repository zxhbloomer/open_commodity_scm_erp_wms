<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col
        :xs="6"
        :sm="6"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <org-tree :height="treeHeight" />
      </el-col>
      <el-col
        :xs="18"
        :sm="18"
        :md="18"
        :lg="18"
        :xl="18"
      >
        <div class="grid-content bg-purple" />
        <el-tabs
          type="border-card"
          tab-position="bottom"
        >
          <el-tab-pane label="显示用户列表">
            <User-List :height="tableHeight" />
          </el-tab-pane>
          <el-tab-pane label="显示组织列表">
            <Org-List :height="tableHeight" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import resizeMixin from '@/mixin/resizeHandlerMixin'

export default {
  name: 'P00000010', // 页面id，和router中的name需要一致，作为缓存
  components: {
    OrgTree: () => import('./orgTree'), // 左侧tree
    OrgList: () => import('./orgList'), // 右侧list
    UserList: () => import('./userList') // 右侧list
  },
  mixins: [resizeMixin],
  data () {
    return {
      treeHeight: this.setUIheight().leftHeigh,
      tableHeight: this.setUIheight().rightHeigh
    }
  }
}
</script>
