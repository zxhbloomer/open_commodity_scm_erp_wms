<template>
  <div class="app-container">
    <div class="edit-container">
      <el-form
        ref="dataSubmitForm"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
        status-icon
      >

        <el-alert
          title="基本信息"
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
          <el-descriptions-item label="操作用户">
            {{ dataJson.tempJson.user_name }} - {{ dataJson.tempJson.staff_name }}
          </el-descriptions-item>
          <el-descriptions-item label="页面-操作说明">
            {{ dataJson.tempJson.page_name }} - {{ dataJson.tempJson.operation }}
          </el-descriptions-item>
          <el-descriptions-item label="操作时间">
            {{ formatDateTime(dataJson.tempJson.operate_time) }}
          </el-descriptions-item>

        </el-descriptions>

        <br>
        <el-alert
          title="变更记录"
          type="info"
          :closable="false"
        />
        <br>
        <div style="padding-right: 10px;padding-left: 10px; ">
          <el-table
            ref="multipleTable"
            v-loading="settings.loading"
            :data="dataJson.detailListData"
            :element-loading-text="'正在拼命加载中...'"
            element-loading-background="rgba(255, 255, 255, 0.5)"
            :height="settings.tableHeight"
            stripe
            border
            highlight-current-row
            style="width: 100%"
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
              min-width="50"
              prop="type"
              label="类型"
            />
            <el-table-column
              show-overflow-tooltip
              min-width="130"
              prop="order_code"
              label="业务单号"
            />
            <el-table-column
              show-overflow-tooltip
              min-width="130"
              prop="name"
              label="表名"
            >
              <template v-slot="scope">
                {{ scope.row.name }} - {{ scope.row.table_name }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              min-width="130"
              prop="name"
              label="字段名"
            >
              <template v-slot="scope">
                {{ scope.row.clm_label }} - {{ scope.row.clm_name }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              min-width="80"
              prop="u_name"
              label="修改人"
            />
            <el-table-column
              show-overflow-tooltip
              min-width="130"
              fixed="right"
              prop="old_value"
              label="修改前"
            >
              <template v-slot="scope">
                {{ scope.row.old_value === null || scope.row.old_value === '' ? '-' : scope.row.old_value }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              min-width="130"
              fixed="right"
              prop="new_value"
              label="修改后"
            />
          </el-table>
        </div>

      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />

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
.slotColor
/deep/.el-input-group__append, .el-input-group__prepend {
  background-color: #f5f7fa;
  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 20px;
  width: 1px;
  white-space: nowrap;
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
import { getApi } from '@/api/30_wms/datachangelogoperation/datachangelogoperation'
import mixin from './mixin/editResizeHandlerMixin'
import constants_program from '@/common/constants/constants_program'

export default {
  components: { },
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
      constants_program: constants_program,
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
        // 来源数据
        // app_data_list: null,
        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          plan_code: '',
          consignor_name: '',
          contract_no: '',
          owner_name: '',
          type: '',
          plan_time: '',
          over_inventory_upper: 0
        },
        // 单条数据 json
        tempJson: null,
        inputSettings: {
          maxLength: {
            contract_num: 20,
            ship_name: 20,
            contract_no: 20,
            price: 10,
            waybill_code: 30,
            remark: 100
          }
        },
        detailListData: []
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        // 是否开启超收配置
        over_receive: false,
        tableHeight: 650,
        duration: 4000,
        // 按钮状态：是否可用，false:可用，true不可用
        btnTableDisabledStatus: {
          disabledInsert: false,
          disabledUpdate: false,
          disabledDelete: false
        },
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

        // 错误数目
        badge: {
          countOne: 0,
          countTwo: 0
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
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 初始化处理
    async init () {
      this.settings.loading = false
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.editStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          // await this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          // await this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_VIEW:
          await this.initViewModel()
          break
      }

      // 初始化watch
      this.setWatch()
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(this).dataJson.tempJsonOriginal
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(this).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(this).settings.btnDisabledStatus
    },

    // 查看时的初始化
    async initViewModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.detailListData = this.data.detailVo
      await this.getData()
      // 初始化来源
      // await getListApi({}).then(response => {
      //   this.dataJson.app_data_list = response.data
      // }).finally(() => {
      // })
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

      const operate_tab_data = {
        data: this.data
      }

      // if (history.state.pushState) {
      //   // 如果是列表页面过来的，可以直接返回
      //   window.history.go(-1)
      // } else {
      //   // 如果是直接打开的，返回查询页面
      //   // 全部
      //   this.$router.push({ name: constants_program.P_IN_PLAN })
      // }
      this.$router.push({
        query: {}
      })

      this.$emit('emitReturn', operate_tab_data)
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
      this.settings.btnTableDisabledStatus.disabledInsert = false
      this.settings.btnTableDisabledStatus.disabledUpdate = false
      this.settings.btnTableDisabledStatus.disabledDelete = false
    },
    async getData () {
      // 查询逻辑
      this.settings.loading = true
      await getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        this.dataJson.tempJson.over_inventory_upper = this.dataJson.tempJson.over_inventory_upper * 100
        this.dataJson.tempJsonOriginal = deepCopy(response.data)
        this.dataJson.detailListData = this.dataJson.tempJson.dataChangeMongoVoList

        if (this.dataJson.tempJson.detailList !== null && this.dataJson.tempJson.detailList !== undefined && this.dataJson.tempJson.detailList.length) {
          this.dataJson.tempJson.sku_price = this.dataJson.tempJson.detailList[0].contract_price
        }

        this.popSettingsData.searchDialogDataOne.selectedDataJson.id = this.dataJson.tempJson.consignor_id
        this.popSettingsData.searchDialogDataTwo.selectedDataJson.id = this.dataJson.tempJson.owner_id
        this.popSettingsData.searchDialogDataThree.selectedDataJson.id = this.dataJson.tempJson.order_id
      }).finally(() => {
        this.settings.loading = false
      })
    }

  }

}
</script>
