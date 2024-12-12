<template>
  <div>
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      title="仓库分组选择页面"
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :modal="true"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1250px"
      destroy-on-close
      top="5vh"
    >
      <div class="el-dialog-div">
        <current-dialog
          ref="dialogRef"
          :data-model="dataJson.dataModel"
          :me-dialog-status="visible"
          :serial-data="serialData"
        />
      </div>
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
  </div>
</template>

<style scoped>
.el-dialog-div {
  height: 70vh;
  overflow: auto;
}
</style>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import currentDialog from '@/views/20_master/relation/relation'
import { setRelationByPostionIdWarehouseGroup } from '@/api/40_business/relation/relation'
import { isNotEmpty } from '@/utils'

export default {
  components: { currentDialog },
  directives: { elDragDialog },
  props: {
    id: {
      type: Number,
      default: null
    },
    // 页面是否显示参数
    visible: {
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

      dataJson: {
        datas: null,
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
          this.$nextTick(() => {
            this.init()
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    // 设置dialog的返回
    this.$store.dispatch('popUpSearchDialog/selectedDataJson', null)
    this.init
  },
  methods: {
    // 初始化
    init () {
      // this.$refs.dialogRef.initDialogStatus({
      //   serial_type: 'm_position',
      //   serial_id: this.id
      // })
      // const _data = this.$store.getters.selectedDataJson
      // if (!isNotEmpty(_data)) {
      //   this.dataJson.settings.btnDisabledStatus.disabledOk = true
      // }
    },
    getAllCheckCode (_data) {
      this.dataJson.datas = []
      if (_data.is_enable) {
        this.dataJson.datas.push({ warehouse_relation_code: _data.code })
      }
      if (_data.children) {
        this.getChecktwo(_data.children)
      }
    },
    getChecktwo (children) {
      for (const _child of children) {
        if (_child.is_enable) {
          this.dataJson.datas.push({ warehouse_relation_code: _child.code })
        }
        if (_child.children) {
          this.getCheckthree(_child.children)
        }
      }
    },
    getCheckthree (children) {
      for (const _child of children) {
        if (_child.is_enable) {
          this.dataJson.datas.push({ warehouse_relation_code: _child.code })
        }
        if (_child.children) {
          this.getCheckfour(_child.children)
        }
      }
    },
    getCheckfour (children) {
      for (const _child of children) {
        if (_child.is_enable) {
          this.dataJson.datas.push({ warehouse_relation_code: _child.code })
        }
      }
    },
    // 更新关系，岗位：仓库分组
    // 确定
    handleDoOk () {
      // this.settings.loading = true
      const _data = this.$store.getters.selectedDataJson
      if (!isNotEmpty(_data[0])) {
        this.$emit('closeMeCancel')
        return
      }
      this.getAllCheckCode(_data[0])

      setRelationByPostionIdWarehouseGroup({
        serial_id: this.id,
        serial_type: 'm_position',
        datas: this.dataJson.datas
      }).then((_data) => {
        this.$notify({
          title: '更新处理成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
      }, (_error) => {
        this.$notify({
          title: '更新处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.$emit('closeMeOk', this.$store.getters.selectedDataJson)
      })
    },
    // 取消
    handleDoCancel () {
      this.$emit('closeMeCancel')
    }
  }
}
</script>
