<template>
  <el-dialog
    v-if="listenVisible"
    v-el-drag-dialog
    :title="settings.role_title"
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
            v-model="settings.transfer.role_permissions"
            filterable
            :filter-method="transferFilterMethod"
            filter-placeholder="请输入权限名称"
            :data="settings.transfer.permission_all"
            :titles="['未选择权限', '已选择权限']"
            :button-texts="['权限反选', '选择权限']"
            :render-content="renderTransfer"
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

import { getPermissionTransferListApi, setPermissionTransferApi } from '@/api/20_master/permission/role/permission'
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
          role_id: null,
          // 所有permission
          permission_all: [],
          role_permissions: [],
          old_role_permissions: [],
          current_row: null
        },
        // 弹出框title，角色名称
        role_title: ''
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
    'settings.transfer.staff_positions': {
      handler (newVal, oldVal) {
        const listA = newVal
        const listB = this.settings.transfer.old_role_permissions
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
      this.settings.role_title = '维护角色【' + this.data.name + '】权限'
      // 初始化数据
      this.settings.transfer = {
        role_id: null,
        // 所有permission
        permission_all: [],
        role_permissions: [],
        old_role_permissions: [],
        current_row: this.data
      }
      this.settings.btnShowStatus.showInsert = true
      this.settings.transfer.role_id = this.id
      getPermissionTransferListApi(this.settings.transfer).then(response => {
        this.settings.transfer.permission_all = response.data.permission_all
        this.settings.transfer.role_permissions = response.data.role_permission
        this.settings.transfer.old_role_permissions = deepcopy(response.data.role_permissions)
      }).finally(() => {
        this.settings.loading = false
      })
      this.settings.btnDisabledStatus.disabledReset = true
    },
    // 查看角色权限
    initView () {
      this.settings.role_title = '查看角色【' + this.data.name + '】权限'
      // 初始化数据
      this.settings.transfer = {
        role_id: null,
        // 所有permission
        permission_all: [],
        permission_positions: [],
        old_permission_positions: [],
        current_row: this.data
      }
      this.settings.btnShowStatus.showInsert = true
      this.settings.transfer.role_id = this.id
      getPermissionTransferListApi(this.settings.transfer).then(response => {
        this.settings.transfer.permission_all = response.data.permission_all
        // 添加新的属性
        this.settings.transfer.permission_all.map((item, index) => {
          item.disabled = true
        })
        this.settings.transfer.permission_positions = response.data.permission_position
        this.settings.transfer.permission_positions = deepcopy(response.data.permission_position)
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
    // 插入逻辑：角色权限维护，点击确定按钮
    doInsert () {
      // 设置角色权限
      setPermissionTransferApi(this.settings.transfer).then((_data) => {
        this.settings.loading = true
        this.settings.transfer.current_row.permission_count = _data.data.role_permission_count
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
      })
    },
    // 点击跳转到组织机构页面，并关闭本页面
    handleForward (val) {
      this.$confirm('查看该权限详情，需要关闭当前页面，请注意保存！', '确认信息', {
      }).then(() => {
        // 通知路由，打开组织机构页面
        // this.$router.push({
        //   name: this.PROGRAMS.P_STAFF, params: { name: val }
        // })
        this.$router.push({
          path: '/operation', query: { permissionId: val, canEdit: false }
        })
        this.handleCancel()
      }).catch(action => {
      })
    },
    // 穿梭框增加按钮
    renderTransfer (h, option) {
      return (
        <span>
          {option.label}
          <el-button type='primary' icon='el-icon-edit' plain style='padding:7px 7px; float: right' on-click={() => this.handleForward(option.key)} />
        </span>
      )
    }
  }
}
</script>
