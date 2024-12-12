<template>
  <div class="app-container container-height">
    <el-row>
      <el-col :span="24">
        <el-form
          :inline="true"
          :model="dataJson.searchForm"
          class="floatRight"
        >
          <el-form-item>
            <select-dict
              v-model="dataJson.searchForm.batch"
              :para="CONSTANTS.DICT_BUSINESS_START_TIME"
              init-placeholder="业务启动日期"
            />
          </el-form-item>
          <el-form-item style="float:right">
            <el-button
              v-popover:popover
              type="primary"
              plain
              icon="perfect-icon-reset"
            >重置</el-button>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button
              type="primary"
              plain
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <contract-logistics
          ref="contractLogistics"
          :batch="dataJson.searchForm.batch"
        />
      </el-col>
      <el-col :span="8">
        <qty-loss
          ref="qtyLoss"
          :batch="dataJson.searchForm.batch"
        />
      </el-col>
      <el-col :span="8">
        <qty-on-way
          ref="qtyInTransit"
          :batch="dataJson.searchForm.batch"
        />
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <qty-schedule ref="scheduleToday" />
      </el-col>
      <el-col :span="8">
        <qty-out ref="outToday" />
      </el-col>
      <el-col :span="8">
        <qty-in ref="inToday" />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <inventory-warehouse
          ref="inventoryWarehouse"
          :batch="dataJson.searchForm.batch"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import qtyLoss from './components/qtyLoss' // 损耗报表
import inventoryWarehouse from './components/inventoryWarehouse' // 库存量
import qtyOnWay from './components/qtyOnWay' // 在途报表
import contractLogistics from './components/contractLogistics' // 合同量
import qtySchedule from './components/qtySchedule' // 当日累计调度数量
import qtyOut from './components/qtyOut' // 当日累计出库数量
import qtyIn from './components/qtyIn'
import SelectDict from '@/components/00_dict/select/SelectDict.vue' // 当日累计入库数量
import { mapState } from 'vuex'

export default {
  components: {
    SelectDict,
    inventoryWarehouse,
    qtyLoss,
    qtyOnWay,
    contractLogistics,
    qtySchedule,
    qtyOut,
    qtyIn
  },
  data () {
    return {
      dataJson: {
        searchForm: {
          // 启动日期
          batch: ''
        }
      }
    }
  },
  computed: {
    ...mapState('dictDefaultValue', ['dict_value'])
  },
  created () {
    this.dataJson.searchForm.batch = this.dict_value
  },
  methods: {
    handleSearch () {
      this.$refs.contractLogistics.getDataList()
      this.$refs.qtyLoss.getDataList()
      this.$refs.qtyInTransit.getDataList()
      this.$refs.inventoryWarehouse.getDataList()
      this.$refs.scheduleToday.getDataList()
      this.$refs.inToday.getDataList()
      this.$refs.outToday.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>
.container-height {
  height: calc(100vh - 83px);
  overflow: auto;
}
</style>
