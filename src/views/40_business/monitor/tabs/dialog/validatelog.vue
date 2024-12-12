<template>
  <div>
    <!-- pop窗口 验车日志窗口-->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      title="验车日志"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1000px"
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
        <el-descriptions-item label="车牌号">
          {{ data.vehicle_no == null?'-':data.vehicle_no }} （{{ dataJson.tempJson.vehicle_color == null ? '-' : dataJson.tempJson.vehicle_color }}）
        </el-descriptions-item>

        <el-descriptions-item label="验车信息">
          <div style="height: 300px;overflow: auto">
            {{ dataJson.tempJson.validate_log == null?'-':dataJson.tempJson.validate_log }}
          </div>
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
        >返回</el-button>
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
import { getValidateAndTrackLogApi } from '@/api/40_business/monitor/monitor'

export default {
  components: { },
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
        'text-align': 'left',
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
        // 单条数据 json
        tempJson: {
          validate_vehicle: null
        }
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        dialogStatus: this.dialogStatus
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
    this.getData()
  },
  mounted () {},
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 设置监听器
    setWatch () {
    },
    unWatch () {
    },

    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 查询验车日志
    getData () {
      getValidateAndTrackLogApi(this.data).then((response) => {
        this.dataJson.tempJson = response.data
      }).finally(() => {
        this.settings.loading = false
      })
    }
  }
}
</script>
