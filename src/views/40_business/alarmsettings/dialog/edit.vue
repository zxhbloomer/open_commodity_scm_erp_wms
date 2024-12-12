<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改 -->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :title="PARAMETERS.STATUS_TEXT_MAP[dialogStatus]"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="850px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
        status-icon
      >
        <br>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="规则名称: "
              prop="name"
            >
              <el-input v-model.trim="dataJson.tempJson.name" />
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item
              prop="type"
              label="预警类型: "
            >
              <select-dict
                v-model="dataJson.tempJson.type"
                :para="CONSTANTS.DICT_B_ALARM_RULES_TYPE"
                init-placeholder="请选择预警类型"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="11">
            <el-form-item
              label="预警人员: "
              prop="staff_name"
            >
              <input-search
                v-model.trim="dataJson.tempJson.staff_name"
                :disabled="isViewModel"
                @onInputSearch="handleStaff"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="2" />

        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="预警规则: "
              prop="rule_type"
            >
              <select-dict
                v-model="dataJson.tempJson.rule_type"
                :para="CONSTANTS.DICT_B_ALARM_SETTINGS_RULES"
                init-placeholder="请选择预警类型"
                :disabled="isViewModel"
                @change="handleChangeRuleType"
              />
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item
              prop="job_name"
              label="定时任务: "
            >
              <input-search
                v-model.trim="dataJson.tempJson.job_name"
                :disabled="!isJobModel"
                @onInputSearch="handleJob"
              />
              <el-input
                v-if="!isJobModel"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="2" />
        </el-row>

        <el-row>

          <el-col :span="11">
            <el-form-item
              prop="notice_type"
              label="通知方式: "
            >
              <select-dict
                v-model="dataJson.tempJson.notice_type"
                :para="CONSTANTS.DICT_B_ALARM_NOTICE_TYPE"
                init-placeholder="预警通知方式"
                :disabled="isViewModel"
              />
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item
              label="时间间隔(分钟): "
              prop="notice_time"
            >
              <numeric
                v-model="dataJson.tempJson.notice_time"
                :currency-symbol="''"
                :decimal-places="0"
              />
            </el-form-item>
          </el-col>

          <el-col :span="2" />
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
          v-show="settings.btnShowStatus.showInsert"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
          @click="doInsert()"
        >确定</el-button>
        <el-button
          v-show="settings.btnShowStatus.showUpdate && !isViewModel"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
          @click="doUpdate()"
        >确定</el-button>
      </div>
    </el-dialog>

    <Job
      v-if="popSettingsData.searchDialogDataOne.visible"
      :visible="popSettingsData.searchDialogDataOne.visible"
      @closeMeOk="handleJobCloseOk"
      @closeMeCancel="handleJobCloseCancel"
    />

    <staff-dialog
      v-if="popSettingsData.searchDialogDataTwo.visible"
      :visible="popSettingsData.searchDialogDataTwo.visible"
      @closeMeOk="handleStaffCloseOk"
      @closeMeCancel="handleStaffCancel"
    />
  </div>

</template>

<style scoped>
.el-form-item .el-select {
  width: 100%;
}
</style>
<style >
</style>

<script>
import SelectDict from '@/components/00_dict/select/SelectDict'
import InputSearch from '@/components/40_input/inputSearch'
import constants_para from '@/common/constants/constants_para'
// import GroupDialog from '@/views/40_business/alarmgroup/dialog/dialog'
import StaffDialog from '@/views/40_business/alarmstaff/dialog/staff/dialog/dialog'
import elDragDialog from '@/directive/el-drag-dialog'
import Job from '@/views/10_system/schedule/dialog/listdialog'
import deepCopy from 'deep-copy'
import numeric from '@/components/40_input/numeric'
import { updateApi, insertApi } from '@/api/40_business/alarm/alarmsettings'

export default {
  components: { InputSearch, StaffDialog, SelectDict, numeric, Job },
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
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        // 预警组弹出框
        searchDialogDataOne: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 预警人员弹出框
        searchDialogDataTwo: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        }
      },
      dataJson: {
        searchForm: {
          pageCondition: {}
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          config_key: '',
          value: '',
          descr: ''
        },
        // 单条数据 json
        tempJson: {
          business_name: ''
        },
        inputSettings: {
          maxLength: {
            name: 50,
            code: 20,
            short_name: 20
          }
        }
      },
      // 页面设置json
      settings: {
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
          name: [
            { required: true, message: '请输入名称', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择预警类型', trigger: 'change' }
          ],
          rule_type: [
            { required: true, message: '请选择预警规则', trigger: 'change' }
          ],
          notice_type: [
            { required: true, message: '请选择通知方式', trigger: 'change' }
          ]
        }
      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (
        this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT ||
        this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT
      ) {
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
    },
    // 定时任务是否可选
    isJobModel () {
      if (this.dataJson.tempJson.rule_type === '2') {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {},
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
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
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
        'dataJson.tempJson', (newVal, oldVal) => {
          this.settings.btnDisabledStatus.disabledInsert = false
          this.settings.btnDisabledStatus.disabledUpdate = false
        }, { deep: true }
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
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          insertApi(tempData)
            .then(
              _data => {
                this.$emit('closeMeOk', { return_flag: true, data: _data })
              },
              _error => {
                this.$emit('closeMeOk', { return_flag: false, error: _error })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData)
            .then(
              _data => {
                this.dataJson.tempJson = deepCopy(_data.data)
                this.$emit('closeMeOk', { return_flag: true, data: _data })
              },
              _error => {
                this.$emit('closeMeOk', { return_flag: false, error: _error })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    // 打开预警组弹窗
    handleGroup () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    // 预警组, 关闭对话框: 确定
    handleJobCloseOk (val) {
      this.handleJobCloseCancel()
      this.dataJson.tempJson.job_id = val.id
      this.dataJson.tempJson.job_name = val.job_name
    },
    // 预警组, 关闭对话框: 取消
    handleJobCloseCancel () {
      this.popSettingsData.searchDialogDataOne.visible = false
    },
    // 选择预警人员
    handleJob () {
      this.popSettingsData.searchDialogDataOne.visible = true
    },
    // 预警组, 关闭对话框: 确定
    handleStaffCloseOk (val) {
      console.log(val)
      this.handleStaffCancel()
      this.dataJson.tempJson.staff_id = val.id
      this.dataJson.tempJson.login_name = val.login_name
      this.dataJson.tempJson.staff_name = val.name
      this.settings.btnDisabledStatus.disabledUpdate = false
      this.settings.btnDisabledStatus.disabledInsert = false
    },
    // 预警组, 关闭对话框: 取消
    handleStaffCancel () {
      this.popSettingsData.searchDialogDataTwo.visible = false
    },
    handleChangeRuleType () {
      this.dataJson.tempJson.job_name = null
      this.dataJson.tempJson.job_id = null
    }
  }
}
</script>
