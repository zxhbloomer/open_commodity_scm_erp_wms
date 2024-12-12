<template>
  <div class="exeBg">
    <el-container>
      <el-header style="height: 85px">
        <div class="header">
          物流数据管理驾驶舱
        </div>
        <span class="dateHeader">
          {{ dataJson.date }}
          <i
            style="font-size: 20px;cursor: pointer;margin-left: 10px;"
            :class="
              isFullPage
                ? ['el-icon-full-screen', 'screenShow']
                : ['el-icon-full-screen']
            "
            @click="fullpageClick"
          />
        </span>
      </el-header>
      <el-main>
        <el-row :gutter="15">
          <el-col :span="17">
            <el-row>
              <el-col :span="9">
                <div class="left-top">
                  <div class="title-font title">
                    供应链
                  </div>
                  <div class="data">
                    <div class="right">
                      <div class="top">
                        <router-link :to="{name:constants_program.P_OUT,query:{ batch_date:dataJson.supply.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_ZERO, fullpath:true}}"><a
                          href="javascript:void(0)"
                        >
                          <div class="top_1 data-title">
                            原粮累计出库量（吨）
                          </div>
                          <div class="countTo">
                            <CountTo
                              :start-val="0"
                              :end-val="dataJson.supply.raw_grain_out_qty"
                              :decimals="1"
                              :duration="1000"
                            />
                          </div>
                        </a></router-link>
                      </div>
                      <div class="down">
                        <router-link :to="{name:constants_program.P_IN,query:{ batch_date:dataJson.supply.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_ZERO, fullpath:true}}"><a
                          href="javascript:void(0)"
                        >
                          <div class="top_1 data-title">
                            加工厂累计生产数量（吨）
                          </div>
                          <div class="countTo">
                            <CountTo
                              :start-val="0"
                              :end-val="dataJson.supply.product_qty"
                              :decimals="1"
                              :duration="1000"
                            />
                          </div>
                        </a></router-link>
                      </div>

                      <!--                      <div class="new-height">-->
                      <!--                        <router-link :to="{name:constants_program.P_IN,query:{ batch_date:dataJson.supply.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_FOUR, fullpath:true}}"><a-->
                      <!--                          href="javascript:void(0)"-->
                      <!--                        >-->
                      <!--                          <div class="top_1 data-title">-->
                      <!--                            加工厂累计生产稻壳数量（吨）-->
                      <!--                          </div>-->
                      <!--                          <div class="countTo">-->
                      <!--                            <CountTo-->
                      <!--                              :start-val="0"-->
                      <!--                              :end-val="dataJson.supply.rice_husk_qty"-->
                      <!--                              :decimals="1"-->
                      <!--                              :duration="1000"-->
                      <!--                            />-->
                      <!--                          </div>-->
                      <!--                        </a></router-link>-->
                      <!--                      </div>-->

                    </div>
                    <div class="left">
                      <div class="top">
                        <router-link :to="{name:constants_program.P_OUT,query:{ batch_date:dataJson.supply.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_SIX, fullpath:true}}"><a
                          href="javascript:void(0)"
                        >
                          <div class="top_1 data-title">
                            销售累计出库量（吨）
                          </div>
                          <div class="countTo">
                            <CountTo
                              :start-val="0"
                              :end-val="dataJson.supply.purchase_out_qty"
                              :decimals="1"
                              :duration="1000"
                            />
                          </div>
                        </a></router-link>
                      </div>
                      <div class="down">
                        <router-link :to="{name:constants_program.P_MONITOR,query:{ batch_date:dataJson.supply.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_THREE, fullpath:true}}"><a
                          href="javascript:void(0)"
                        >
                          <div class="top_1 data-title">
                            饲料厂收货数量（吨）
                          </div>
                          <div class="countTo">
                            <CountTo
                              :start-val="0"
                              :end-val="dataJson.supply.feed_in_qty"
                              :decimals="1"
                              :duration="1000"
                            />
                          </div>
                        </a></router-link>
                      </div>

                      <!--                      <div class="new-height">-->
                      <!--                        <router-link :to="{name:constants_program.P_IN,query:{ batch_date:dataJson.supply.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_FIVE, fullpath:true}}"><a-->
                      <!--                          href="javascript:void(0)"-->
                      <!--                        >-->
                      <!--                          <div class="top_1 data-title">-->
                      <!--                            加工厂累计生产杂质数量（吨）-->
                      <!--                          </div>-->
                      <!--                          <div class="countTo">-->
                      <!--                            <CountTo-->
                      <!--                              :start-val="0"-->
                      <!--                              :end-val="dataJson.supply.impurity_qty"-->
                      <!--                              :decimals="1"-->
                      <!--                              :duration="1000"-->
                      <!--                            />-->
                      <!--                          </div>-->
                      <!--                        </a></router-link>-->
                      <!--                      </div>-->

                    </div>
                  </div>
                </div>
                <div class="left-middle">
                  <div class="title-font title">
                    车次相关
                  </div>
                  <div class="data">
                    <div class="left">
                      <div class="data-title top_1">
                        累计派车次数
                        <div class="countTo">
                          <CountTo
                            :start-val="0"
                            :end-val="dataJson.train_count.monitor_total"
                            :duration="1000"
                          />
                        </div>
                      </div>
                      <div class="data-title down_1">
                        当月派车次数
                        <div class="countTo">
                          <CountTo
                            :start-val="0"
                            :end-val="dataJson.train_count.month_monitor"
                            :duration="1000"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="middle">
                      <div class="data-title top_1">
                        在途车次数量
                        <div class="countTo">
                          <CountTo
                            :start-val="0"
                            :end-val="dataJson.train_count.in_transit_monitor"
                            :duration="1000"
                          />
                        </div>
                      </div>
                      <div class="data-title down_1">
                        异常车次
                        <div class="countTo" style="color: red">
                          <CountTo
                            :start-val="0"
                            :end-val="dataJson.train_count.unusual_monitor"
                            :duration="1000"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="right">
                      <div class="data-title top_1">
                        累计完成车次
                        <div class="countTo">
                          <CountTo
                            :start-val="0"
                            :end-val="dataJson.train_count.complete_monitor"
                            :duration="1000"
                          />
                        </div>
                      </div>
                      <div class="data-title down_1">
                        当月完成车次
                        <div class="countTo">
                          <CountTo
                            :start-val="0"
                            :end-val="dataJson.train_count.month_complete_monitor"
                            :duration="1000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="15">
                <div class="middle-top">
                  <div class="title-font title">
                    物流合同
                  </div>
                  <div class="data">
                    <div class="first">
                      <div class="data-title top_1">
                        <router-link :to="{name:constants_program.P_LOGISTICS,query:{ batch_date:dataJson.carriage.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_ZERO, fullpath:true}}"><a
                          href="javascript:void(0)"
                        >
                          累计运输合同量（吨）
                          <div class="countTo">
                            <CountTo
                              :start-val="0"
                              :end-val="dataJson.carriage.carriage_num"
                              :duration="1000"
                              :decimals="1"
                            />
                          </div>
                        </a></router-link>
                      </div>
                      <div class="data-title down_1">
                        <router-link :to="{name:constants_program.P_LOGISTICS,query:{ batch_date:dataJson.carriage.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_ONE, fullpath:true}}"><a
                          href="javascript:void(0)"
                        >
                          待运合同量（吨）
                          <div class="countTo">
                            <CountTo
                              :start-val="0"
                              :end-val="dataJson.carriage.predict_carriage_num"
                              :duration="1000"
                              :decimals="1"
                            />
                          </div>
                        </a></router-link>
                      </div>
                    </div>
                    <div class="second">
                      <div class="data-title top_1">
                        <router-link :to="{name:constants_program.P_MONITOR,query:{ batch_date:dataJson.carriage.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_ONE, fullpath:true}}"><a
                          href="javascript:void(0)"
                        >
                          累计完成量（吨）
                          <div class="countTo">
                            <CountTo
                              :start-val="0"
                              :end-val="dataJson.carriage.complete_carriage_num"
                              :duration="1000"
                              :decimals="1"
                            />
                          </div>
                        </a></router-link>
                      </div>
                      <div class="data-title down_1">
                        <router-link :to="{name:constants_program.P_MONITOR,query:{ batch_date:dataJson.carriage.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_ONE, fullpath:true}}"><a
                          href="javascript:void(0)"
                        >
                          累计损耗数量（吨）
                          <div class="countTo">
                            <CountTo
                              :start-val="0"
                              :end-val="dataJson.carriage.loss_carriage_num"
                              :duration="1000"
                              :decimals="1"
                            />
                          </div>
                        </a></router-link>
                      </div>
                    </div>
                    <div class="third">
                      <div class="data-title top_1">
                        <router-link :to="{name:constants_program.P_MONITOR,query:{ batch_date:dataJson.carriage.batch_date,logistics_status:Constants_dict.DICT_LOGISTICS_LARGE_SCREEN_TWO, fullpath:true}}"><a
                          href="javascript:void(0)"
                        >
                          在途数量（吨）
                          <div class="countTo">
                            <CountTo
                              :start-val="0"
                              :end-val="dataJson.carriage.in_transit_carriage_num"
                              :duration="1000"
                              :decimals="1"
                            />
                          </div>
                        </a></router-link>
                      </div>
                      <div class="data-title down_1">
                        合同完成进度
                        <div class="countTo">
                          <CountTo
                            :start-val="0"
                            :end-val="dataJson.carriage.carriage_complete_processing"
                            :duration="1000"
                            :decimals="1"
                            suffix="%"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="fourth">
                      <div class="data-title top_1">
                        承运商数量
                        <div class="countTo">
                          <CountTo
                            :start-val="0"
                            :end-val="dataJson.carriage.customer_count"
                            :duration="1000"
                          />
                        </div>
                      </div>
                      <div class="data-title down_1" />
                    </div>
                  </div>
                  <div class="middle-middle">

                    <div class="left">
                      <div class="title-font title">
                        当月数据
                      </div>
                      <div class="data">
                        <div class="first">
                          <div class="data-title top_1">
                            完成运输量（吨）
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.month_complete_qty"
                                :duration="1000"
                                :decimals="1"
                              />
                            </div>
                          </div>
                          <div class="data-title down_2">
                            损耗（吨）
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.month_loss_qty"
                                :duration="1000"
                                :decimals="1"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="second">
                          <div class="data-title top_1">
                            饲料厂收货量（吨）
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.month_feed_in_qty"
                                :duration="1000"
                                :decimals="1"
                              />
                            </div>
                          </div>
                          <div class="data-title down_2">
                            加工厂生产量（吨）
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.month_product_qty"
                                :duration="1000"
                                :decimals="1"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="third">
                          <div class="data-title top_1">
                            原粮出库量（吨）
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.month_raw_grain_qty"
                                :duration="1000"
                                :decimals="1"
                              />
                            </div>
                          </div>
                          <div class="data-title down_2">
                            销售出库量（吨）
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.month_sales_out_qty"
                                :duration="1000"
                                :decimals="1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="right">
                      <div class="title-font title">
                        当天数据
                      </div>
                      <div class="data">
                        <div class="first">
                          <div class="data-title top_1">
                            派车数
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.daily_monitor_count"
                                :duration="1000"
                              />
                            </div>
                          </div>
                          <div class="data-title down_2">
                            销售出库量
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.daily_sales_out_qty"
                                :duration="1000"
                                :decimals="1"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="second">
                          <div class="data-title top_1">
                            完成车次
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.daily_complete_monitor_count"
                                :duration="1000"
                              />
                            </div>
                          </div>
                          <div class="data-title down_2">
                            生产数量
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.daily_product_qty"
                                :duration="1000"
                                :decimals="1"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="third">
                          <div class="data-title top_1">
                            在途车次
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.daily_in_transit_monitor_count"
                                :duration="1000"
                              />
                            </div>
                          </div>
                          <div class="data-title down_2">
                            饲料厂收货量
                            <div class="countTo">
                              <CountTo
                                :start-val="0"
                                :end-val="dataJson.month.daily_in_qty"
                                :duration="1000"
                                :decimals="1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="7">
            <div class="right-data">
              <div class="title-font title">
                实时运输状态
              </div>
              <div class="right-title">
                <el-row :gutter="4" style="margin-left: 10px; margin-top: 10px">
                  <el-col :span="2" style="font-size: 15px; color: #c2cff0">序号</el-col>
                  <el-col :span="8" style="font-size: 15px; color: #c2cff0">任务号</el-col>
                  <el-col :span="8" style="font-size: 15px; color: #c2cff0">车牌号</el-col>
                  <el-col :span="6" style="font-size: 15px; color: #c2cff0">状态</el-col>
                </el-row>
              </div>
              <div class="data">
                <el-row v-for="item in dataJson.monitor_list" :key="item.code" :gutter="4" style="margin-left: 10px; margin-top: 10px">
                  <el-col :span="2" style="font-size: 15px; color: #c2cff0">{{ item.no }}</el-col>
                  <el-col :span="8" style="font-size: 15px; color: #c2cff0">{{ item.code }}</el-col>
                  <el-col :span="8" style="font-size: 15px; color: #c2cff0">{{ item.vehicle_no }}</el-col>
                  <el-col :span="6" style="font-size: 15px; color: #c2cff0">{{ item.status_name }}</el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>

