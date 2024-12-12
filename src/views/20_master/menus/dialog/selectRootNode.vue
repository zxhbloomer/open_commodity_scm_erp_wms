<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改、步骤窗体-->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :title="settings.textMap"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        label-position="rigth"
        label-width="120px"
        :model="dataJson.tempJson"
        status-icon
      >
        <el-row>
          <el-form-item
            label="菜单组："
            :rules="[
              { required: true, message: '请选择菜单组!'},
            ]"
          >
            <el-select
              ref="refFocus"
              v-model="dataJson.tempJson"
              placeholder="请选择"
            >
              <el-option
                v-for="item in data"
                :key="item.id"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <el-button
          plain
          :disabled="settings.loading"
          @click="handleCancel()"
        >取消</el-button>
        <el-button
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledNext "
          @click="handleNext()"
        >下一步</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  components: {},
  directives: { elDragDialog },
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    data: {
      type: Array,
      default: null
    },
    dialogStatus: {
      type: String,
      default: constants_para.STATUS_VIEW
    }
  },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {// 单条数据 json的，初始化原始数据
        // 单条数据 json
        tempJson: null,
        inputSettings: {
          maxLength: {
          }
        }
      },
      settings: {
        // loading 状态
        loading: true,
        dialogStatus: this.dialogStatus,
        textMap: '请选择要调整顺序的菜单组',
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false,
          showCopyInsert: false
        },
        // 按钮状态：是否可用
        btnDisabledStatus: {
          disabledNext: true
        },
        rules: {
          root_node: [{ required: true, message: '请选择菜单组', trigger: 'change' }]
        }
      },
      popSettings: {
        // 弹出编辑页面
        two: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        }
      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT || this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT) {
        return false
      } else {
        return true
      }
    },
    listenVisible () {
      return this.visible
    },
    isViewModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_VIEW) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {
  },
  created () {
    this.init()
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    // 初始化处理
    init () {
      // 初始化级联数据
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      this.initData()
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(this).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(this).settings.btnDisabledStatus
    },
    // 修改时的初始化
    initData () {
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocus'].focus()
      })
    },
    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    handleNext () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          this.$emit('closeMeOk', this.dataJson.tempJson)
        } else {
          this.showErrorMsg('请选择菜单组!')
        }
      })
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.tempJson', (newVal, oldVal) => {
        this.settings.btnDisabledStatus.disabledNext = false
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    }
  }
}
</script>
