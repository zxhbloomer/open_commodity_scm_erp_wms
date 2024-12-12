<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改 -->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :title="settings.dialogTitle"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1000px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="0px"
        status-icon
      >
        <el-alert
          title="请注意：点击确定后，会自动生成审核通过、入库类型为监管退货：入库计划和入库单！"
          type="warning"
          show-icon
          :closable="false"
          style="margin-left: 10px;width: 98%;margin-bottom: 10px"
        />
        <el-descriptions
          title=""
          :column="1"
          :label-style="fileLabelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="出库信息">

            <el-descriptions
              title=""
              :column="3"
              :label-style="fileLabelStyleTwo"
              :content-style="contentStyle"
              direction="horizontal"
              border
              style="padding-right: 10px;padding-left: 10px"
            >
              <el-descriptions-item label="毛重(吨)">{{ dataJson.tempJson.monitorOutVo.gross_weight }}</el-descriptions-item>

              <el-descriptions-item label="皮重(吨)">{{ dataJson.tempJson.monitorOutVo.tare_weight }}</el-descriptions-item>

              <el-descriptions-item label="净重(吨)">{{ dataJson.tempJson.monitorOutVo.net_weight }}</el-descriptions-item>

            </el-descriptions>
          </el-descriptions-item>

        </el-descriptions>

        <el-descriptions
          title=""
          :column="1"
          :label-style="fileLabelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="入库信息">
            <el-descriptions
              title=""
              :column="3"
              :label-style="fileLabelStyleTwo"
              :content-style="contentStyle"
              direction="horizontal"
              border
              style="padding-right: 10px;padding-left: 10px"
            >
              <el-descriptions-item label="毛重(吨)">{{ dataJson.tempJson.monitorInVo.gross_weight }}</el-descriptions-item>

              <el-descriptions-item label="皮重(吨)">{{ dataJson.tempJson.monitorInVo.tare_weight }}</el-descriptions-item>

              <el-descriptions-item label="净重(吨)">{{ dataJson.tempJson.monitorInVo.net_weight }}</el-descriptions-item>

            </el-descriptions>
          </el-descriptions-item>

        </el-descriptions>

        <br>

        <el-descriptions
          title=""
          :column="1"
          :label-style="fileLabelStyleThree"
          :content-style="contentStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item label="退货信息">
            <el-alert
              title="请输入吨数，且退货数量(吨)需<=出库净重(吨)-入库净重(吨)"
              type="warning"
              show-icon
              :closable="false"
              style="margin-left: 10px;width: 97.5%;"
            />
            <br>
            <el-descriptions
              title=""
              :column="1"
              :label-style="fileLabelStyleFour"
              :content-style="contentStyle"
              direction="horizontal"
              border
              style="padding-right: 10px;padding-left: 10px;margin-top: -10px"
            >

              <el-descriptions-item label="退货数量(吨)">
                <el-form-item
                  prop="quantity"
                  label-width="0"
                >
                  <el-input
                    ref="refFocusOne"
                    v-model.trim="dataJson.tempJson.returnRelationVo.quantity"
                    type="text"
                    clearable
                    show-word-limit
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    :placeholder="isPlaceholderShow('请输入')"
                  />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item label="退货理由">
                <el-form-item
                  prop="quantity_reason"
                  label-width="0"
                >
                  <el-input
                    ref="refFocusOne"
                    v-model.trim="dataJson.tempJson.returnRelationVo.quantity_reason"
                    type="textarea"
                    clearable
                    show-word-limit
                    :placeholder="isPlaceholderShow('请输入')"
                  />
                </el-form-item>
              </el-descriptions-item>

              <el-descriptions-item label="附件" :span="3">
                <el-row style="display: flex;flex-wrap: wrap;">
                  <el-col>
                    <Simple-upload-mutil-file
                      :accept="'*'"
                      style="margin-top: 5px;margin-bottom: 5px"
                      @upload-success="handleUploadFileSuccess"
                      @upload-error="handleUploadFileError"
                    />
                  </el-col>
                  <el-col
                    v-for="(item, i) in dataJson.files"
                    :key="i"
                    :offset="1"
                    :span="6"
                  >
                    <previewCard
                      :file-name="item.fileName"
                      :url="item.url"
                      :time="item.timestamp"
                      @removeFile="removeFile(i)"
                    />
                  </el-col>
                </el-row>
              </el-descriptions-item>

            </el-descriptions>
          </el-descriptions-item>

        </el-descriptions>
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
          v-show="settings.btnShowStatus.showUpdate"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
          @click="doUpdate()"
        >确定</el-button>
      </div>
    </el-dialog>
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
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import SimpleUploadMutilFile from '@/components/10_file/SimpleUploadMutilFile/index.vue'
import previewCard from '@/components/50_preview_card/preview_card.vue'