</template>

<script>
import { fullPage } from '@/mixin/fullPage'
import { parseTime } from '@/utils'
import CountTo from 'vue-count-to'
import constants_program from '@/common/constants/constants_program'
import { getLogisticsSupplyApi, getTrainCountApi, getCarriageCountApi, getMonthDataApi, getMonitorListApi } from '@/api/50_query/largescreen'
import Constants_dict from '@/common/constants/constants_dict'
export default {
  components: { CountTo },
  mixins: [fullPage],
  data () {
    return {
      dataJson: {
        date: null, // 日期
        // 供应链相关
        supply: {
          raw_grain_out_qty: 0,
          purchase_out_qty: 0,
          product_qty: 0,
          feed_in_qty: 0,
          rice_husk_qty: 0,
          impurity_qty: 0
        },
        // 车次相关
        train_count: {
          monitor_total: 0,
          in_transit_monitor: 0,
          complete_monitor: 0,
          month_monitor: 0,
          unusual_monitor: 0,
          month_complete_monitor: 0
        },
        // 物流合同
        carriage: {
          carriage_num: 0,
          predict_carriage_num: 0,
          complete_carriage_num: 0,
          loss_carriage_num: 0,
          in_transit_carriage_num: 0,
          carriage_complete_processing: 0,
          customer_count: 0,
          contract_over_due_count: 0,
          batch_date: 0
        },
        month: {
          month_complete_qty: 0,
          month_loss_qty: 0,
          month_feed_in_qty: 0,
          month_product_qty: 0,
          month_raw_grain_qty: 0,
          month_sales_out_qty: 0,
          daily_monitor_count: 0,
          daily_sales_out_qty: 0,
          daily_complete_monitor_count: 0,
          daily_product_qty: 0,
          daily_in_transit_monitor_count: 0,
          daily_in_qty: 0
        },
        // 实时运输状态
        monitor_list: []
      }
    }
  },
  computed: {
    Constants_dict () {
      return Constants_dict
    },
    constants_program () {
      return constants_program
    }
  },
  created () {
    this.initData()
    this.initDay()
  },
  mounted () {
    this.timer = setInterval(() => {
      this.initDay()
    }, 1000)
    this.timer1 = setInterval(() => {
      this.initData()
    }, 60 * 5 * 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timer1)
  },
  methods: {
    // 获取今天日期
    initDay () {
      this.dataJson.date = parseTime(new Date(), '{y}年{m}月{d}日 {h}:{i}:{s} 星期{a}')
    },
    initData () {
      this.getSupplyData() // 供应链
      this.getTrainCountData() // 车次相关
      this.getCarriageCountData() // 物流合同
      this.getMonthData() // 当月当天数据
      this.getMonitorListData() // 实时运输状态
    },
    // 供应链
    getSupplyData () {
      getLogisticsSupplyApi().then(response => {
        this.dataJson.supply = response.data
      }).finally(() => {
      })
    },
    // 车次相关
    getTrainCountData () {
      getTrainCountApi().then(response => {
        this.dataJson.train_count = response.data
      }).finally(() => {
      })
    },
    // 物流合同
    getCarriageCountData () {
      getCarriageCountApi().then(response => {
        this.dataJson.carriage = response.data
      }).finally(() => {
      })
    },
    // 当月当天数据
    getMonthData () {
      getMonthDataApi().then(response => {
        this.dataJson.month = response.data
      }).finally(() => {
      })
    },
    // 实时运输状态
    getMonitorListData () {
      getMonitorListApi().then(response => {
        this.dataJson.monitor_list = response.data
      }).finally(() => {
      })
    }
  }
}
</script>

