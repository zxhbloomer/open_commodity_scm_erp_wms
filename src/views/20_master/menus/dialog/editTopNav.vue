<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改、步骤窗体-->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :title="settings.textMap[settings.dialogStatus]"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="900px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="120px"
        status-icon
      >
        <el-alert
          title="上级菜单信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="上级菜单："
              prop="parent_id"
            >
              <el-cascader
                v-model="dataJson.tempJson.depth_id_array"
                placeholder="请选择"
                :options="dataJson.cascader.data"
                filterable
                clearable
                :props="{ checkStrictly: true, expandTrigger: 'hover'}"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-alert
          title="添加顶部导航栏信息"
          type="info"
          :closable="false"
        />
        <br>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="导航栏名称："
              prop="name"
            >
              <el-input
                ref="refFocus"
                v-model.trim="dataJson.tempJson.name"
                clearable
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="icon："
              prop="meta_icon"
            >
              <input-search
                v-model.trim="dataJson.tempJson.meta_icon"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handleSysIconOpen"
              >
                <template slot="prepend">
                  <svg-icon
                    :icon-class="dataJson.tempJson.meta_icon"
                    :class="dataJson.tempJson.meta_icon"
                  />
                </template>
              </input-search>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="settings.dialogStatus === PARAMETERS.STATUS_UPDATE || isViewModel">
          <el-col :span="12">
            <el-form-item
              label="更新人："
              prop="u_name"
            >
              <el-input
                v-model.trim="dataJson.tempJson.u_name"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="更新时间："
              prop="u_time"
            >
              <el-input
                v-model.trim="dataJson.tempJson.u_time"
                disabled
              />
            </el-form-item>
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
          v-show="settings.btnShowStatus.showInsert"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
          @click="doInsert()"
        >确定</el-button>
        <el-button
          v-show="settings.btnShowStatus.showUpdate"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
          @click="doUpdate()"
        >确定</el-button>
      </div>
    </el-dialog>
    <sys-icon-dialog
      v-if="popSettings.two.visible"
      :visible="popSettings.two.visible"
      @closeMeOk="handleSysIconCloseOk"
      @closeMeCancel="handleSysIconCloseCancel"
    />
  </div>
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
import constants_para from '@/common/constants/constants_para'
import deepCopy from 'deep-copy'
import elDragDialog from '@/directive/el-drag-dialog'
import { addTopNavApi, updateApi, getCascaderListApi } from '@/api/20_master/menus/menu'
import InputSearch from '@/components/40_input/inputSearch'
import sysIconDialog from '@/views/10_system/icons/dialog/dialog'

