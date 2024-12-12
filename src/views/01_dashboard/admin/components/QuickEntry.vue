<template>
  <div
    :style="{height:height,width:width}"
    class="quickEntry"
  >
    <div class="title">快捷入口</div>
    <el-row>
      <el-col
        :span="12"
        style="text-align: center;"
      >
        <div class="card_grid card_grid_hoverable">
          <img
            src="@/assets/images/quick/入库计划.png"
            class="image_button"
            @click="handleInPlanClick"
          >
          <div style="padding: 5px;">
            <el-link
              type="primary"
              @click="handleInPlanClick"
            >入库计划</el-link>
          </div>
        </div>
      </el-col>
      <el-col
        :span="12"
        style="text-align: center;"
      >
        <div class="card_grid card_grid_hoverable">
          <img
            src="@/assets/images/quick/出库计划.png"
            class="image_button"
            @click="handleOutPlanClick"
          >
          <div style="padding: 5px;">
            <el-link
              type="primary"
              @click="handleOutPlanClick"
            >出库计划</el-link>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :span="12"
        style="text-align: center;"
      >
        <div class="card_grid card_grid_hoverable">
          <img
            src="@/assets/images/quick/入库单.png"
            class="image_button"
            @click="handleInClick"
          >
          <div style="padding: 5px;">
            <el-link
              type="primary"
              @click="handleInClick"
            >入库单</el-link>
          </div>
        </div>
      </el-col>
      <el-col
        :span="12"
        style="text-align: center;"
      >
        <div class="card_grid card_grid_hoverable">
          <img
            src="@/assets/images/quick/出库单.png"
            class="image_button"
            @click="handleOutClick"
          >
          <div style="padding: 5px;">
            <el-link
              type="primary"
              @click="handleOutClick"
            >出库单</el-link>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :span="12"
        style="text-align: center;"
      >
        <div class="card_grid card_grid_hoverable">
          <img
            src="@/assets/images/quick/库存调整.png"
            class="image_button"
            @click="handleAdjustClick"
          >
          <div style="padding: 5px;">
            <el-link
              type="primary"
              @click="handleAdjustClick"
            >库存调整</el-link>
          </div>
        </div>
      </el-col>
      <el-col
        :span="12"
        style="text-align: center;"
      >
        <div class="card_grid card_grid_hoverable">
          <img
            src="@/assets/images/quick/库存调拨.png"
            class="image_button"
            @click="handleAllocateClick"
          >
          <div style="padding: 5px;">
            <el-link
              type="primary"
              @click="handleAllocateClick"
            >库存调拨</el-link>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :span="12"
        style="text-align: center;"
      >
        <div class="card_grid card_grid_hoverable">
          <img
            src="@/assets/images/quick/库存明细查询.png"
            class="image_button"
            @click="handleInventoryDetailQueryClick"
          >
          <div style="padding: 5px;">
            <el-link
              type="primary"
              @click="handleInventoryDetailQueryClick"
            >库存明细查询</el-link>
          </div>
        </div>
      </el-col>
      <el-col
        :span="12"
        style="text-align: center;"
      >
        <div class="card_grid card_grid_hoverable">
          <img
            src="@/assets/images/quick/库存流水查询.png"
            class="image_button"
            @click="handleInventorySequenceQueryClick"
          >
          <div style="padding: 5px;">
            <el-link
              type="primary"
              @click="handleInventorySequenceQueryClick"
            >库存流水查询</el-link>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        v-if="show_cockpit"
        :span="12"
        style="text-align: center;"
      >
        <div class="card_grid card_grid_hoverable">
          <img
            src="@/assets/images/quick/管理驾驶舱.jpg"
            class="image_button"
            @click="handleOpenCockpit"
          >
          <div style="padding: 5px;">
            <el-link
              type="primary"
              @click="handleOpenCockpit"
            >管理驾驶舱</el-link>
          </div>
        </div>

      </el-col>
      <el-col
        :span="12"
        style="text-align: center;"
      >
        <div class="card_grid card_grid_hoverable">
          <img
            src="@/assets/images/quick/物流管理大屏1.png"
            class="image_button"
            @click="handleOpenLogisticsLargeScreenClick"
          >
          <div style="padding: 5px;">
            <el-link
              type="primary"
              @click="handleOpenLogisticsLargeScreenClick"
            >物流数据看板</el-link>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.quickEntry .title {
  padding: 0 0 10px;
}
.image_button {
  width: 40px;
  height: 40px;
  vertical-align: middle;
  display: inline-block;
  cursor: pointer;
  margin-top: 10px;
}
.card_grid {
  /* float: left;
  width: 33.33%; */
  padding: 5px;
  border: 0;
  border-radius: 0;
  box-shadow: 1px 0 #f0f0f0, 0 1px #f0f0f0, 1px 1px #f0f0f0, 1px 0 #f0f0f0 inset,
    0 1px #f0f0f0 inset;
  transition: all 0.3s;
}
.card_grid_hoverable:hover {
  position: relative;
  z-index: 1;
  box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f,
    0 5px 12px 4px #00000017;
}
</style>

<script>
import resize from './mixins/resize'
import constants_program from '@/common/constants/constants_program'
import { getListApi } from '@/api/10_system/config/config'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '805px'
    }
  },
  data () {
    return {
      chart: null,
      // 是否显示驾驶舱入口
      show_cockpit: false,
      // 驾驶舱路径
      cockpit_url: ''
    }
  },
  created () {
    this.getCockpitUrl()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getCockpitUrl () {
      const param = {
        pageCondition: {}
      }
      param.pageCondition.current = 1
      param.pageCondition.size = 1
      param.config_key = 'cockpit_url'
      getListApi(param).then(response => {
        const listData = response.data.records
        if (listData && listData.length) {
          this.show_cockpit = true
          this.cockpit_url = listData[0].value
        } else {
          this.show_cockpit = false
        }
      }).finally(() => {
      })
    },
    // 入库计划点击事件
    handleInPlanClick () {
      this.$router.push({
        name: constants_program.P_IN_PLAN, params: {}
      })
    },
    // 出库计划点击事件
    handleOutPlanClick () {
      this.$router.push({
        name: constants_program.P_OUT_PLAN, params: {}
      })
    },
    // 入库单点击事件
    handleInClick () {
      this.$router.push({
        name: constants_program.P_IN, params: {}
      })
    },
    // 出库单点击事件
    handleOutClick () {
      this.$router.push({
        name: constants_program.P_OUT, params: {}
      })
    },
    // 库存调整
    handleAdjustClick () {
      this.$router.push({
        name: constants_program.P_ADJUST, params: {}
      })
    },
    // 库存调拨
    handleAllocateClick () {
      this.$router.push({
        name: constants_program.P_ALLOCATE, params: {}
      })
    },
    // 库存明细查询
    handleInventoryDetailQueryClick () {
      this.$router.push({
        name: constants_program.P_INVENTORY_DETAIL, params: {}
      })
    },
    // 库存流水查询
    handleInventorySequenceQueryClick () {
      this.$router.push({
        name: constants_program.P_INVENTORY_ACCOUNT, params: {}
      })
    },
    // 管理驾驶舱
    handleOpenCockpit () {
      window.open(this.cockpit_url)
    },
    // 库存流水查询
    handleOpenLogisticsLargeScreenClick () {
      // 获取当前页面的URL 构建完整的URL
      const newURL = window.location.origin + '/#/logistics_large_screen'
      window.open(newURL, '_blank')
    }
  }
}
</script>