<style scoped>
/*.exeBg {*/
/*  width: 1920px;*/
/*  height: 1080px;*/
/*  background: url("~@/assets/images/largeeScreen/bg_8.png") no-repeat;*/
/*  background-size: cover;*/
/*  position: relative;*/
/*  display: flex;*/
/*  justify-content: space-evenly;*/
/*  overflow: hidden;*/
/*.header {
  display: flex;
  justify-content: center; !* 居中对齐水平方向 *!
  align-items: center; !* 居中对齐垂直方向 *!
  color: white;
  font-size: 32px;
  height: 100%; !* 设置元素高度为父元素高度，以实现垂直居中 *!
}*/
/*  .dateHeader {*/
/*    position: absolute;*/
/*    top: 33px;*/
/*    color: #1ebbfc;*/
/*    font-size: 18px;*/
/*    font-weight: 400;*/
/*    right: 46px;*/
/*  }*/
/*  .left-top {*/
/*    width: 509px;*/
/*    height: 453px;*/
/*    margin-top: 1px;*/
/*    margin-left: 5px;*/
/*    .el-divider--vertical {*/
/*      display: inline-block;*/
/*      width: 2px;*/
/*      height: 20em;*/
/*      margin: 1px 2px;*/
/*      vertical-align: middle;*/
/*      position: relative;*/
/*    }*/
/*    .title {*/
/*      padding-top: 24px;*/
/*      padding-left: 23px;*/
/*    }*/
/*    .data {*/
/*      display: flex;*/
/*      height: 410px;*/
/*      .right {*/
/*        flex: 1;*/
/*        .top {*/
/*          height: 200px;*/
/*          //margin: 5px 5px;*/
/*          .top_1 {*/
/*            padding-top: 50px;*/
/*          }*/
/*        }*/
/*        .down {*/
/*          height: 126px;*/
/*          //margin: 5px 5px;*/
/*          .top_1 {*/
/*            padding-top: 10px;*/
/*          }*/
/*        }*/
/*      }*/
/*      .left {*/
/*        flex: 1;*/
/*        .top {*/
/*          height: 200px;*/
/*          //margin: 5px 5px;*/
/*          .top_1 {*/
/*            padding-top: 50px;*/
/*          }*/
/*        }*/
/*        .down {*/
/*          height: 200px;*/
/*          //margin: 5px 5px;*/
/*          .top_1 {*/
/*            padding-top: 10px;*/
/*          }*/
/*        }*/
/*      }*/
/*    }*/
/*  }*/
/*  .left-middle {*/
/*    width: 509px;*/
/*    height: 301px;*/
/*    margin-top: 16px;*/
/*    margin-left: 5px;*/
/*    .title {*/
/*      padding-top: 24px;*/
/*      padding-left: 23px;*/
/*    }*/
/*    .data {*/
/*      display: flex;*/
/*      height: 400px;*/
/*      .top_1 {*/
/*        height: 200px;*/
/*        padding-top: 50px;*/
/*        margin: 5px 5px;*/
/*      }*/
/*      .down_1 {*/
/*        height: 140px;*/
/*        padding-top: 10px;*/
/*        margin: 5px 5px;*/
/*      }*/
/*      .left {*/
/*        flex: 1;*/
/*      }*/
/*      .middle {*/
/*        flex: 1;*/
/*      }*/
/*      .right {*/
/*        flex: 1;*/
/*      }*/
/*    }*/
/*  }*/
/*  .middle-top {*/
/*    width: 828px;*/
/*    height: 301px;*/
/*    margin-left: 29px;*/
/*    margin-top: 1px;*/
/*    .title {*/
/*      padding-top: 24px;*/
/*      padding-left: 21px;*/
/*    }*/
/*    .data {*/
/*      display: flex;*/
/*      height: 253px;*/
/*      .top_1 {*/
/*        height: 200px;*/
/*        padding-top: 50px;*/
/*        margin: 5px 5px;*/
/*      }*/
/*      .down_1 {*/
/*        height: 120px;*/
/*        padding-top: 10px;*/
/*        margin: 5px 5px;*/
/*      }*/
/*      .down_2 {*/
/*        height: 120px;*/
/*        padding-top: 10px;*/
/*        margin: 5px 5px;*/
/*      }*/
/*      .first {*/
/*        flex: 1;*/
/*      }*/
/*      .second {*/
/*        flex: 1;*/
/*      }*/
/*      .third {*/
/*        flex: 1*/
/*      }*/
/*      .fourth {*/
/*        flex: 1*/
/*      }*/
/*    }*/
/*    .middle-middle {*/
/*      width: 828px;*/
/*      height: 286px;*/
/*      padding-top: 146px;*/
/*      margin-top: 27px;*/
/*      display: flex;*/
/*      .left {*/
/*        flex: 4;*/
/*        .data {*/
/*          display: flex;*/
/*          .first {*/
/*            flex: 1;*/
/*          }*/
/*          .second {*/
/*            flex: 1;*/
/*          }*/
/*          .third {*/
/*            flex: 1;*/
/*          }*/
/*        }*/
/*      }*/
/*      .right {*/
/*        flex: 3;*/
/*        .data {*/
/*          display: flex;*/
/*          .first {*/
/*            flex: 1;*/
/*          }*/
/*          .second {*/
/*            flex: 1;*/
/*          }*/
/*          .third {*/
/*            flex: 1;*/
/*          }*/
/*        }*/
/*      }*/
/*    }*/
/*  }*/
/*  .right-data {*/
/*    height: 932px;*/
/*    margin-left: 50px;*/
/*    .title {*/
/*      padding-top: 17px;*/
/*      padding-left: 21px;*/
/*    }*/
/*  }*/
/*}*/
/*.screenShow {*/
/*  color: #000723;*/
/*}*/
/*.screenShow:hover {*/
/*  color: #1EBBFC;*/
/*}*/
/*.title-font {*/
/*  font-size: 18px;*/
/*  color: #1EBBFC;*/
/*  font-weight: bold;*/
/*}*/
/*.countTo {*/
/*  padding-top: 15px;*/
/*  font-size: 22px;*/
/*  color: #c2cff0;*/
/*  text-align: center;*/
/*}*/
/*.data-title {*/
/*  color: #c2cff0;*/
/* text-align: center;*/
/* } */
/* 搜狗浏览器好像不支持 css 的嵌套写法 */
/* .exeBg */
.exeBg {
  width: 1920px;
  height: 1080px;
  background: url("~@/assets/images/largeeScreen/bg_8.png") no-repeat;
  background-size: cover;
  position: relative;
  display: flex;
  justify-content: space-evenly;
  overflow: hidden;
}
.exeBg .header {
  display: flex;
  justify-content: center; /* 居中对齐水平方向 */
  align-items: center; /* 居中对齐垂直方向 */
  color: white;
  font-size: 32px;
  height: 100%; /* 设置元素高度为父元素高度，以实现垂直居中 */
}

