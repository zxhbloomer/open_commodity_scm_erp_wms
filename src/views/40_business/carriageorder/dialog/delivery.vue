<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改 -->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      title="上传收货确认函"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1100px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="0px"
        status-icon
      >
        <br>
        <el-descriptions
          title=""
          :column="2"
          :label-style="labelStyle"
          :content-style="contentStyle"
          direction="horizontal"
          border
        >
          <el-descriptions-item label="合同编号">
            {{ data.contract_no }}
          </el-descriptions-item>
          <el-descriptions-item label="订单编号">
            {{ data.order_no }}
          </el-descriptions-item>
          <el-descriptions-item label="序号">
            {{ data.idx }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名称">
            {{ data.goods_name }}
          </el-descriptions-item>
          <el-descriptions-item label="品名">
            {{ data.pm }}
          </el-descriptions-item>
          <el-descriptions-item label="商品规格">
            {{ data.spec }}
          </el-descriptions-item>
          <el-descriptions-item label="收货确认函">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col>
                <Simple-upload-mutil-file
                  :accept="'*'"
                  @upload-success="handleUploadFileSuccess"
                  @upload-error="handleUploadFileError"
                />
              </el-col>
              <el-col
                v-for="(item, i) in dataJson.tempJson.files_detail"
                :key="i"
                :offset="1"
                :span="5"
              >
                <previewCard
                  :file-name="item.fileName"
                  :url="item.url"
                  :time="item.timestamp"
                  @removeFile="removeFile"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <el-button
          type="primary"
          :disabled="settings.btnDisabledStatus.disabledUpdate"
          @click="doSave()"
        >确定</el-button>
        <el-button
          plain
          :disabled="settings.btnDisabledStatus.disabledCancel"
          @click="handleCancel()"
        >取消</el-button>
      </div>
    </el-dialog>
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
</style>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import SimpleUploadMutilFile from '@/components/10_file/SimpleUploadMutilFile'
import previewCard from '@/components/50_preview_card/preview_card'
import { getListApi, updateApi } from '@/api/40_business/inorder/inorderdocument'
import deepCopy from 'deep-copy'

export default {
  components: { SimpleUploadMutilFile, previewCard },
  directives: { elDragDialog },
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '5%',
        'text-align': 'right'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          files_detail: null
        },
        // 单条数据 json
        tempJson: {
          files_detail: null
        }
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledUpdate: true,
          disabledCancel: false
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus,
        // pop的check内容
        rules: {
          name: [
            { required: true, message: '请输入类别名称', trigger: 'change' }
          ],
          business_name: [
            { required: true, message: '请选择板块', trigger: 'change' }
          ],
          industry_name: [
            { required: true, message: '请选择行业', trigger: 'change' }
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
      this.getDataList()
      this.settings.loading = false
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson.files_detail',
        (newVal, oldVal) => {
          this.settings.btnDisabledStatus.disabledUpdate = false
        },
        { deep: true }
      )
    },
    getDataList () {
      // 查询逻辑
      this.settings.loading = true
      getListApi({ in_order_goods_id: this.data.in_order_goods_id }).then(response => {
        this.dataJson.tempJson.files_detail = response.data
        // 初始化watch
        this.setWatch()
      }).finally(() => {
        this.settings.loading = false
      })
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
    // 上传成功
    handleUploadFileSuccess (res) {
      res.response.data.timestamp = res.response.timestamp
      this.dataJson.tempJson.files_detail.push(res.response.data)
    },
    // 上传失败
    handleUploadFileError () {
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },
    // 保存
    doSave () {
      this.settings.loading = true
      updateApi({ in_order_goods_id: this.data.in_order_goods_id, files_detail: this.dataJson.tempJson.files_detail }).then((_data) => {
        // this.dataJson.tempJson = Object.assign({}, _data.data)
        this.dataJson.tempJson = deepCopy(_data.data)
        this.$emit('closeMeOk', { return_flag: true, data: _data })
      }, (_error) => {
        this.$emit('closeMeOk', { return_flag: false, error: _error })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    removeFile (val) {
      // 获取下标
      const _index = this.dataJson.tempJson.files_detail.lastIndexOf(val)
      // 从数组中移除
      this.dataJson.tempJson.files_detail.splice(_index, 1)
    }
  }
}
</script>
