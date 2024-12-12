<template>
  <div>
    <el-dialog
      v-if="showAlarm"
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      custom-class="configDialog"
      :append-to-body="true"
      :modal-append-to-body="true"
      :destroy-on-close="true"
    >
      <el-container>
        <el-main>
          <span>
            待处理预警: {{ alarmCount }}
          </span>
          <Content
            ref="content"
            @closeTable="closeTable"
          />
        </el-main>
        <el-divider direction="vertical" />
        <el-aside width="330px">
          <el-row :gutter="20">
            <el-col :span="12">
              <StatisticsCardNew
                :title-one="'入库'"
                :number-one="dataJson.sumData.inCount"
                :page-code-one="constants_program.P_IN"
                :title-two="'出库同步失败'"
                :number-two="dataJson.sumData.outCount"
                :page-code-two="constants_program.P_OUT"
                @closeTable="closeTable"
              />
            </el-col>
            <el-col :span="12">
              <StatisticsCardNew
                :title-one="'入库'"
                :number-one="dataJson.sumData.inPlanCount"
                :page-code-one="constants_program.P_IN_PLAN"
                :title-two="'出库计划同步失败'"
                :number-two="dataJson.sumData.outPlanCount"
                :page-code-two="constants_program.P_OUT_PLAN"
                @closeTable="closeTable"
              />
            </el-col>
          </el-row>
          <br>
          <el-row :gutter="10">
            <el-col :span="12">
              <StatisticsCard
                title="车次异常"
                :number="dataJson.sumData.monitorCount"
                :page-code="constants_program.P_MONITOR"
              />
            </el-col>
            <el-col :span="12">
              <StatisticsCard
                title="监管任务同步失败"
                :number="dataJson.sumData.monitorSyncErrorCount"
                :page-code="constants_program.P_MONITOR"
                sync-status="2"
                @closeTable="closeTable"
              />
            </el-col>
          </el-row>
          <br>
          <el-row :gutter="10">
            <el-col :span="12">
              <StatisticsCard
                title="待审核预警"
                :number="dataJson.sumData.monitor_unaudited"
                sync-status="7"
                :page-code="constants_program.P_MONITOR"
                @closeTable="closeTable"
              />
            </el-col>

            <el-col :span="12">
              <StatisticsCard
                title="港口中转停滞预警"
                :number="dataJson.sumData.inventory_stagnation_warning"
                sync-status="7"
                :page-code="constants_program.M_INVENTORY_STAGNATION_WARNING"
                @closeTable="closeTable"
              />
            </el-col>
          </el-row>
          <br>
          <el-row :gutter="10">
            <el-col :span="12">
              <StatisticsCard
                title="监管任务损耗预警"
                :number="dataJson.sumData.monitor_loss_warning"
                :page-code="constants_program.P_MONITOR"
                sync-status="8"
                @closeTable="closeTable"
              />
            </el-col>
          </el-row>
        </el-aside>
      </el-container>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button
          type="primary"
          @click="closeTable"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Sync from '@/views/10_system/synclog/dialog/syncalarmdialog'
import StatisticsCard from '@/components/StatisticsCard/index'
import Content from '@/views/10_system/websocketnotice/dialog/alarmcontentlistdialog'
import { getHeaderCount } from '@/api/10_system/message/index'
import constants_program from '@/common/constants/constants_program'
import { mapState } from 'vuex'
import StatisticsCardNew from '@/components/StatisticsCardNew/index'

export default {
  components: { StatisticsCardNew, StatisticsCard, Content },
  props: {
    // 是否显示
    showAlarm: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: true,
      constants_program: constants_program,
      dataJson: {
        searchForm: {},
        sumData: {
          // 监管任务数量
          monitorCount: 0,
          // 监管任务同步失败
          monitorSyncErrorCount: 0,
          // 出库计划数量
          outPlanCount: 0,
          // 出库单数量
          outCount: 0,
          // 入库单数量
          inCount: 0,
          // 入库计划数量
          inPlanCount: 0,
          // 待审核预警
          monitor_unaudited: 0,
          // 港口停滞预警
          inventory_stagnation_warning: 0,
          // 监管任务损耗预警
          monitor_loss_warning: 0
        }
      }
    }
  },
  computed: {
    ...mapState('headNotice', ['alarmCount'])
  },
  created () {
    this.getDataCount()
    // alert(this.showAlarm)
  },
  beforeDestroy () {
    // alert('销毁了')
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    closeTable () {
      this.$emit('closeTable')
    },
    // 查询数量
    getDataCount () {
      getHeaderCount(this.dataJson.searchForm).then(response => {
        this.dataJson.sumData = response.data
      }).finally(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.configDialog.el-dialog {
  .el-dialog__header {
    display: none !important;
  }
  .dj-dialog-content {
    padding: 0;
    overflow: unset;
  }
}
::v-deep .configDialog .el-dialog__body {
  padding: 10px 12px;
}

::v-deep .configDialog .el-dialog__footer {
  padding: 15px;
  padding-top: 0px;
}
.el-checkbox {
  width: auto;
}
.el-aside {
  background-color: white;
  padding: 10px 12px;
}
br {
  display: block;
  margin: 1px;
  content: ' ';
}
.el-main {
  padding: 1px;
  height: 300px;
}

::v-deep .el-main .container {
  height: 251px;
}
.el-divider--vertical {
  display: inline-block;
  width: 2px;
  height: 21em;
  margin: 1px 2px;
  vertical-align: middle;
  position: relative;
}
</style>
