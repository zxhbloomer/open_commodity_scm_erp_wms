<template>
  <div class="qtyLoss">
    <!-- 当日累计调度统计(吨) -->
    <el-alert
      title="当日累计物流统计"
      type="info"
      :closable="false"
    />
    <el-skeleton
      :loading="settings.loading"
      :rows="3"
      :throttle="500"
      animated
    >
      <el-descriptions
        title=""
        border
        :column="1"
        :label-style="dataJson.labelStyle"
      >
        <el-descriptions-item
          label="车次"
          :content-style="dataJson.contentStyle"
        >
          <router-link :to="{name:dataJson.constants_program.P_MONITOR,query:{out_time: dataJson.scheduleData.date,status: 8, fullpath:true}}"><a href="javascript:void(0)"> {{ dataJson.scheduleData.num === null ? '0' : dataJson.scheduleData.num }}</a></router-link>
        </el-descriptions-item>
        <el-descriptions-item
          label="发货数量"
          :content-style="dataJson.contentStyle"
        >
          <router-link :to="{name:dataJson.constants_program.P_MONITOR,query:{out_time: dataJson.scheduleData.date,status: 8, fullpath:true}}"><a href="javascript:void(0)"> {{ dataJson.scheduleData.out_qty === null ? '0' : isZhongLin ? formatNumber3(dataJson.scheduleData.out_qty) : formatNumberTwo(dataJson.scheduleData.out_qty,true,2) }}</a></router-link>

        </el-descriptions-item>
        <el-descriptions-item
          label="收货数量"
          :content-style="dataJson.contentStyle"
        >
          <router-link :to="{name:dataJson.constants_program.P_MONITOR,query:{out_time: dataJson.scheduleData.date,status: 8, fullpath:true}}"><a href="javascript:void(0)"> {{ dataJson.scheduleData.in_qty === null ? '0' : isZhongLin ? formatNumber3(dataJson.scheduleData.in_qty) : formatNumberTwo(dataJson.scheduleData.in_qty,true,2) }}</a></router-link>

        </el-descriptions-item>
        <el-descriptions-item
          label="损耗数量"
          :content-style="dataJson.contentStyle"
        >
          <router-link :to="{name:dataJson.constants_program.P_MONITOR,query:{in_time: dataJson.scheduleData.date,status: 7, fullpath:true}}"><a href="javascript:void(0)"> {{ dataJson.scheduleData.qty_loss === null ? '0' : isZhongLin ? formatNumber3(dataJson.scheduleData.qty_loss) : formatNumberTwo(dataJson.scheduleData.qty_loss,true,2) }}</a></router-link>
        </el-descriptions-item>
        <el-descriptions-item
          label="原粮出库数量"
          :content-style="dataJson.contentStyle"
        >
          <router-link :to="{name:dataJson.constants_program.P_OUT,query:{start_time: dataJson.scheduleData.date,warehouse_type: '1', fullpath:true}}"><a href="javascript:void(0)"> {{ dataJson.scheduleData.out_raw_grain_count === null ? '0' : isZhongLin ? formatNumber3(dataJson.scheduleData.out_raw_grain_count) : formatNumberTwo(dataJson.scheduleData.out_raw_grain_count,true,2) }}</a></router-link>
        </el-descriptions-item>
      </el-descriptions>
      <br>
    </el-skeleton>
  </div>
