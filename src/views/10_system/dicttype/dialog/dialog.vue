<template>
  <el-dialog
    v-el-drag-dialog
    title="字典类型选择对话框"
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :modal="true"
    :append-to-body="true"
    :modal-append-to-body="false"
    width="1000px"
    destroy-on-close
    top="5vh"
  >
    <current-dialog
      ref="dialogRef"
      @rowDbClick="handleRowDbClick"
    />
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />
      <el-button
        plain
        @click="handleDoCancel()"
      >取消</el-button>
      <el-button
        :disabled="dataJson.settings.btnDisabledStatus.disabledOk"
        @click="handleDoOk()"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import currentDialog from '@/views/10_system/dicttype/dicttype'

export default {
  name: 'COM000010',
  components: { currentDialog },
  directives: { elDragDialog },
  props: {
    // 页面是否显示参数
    visible: {
      type: Boolean,
      default: false
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
    listenSelectedDataJson () {
      return this.$store.getters.selectedDataJson
    },
    listenVisible () {
      return this.visible
    }
  },
  // 监听器
  watch: {
    // 监听页面上面是否有选择
    listenSelectedDataJson: {
      handler (newVal, oldVal) {
        if (newVal === undefined || newVal === null || JSON.stringify(newVal) === '{}') {
          this.dataJson.settings.btnDisabledStatus.disabledOk = true
        } else {
          this.dataJson.settings.btnDisabledStatus.disabledOk = false
        }
      },
      deep: true,
      immediate: true
    },
    // 监听页面是否打开
    listenVisible: {
      handler (newVal, oldVal) {
        if (newVal) {
          // dialog打开后初始化
          this.$store.dispatch('popUpSearchDialog/program', { programId: 'COM000010', status: 'open' })
          this.$store.dispatch('popUpSearchDialog/selectedDataJson', null)
          this.$nextTick(() => {
            this.$refs.dialogRef.initDialogStatus()
            this.$refs.dialogRef.initShow()
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    // 设置当前打开的页面

  },
  methods: {
    handleRowDbClick (val) {
      this.$store.dispatch('popUpSearchDialog/program', { programId: 'COM000010', status: 'closed' })
      this.$emit('closeMeOk', this.$store.getters.selectedDataJson)
    },
    // 确定
    handleDoOk () {
      // this.$emit('update:visible', false)
      this.$store.dispatch('popUpSearchDialog/program', { programId: 'COM000010', status: 'closed' })
      this.$emit('closeMeOk', this.$store.getters.selectedDataJson)
    },
    // 取消
    handleDoCancel () {
      // this.$emit('update:visible', false)
      this.$store.dispatch('popUpSearchDialog/program', { programId: 'COM000010', status: 'closed' })
      this.$store.dispatch('popUpSearchDialog/selectedDataJson', null)
      this.$emit('closeMeCancel')
    }
  }
}
</script>
