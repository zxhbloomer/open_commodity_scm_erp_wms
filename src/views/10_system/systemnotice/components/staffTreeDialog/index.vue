<template>
  <el-dialog
    v-if="listenVisible"
    v-el-drag-dialog
    v-loading="settings.loading"
    element-loading-text="拼命加载中，请稍后..."
    element-loading-background="rgba(255, 255, 255, 0.7)"
    title="员工选择"
    :visible="visible"
    :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
    :close-on-press-escape="!PARAMETERS.DIALOG_CLOSE_BY_ESC"
    :show-close="!PARAMETERS.DIALOG_SHOW_CLOSE"
    :append-to-body="true"
    :modal-append-to-body="true"
    width="1150px"
    top="10vh"
    destroy-on-close
  >
    <el-container>
      <el-aside width="300px">
        <LeftTree />
      </el-aside>
      <el-main>
        <RightStaff />
      </el-main>
    </el-container>
    <el-footer>
      <FooterSelected
        ref="footer"
        :data="data"
        @emitButtonDisabledStatus="handleButtonDisabledStatus"
      />
    </el-footer>
    <div class="button">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        :disabled="!settings.btnShowStatus.showInsert"
        :loading="settings.loading"
        @click="handleSelect"
      >完成选择</el-button>
      <el-button
        type="primary"
        icon="el-icon-edit-outline"
        :disabled="!settings.btnShowStatus.showInsert"
        :loading="settings.loading"
        @click="handleClear"
      >清空</el-button>
      <el-button
        type="primary"
        icon="el-icon-camera-solid"
        :loading="settings.loading"
        @click="handleClose"
      >关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import '@/styles/org_png.scss'
import LeftTree from '@/views/10_system/systemnotice/components/staffTreeDialog/components/leftTree.vue'
import RightStaff from '@/views/10_system/systemnotice/components/staffTreeDialog/components/rightStaff.vue'
import FooterSelected from '@/views/10_system/systemnotice/components/staffTreeDialog/components/footerSelected.vue'

export default {
  components: { LeftTree, RightStaff, FooterSelected },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      dataJson: {},
      settings: {
        loading: false,
        btnShowStatus: {
          showInsert: false
        }
      }
    }
  },
  computed: {
    listenVisible () {
      return this.visible
    }
  },
  created () {
  },
  methods: {
    handleSelect () {
      const listData = this.$refs.footer.dataJson.listData
      this.$emit('emitInsertStaffOk', listData)
    },
    // 清空选择
    handleClear () {
      this.$refs.footer.dataJson.listData = []
    },
    handleButtonDisabledStatus (status) {
      this.settings.btnShowStatus.showInsert = status
    },
    handleClose () {
      this.$emit('emitCloseCancel')
    }
  }
}
</script>

<style scoped>
.el-aside {
  background-color: white;
  padding: 2px 3px;
}
.el-main {
  padding: 3px;
}
.el-footer {
  padding: 0 3px;
}
.button {
  padding-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
