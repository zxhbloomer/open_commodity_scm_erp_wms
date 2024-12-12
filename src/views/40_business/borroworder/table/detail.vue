<template>
  <div class="app-container">
    <div class="edit-container">

      <el-alert
        title="基本信息"
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
        <el-descriptions-item label="放货指令编号">
          {{ dataJson.tempJson.code }}
        </el-descriptions-item>

        <el-descriptions-item label="放货指令类型">
          {{ dataJson.tempJson.type_name }}
        </el-descriptions-item>

        <el-descriptions-item label="业务板块">
          {{ dataJson.tempJson.business_plate_name }}
        </el-descriptions-item>

        <el-descriptions-item label="业务类型">
          {{ dataJson.tempJson.business_type_name }}
        </el-descriptions-item>

        <el-descriptions-item label="合同编号">
          {{ dataJson.tempJson.contract_code }}
        </el-descriptions-item>

        <el-descriptions-item label="订单编号">
          {{ dataJson.tempJson.order_code }}
        </el-descriptions-item>

        <el-descriptions-item label="采购退货单编号">
          {{ dataJson.tempJson.purchase_order_return_code }}
        </el-descriptions-item>

        <el-descriptions-item label="客户">
          {{ dataJson.tempJson.customer_name }}
        </el-descriptions-item>

        <el-descriptions-item label="委托方">
          {{ dataJson.tempJson.consignor_name }}
        </el-descriptions-item>

        <el-descriptions-item label="货主">
          {{ dataJson.tempJson.owner_name }}
        </el-descriptions-item>

        <el-descriptions-item label="放货指令信息">
          {{ dataJson.tempJson.direct_info }}
        </el-descriptions-item>

        <el-descriptions-item label="放货指令日期">
          {{ dataJson.tempJson.out_time == null ? '': formatDateTime(dataJson.tempJson.out_time) }}
        </el-descriptions-item>

        <el-descriptions-item label="计划时间">
          {{ dataJson.tempJson.plan_time == null ? '': formatDateTime(dataJson.tempJson.out_time) }}
        </el-descriptions-item>

        <el-descriptions-item label="上浮百分比">
          {{ dataJson.tempJson.float_up }}
        </el-descriptions-item>

        <el-descriptions-item label="下浮百分比">
          {{ dataJson.tempJson.float_down }}
        </el-descriptions-item>

        <el-descriptions-item label="总金额">
          {{ dataJson.tempJson.total_amount == null ? '': formatCurrency(dataJson.tempJson.total_amount, true) }}
        </el-descriptions-item>

        <el-descriptions-item label="账户余额">
          {{ dataJson.tempJson.balance == null ? '': formatCurrency(dataJson.tempJson.balance, true) }}
        </el-descriptions-item>

        <el-descriptions-item label="是否已用印上传">
          {{ dataJson.tempJson.use_sealed ? '是': '否' }}
        </el-descriptions-item>

        <el-descriptions-item label="状态">
          {{ dataJson.tempJson.status_name }}
        </el-descriptions-item>

        <el-descriptions-item label="备注">
          {{ dataJson.tempJson.remark }}
        </el-descriptions-item>

        <el-descriptions-item label="创建人">
          {{ dataJson.tempJson.c_name }}
        </el-descriptions-item>

        <el-descriptions-item label="更新人">
          {{ dataJson.tempJson.u_name }}
        </el-descriptions-item>

        <el-descriptions-item label="创建时间">
          {{ dataJson.tempJson.c_time == null ? '': formatDateTime(dataJson.tempJson.c_time) }}
        </el-descriptions-item>

        <el-descriptions-item label="更新时间">
          {{ dataJson.tempJson.u_time == null ? '': formatDateTime(dataJson.tempJson.u_time) }}
        </el-descriptions-item>
      </el-descriptions>
      <br>

      <el-descriptions
        title=""
        :column="1"
        :label-style="fileLabelStyle"
        :content-style="contentStyle"
        direction="horizontal"
        border
        style="padding-right: 10px;padding-left: 10px;"
      >

        <el-descriptions-item v-for="item in dataJson.tempJson.files_list" :key="item.id" :label="item.file_name">
          <el-row style="display: flex;flex-wrap: wrap;">
            <el-col>
              <Simple-upload-mutil-file
                v-show="false"
                :accept="'*'"
              />
            </el-col>
            <el-col
              :offset="1"
              :span="4"
            >
              <previewCard
                :show-delete="false"
                :file-name="item.file_name"
                :url="item.url"
                :time="item.timestamp"
              />
            </el-col>
          </el-row>
        </el-descriptions-item>
      </el-descriptions>

      <br>
      <el-alert
        title="物料明细"
        type="info"
        :closable="false"
      />
      <el-button-group />

      <el-table
        ref="multipleTable"
        v-loading="settings.loading"
        :data="dataJson.tempJson.detailList"
        :element-loading-text="'正在拼命加载中...'"
        element-loading-background="rgba(255, 255, 255, 0.5)"
        :height="settings.tableHeight"
        stripe
        border
        fit
        highlight-current-row
        :default-sort="{prop: 'u_time', order: 'descending'}"
        style="width: 100%"
      >
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="no"
          label="序号"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="commodity_code"
          label="商品编号"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="commodity_name"
          label="商品名称"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="commodity_spec"
          label="商品规格"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="commodity_spec_code"
          label="商品规格编码"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="commodity_nickname"
          label="商品别称"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="type_gauge"
          label="型规"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="qty"
          label="放货数量"
        >
          <template v-slot="scope">
            {{ scope.row.qty == null? '-':isZhongLin ? formatNumber3(scope.row.qty) : formatNumber(scope.row.qty,true,4) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="price"
          label="单价"
        >
          <template v-slot="scope">
            {{ scope.row.price == null ? '': formatCurrency(scope.row.price, true) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="real_price"
          label="实时单价"
        >
          <template v-slot="scope">
            {{ scope.row.real_price == null ? '': formatCurrency(scope.row.real_price, true) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="amount"
          label="金额"
        >
          <template v-slot="scope">
            {{ scope.row.amount == null ? '': formatCurrency(scope.row.amount, true) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="qty"
          label="已生产数量"
        >
          <template v-slot="scope">
            {{ scope.row.has_product_num == null? '-':isZhongLin ? formatNumber3(scope.row.has_product_num) : formatNumber(scope.row.has_product_num,true,4) }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="130"
          prop="collection_date"
          label="收款日期"
        >
          <template v-slot="scope">
            {{ scope.row.collection_date == null? '': formatDate(scope.row.collection_date) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="unit_name"
          label="单位"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="warehouse_name"
          label="仓库"
        />
        <el-table-column
          show-overflow-tooltip
          min-width="130"
          prop="remark"
          label="备注"
        />
      </el-table>

    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />
      <el-button
        :disabled="settings.loading"
        size="medium"
        @click="handleCancel()"
      >返回</el-button>
    </div>
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
  margin-bottom: 10px;
}
.el-popup-border-color >>> .el-input__inner {
  border-color: #1890ff;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
</style>

<script>

import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getApi } from '@/api/40_business/releaseorder/releaseorder'
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
    editStatus: {
      type: String,
      default: constants_para.STATUS_INSERT
    }
  },
  data () {
    return {
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '10%',
        'text-align': 'right'
      },
      fileLabelStyle: {
        width: '2.3%',
        'text-align': 'right'
      },
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          detailList: []
        },
        // 单条数据 json
        tempJson: {
          detailList: [],
          // 文件
          files: [],
          // 文件过滤集合
          files_list: []
        }
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        duration: 4000,
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.editStatus,
        // 表格高度
        tableHeight: 280
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
  watch: {},
  created () {
    this.init()
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
  },
  methods: {
    // // 初始化处理
    init () {
      switch (this.editStatus) {
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          break
      }
      this.settings.loading = false

      // 计算物料明细表格高度，分辨率不一致保持始终固定在底部
      this.settings.tableHeight = document.body.clientHeight - 545
    },
    // 查看时的初始化
    initViewModel () {
      this.getData()
    },

    // 取消按钮
    handleCancel () {
      this.$emit('emitReturn')
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        this.dataJson.tempJson.files_list = []
        this.dataJson.tempJson.files.forEach(k => {
          if ((this.dataJson.tempJson.status_name.includes('自动中止') ||
              this.dataJson.tempJson.status_name.includes('手动中止')) &&
            // eslint-disable-next-line no-empty
            k.file_name.includes('中止附件')) {

          } else {
            this.dataJson.tempJson.files_list.push(k)
          }
        })
        console.log(response.data)
      }).finally(() => {
        this.settings.loading = false
      })
    }
  }

}
</script>