/* .dateHeader */
.exeBg .dateHeader {
  position: absolute;
  top: 33px;
  color: #1ebbfc;
  font-size: 18px;
  font-weight: 400;
  right: 46px;
}

/* .left-top */
.exeBg .left-top {
  width: 509px;
  height: 453px;
  margin-top: 1px;
  margin-left: 5px;
}

/* .left-top .el-divider--vertical */
.exeBg .left-top .el-divider--vertical {
  display: inline-block;
  width: 2px;
  height: 20em;
  margin: 1px 2px;
  vertical-align: middle;
  position: relative;
}

/* .left-top .title */
.exeBg .left-top .title {
  padding-top: 24px;
  padding-left: 23px;
}

/* .left-top .data */
.exeBg .left-top .data {
  display: flex;
  height: 410px;
}

/* .left-top .data .right */
.exeBg .left-top .data .right {
  flex: 1;
}

/* .left-top .data .right .top */
.exeBg .left-top .data .right .top {
  height: 200px;
}

/* .left-top .data .right .top .top_1 */
.exeBg .left-top .data .right .top .top_1 {
  padding-top: 50px;
}

/* .left-top .data .right .down */
.exeBg .left-top .data .right .down {
  height: 126px;
}

/* .left-top .data .right .down .top_1 */
.exeBg .left-top .data .right .down .top_1 {
  padding-top: 10px;
}

