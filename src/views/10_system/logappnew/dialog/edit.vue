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
      width="1350px"
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

        <el-descriptions
          title=""
          :column="2"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item label="类型">

            {{ dataJson.tempJson.type }}

          </el-descriptions-item>
          <el-descriptions-item label="操作">

            {{ dataJson.tempJson.operation }}

          </el-descriptions-item>
          <el-descriptions-item label="类名">

            {{ dataJson.tempJson.class_name }}

          </el-descriptions-item>
          <el-descriptions-item label="方法名">

            {{ dataJson.tempJson.class_method }}

          </el-descriptions-item>
          <el-descriptions-item label="请求类型">

            {{ dataJson.tempJson.http_method }}

          </el-descriptions-item>
          <el-descriptions-item label="url">

            {{ dataJson.tempJson.url }}

          </el-descriptions-item>
          <el-descriptions-item label="参数">

            {{ dataJson.tempJson.params }}

          </el-descriptions-item>
          <el-descriptions-item label="异常信息">

            {{ dataJson.tempJson.exception }}

          </el-descriptions-item>
          <el-descriptions-item label="创建时间">

            {{ dataJson.tempJson.c_time }}

          </el-descriptions-item>
          <el-descriptions-item />

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
import { getApi } from '@/api/10_system/lognew/logapp'

export default {
  components: {},
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
        width: '3%',
        'text-align': 'right'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        // 单条数据 json
        tempJson: {}
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus,
        rules: {
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
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          break
      }
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    // 查看时的初始化
    initViewModel () {
      this.getData()
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
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
    // 查询详情
    getData () {
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
      }).finally(() => {
        this.settings.loading = false
      })
    }
  }
}
</script>
