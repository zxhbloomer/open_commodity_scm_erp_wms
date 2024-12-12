<template>
  <el-dialog
    v-if="listenVisible"
    v-el-drag-dialog
    :title="settings.title"
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
            v-model="settings.transfer.warehouses"
            filterable
            :filter-method="transferFilterMethod"
            filter-placeholder="请输入仓库名称"
            :data="settings.transfer.warehouse_all"
            :titles="['未选择仓库', '已选择仓库']"
            :button-texts="['仓库反选', '选择仓库']"
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
.el-transfer {
  width: 100%;
}
</style>

<script>

import { getWarehouseTransferListApi, setWarehousesTransferApi } from '@/api/20_master/relation/relation'
import constants_para from '@/common/constants/constants_para'
import deepcopy from 'deep-copy'
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
    name: {
      type: String,
      default: null
    },
    data: {
      type: String,
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
          warehouse_group_id: null,
          // 所有Warehouses
          warehouse_all: [],
          warehouses: [],
          old_warehouses: [],
          current_row: null
        },
        // 弹出框title，仓库名称
        title: ''
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
    'settings.transfer.warehouses': {
      handler (newVal, oldVal) {
        const listA = newVal
        const listB = this.settings.transfer.old_warehouses
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
      this.settings.title = '维护仓库分组【' + this.name + '】成员'
      // 初始化数据
      this.settings.transfer = {
        warehouse_group_id: this.id,
        // 所有Warehouses
        warehouse_all: [],
        warehouses: [],
        old_warehouses: [],
        code: this.data
      }
      this.settings.btnShowStatus.showInsert = true
      getWarehouseTransferListApi({ code: this.data, warehouse_group_id: this.id }).then(response => {
        this.settings.transfer.warehouse_all = response.data.warehouse_all
        this.settings.transfer.warehouses = response.data.warehouses
        this.settings.transfer.old_warehouses = deepcopy(response.data.warehouses)
      }).finally(() => {
        this.settings.loading = false
      })
      this.settings.btnDisabledStatus.disabledReset = true
    },
    // 查看仓库成员
    initView () {
      this.settings.title = '查看仓库【' + this.data.name + '】成员'
      // 初始化数据
      this.settings.transfer = {
        // 所有Warehouses
        warehouse_all: [],
        warehouses: [],
        old_warehouses: [],
        current_row: this.data
      }
      this.settings.btnShowStatus.showInsert = true
      getWarehouseTransferListApi(this.settings.transfer).then(response => {
        this.settings.transfer.warehouse_all = response.data.warehouse_all
        // 添加新的属性
        this.settings.transfer.warehouse_all.map((item, index) => {
          item.disabled = true
        })
        this.settings.transfer.warehouses = response.data.warehouses
        this.settings.transfer.old_warehouses = deepcopy(response.data.warehouses)
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
    // 插入逻辑：仓库成员维护，点击确定按钮
    doInsert () {
      setWarehousesTransferApi(this.settings.transfer).then((_data) => {
        this.settings.loading = true
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
    }
  }
}
</script>