/* .left-top .data .left */
.exeBg .left-top .data .left {
  flex: 1;
}

/* .left-top .data .left .top */
.exeBg .left-top .data .left .top {
  height: 200px;
}

/* .left-top .data .left .top .top_1 */
.exeBg .left-top .data .left .top .top_1 {
  padding-top: 50px;
}

/* .left-top .data .left .down */
.exeBg .left-top .data .left .down {
  height: 200px;
}

/* .left-top .data .left .down .top_1 */
.exeBg .left-top .data .left .down .top_1 {
  padding-top: 10px;
}

/* .left-middle */
.exeBg .left-middle {
  width: 509px;
  height: 301px;
  margin-top: 16px;
  margin-left: 5px;
}

/* .left-middle .title */
.exeBg .left-middle .title {
  padding-top: 24px;
  padding-left: 23px;
}

/* .left-middle .data */
.exeBg .left-middle .data {
  display: flex;
  height: 400px;
}

/* .left-middle .data .top_1 */
.exeBg .left-middle .data .top_1 {
  height: 200px;
  padding-top: 50px;
  margin: 5px 5px;
}

/* .left-middle .data .down_1 */
.exeBg .left-middle .data .down_1 {
  height: 140px;
  padding-top: 10px;
  margin: 5px 5px;
}

