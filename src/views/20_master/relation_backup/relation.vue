<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col
        :xs="9"
        :sm="9"
        :md="9"
        :lg="9"
        :xl="9"
      >
        <el-card
          shadow="always"
          :body-style="{ padding: '10px' }"
        >
          <left
            :serial-data="serialData"
            :height="settings.leftHeight -68"
          />
        </el-card>
      </el-col>
      <el-col
        :xs="15"
        :sm="15"
        :md="15"
        :lg="15"
        :xl="15"
      >
        <el-card
          shadow="always"
          :body-style="{ padding: '10px' }"
        >
          <right :height="settings.rightHeight-68" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import resizeMixin from './relationResizeHandlerMixin'

export default {
  components: {
    left: () => import('./left/left'), // 左侧tree
    right: () => import('./right/right') // 右侧list
  },
  mixins: [resizeMixin],
  props: {
    dataModel: {
      type: String,
      default: ''
    },
    meDialogStatus: {
      type: Boolean,
      default: false
    },
    serialData: {
      type: Object,
      default: null
    }
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
    // 弹出框设置初始化
    initDialogStatus (val) {
      // this.dataJson.dialog_param = val
    }
  }
}
</script>
