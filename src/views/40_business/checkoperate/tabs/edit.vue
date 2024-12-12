<template>
  <div class="app-container">
    <div class="edit-container">
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
        status-icon
      >

        <el-alert
          title="盘点任务单基本信息"
          type="info"
          :closable="false"
        />
        <br>

        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="盘点任务单号">
            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}
          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              货主
            </div>
            <el-form-item
              prop="owner_name"
              label-width="0"
            >
              <el-select
                v-model="dataJson.tempJson.owner_name"
                :placeholder="isPlaceholderShow('请选择货主')"
                :disabled="isViewModel"
                filterable
                clearable
                @change="selectOwner"
              >
                <el-option
                  v-for="item in dataJson.ownerComboList"
                  :key="item.id"
                  :label="item.short_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              仓库
            </div>
            <el-form-item
              prop="warehouse_name"
              label-width="0"
            >
              <select-warehouse
                v-model.trim="dataJson.tempJson.warehouse_name"
                placement="left"
                :warehouse1="dataJson.tempJson.warehouse_id"
                :disabled="isViewModel"
                @closeParentDialog="handleWarehouseDialog"
                @onReturnData="handleWarehouseReturnData"
              />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <div slot="label">
              备注
            </div>
            <el-form-item
              prop="remark"
              label-width="0"
            >
              {{ dataJson.tempJson.remark }}
            </el-form-item>
          </el-descriptions-item>

        </el-descriptions>

        <br>
        <el-alert
          title="盘点任务明细"
          type="info"
          :closable="false"
        />
        <br>
        <el-table
          ref="multipleTable"
          v-loading="settings.loading"
          :data="dataJson.detailListData"
          :element-loading-text="'正在拼命加载中...'"
          element-loading-background="rgba(255, 255, 255, 0.5)"
          :height="settings.tableHeight"
          stripe
          border
          fit
          highlight-current-row
          :default-sort="{prop: 'u_time', order: 'descending'}"
          style="width: 100%"
          @cell-click="cellClick"
          @row-click="handleRowClick"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            type="index"
            width="45"
            label="No"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="sku_code"
            label="物料编码"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="goods_name"
            label="物料名称"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="sku_name"
            label="规格"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="130"
            prop="pm"
            label="品名"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="unit"
            label="单位"
          />
          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="qty"
            label="库存数量"
          />
          <el-table-column
            label="盘点重量"
            class-name="column-bg-color-editable"
            min-width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.seen"
                ref="scope.$index"
                v-model="scope.row.qty_check"
                @blur="loseFcous(scope.$index, scope.row)"
              />
              <span
                v-else
                style="margin-left: 10px"
              >{{ scope.row.qty_check }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            min-width="150"
            prop="qty_diff"
            label="盘盈盘亏"
          />
        </el-table>
      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />
      <el-button
        v-show="settings.btnShowStatus.showUpdate"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert"
        size="medium"
        @click="doUpdate()"
      >保存</el-button>
      <el-button
        :disabled="settings.loading"
        size="medium"
        @click="handleCancel()"
      >返回</el-button>
    </div>

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
  text-align: center;
}
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
.el-button-group {
  margin-bottom: 15px;
}
.el-popup-border-color >>> .el-input__inner {
  border-color: #1890ff;
}
.tb-edit .input-box {
  display: none;
}
.tb-edit .current-cell .input-box {
  display: block;
  margin-left: -15px;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getDetailInfo, updateApi } from '@/api/40_business/checkoperate/checkoperate'
import mixin from './mixin/editResizeHandlerMixin'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import SelectWarehouse from '@/views/30_wms/warehouse/selectgrid/selectWarehouseLocationBin'

