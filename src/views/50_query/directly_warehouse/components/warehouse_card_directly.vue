<!--直属库仓库card-->
<template>
  <el-row
    :gutter="20"
    style="min-width:1800px"
  >
    <el-col
      v-for="(item, index) in data"
      :key="index"
      :span="12"
    >
      <el-card
        shadow="hover"
        :body-style="{ padding: '10px' }"
        style="width: 100%"
      >
        <el-descriptions
          :column="2"
          border
          :label-style="dataJson.labelStyle"
        >
          <el-descriptions-item
            :label="'库点'+(index*1+1)"
            :span="2"
            content-style="text-align: center"
          >
            {{ item.warehouse_name }}
          </el-descriptions-item>
          <el-descriptions-item
            :span="2"
            :content-style="dataJson.contentStyle"
          >
            <template slot="label">
              截止日期与合同<br>
              <div style="text-align: center">共{{ item.file_json.length }}条</div>
            </template>
            <el-table
              border
              :data="item.file_json"
              stripe
              fit
              show-summary
              :summary-method="summary"
              height="250"
              style="width: 100%"
            >
              <el-table-column
                label="到期日"
                prop="contract_expire_dt"
                min-width="25%"
              />
              <el-table-column
                label="合同号"
                prop="contract_no"
                min-width="50%"
              />
              <el-table-column
                label="待出库数量"
                align="right"
                prop="pending_count"
                min-width="25%"
              >
                <template v-slot="scope">
                  {{ scope.row.pending_count === null?'':formatNumberTwo(scope.row.pending_count,true,2) }}
                </template>
              </el-table-column>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item
            label="竞拍数"
            :content-style="dataJson.contentStyle"
          >
            {{ item.contract_num === null ?'': formatNumberTwo(item.contract_num,true,2) }}吨
          </el-descriptions-item>

          <el-descriptions-item
            label="贴水数"
            :content-style="dataJson.contentStyle"
          >
            {{ item.in_actual_count === null ?'': formatNumberTwo(item.in_actual_count,true,2) }}吨
          </el-descriptions-item>

          <el-descriptions-item
            label="当天车辆数"
            :content-style="dataJson.contentStyle"
          >
            {{ item.vehicle_count_today }}辆
          </el-descriptions-item>
          <el-descriptions-item
            label="累计车辆数"
            :content-style="dataJson.contentStyle"
          >
            {{ item.vehicle_count }}辆
          </el-descriptions-item>

          <el-descriptions-item
            label="当天出库数"
            :content-style="dataJson.contentStyle"
          >
            {{ item.actual_count_today === null ?'': formatNumberTwo(item.actual_count_today,true,2) }}吨
          </el-descriptions-item>
          <el-descriptions-item
            label="累计出库数"
            :content-style="dataJson.contentStyle"
          >
            {{ item.actual_count === null ?'': formatNumberTwo(item.actual_count,true,2) }}吨
          </el-descriptions-item>
          <el-descriptions-item
            label="待出库数"
            :content-style="dataJson.contentStyle"
          >
            {{ item.pending_count === null ?'': formatNumberTwo(item.pending_count,true,2) }}吨
          </el-descriptions-item>
          <el-descriptions-item label="" />
        </el-descriptions>
      </el-card>
      <br>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-col-offset-2 {
  margin-left: 4%;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
</style>

<script>

export default {
  // name: 'CardComponent',
  props: {
    data: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      dataJson: {
        // 分页控件的json
        paging: {
          current: 0,
          size: 2,
          total: 0
        },
        labelStyle: {
          'width': '15%',
          'text-align': 'right',
          'font-size': '14px'
        },
        contentStyle: {
          'font-size': '14px',
          'width': '30%',
          'text-align': 'center'
        }
      },
      settings: {
        loading: false
      }
    }
  },
  // 监听器
  watch: {
  },
  created () {
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
  },
  methods: {
    // 设置列表合计格式
    summary (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (column.property === 'pending_count') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = this.formatNumberTwo(sums[index], true, 2)
        }
      })
      return sums
    }
  }
}
</script>