/* .left-middle .data .left */
.exeBg .left-middle .data .left {
  flex: 1;
}

/* .left-middle .data .middle */
.exeBg .left-middle .data .middle {
  flex: 1;
}

/* .left-middle .data .right */
.exeBg .left-middle .data .right {
  flex: 1;
}

/* .middle-top */
.exeBg .middle-top {
  width: 828px;
  height: 301px;
  margin-left: 29px;
  margin-top: 1px;
}

/* .middle-top .title */
.exeBg .middle-top .title {
  padding-top: 24px;
  padding-left: 21px;
}

/* .middle-top .data */
.exeBg .middle-top .data {
  display: flex;
  height: 253px;
}

/* .middle-top .data .top_1 */
.exeBg .middle-top .data .top_1 {
  height: 200px;
  padding-top: 50px;
  margin: 5px 5px;
}

/* .middle-top .data .down_1 */
.exeBg .middle-top .data .down_1 {
  height: 120px;
  padding-top: 10px;
  margin: 5px 5px;
}

/* .middle-top .data .down_2 */
.exeBg .middle-top .data .down_2 {
  height: 120px;
  padding-top: 10px;
  margin: 5px 5px;
}

/* .middle-top .data .first */
.exeBg .middle-top .data .first {
  flex: 1;
}

