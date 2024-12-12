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
      width="1300px"
      destroy-on-close
      top="5vh"
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="0px"
        status-icon
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

            <el-row v-if="dataJson.tempJsonOriginal.monitorOutVo.is_container && dataJson.tempJsonOriginal.monitorOutVo.containerInfos && dataJson.tempJsonOriginal.monitorOutVo.containerInfos.length>0">

              <el-alert
                v-if="dataJson.tempJson.monitorOutVo.is_container && dataJson.tempJson.monitorOutVo.containerInfos && dataJson.tempJson.monitorOutVo.containerInfos.length>0"
                :title="'集装箱信息'"
                type="info"
                :closable="false"
              />
              <br v-if="dataJson.tempJson.monitorOutVo.containerInfos && dataJson.tempJson.monitorOutVo.containerInfos.length>0">
              <el-descriptions
                v-for="(item, i) in dataJson.tempJsonOriginal.monitorOutVo.containerInfos"
                :key="i"
                title=""
                :column="3"
                :content-style="contentStyle"
                :label-style="labelStyle"
                direction="horizontal"
                border
                style="padding-right: 10px;padding-left: 10px;"
              >

                <el-descriptions-item label="集装箱号">

                  {{ item.code }}
                </el-descriptions-item>
                <el-descriptions-item
                  v-if="i===0"
                  label="铁运/海运运单号"
                >
                  {{ item.waybill_code }}
                </el-descriptions-item>
                <el-descriptions-item v-if="i!==0" />
                <el-descriptions-item />
                <el-descriptions-item label="毛重（吨）">
                  {{ item.gross_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="皮重（吨）">
                  {{ item.tare_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="净重（吨）">
                  {{ item.net_weight }}
                </el-descriptions-item>

              </el-descriptions>

            </el-row>
            <br>
            <el-alert
              :title="'出库信息'"
              type="info"
              :closable="false"
            />
            <br>
            <el-row v-if="dataJson.tempJsonOriginal.monitorOutVo">
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
                  <div slot="label">
                    毛重（吨）
                  </div>
                  <el-form-item label-width="0">

                    {{ dataJson.tempJsonOriginal.gross_weight }}
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <div slot="label">
                    皮重（吨）
                  </div>
                  <el-form-item label-width="0">

                    {{ dataJson.tempJsonOriginal.tare_weight }}
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <div slot="label">
                    净重（吨）
                  </div>
                  <el-form-item label-width="0">

                    {{ dataJson.tempJsonOriginal.net_weight }}
                  </el-form-item>
                </el-descriptions-item>
              </el-descriptions>
            </el-row>

          </el-descriptions-item>
          <el-descriptions-item label="维护信息">
            <el-alert
              v-if="dataJson.tempJsonOriginal.monitorOutVo.is_container && dataJson.tempJson.monitorOutVo.containerInfos && dataJson.tempJson.monitorOutVo.containerInfos.length>0"
              :title="'集装箱信息'"
              type="info"
              :closable="false"
            />
            <br v-if="dataJson.tempJson.monitorOutVo.is_container && dataJson.tempJson.monitorOutVo.containerInfos && dataJson.tempJson.monitorOutVo.containerInfos.length>0">
            <el-row v-if="dataJson.tempJson.monitorOutVo.is_container && dataJson.tempJson.monitorOutVo.containerInfos && dataJson.tempJson.monitorOutVo.containerInfos.length>0">

              <el-descriptions
                v-for="(item, i) in dataJson.tempJson.monitorOutVo.containerInfos"
                :key="i"
                title=""
                :column="3"
                :content-style="contentStyle"
                :label-style="labelStyle"
                direction="horizontal"
                border
                style="padding-right: 10px;padding-left: 10px;"
              >

                <el-descriptions-item label="集装箱号">
                  {{ item.code }}
                </el-descriptions-item>
                <el-descriptions-item
                  v-if="i===0"
                  label="铁运/海运运单号"
                >
                  {{ item.waybill_code }}
                </el-descriptions-item>
                <el-descriptions-item v-if="i!==0" />
                <el-descriptions-item />
                <el-descriptions-item label="毛重（吨）">
                  <el-form-item
                    :prop="'container_gross_weight_'+i"
                    label-width="0"
                  >
                    <numeric
                      v-model="item.gross_weight"
                      :decimal-places="3"
                      :currency-symbol="''"
                    />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="皮重（吨）">
                  <el-form-item
                    :prop="'container_tare_weight_'+i"
                    label-width="0"
                  >
                    <numeric
                      v-model="item.tare_weight"
                      :decimal-places="3"
                      :currency-symbol="''"
                    />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item label="净重（吨）">
                  <el-form-item
                    :prop="'container_net_weight_'+i"
                    label-width="0"
                  >
                    <numeric
                      v-model="item.net_weight"
                      :decimal-places="3"
                      :currency-symbol="''"
                    />
                  </el-form-item>
                </el-descriptions-item>

              </el-descriptions>
            </el-row>
            <br>
            <el-alert
              :title="'出库信息'"
              type="info"
              :closable="false"
            />
            <br>
            <el-row v-if="dataJson.tempJson.monitorOutVo">
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
                    毛重（吨）
                  </div>
                  <el-form-item
                    prop="gross_weight"
                    label-width="0"
                  >
                    <numeric
                      v-model="dataJson.tempJson.gross_weight"
                      :disabled="dataJson.tempJson.monitorOutVo.is_container"
                      :decimal-places="3"
                      :currency-symbol="''"
                    />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <div
                    slot="label"
                    class="required-mark"
                  >
                    皮重（吨）
                  </div>
                  <el-form-item
                    prop="tare_weight"
                    label-width="0"
                  >
                    <numeric
                      v-model="dataJson.tempJson.tare_weight"
                      :disabled="dataJson.tempJson.monitorOutVo.is_container"
                      :decimal-places="3"
                      :currency-symbol="''"
                    />
                  </el-form-item>
                </el-descriptions-item>
                <el-descriptions-item>
                  <div
                    slot="label"
                    class="required-mark"
                  >
                    净重（吨）
                  </div>
                  <el-form-item
                    prop="net_weight"
                    label-width="0"
                  >
                    <numeric
                      v-model="dataJson.tempJson.net_weight"
                      disabled
                      :decimal-places="3"
                      :currency-symbol="''"
                    />
                  </el-form-item>
                </el-descriptions-item>
              </el-descriptions>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
        <br>
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
          @click="doUpdate()"
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
import numeric from '@/components/40_input/numeric'
import { saveOutApi } from '@/api/40_business/monitor/monitor'

export default {
  components: { numeric },
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
        width: '15%'
      },
      labelStyle: {
        width: '13%',
        'text-align': 'right'
      },
      fileLabelStyle: {
        width: '2%',
        'text-align': 'right'
      },
      fileContentStyle: {
        'text-align': 'center',
        width: '20%'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        license_frontVo: [],
        license_front: [],

        license_backVo: [],
        license_back: [],

        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          gross_weight: undefined,
          tare_weight: undefined,
          net_weight: undefined
        },
        // 单条数据 json
        tempJson: {
          gross_weight: undefined,
          tare_weight: undefined,
          net_weight: undefined
        },
        inputSettings: {
          maxLength: {
          }
        }
      },
      // 页面设置json
      settings: {
        showDelete: false,
        showUpdate: true,
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
          gross_weight: [
            { validator: this.gross_weight_validator, trigger: 'change' }
          ],
          tare_weight: [
            { validator: this.tare_weight_validator, trigger: 'change' }
          ],
          net_weight: [
            { validator: this.net_weight_validator, trigger: 'change' }
          ],
          container_gross_weight_0: [
            { validator: this.container_gross_weight_0_validator, trigger: 'change' }
          ],
          container_gross_weight_1: [
            { validator: this.container_gross_weight_1_validator, trigger: 'change' }
          ],
          container_tare_weight_0: [
            { validator: this.container_tare_weight_0_validator, trigger: 'change' }
          ],
          container_tare_weight_1: [
            { validator: this.container_tare_weight_1_validator, trigger: 'change' }
          ],
          container_net_weight_0: [
            { validator: this.container_net_weight_0_validator, trigger: 'change' }
          ],
          container_net_weight_1: [
            { validator: this.container_net_weight_1_validator, trigger: 'change' }
          ]
        },
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
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
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
      this.data.gross_weight = this.data.monitorOutVo.gross_weight
      this.data.tare_weight = this.data.monitorOutVo.tare_weight
      this.data.net_weight = this.data.monitorOutVo.net_weight

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
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson',
        (newVal, oldVal) => {
          this.settings.btnDisabledStatus.disabledInsert = false
          this.settings.btnDisabledStatus.disabledUpdate = false

          if (this.dataJson.tempJson.monitorOutVo.is_container && this.dataJson.tempJson.monitorOutVo.containerInfos != null && this.dataJson.tempJson.monitorOutVo.containerInfos.length > 0) {
            var net_weight = 0
            var gross_weight = 0
            var tare_weight = 0
            this.dataJson.tempJson.monitorOutVo.containerInfos.forEach(item => {
              net_weight += item.net_weight
              gross_weight += item.gross_weight
              tare_weight += item.tare_weight
            })
            this.dataJson.tempJson.monitorOutVo.net_weight = net_weight
            this.dataJson.tempJson.monitorOutVo.gross_weight = gross_weight
            this.dataJson.tempJson.monitorOutVo.tare_weight = tare_weight
            this.dataJson.tempJson.monitorOutVo.qty = net_weight

            this.dataJson.tempJson.gross_weight = gross_weight
            this.dataJson.tempJson.tare_weight = tare_weight
            this.dataJson.tempJson.net_weight = net_weight
          }

          this.dataJson.tempJson.net_weight = this.dataJson.tempJson.gross_weight - this.dataJson.tempJson.tare_weight

          this.dataJson.tempJson.monitorOutVo.gross_weight = this.dataJson.tempJson.gross_weight
          this.dataJson.tempJson.monitorOutVo.tare_weight = this.dataJson.tempJson.tare_weight
          this.dataJson.tempJson.monitorOutVo.net_weight = this.dataJson.tempJson.net_weight
          this.dataJson.tempJson.monitorOutVo.qty = this.dataJson.tempJson.net_weight
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
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          console.log(tempData)
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      // 开始综合验证

      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.showLoading('正在保存，请稍后...')
          saveOutApi(tempData)
            .then(
              _data => {
                this.$notify({
                  title: '保存成功',
                  message: '保存成功',
                  type: 'success',
                  duration: this.settings.duration
                })
                this.$emit('closeMeOk')
              },
              _error => {
                this.$notify({
                  title: '保存失败',
                  message: '保存失败',
                  type: 'error',
                  duration: this.settings.duration
                })
                this.$emit('emitReturn')
              }
            )
            .finally(() => {
              this.closeLoading()
            })
        }
      })
    },

    gross_weight_validator (rule, value, callback) {
      if (this.dataJson.tempJson.gross_weight <= 0) {
        if (this.dataJson.tempJson.monitorOutVo.is_container && this.dataJson.tempJson.monitorOutVo.containerInfos && this.dataJson.tempJson.monitorOutVo.containerInfos.length > 0) {
          callback(new Error('集装箱毛重和需要大于零'))
        } else {
          callback(new Error('请输入大于零的数值'))
        }
      } else if (this.dataJson.tempJson.gross_weight <= this.dataJson.tempJson.tare_weight) {
        callback(new Error('毛重需要大于皮重'))
      } else {
        callback()
      }
    },
    tare_weight_validator (rule, value, callback) {
      if (this.dataJson.tempJson.tare_weight <= 0) {
        if (this.dataJson.tempJson.monitorOutVo.is_container && this.dataJson.tempJson.monitorOutVo.containerInfos && this.dataJson.tempJson.monitorOutVo.containerInfos.length > 0) {
          callback(new Error('集装箱皮重和需要大于零'))
        } else {
          callback(new Error('请输入大于零的数值'))
        }
      } else if (this.dataJson.tempJson.gross_weight <= this.dataJson.tempJson.tare_weight) {
        callback(new Error('毛重需要大于皮重'))
      } else {
        callback()
      }
    },
    net_weight_validator (rule, value, callback) {
      // if (this.dataJson.tempJson.net_weight <= 0) {
      //   if (this.dataJson.tempJson.monitorOutVo.is_container && this.dataJson.tempJson.monitorOutVo.containerInfos && this.dataJson.tempJson.monitorOutVo.containerInfos.length > 0) {
      //     callback(new Error('集装箱净重和需要大于零'))
      //   } else {
      //     callback(new Error('请输入大于零的数值'))
      //   }
      // } else {
      callback()
      // }
    },

    // 集装箱毛重验证0
    container_gross_weight_0_validator (rule, value, callback) {
      if (this.dataJson.tempJson.monitorOutVo.containerInfos[0].gross_weight <= 0) {
        callback(new Error('请输入大于零的数值'))
      } else {
        callback()
      }
    },
    // 集装箱毛重验证1
    container_gross_weight_1_validator (rule, value, callback) {
      if (this.dataJson.tempJson.monitorOutVo.containerInfos[1].gross_weight < 0) {
        callback(new Error('不能输入负数'))
      } else {
        callback()
      }
    },

    // 集装箱皮重验证0
    container_tare_weight_0_validator (rule, value, callback) {
      if (this.dataJson.tempJson.monitorOutVo.containerInfos[0].tare_weight <= 0) {
        callback(new Error('请输入大于零的数值'))
      } else {
        callback()
      }
    },
    // 集装箱皮重验证1
    container_tare_weight_1_validator (rule, value, callback) {
      if (this.dataJson.tempJson.monitorOutVo.containerInfos[1].tare_weight < 0) {
        callback(new Error('不能输入负数'))
      } else {
        callback()
      }
    },

    // 集装箱净重验证0
    container_net_weight_0_validator (rule, value, callback) {
      if (this.dataJson.tempJson.monitorOutVo.containerInfos[0].net_weight <= 0) {
        callback(new Error('请输入大于零的数值'))
      } else {
        callback()
      }
    },
    // 集装箱净重验证1
    container_net_weight_1_validator (rule, value, callback) {
      if (this.dataJson.tempJson.monitorOutVo.containerInfos[1].net_weight < 0) {
        callback(new Error('不能输入负数'))
      } else {
        callback()
      }
    }

  }
}
</script>