</template>
<style scoped>
::v-deep .el-tabs__item {
  height: 30px;
  line-height: 30px;
}
::v-deep .el-tabs__header {
  margin: 0 0 5px;
}
.edit-container {
  height: calc(100vh - 160px);
  overflow-x: auto;
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
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 371px;
}
.el-button-group {
  margin-bottom: 10px;
  max-width: 50%;
}
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.el-input-group__append_reset {
  color: #ffffff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
a {
  color: #52b5f2;
}
.right {
  position: absolute;
  right: 10px;
  margin-right: 10px;
}
.left {
  position: absolute;
  left: 10px;
  margin-left: 10px;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
</style>
<style>
.qtyLoss .el-alert__title {
  font-size: 20px;
}
</style>

<script>
import { getQtyListApi } from '@/api/50_query/qty_loss/qty_total'
import { getWayQtyListApi } from '@/api/50_query/qty_loss/qty_total'
import { getContractNumApi } from '@/api/50_query/qty_loss/in'
import { getScheduleApi, getOutApi, getInApi } from '@/api/50_query/qty_loss/data_board'
import deepCopy from 'deep-copy'
import resizeMixin from './mixin/resizeHandlerMixin'
import constants_program from '@/common/constants/constants_program'

export default {
  components: {},
  directives: {},
  mixins: [resizeMixin],
  props: {
  },
  data () {
    return {
      dataJson: {
        constants_program: constants_program,
        labelStyle: {
          'width': '150px',
          'text-align': 'right',
          'font-size': '15px'
        },
        contentStyle: {
          'text-align': 'right',
          'font-size': '18px'
        },
        contentStyle1: {
          'text-align': 'left',
          'font-size': '18px'
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: {
            current: 1,
            size: 20,
            sort: 'goods_prop' // 排序
          },
          query_type: 1
        },
        // 查询使用的json
        searchWayForm: {
          // 翻页条件
          pageCondition: {
            current: 1,
            size: 20,
            sort: 'goods_prop' // 排序
          },
          query_type: 2
        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // 损耗返回的 data
        listData: null,
        // 在途返回的 data
        listWayData: null,
        // 合同返回的 data
        contractListData: null,
        // 出库合计
        out_total: 0,
        // 入库合计
        in_total: 0,
        // 当日累计调度统计
        scheduleData: {
          num: 0,
          out_qty: 0,
          in_qty: 0,
          qty_loss: 0,
          // 原粮
          out_raw_grain_count: 0
        },
        // 当日累计出库数量
        outData: null,
        // 当日累计入库数量
        inData: null,
        // 当前时间
        start: '2022-09-13',
        end: '2022-09-13',
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          value: '',
          descr: '',
          wlb_data: null
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000
      }
    }
  },
  computed: {
    // 判断是否是中林环境
    isZhongLin () {
      const href = window.location.href
      if (href.indexOf('shyiyuanth') !== -1 || href.indexOf('172.21.1.249') !== -1 || href.indexOf('localhost') !== -1) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {
    // 计算出库合计数量
    'dataJson.outData' () {
      if (this.dataJson.outData !== null) {
        let out_total = this.dataJson.out_total
        for (var key in this.dataJson.outData) {
          out_total = this.dataJson.outData[key].out_qty + out_total
        }
        this.dataJson.out_total = out_total
      }
    },
    // 计算入库合计数量
    'dataJson.inData' () {
      if (this.dataJson.inData !== null) {
        let in_total = this.dataJson.in_total
        for (var key in this.dataJson.inData) {
          in_total = this.dataJson.inData[key].in_qty + in_total
        }
        this.dataJson.in_total = in_total
      }
    }
  },
  created () {
    // 初始化查询
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList () {
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      getQtyListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
      //
      getWayQtyListApi(this.dataJson.searchWayForm).then(response => {
        this.dataJson.listWayData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
      // 查询采购销售合同量
      getContractNumApi(this.dataJson.searchForm).then(response => {
        this.dataJson.contractListData = response.data
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
      // 当日累计调度统计
      getScheduleApi(this.dataJson.searchForm).then(response => {
        if (response.data !== null) {
          this.dataJson.scheduleData = response.data
        }
      }).finally(() => {
        this.settings.loading = false
      })
      // 当日累计出库数量
      getOutApi(this.dataJson.searchForm).then(response => {
        this.dataJson.outData = response.data
      }).finally(() => {
        this.settings.loading = false
      })
      // 当日累计入库数量
      getInApi(this.dataJson.searchForm).then(response => {
        this.dataJson.inData = response.data
      }).finally(() => {
        this.settings.loading = false
      })
    }
  }
}
</script>
