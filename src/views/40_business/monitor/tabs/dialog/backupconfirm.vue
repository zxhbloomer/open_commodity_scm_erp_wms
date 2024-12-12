<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改 -->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      title="备份参数"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="950px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="0px"
        status-icon
      >
        <el-alert
          title="监管备份参数信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="1"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item>
            <div
              slot="label"
              class="required-mark"
            >
              <span>
                备份时间范围
                <el-tooltip
                  class="item"
                  effect="dark"
                  placement="bottom"
                >
                  <div slot="content">
                    提示：<br>
                    备份时间为创建时间
                  </div>
                  <svg-icon
                    icon-class="perfect-icon-question1_btn"
                    style="margin-left: 5px"
                  />
                </el-tooltip>
              </span>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  prop="daterange"
                  label-width="0"
                >
                  <el-date-picker
                    v-model="dataJson.tempJson.daterange"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="handleCalcCount"
                  />
                </el-form-item>
              </el-col>
            </el-row>

          </el-descriptions-item>
          <el-descriptions-item label="监管任务状态">
            <el-form-item>
              <select-dict
                v-model="dataJson.tempJson.status"
                disabled
                :para="CONSTANTS.DICT_B_MONITOR_STATUS"
                init-placeholder="监管状态"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-form-item>
              <select-dict
                v-model="dataJson.tempJson.audit_status"
                disabled
                :para="CONSTANTS.DICT_B_MONITOR_AUDIT_STATUS"
                init-placeholder="审核状态"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="结算状态">
            <el-form-item>
              <select-dict
                v-model="dataJson.tempJson.settlement_status"
                disabled
                :para="CONSTANTS.DICT_B_MONITOR_SETTLEMENT_STATUS"
                init-placeholder="结算状态"
              />
            </el-form-item>
          </el-descriptions-item>

        </el-descriptions>
        <br>
        <el-alert
          title="备份数量"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="1"
          :label-style="fileLabelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="备份数量">
            {{ dataJson.tempJson.count }}
          </el-descriptions-item>

        </el-descriptions>
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
          v-show="settings.btnShowStatus.showInsert"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert"
          @click="doInsert()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.edit-container {
  height: calc(100vh - 160px);
  overflow-x: auto;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.dialog-footer {
  text-align: right;
}
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 350px;
}
.el-button-group {
  margin-bottom: 15px;
}
.el-popup-border-color >>> .el-input__inner {
  border-color: #1890ff;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import { getBackupCountApi } from '@/api/40_business/monitor/monitor'
import constants_type from '@/common/constants/constants_dict'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import SelectDict from '@/components/00_dict/select/SelectDict'

export default {
  components: { SelectDict },
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
      type: Object,
      default: null
    },
    dialogStatus: {
      type: String,
      default: constants_para.STATUS_VIEW
    }
  },
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
      },
      fileLabelStyle: {
        width: '3%',
        'text-align': 'right'
      },
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '5%',
        'text-align': 'right'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          // 时间范围
          daterange: [],
          // 备份数量
          count: 0,
          // 监管任务状态, 默认为 卸货完成, 不可修改
          status: constants_type.DICT_B_MONITOR_STATUS_SEVEN
        },
        // 单条数据 json
        tempJson: {
          // 时间范围
          daterange: [],
          // 备份数量
          count: 0,
          // 监管任务状态, 默认为 卸货完成, 不可修改
          status: constants_type.DICT_B_MONITOR_STATUS_SEVEN,
          audit_status: constants_type.DICT_B_MONITOR_AUDIT_STATUS_2,
          settlement_status: constants_type.DICT_B_MONITOR_SETTLEMENT_STATUS_1
        },
        inputSettings: {
          maxLength: {
          }
        }
      },
      // 页面设置json
      settings: {
        showUpload1: true,
        showUpload2: true,
        // loading 状态
        loading: true,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus,
        // pop的check内容

        rules: {
          daterange: [
            { required: true, message: '请选择时间范围', trigger: 'change' }
          ]
        }
      }
    }
  },
  computed: {
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
    // 描绘完成
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 初始化处理
    init () {
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          break
      }
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(
        this
      ).dataJson.tempJsonOriginal
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(
        this
      ).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(
        this
      ).settings.btnDisabledStatus
    },
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      console.log(this.dataJson.tempJson)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson.daterange',
        (newVal, oldVal) => {
          if (this.dataJson.tempJson.daterange !== null && this.dataJson.tempJson.daterange.length) {
            // this.settings.btnDisabledStatus.disabledInsert = false
          } else if (this.dataJson.tempJson.daterange === null) {
            // this.settings.btnDisabledStatus.disabledInsert = true
            this.dataJson.tempJson.start_time = null
            this.dataJson.tempJson.over_time = null
            // this.$set(this.dataJson.tempJson, 'count', 0)
            // this.dataJson.tempJson.count = deepCopy(0) // 数量置0
          }
        },
        { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },

    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 插入逻辑
    doInsert () {
      const _message = '数据备份后将会删除，请问是否继续操作？'
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // 开始综合验证
        this.$refs['dataSubmitForm'].validate(valid => {
          if (valid) {
            const tempData = deepCopy(this.dataJson.tempJson)
            this.$emit('closeMeOk', tempData)
          }
        })
      }).catch(action => {
      })
    },
    // 更新逻辑
    doUpdate () {
      let _message = '将作废监管任务，请问是否继续操作？'
      if (this.data.out_code != null && this.data.in_code != null) {
        _message = '作废监管任务操作，同时会作废该监管任务下出库单' + this.data.out_code + '、入库单' + this.data.in_code + '，请问是否继续操作？'
      } else if (this.data.out_code != null) {
        _message = '作废监管任务操作，同时会作废该监管任务下出库单' + this.data.out_code + '，请问是否继续操作？'
      } else if (this.data.in_code != null) {
        _message = '作废监管任务操作，同时会作废该监管任务下入库单' + this.data.in_code + '，请问是否继续操作？'
      }
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // 开始综合验证
        this.$refs['dataSubmitForm'].validate(valid => {
          if (valid) {
            const tempData = deepCopy(this.dataJson.tempJson)
            this.$emit('closeMeOk', tempData)
          }
        })
      }).catch(action => {
      })
    },
    handleCalcCount () {
      if (this.dataJson.tempJson.daterange !== null && this.dataJson.tempJson.daterange !== undefined && this.dataJson.tempJson.daterange !== '') {
        this.dataJson.tempJson.start_time = this.dataJson.tempJson.daterange[0]
        this.dataJson.tempJson.over_time = this.dataJson.tempJson.daterange[1]
      }
      // 如果没有选择时间, 不查询数量

      if (this.dataJson.tempJson.start_time !== null && this.dataJson.tempJson.over_time !== null) {
        this.settings.loading = true
        getBackupCountApi(this.dataJson.tempJson).then(response => {
          this.dataJson.tempJson.count = response.data.count
          // 数量为 0 时按钮置灰, 大于 0 时高亮显示
          if (this.dataJson.tempJson.count === 0) {
            this.settings.btnDisabledStatus.disabledInsert = true
          } else {
            this.settings.btnDisabledStatus.disabledInsert = false
          }
        }).finally(() => {
          this.settings.loading = false
        })
      }
    }

  }
}
</script>
