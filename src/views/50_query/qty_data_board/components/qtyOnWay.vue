<template>
  <div class="qtyLoss">
    <el-alert
      title="在途数量（吨）"
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
          v-for="(value, index) in dataJson.listWayData"
          :key="index"
          :label="value.goods_prop"
          :content-style="dataJson.contentStyle"
        >
          <router-link :to="{name:dataJson.constants_program.P_QTY_ON_WAY,query:{goods_prop:value.goods_prop,batch: batch, fullpath:true}}"><a href="javascript:void(0)">{{ value.qty === null?'': isZhongLin ? formatNumber3(value.qty) : formatNumberTwo(value.qty,true,2) }}</a></router-link>
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
import { getWayQtyAndInventorListApi } from '@/api/50_query/qty_loss/qty_total'
import deepCopy from 'deep-copy'
import resizeMixin from './mixin/resizeHandlerMixin'
import constants_program from '@/common/constants/constants_program'

export default {
  components: {},
  directives: {},
  mixins: [resizeMixin],
  props: {
    // 起始日期
    batch: {
      type: String,
      default: ''
    }
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
        // 在途返回的 data
        listWayData: null,
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
      this.dataJson.searchWayForm.batch = this.batch
      // 查询逻辑
      this.settings.loading = true
      // 在途数量
      getWayQtyAndInventorListApi(this.dataJson.searchWayForm).then(response => {
        this.dataJson.listWayData = response.data.records
        // 原材料在第一个
        const listWayData = response.data.records
        if (listWayData !== null && listWayData !== undefined) {
          listWayData.sort((a, b) => {
            return a.id - b.id
          })
        }
        this.dataJson.listWayData = listWayData
      }).finally(() => {
        this.settings.loading = false
      })
    }
  }
}
</script>