export default {
  components: { InputSearch, sysIconDialog },
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
      dataJson: {// 单条数据 json的，初始化原始数据
        // 级联选择器数据
        cascader: {
          data: null,
          value: ''
        },
        tempJsonOriginal: {
          id: undefined,
          name: '',
          code: '',
          descr: '',
          dbversion: 0
        },
        // 单条数据 json
        tempJson: null,
        inputSettings: {
          maxLength: {
          }
        }
      },
      settings: {
        // loading 状态
        loading: true,
        dialogStatus: this.dialogStatus,
        textMap: {
          insert: '添加顶部导航栏',
          update: '修改顶部导航栏'
        },
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false,
          showCopyInsert: false
        },
        // 按钮状态：是否可用
        btnDisabledStatus: {
          disabledReset: true,
          disabledInsert: true,
          disabledUpdate: true,
          disabledCopyInsert: true
        },
        rules: {
          code: [{ required: true, message: '请输入菜单组编号', trigger: 'change' }],
          name: [{ required: true, message: '请输入菜单组名称', trigger: 'change' }],
          path: [{ required: true, message: '请输入请求地址', trigger: 'change' }]
        }
      },
      popSettings: {
        // 弹出编辑页面
        two: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        }
      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT || this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT) {
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
  watch: {
  },
  created () {
    this.init()
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    // 初始化处理
    init () {
      // 初始化级联数据
      this.getCascaderDataList()
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          break
      }
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
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
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      this.dataJson.tempJson.parent_id = this.dataJson.tempJson.id
      this.dataJson.tempJson.id = undefined
      this.dataJson.tempJson.template_id = undefined
      this.dataJson.tempJson.u_id = ''
      this.dataJson.tempJson.u_time = ''
      this.dataJson.tempJson.code = ''
      this.dataJson.tempJson.son_count = this.dataJson.tempJson.son_count + 1
      this.dataJson.tempJson.path = ''
      this.dataJson.tempJson.meta_title = ''
      this.dataJson.tempJson.meta_icon = ''
      this.dataJson.tempJson.route_name = ''
      this.dataJson.tempJson.component = ''
      this.dataJson.tempJson.name = ''
      this.dataJson.tempJson.type_name = '顶部导航栏'
      this.dataJson.tempJson.type = this.CONSTANTS.DICT_SYS_MENU_TYPE_TOPNAV

      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocus'].focus()
      })
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      this.dataJson.tempJson.depth_id_array = this.dataJson.tempJson.parent_depth_id_array
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocus'].focus()
      })
    },
    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    getCascaderDataList () {
      // 级联查询逻辑
      this.settings.loading = true
      getCascaderListApi().then(response => {
        this.dataJson.cascader.data = response.data
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 更新逻辑
    doUpdate () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.dataJson.tempJson)
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          updateApi(tempData).then((_data) => {
            // this.dataJson.tempJson = Object.assign({}, _data.data)
            this.dataJson.tempJson = deepCopy(_data.data)
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 重置按钮
    doReset () {
      switch (this.settings.dialogStatus) {
        case this.PARAMETERS.STATUS_UPDATE:
          // 数据初始化
          this.initUpdateModel()
          this.$nextTick(() => {
            this.$refs['refFocus'].focus()
          })
          break
        case this.PARAMETERS.STATUS_COPY_INSERT:
          // 数据初始化
          this.initUpdateModel()
          // 设置控件焦点focus
          this.$nextTick(() => {
            this.$refs['refFocus'].focus()
          })
          break
      }
      // 初始化按钮
      this.initButtonDisabledStatus()
      // 初始化watch
      this.setWatch()
      // 去除validate信息
      this.$nextTick(() => {
        this.$refs['dataSubmitForm'].clearValidate()
      })
    },

    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch('dataJson.tempJson', (newVal, oldVal) => {
        this.settings.btnDisabledStatus.disabledReset = false
        this.settings.btnDisabledStatus.disabledInsert = false
        this.settings.btnDisabledStatus.disabledUpdate = false
        this.settings.btnDisabledStatus.disabledCopyInsert = false
      }, { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },

    // 插入逻辑
    doInsert () {
      this.$refs['dataSubmitForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.dataJson.tempJson)
          const tempData = deepCopy(this.dataJson.tempJson)
          this.settings.loading = true
          addTopNavApi(tempData).then((_data) => {
            this.$emit('closeMeOk', { return_flag: true, data: _data })
          }, (_error) => {
            this.$emit('closeMeOk', { return_flag: false, error: _error })
          }).finally(() => {
            this.settings.loading = false
          })
        }
      })
    },
    // 级联事件
    handleCascaderChange (val) {
      // 数组中最后一个才是parent_id
      this.dataJson.tempJson.parent_id = val[val.length - 1]
    },
    // ------------------system icon input search start --------------------
    handleSysIconOpen () {
      this.popSettings.two.visible = true
    },
    handleSysIconCloseOk (val) {
      this.dataJson.tempJson.meta_icon = val
      this.popSettings.two.visible = false
    },
    handleSysIconCloseCancel () {
      this.popSettings.two.visible = false
    }
    // ------------------system icon input search end--------------------
  }
}
</script>