export default {
  components: { SelectWarehouse },
  directives: { elDragDialog },
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    },
    editStatus: {
      type: String,
      default: constants_para.STATUS_INSERT
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      id: '',
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        // 弹出的查询框参数设置
        searchDialogDataOne: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataTwo: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的查询框参数设置
        searchDialogDataThree: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataFour: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataFive: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataSix: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的行业查询框参数设置
        searchDialogDataSeven: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }

        },

        // 弹出的商品查询框参数设置
        goodsDialog: {
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
        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          plan_code: '',
          contract_no: '',
          owner_name: '',
          type: '',
          plan_time: ''
        },
        // 单条数据 json
        tempJson: {
        },
        inputSettings: {
          maxLength: {
            contract_num: 20,
            ship_name: 20,
            contract_no: 20,
            primary_quantity: 10,
            car_count: 20,
            actual_count: 20,
            price: 10
          }
        },
        detailListData: []
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        topBtnShowStatus: {
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
        rulesOne: {
        },
        rules: {
        }
      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (
        this.editStatus === this.PARAMETERS.STATUS_INSERT ||
        this.editStatus === this.PARAMETERS.STATUS_COPY_INSERT
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
      if (this.editStatus === this.PARAMETERS.STATUS_VIEW) {
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
    // 选择货主
    this.getOwnerData()
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
      this.settings.rules = this.settings.rulesOne
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.editStatus) {
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
      this.dataJson.tempJson.unit = '吨'
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
      // 控件focus
      this.$nextTick(() => {
        // this.$refs['refFocusOne'].focus()
      })

      // 初始化watch
      this.setWatch()
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
      this.dataJson.tempJson.warehouse_id = this.data.warehouse_id
      this.getData()
      // this.dataJson.tempJson = deepCopy(this.data)
      // this.dataJson.tempJsonOriginal = deepCopy(this.data)

      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        // this.$refs['refFocusOne'].focus()
      })
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      // this.dataJson.tempJson = deepCopy(this.data)
      // this.dataJson.detailListData = this.data.detailVo
      this.getData()
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.tempJson', (newVal, oldVal) => {
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

    // 返回按钮
    handleCancel () {
      // this.$emit('closeMeCancel')
      // this.$router.go(-1)
      this.$emit('emitReturn')
    },
    // 编辑逻辑
    doUpdate () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.detailList = this.dataJson.detailListData
          this.settings.loading = true
          updateApi(tempData)
            .then(
              _data => {
                // this.$emit('closeMeOk', { return_flag: true, data: _data })
                this.$notify({
                  title: '操作成功',
                  message: _data.data.message,
                  type: 'success',
                  duration: this.settings.duration
                })

                this.$emit('emitReturn')
              },
              _error => {
                // this.$emit('closeMeOk', { return_flag: false, error: _error })
                this.$notify({
                  title: '操作失败',
                  message: _error.error.message,
                  type: 'error',
                  duration: this.settings.duration
                })
              }
            )
            .finally(() => {
              this.$emit('emitReturn')
            })
        }
      })
    },
    handleTabsClick (tab, event) { },
    // 开始综合验证
    doValidateByTabs () {
      // 第一个tabs
      this.settings.rules = this.settings.rulesOne
      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
      // 所有的数据进行验证
      this.doValidateAllRules()
    },
    // 所有的数据开始validate
    doValidateAllRules () {
      if (this.isLoginEnabled) {
        this.settings.rules = { ...this.settings.rulesOne, ...this.settings.rulesTwo }
      } else {
        this.settings.rules = { ...this.settings.rulesOne }
      }

      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
    },
    handleRowClick (row) {
      this.popSettingsData.goodsDialog.rowIndex = this.getRowIndex(row)
    },
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.detailListData.lastIndexOf(row)
      return _index
    },
    handleCurrentChange (row) {
      this.dataJson.currentJson = Object.assign({}, row) // copy obj
      this.dataJson.currentJson.index = this.getRowIndex(row)

      if (this.dataJson.currentJson !== undefined) {
        this.settings.topBtnShowStatus.showUpdate = true
      } else {
        this.settings.topBtnShowStatus.showUpdate = false
      }
    },
    // 仓库
    handleWarehouseDialog () {
      this.popSettingsData.searchDialogDataFour.visible = true
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getDetailInfo(this.data).then(response => {
        this.dataJson.tempJson = response.data
        this.dataJson.detailListData = response.data.detailList
      }).finally(() => {
        this.settings.loading = false
      })
    },
    loseFcous (index, row) {
      this.dataJson.tempJson.detailList = this.dataJson.detailListData
      this.settings.btnDisabledStatus.disabledInsert = false
      this.settings.btnDisabledStatus.disabledUpdate = false
      row.seen = false
      row.qty_diff = row.qty_check - row.qty
    },
    cellClick (row, column) {
      row.seen = true
    },
    // 选择货主
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
        // 新增时默认选中第一条
        if (this.editStatus === constants_para.STATUS_INSERT) {
          this.dataJson.tempJson.owner_name = _data.data[0].short_name
          this.dataJson.tempJson.owner_id = _data.data[0].id
          this.dataJson.tempJson.owner_code = _data.data[0].code
        }
      }, (_error) => {
      })
    },
    selectOwner (val) {
      this.dataJson.tempJson.owner_id = val
      var owner = this.dataJson.ownerComboList.find((item) => {
        return item.id === val
      })
      this.dataJson.tempJson.owner_code = owner.code
      this.dataJson.tempJson.owner_name = owner.name
    },
    // 选择仓库
    handleWarehouseReturnData (val) {
      if (val.enable === false) {
        this.showErrorMsg('该仓库已禁用，请重新选择')
        return
      }
      this.popSettingsData.searchDialogDataFour.selectedDataJson = val
      this.popSettingsData.searchDialogDataFour.visible = false
      this.dataJson.tempJson.warehouse_name = val.warehouse_name
      this.dataJson.tempJson.warehouse_id = val.warehouse_id
      this.dataJson.tempJson.warehouse_code = val.warehouse_code
    }

  }

}
</script>
