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
        <el-card
          shadow="always"
          :body-style="{ padding: '10px' }"
        >
          <left :height="settings.leftHeight" />
        </el-card>
      </el-col>
      <el-col
        :xs="18"
        :sm="18"
        :md="18"
        :lg="18"
        :xl="18"
      >
        <el-card
          shadow="always"
          :body-style="{ padding: '10px' }"
        >
          <right :height="settings.rightHeight" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import constants_program from '@/common/constants/constants_program'
import resizeMixin from './permission_deptResizeHandlerMixin'

export default {
  name: constants_program.P_PERMISSION_DEPT, // 页面id，和router中的name需要一致，作为缓存
  components: {
    left: () => import('./left/left'), // 左侧tree
    right: () => import('./right/right') // 右侧list
    // UserList: () => import('./userList') // 右侧list
  },
  mixins: [resizeMixin],
  props: {
  },
  data () {
    return {

      // 数据类
      dataJson: {
      },
      // 页面设置json
      settings: {
        leftHeight: this.setUIheight(),
        rightHeight: this.setUIheight()
      }
    }
  },
  computed: {
    // leftHeight() {
    //   return this.setUIheight() - 60
    // },
    // rightHeight() {
    //   return this.setUIheight() - 50
    // }
  },
  // 监听器
  watch: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
