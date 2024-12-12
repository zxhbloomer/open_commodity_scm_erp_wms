<template>
  <el-dialog
    v-if="listenVisible"
    v-el-drag-dialog
    title="流程设计"
    :visible="visible"
    :modal="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    destroy-on-close
  >
    <my-page
      ref="dialogRef"
      :data="data"
    />
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import myPage from '@/components/60_bpm/admin/FormProcessDesign'

export default {
  components: { myPage },
  directives: { elDragDialog },
  props: {
    // 页面是否显示参数
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dataJson: {
        // 页面设置json
        settings: {
          // 按钮状态：是否可用
          btnDisabledStatus: {
            disabledOk: false
          }
        }
      }
    }
  },
  computed: {

    listenVisible () {
      return this.visible
    }
  },
  // 监听器
  watch: {
    // 监听页面上面是否有选择
    // 监听页面是否打开
    listenVisible: {
      handler (newVal, oldVal) {
        if (newVal) {
          // dialog打开后初始化
          this.$nextTick(() => {
            // this.$refs.dialogRef.initDialogStatus()
            // this.$refs.dialogRef.initShow()
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    // 设置dialog的返回
  },
  methods: {
  }
}
</script>
<style scoped>
::v-deep .el-dialog {
  margin-top: 0vh !important;
  height: 95vh;
  width: 95vw;
  overflow: auto;
}
</style>
