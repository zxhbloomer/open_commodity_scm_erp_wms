<template>
  <div class="app-container">
    <el-row :gutter="10">
      <!-- <el-col
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
      </el-col> -->
      <el-col>
        <el-card
          shadow="always"
          :body-style="{ padding: '10px' }"
        >

          <right :height="settings.rightHeight" />
          <!-- <right height="100%" /> -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import resizeMixin from './permission_roleResizeHandlerMixin'

export default {
  components: {
    // left: () => import('./left/left'), // 左侧tree
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
