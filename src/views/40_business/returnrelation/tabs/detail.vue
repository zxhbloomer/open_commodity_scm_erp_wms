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
          title="退货信息"
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

          <el-descriptions-item label="退货入库计划单号">
            {{ dataJson.tempJson.in_plan_code == null?'-': dataJson.tempJson.in_plan_code }}
          </el-descriptions-item>

          <el-descriptions-item label="退货入库单号">
            {{ dataJson.tempJson.in_code == null?'-': dataJson.tempJson.in_code }}
          </el-descriptions-item>

          <el-descriptions-item label="退货数量">
            {{ dataJson.tempJson.quantity == null?'-': dataJson.tempJson.quantity }}
          </el-descriptions-item>
          <el-descriptions-item label="退货入库单位">
            {{ dataJson.tempJson.unit_name == null?'-': dataJson.tempJson.unit_name }}
          </el-descriptions-item>
          <el-descriptions-item />
          <el-descriptions-item />
          <el-descriptions-item label="退货理由" :span="3">
            {{ dataJson.tempJson.quantity_reason == null?'-': dataJson.tempJson.quantity_reason }}
          </el-descriptions-item>

          <el-descriptions-item label="附件" :span="3">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                v-for="( value, index) in dataJson.tempJson.files"
                :key="index"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  :title="value.file_name"
                  :data="value"
                  @emitPreview="handlePreview"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>

        </el-descriptions>
      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />
      <el-button-group class="floatRight">
        <el-button
          style="margin-left:10px"
          :disabled="settings.loading"
          size="medium"
          @click="handleCancel()"
        >返回</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<style scoped>
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
.fontCenter {
  display: inline-block;
  text-align: left;
  line-height: 28px;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
.br {
  display: block;
  margin: 0px;
  content: ' ';
}
.fontWeight {
  font-weight: bold;
  color: #1890ff;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import {
  getApi
} from '@/api/40_business/returnrelation/returnrelation'
import previewCard from '@/components/50_preview_card/preview_card_zl'
import { getMonitorFileApi } from '@/api/40_business/monitor/monitor'
export default {
  components: { previewCard },
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
    editStatus: {
      type: String,
      default: constants_para.STATUS_INSERT
    }
  },
  data () {
    return {
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '6%',
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
      popSettings: {
        // 弹出编辑页面
        one: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 弹出编辑页面
        two: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 弹出编辑页面
        three: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
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
        },
        // 弹出编辑页面
        six: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 验车日志
        seven: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 轨迹日志
        eight: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 退货单窗口
        nine: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        }
      },
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          monitorOutVo: {
            one_fileVo: undefined,
            two_fileVo: undefined,
            three_fileVo: undefined,
            four_fileVo: undefined,
            five_fileVo: undefined,
            six_fileVo: undefined,
            seven_fileVo: undefined,
            eight_fileVo: undefined,
            nine_fileVo: undefined,
            containerInfos: undefined
          },
          monitorInVo: {
            one_fileVo: undefined,
            two_fileVo: undefined,
            three_fileVo: undefined,
            four_fileVo: undefined,
            five_fileVo: undefined,
            six_fileVo: undefined,
            seven_fileVo: undefined,
            eight_fileVo: undefined,
            nine_fileVo: undefined,
            ten_fileVo: undefined,
            elevenn_fileVo: undefined,
            containerInfos: undefined
          }
        },
        // 单条数据 json
        tempJson: undefined,
        // 验车状态
        validateList: [
          { id: '1', value: '验车通过' },
          { id: '0', value: '验车失败' }
        ],
        inputSettings: {
          maxLength: {
          }
        }
      },
      // 页面设置json
      settings: {
        showDelete: false,
        showUpdate: true,
        showInUpdate: true,
        showOutUpdate: true,
        showTitle: true,
        // loading 状态
        loading: true,
        loading_prev: true,
        loading_next: true,
        // tableHeight: this.setUIheight(),
        duration: 4000,
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
        dialogStatus: this.editStatus,
        // pop的check内容
        rulesOne: {

        },
        rules: {

        },
        popSettings: {
          // 弹出编辑页面
          one: {
            visible: false,
            props: {
              index: 0,
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          },
          two: {
            visible: false,
            props: {
              index: 0,
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          },
          three: {
            visible: false,
            props: {
              index: 0,
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          },
          four: {
            visible: false,
            props: {
              index: 0,
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          },
          five: {
            visible: false,
            props: {
              index: 0,
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          },
          showReturn: true
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
      // this.dataJson.tempJson = this.data
      this.settings.rules = this.settings.rulesOne
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      this.initViewModel()
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    // 弹出框设置初始化
    initDialogStatus () {
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
    // 新增时的初始化
    initInsertModel () {
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

    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 数据初始化
      this.getData()
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
      const operate_tab_data = {
        data: this.data
      }

      this.$router.push({
        query: {}
      })

      this.$emit('emitReturn', operate_tab_data)
    },
    handleTabsClick (tab, event) { },
    // 开始综合验证
    doValidateByTabs () {
      // 第一个tabs
      this.settings.rules = this.settings.rulesOne
      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
      this.$refs['dataSubmitForm'].validate((valid, validateItems) => {
        if (valid === false) {
          this.settings.badge.countOne = Object.keys(validateItems).length
        } else {
          this.settings.badge.countOne = 0
        }
      })
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
    // 上一条
    handlePrev () {
      this.data.id = this.dataJson.tempJson.prev_id
      this.data.no = this.data.no - 1

      window.history.pushState({ pushState: true }, '', `#${this.$route.path}?p2=${this.data.id}`)
      this.settings.loading = true
      this.getData()
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      this.showLoading('正在查询，请稍后...')
      getApi(this.data).then(response => {
        this.dataJson.tempJson = response.data
      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
        // 预览附件查询
        this.getReturnFile()
      })
    },
    // 出库维护确认
    handleCloseDialogOneOk () {
      this.popSettings.one.visible = false
      this.getData()
    },
    // 出库维护取消
    handleCloseDialogOneCancel () {
      this.popSettings.one.visible = false
    },
    // 出库维护确认
    handleCloseDialogTwoOk () {
      this.popSettings.two.visible = false
      this.getData()
    },

    // 出库维护取消
    handleCloseDialogTwoCancel () {
      this.popSettings.two.visible = false
    },
    //  文件上传失败
    replaceError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },

    handlePreview (url) {
      const index = this.dataJson.tempJson.preview_data.findIndex(item => {
        return item.url === url
      })

      const { href } = this.$router.resolve({
        path: `/preview`,
        query: {
          id: this.dataJson.tempJson.serial_id,
          type: 'monitor',
          index: index
        }
      })
      window.open(href, '_blank')
    },
    getReturnFile () {
      // 查询逻辑
      const temp = {}
      temp.id = this.dataJson.tempJson.serial_id
      getMonitorFileApi(temp).then(response => {
        this.dataJson.tempJson.preview_data = deepCopy(response.data.preview_data)
        this.popSettings.one.props.data = deepCopy(this.dataJson.tempJson.preview_data)
      }).finally(() => {
      })
    }
  }

}
</script>
