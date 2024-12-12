<template>
  <div>
    <!-- pop窗口 基本信息编辑-->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      title="修改"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1200px"
      destroy-on-close
      top="15vh"
    >
      <el-descriptions
        title=""
        :column="1"
        :content-style="fileContentStyle"
        :label-style="fileLabelStyle"
        direction="horizontal"
        border
        style="padding-right: 10px;padding-left: 10px;"
      >
        <el-descriptions-item label="原数据信息">
          <el-descriptions
            title=""
            :column="3"
            :content-style="contentStyle"
            :label-style="labelStyle"
            direction="horizontal"
            border
            style="padding-right: 10px;padding-left: 10px;"
          >

            <el-descriptions-item label="司机(手机号)">
              {{ dataJson.tempJsonOriginal.driver_name == null?'-':dataJson.tempJsonOriginal.driver_name }} ( {{ dataJson.tempJsonOriginal.driver_mobile_phone }} )
            </el-descriptions-item>

            <el-descriptions-item label="车牌号">
              {{ dataJson.tempJsonOriginal.vehicle_no == null?'-':dataJson.tempJsonOriginal.vehicle_no }}
            </el-descriptions-item>

            <el-descriptions-item label="验车状态">
              <span class="fontCenter">{{ dataJson.tempJsonOriginal.validate_vehicle == true?'验车通过':'验车失败' }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="箱号">
              {{ dataJson.tempJsonOriginal.container_code == null?'-':dataJson.tempJsonOriginal.container_code }}
            </el-descriptions-item>

            <el-descriptions-item />
            <el-descriptions-item />
          </el-descriptions>
        </el-descriptions-item>

        <el-descriptions-item label="维护信息">
          <el-descriptions
            title=""
            :column="3"
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
                司机(手机号)
              </div>
              <input-search
                v-model.trim="driver_info"
                @onInputSearch="handleDriverDialog"
              />
            </el-descriptions-item>

            <el-descriptions-item label="车牌号">
              <div
                slot="label"
                class="required-mark"
              >
                车牌号
              </div>
              <input-search
                v-model.trim="dataJson.tempJson.vehicle_no"
                @onInputSearch="handleVehicleDialog"
              />
            </el-descriptions-item>

            <el-descriptions-item label="验车状态">
              <div
                slot="label"
                class="required-mark"
              >
                验车状态
              </div>
              <el-select
                v-model="dataJson.tempJson.validate_vehicle"
                placeholder="验车状态"
              >
                <el-option
                  v-for="item in dataJson.validateList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>
            </el-descriptions-item>
            <el-descriptions-item label="箱号">
              <el-select
                v-model="dataJson.tempJson.container_code"
                placeholder="箱号"
                @change="selectContainer"
              >
                <el-option
                  v-for="item in dataJson.containerList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id"
                />
              </el-select>
            </el-descriptions-item>
            <el-descriptions-item />
            <el-descriptions-item />

          </el-descriptions>
        </el-descriptions-item>
      </el-descriptions>
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
          :disabled="settings.loading"
          type="primary"
          @click="handleSave()"
        >确定</el-button>
      </div>
      <vehicle-dialog
        v-if="popSettings.four.visible"
        :visible="popSettings.four.visible"
        @closeMeOk="handleVehicleCloseOk"
        @closeMeCancel="handleVehicleCloseCancel"
      />
      <driver-dialog
        v-if="popSettings.five.visible"
        :visible="popSettings.five.visible"
        @closeMeOk="handleDriverCloseOk"
        @closeMeCancel="handleDriverCloseCancel"
      />
      <!-- </el-descriptions> -->
    </el-dialog>
  </div>
</template>

<style scoped>
.el-dialog-div {
  height: 70vh;
  overflow: auto;
}
.edit-container {
  height: calc(100vh - 160px);
  overflow-x: auto;
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
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.font-class-red {
  color: #f00;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import vehicleDialog from '@/views/30_wms/vehicle/dialog/dialog'
import driverDialog from '@/views/30_wms/driver/dialog/dialog'
import { saveValidatVehicleApi } from '@/api/40_business/monitor/monitor'
import { getListApi as getContainerListApi } from '@/api/30_wms/container/container'
import inputSearch from '@/components/40_input/inputSearch'

export default {
  components: { vehicleDialog, driverDialog, inputSearch },
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
      contentStyle: {
        width: '18%'
      },
      labelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      fileLabelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      fileContentStyle: {
        'text-align': 'center',
        width: '90%'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
        },
        // 集装箱号列表
        containerList: [],
        // 验车状态
        validateList: [
          { id: '1', value: '验车通过' },
          { id: '0', value: '验车失败' }
        ],
        // 单条数据 json
        tempJson: {
          validate_vehicle: null
        }
      },
      popSettings: {
        // 弹出编辑页面
        four: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 弹出编辑页面
        five: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
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
          validate_vehicle: [
            { required: true, message: '请选择验车状态', trigger: 'change' }
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
    driver_info () {
      return this.dataJson.tempJson.driver_name + '(' + this.dataJson.tempJson.driver_mobile_phone + ')'
    }
  },
  // 监听器
  watch: {
    'dataJson.tempJson.driver_name': {
      handler (newVal, oldVal) {

      }
    }

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
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
    },
    // 查看时的初始化
    initViewModel () {
      // 查询集装箱
      this.getContainerData()
      // 数据初始化
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      this.dataJson.tempJson = deepCopy(this.data)
    },
    // 设置监听器
    setWatch () {
    },
    unWatch () {
    },

    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 司机
    handleDriverDialog () {
      this.popSettings.five.visible = true
    },
    // 车牌号
    handleVehicleDialog () {
      this.popSettings.four.visible = true
    },
    // 更新验车状态
    handleSave () {
      this.showLoading('正在保存，请稍后...')
      const tempData = deepCopy(this.dataJson.tempJson)
      tempData.validate_vehicle = this.dataJson.tempJson.validate_vehicle
      saveValidatVehicleApi(tempData).then((_data) => {
        this.$notify({
          title: '保存成功',
          message: '保存成功',
          type: 'success',
          duration: this.settings.duration
        })
      }, (_error) => {
        this.$notify({
          title: '保存失败',
          message: '保存失败',
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
        this.$emit('closeMeSuccess')
      })
    },
    // 车牌号：关闭对话框：确定
    handleVehicleCloseOk (val) {
      const tempData = deepCopy(this.dataJson.tempJson)
      tempData.vehicle_no = val.no
      tempData.vehicle_id = val.id
      tempData.vehicle_code = val.code
      this.dataJson.tempJson.vehicle_no = val.no
      this.dataJson.tempJson.vehicle_id = val.id
      this.dataJson.tempJson.vehicle_code = val.code
      this.popSettings.four.visible = false
    },
    // 司机：关闭对话框：确定
    handleDriverCloseOk (val) {
      const tempData = deepCopy(this.dataJson.tempJson)
      tempData.driver_name = val.name
      tempData.driver_id = val.id
      tempData.driver_code = val.code
      this.dataJson.tempJson.driver_name = val.name
      this.dataJson.tempJson.driver_mobile_phone = val.mobile_phone
      this.dataJson.tempJson.driver_id = val.id
      this.dataJson.tempJson.driver_code = val.code
      this.popSettings.five.visible = false
    },
    // 司机：关闭对话框：取消
    handleDriverCloseCancel () {
      this.popSettings.five.visible = false
    },
    // 车牌号：关闭对话框：取消
    handleVehicleCloseCancel () {
      this.popSettings.four.visible = false
    },
    // 更新基础信息
    saveValidatVehicle () {
      this.showLoading('正在保存，请稍后...')
      const tempData = deepCopy(this.dataJson.tempJson)
      tempData.validate_vehicle = this.dataJson.tempJson.validate_vehicle
      saveValidatVehicleApi(tempData).then((_data) => {
        this.$notify({
          title: '保存成功',
          message: '保存成功',
          type: 'success',
          duration: this.settings.duration
        })
      }, (_error) => {
        this.$notify({
          title: '保存失败',
          message: '保存失败',
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
      console.log('----------', this.dataJson.tempJson)
    },
    // 查询集装箱数据
    getContainerData () {
      getContainerListApi().then((response) => {
        this.dataJson.containerList = response.data
      })
    },
    // 选择集装箱号
    selectContainer (val) {
      this.dataJson.tempJson.container_id = val
      var container = this.dataJson.containerList.find((item) => {
        return item.id === val
      })
      this.dataJson.tempJson.container_code = container.code
    }

  }
}
</script>