export default {
  components: { previewCard, SimpleUploadMutilFile },
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
      fileLabelStyle: {
        width: '1%',
        height: '100px',
        'text-align': 'center'
      },
      contentStyle: {
        width: '10%'
      },
      fileLabelStyleTwo: {
        width: '5%',
        'text-align': 'center'
      },
      fileLabelStyleThree: {
        width: '0.85%',
        height: '200px',
        'text-align': 'center'
      },
      fileLabelStyleFour: {
        width: '1.5%',
        'text-align': 'center'
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
          id: undefined
        },
        files: [],
        files_url: [],
        // 单条数据 json
        tempJson: {
          // 入库信息
          monitorInVo: [],
          // 出库信息
          monitorOutVo: [],
          returnRelationVo: {
            // 退回数量(吨)
            quantity: null,
            // 退货理由
            quantity_reason: null,
            // 附件
            files: []
          }
        },
        inputSettings: {
          maxLength: {
            name: 20,
            code: 20,
            short_name: 50,
            warehouse_type: 10,
            contact_person: 20,
            mobile_phone: 20,
            charge_company_id: 10,
            operate_company_id: 10,
            area: 20,
            warehouse_capacity: 20,
            longitude: 20,
            latitude: 20,
            province: 20,
            city: 20,
            district: 20,
            address: 20
          }
        }
      },
      // 页面设置json
      settings: {
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
        dialogTitle: ''
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
      this.settings.dialogTitle = '退货单信息'
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJson.returnRelationVo = {}

      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      return val
    },
    // 修改时的初始化
    initUpdateModel () {
      this.settings.dialogTitle = '修改退货单信息'
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      console.log(this.dataJson.tempJson.returnRelationVo.files)
      this.dataJson.files = this.dataJson.tempJson.returnRelationVo.files
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
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
      this.$emit('closeMeCancel')
    },
    // 插入逻辑
    doInsert () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          this.$emit('closeMeInsertOk', tempData)
        }
      })
    },
    // 更新逻辑
    doUpdate () {
      console.log(this.dataJson.tempJson)
      const _message = '该退货操作，同时会作废该监管任务下退货入库计划' + this.dataJson.tempJson.returnRelationVo.in_plan_code + '、退货入库单' + this.dataJson.tempJson.returnRelationVo.in_code + '、退货单' + this.dataJson.tempJson.returnRelationVo.code + '，请问是否继续操作？'
      // 选择全部的时候
      this.$confirm(_message, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        // 开始综合验证
        this.$refs['dataSubmitForm'].validate(valid => {
          if (valid) {
            const tempData = deepCopy(this.dataJson.tempJson)
            this.$emit('closeMeUpdateOk', tempData)
          }
        })
      }).catch(action => {
      })
    },
    // 附件上传成功
    handleUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      if (this.dataJson.files == null) this.dataJson.files = []
      if (this.dataJson.files_url == null) this.dataJson.files_url = []

      this.dataJson.files.push(res.response.data)
      this.dataJson.files_url.push(res.response.data.url)
      this.dataJson.tempJson.returnRelationVo.files = this.dataJson.files
    },
    // 附件上传失败
    handleUploadFileError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 删除附件文件
    removeFile (val) {
      // 从数组中移除
      this.dataJson.files.splice(val, 1)
      this.dataJson.files_url.splice(val, 1)
    }

  }
}
</script>
