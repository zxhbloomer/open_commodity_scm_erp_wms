<template>
  <el-dialog
    v-if="listenVisible"
    v-el-drag-dialog
    :title="settings.position_title"
    :visible="visible"
    :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
    :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
    :show-close="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    width="740px"
  >
    <el-form
      ref="dataSubmitForm"
      :model="dataJson.tempJson"
      label-position="rigth"
      label-width="120px"
      status-icon
    >
      <el-row>
        <el-col
          :span="24"
          class="transferCenter"
        >
          <el-transfer
            v-model="settings.transfer.staff_alarm"
            filterable
            :filter-method="transferFilterMethod"
            filter-placeholder="请输入员工姓名"
            :data="settings.transfer.staff_all"
            :titles="['未选择预警组', '已选择预警组']"
            :button-texts="['预警组反选', '选择预警组']"
          />
        </el-col>
      </el-row>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />
      <div class="floatLeft">
        <el-button
          v-show="!isViewModel"
          type="danger"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledReset"
          @click="doReset()"
        >重置</el-button>
      </div>
      <el-button
        plain
        :disabled="settings.loading"
        @click="handleCancel()"
      >取消</el-button>
      <el-button
        v-show="settings.btnShowStatus.showInsert && !isViewModel"
        plain
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
        @click="doInsert()"
      >确定</el-button>
    </div>
  </el-dialog>
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

import { getGroupTransferListApi, setGroupTransferApi } from '@/api/40_business/alarm/alarmsettings'
import constants_para from '@/common/constants/constants_para'
import deepcopy from 'deep-copy'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  // name: '', // 页面id，和router中的name需要一致，作为缓存
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
      type: Object,
      default: null
    },
    model: {
      type: String,
      default: constants_para.MODEL_VIEW
    }
  },
  data () {
    return {
      dataJson: {},
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        duration: 4000,

        // 按钮状态
        btnShowStatus: {
          showInsert: false,
          showUpdate: false,
          showCopyInsert: false
        },
        // 按钮状态：是否可用
        btnDisabledStatus: {
          disabledReset: false,
          disabledInsert: false,
          disabledUpdate: false,
          disabledCopyInsert: false
        },
        // 重置按钮点击后
        btnResetStatus: false,
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: '',
        // 穿梭框
        transfer: {
          group_id: null,
          // 所有staff
          staff_all: [],
          staff_alarm: [],
          old_staff_alarm: [],
          current_row: null
        },
        // 弹出框title，岗位名称
        position_title: ''
      }
    }
  },
  computed: {
    listenVisible () {
      return this.visible
    },
    isViewModel () {
      if (this.model === constants_para.MODEL_VIEW) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {
    // 穿梭框的数据变动，设置重置和确定
    'settings.transfer.staff_alarm': {
      handler (newVal, oldVal) {
        const listA = newVal
        const listB = this.settings.transfer.old_staff_alarm
        // 如果新值，旧值为undefined 则return
        if (listA === undefined || listB === undefined) {
          this.settings.btnDisabledStatus.disabledReset = true
          return
        }
        const result = listA.length === listB.length && listA.every(a => listB.some(b => a === b)) && listB.every(_b => listA.some(_a => _a === _b))
        if (result) {
          // 未改变值
          this.settings.btnDisabledStatus.disabledReset = true
          this.settings.btnDisabledStatus.disabledInsert = true
        } else {
          // 有改变值
          this.settings.btnDisabledStatus.disabledReset = false
          this.settings.btnDisabledStatus.disabledInsert = false
        }
      },
      deep: true
    }
  },
  created () {
    this.init()
  },
  mounted () { },
  methods: {
    init () {
      if (this.isViewModel) {
        this.initView()
      } else {
        this.initEdit()
      }
    },
    // 初始化
    initEdit () {
      this.settings.position_title = '维护预警规则【' + this.data.name + '】成员'
      // 初始化数据
      this.settings.transfer = {
        group_id: null,
        // 所有staff
        staff_all: [],
        staff_alarm: [],
        old_staff_alarm: [],
        current_row: this.data
      }
      this.settings.btnShowStatus.showInsert = true
      this.settings.transfer.alarm_id = this.id
      getGroupTransferListApi(this.settings.transfer).then(response => {
        this.settings.transfer.staff_all = response.data.staff_all
        this.settings.transfer.staff_alarm = response.data.staff_alarm
        this.settings.transfer.old_staff_alarm = deepcopy(response.data.staff_alarm)
      }).finally(() => {
        this.settings.loading = false
      })
      this.settings.btnDisabledStatus.disabledReset = true
    },
    // 查看岗位成员
    initView () {
      this.settings.position_title = '查看岗位【' + this.data.name + '】成员'
      // 初始化数据
      this.settings.transfer = {
        group_id: null,
        // 所有staff
        staff_all: [],
        staff_alarm: [],
        old_staff_alarm: [],
        current_row: this.data
      }
      this.settings.btnShowStatus.showInsert = true
      this.settings.transfer.group_id = this.id
      getGroupTransferListApi(this.settings.transfer).then(response => {
        this.settings.transfer.staff_all = response.data.staff_all
        // 添加新的属性
        this.settings.transfer.staff_all.map((item, index) => {
          item.disabled = true
        })
        this.settings.transfer.staff_posstaff_alarmitions = response.data.staff_alarm
        this.settings.transfer.old_staff_alarm = deepcopy(response.data.staff_alarm)
      }).finally(() => {
        this.settings.loading = false
      })
      this.settings.btnDisabledStatus.disabledReset = true
    },
    // 穿梭框的过滤方法
    transferFilterMethod (query, item) {
      return item.label.indexOf(query) > -1
    },
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 重置按钮
    doReset () {
      this.settings.btnResetStatus = true
      this.init()
    },
    // 插入逻辑：岗位成员维护，点击确定按钮
    doInsert () {
      this.showLoading('正在提交，请稍后...')
      setGroupTransferApi(this.settings.transfer).then((_data) => {
        this.settings.loading = true
        this.settings.transfer.current_row.staff_count = _data.data.staff_alarm_count
        this.$notify({
          title: '更新处理成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.$emit('closeMeOk', _data)
      }, (_error) => {
        this.$notify({
          title: '更新处理失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
      })
    },
    // 点击跳转到组织机构页面，并关闭本页面
    handleForward (val) {
      this.$confirm('查看该员工详情，需要关闭当前页面，请注意保存！', '确认信息', {
      }).then(() => {
        // 通知路由，打开组织机构页面
        this.$router.push({
          name: this.PROGRAMS.P_STAFF, params: { name: val }
        })
        this.handleCancel()
      }).catch(action => {
      })
    }
  }
}
</script>