/* .middle-top .data .second */
.exeBg .middle-top .data .second {
  flex: 1;
}

/* .middle-top .data .third */
.exeBg .middle-top .data .third {
  flex: 1;
}

/* .middle-top .data .fourth */
.exeBg .middle-top .data .fourth {
  flex: 1;
}

/* .middle-middle */
.exeBg .middle-middle {
  width: 828px;
  height: 286px;
  padding-top: 146px;
  margin-top: 27px;
  display: flex;
}

/* .middle-middle .left */
.exeBg .middle-middle .left {
  flex: 4;
}

/* .middle-middle .left .data */
.exeBg .middle-middle .left .data {
  display: flex;
}

/* .middle-middle .left .data .first */
.exeBg .middle-middle .left .data .first {
  flex: 1;
}

/* .middle-middle .left .data .second */
.exeBg .middle-middle .left .data .second {
  flex: 1;
}

/* .middle-middle .left .data .third */
.exeBg .middle-middle .left .data .third {
  flex: 1;
}

/* .middle-middle .right */
.exeBg .middle-middle .right {
  flex: 3;
}

/* .middle-middle .right .data */
.exeBg .middle-middle .right .data {
  display: flex;
}

/* .middle-middle .right .data .first */
.exeBg .middle-middle .right .data .first {
  flex: 1;
}

/* .middle-middle .right .data .second */
.exeBg .middle-middle .right .data .second {
  flex: 1;
}

/* .middle-middle .right .data .third */
.exeBg .middle-middle .right .data .third {
  flex: 1;
}

/* .right-data */
.exeBg .right-data {
  height: 932px;
  margin-left: 50px;
}

/* .right-data .title */
.exeBg .right-data .title {
  padding-top: 17px;
  padding-left: 21px;
}

/* .screenShow */
.screenShow {
  color: #000723;
}

/* .screenShow:hover */
.screenShow:hover {
  color: #1EBBFC;
}

/* .title-font */
.title-font {
  font-size: 18px;
  color: #1EBBFC;
  font-weight: bold;
}

/* .countTo */
.countTo {
  padding-top: 15px;
  font-size: 22px;
  color: #c2cff0;
  text-align: center;
}

/* .data-title */
.data-title {
  color: #c2cff0;
  text-align: center;
}
.new-height {
  height: 80px;
  margin-top: 50px;
}
</style>
