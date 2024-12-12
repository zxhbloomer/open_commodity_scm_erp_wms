<template>
  <div class="app-container">
    <el-row>
      <el-col
        :span="24"
        class="card-box"
      >
        <el-card>
          <div slot="header"><span>基本信息</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table
              cellspacing="0"
              style="width: 100%"
            >
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">Redis版本</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ cache.info.redis_version }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">运行模式</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ cache.info.redis_mode == "standalone" ? "单机" : "集群" }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">端口</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ cache.info.tcp_port }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">客户端数</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ cache.info.connected_clients }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">运行时间(天)</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ cache.info.uptime_in_days }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">使用内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ cache.info.used_memory_human }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">使用CPU</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ parseFloat(cache.info.used_cpu_user_children).toFixed(2) }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">内存配置</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ cache.info.maxmemory_human }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">AOF是否开启</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ cache.info.aof_enabled == "0" ? "否" : "是" }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">RDB是否成功</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ cache.info.rdb_last_bgsave_status }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">Key数量</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.dbSize"
                      class="cell"
                    >{{ cache.dbSize }} </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">网络入口/出口</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="cache.info"
                      class="cell"
                    >{{ cache.info.instantaneous_input_kbps }}kps/{{ cache.info.instantaneous_output_kbps }}kps</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col
        :span="12"
        class="card-box"
      >
        <el-card>
          <div slot="header"><span>命令统计</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div
              ref="commandstats"
              style="height: 420px"
            />
          </div>
        </el-card>
      </el-col>

      <el-col
        :span="12"
        class="card-box"
      >
        <el-card>
          <div slot="header">
            <span>内存信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div
              ref="usedmemory"
              style="height: 420px"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang='scss' scoped>
/**
 * 通用css样式布局处理
 * Copyright (c) 2019 ruoyi
 */

/** 基础通用 **/
.pt5 {
  padding-top: 5px;
}
.pr5 {
  padding-right: 5px;
}
.pb5 {
  padding-bottom: 5px;
}
.mt5 {
  margin-top: 5px;
}
.mr5 {
  margin-right: 5px;
}
.mb5 {
  margin-bottom: 5px;
}
.mb8 {
  margin-bottom: 8px;
}
.ml5 {
  margin-left: 5px;
}
.mt10 {
  margin-top: 10px;
}
.mr10 {
  margin-right: 10px;
}
.mb10 {
  margin-bottom: 10px;
}
.ml10 {
  margin-left: 10px;
}
.mt20 {
  margin-top: 20px;
}
.mr20 {
  margin-right: 20px;
}
.mb20 {
  margin-bottom: 20px;
}
.ml20 {
  margin-left: 20px;
}

.h1,
.h2,
.h3,
.h4,
.h5,
.h6,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: inherit;
  font-weight: 500;
  line-height: 1.1;
  color: inherit;
}

.el-dialog:not(.is-fullscreen) {
  margin-top: 6vh !important;
}

.el-dialog__wrapper.scrollbar .el-dialog .el-dialog__body {
  overflow: auto;
  overflow-x: hidden;
  max-height: 70vh;
  padding: 10px 20px 0;
}

.el-table {
  .el-table__header-wrapper,
  .el-table__fixed-header-wrapper {
    th {
      word-break: break-word;
      background-color: #f8f8f9;
      color: #515a6e;
      height: 40px;
      font-size: 13px;
    }
  }
  .el-table__body-wrapper {
    .el-button [class*='el-icon-'] + span {
      margin-left: 1px;
    }
  }
}

/** 表单布局 **/
.form-header {
  font-size: 15px;
  color: #6379bb;
  border-bottom: 1px solid #ddd;
  margin: 8px 10px 25px 10px;
  padding-bottom: 5px;
}

/** 表格布局 **/
.pagination-container {
  position: relative;
  height: 25px;
  margin-bottom: 10px;
  margin-top: 15px;
  padding: 10px 20px !important;
}

/* tree border */
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #ffffff none;
  border-radius: 4px;
}

.pagination-container .el-pagination {
  right: 0;
  position: absolute;
}

@media (max-width: 768px) {
  .pagination-container .el-pagination > .el-pagination__jump {
    display: none !important;
  }
  .pagination-container .el-pagination > .el-pagination__sizes {
    display: none !important;
  }
}

.el-table .fixed-width .el-button--mini {
  padding-left: 0;
  padding-right: 0;
  width: inherit;
}

/** 表格更多操作下拉样式 */
.el-table .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 5px;
}

.el-table .el-dropdown,
.el-icon-arrow-down {
  font-size: 12px;
}

.el-tree-node__content > .el-checkbox {
  margin-right: 8px;
}

.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.list-group {
  padding-left: 0px;
  list-style: none;
}

.list-group-item {
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0px;
  font-size: 13px;
}

.pull-right {
  float: right !important;
}

.el-card__header {
  padding: 14px 15px 7px;
  min-height: 40px;
}

.el-card__body {
  padding: 15px 20px 20px 20px;
}

.card-box {
  padding-right: 15px;
  padding-left: 15px;
  margin-bottom: 10px;
}

/* button color */
.el-button--cyan.is-active,
.el-button--cyan:active {
  background: #20b2aa;
  border-color: #20b2aa;
  color: #ffffff;
}

.el-button--cyan:focus,
.el-button--cyan:hover {
  background: #48d1cc;
  border-color: #48d1cc;
  color: #ffffff;
}

.el-button--cyan {
  background-color: #20b2aa;
  border-color: #20b2aa;
  color: #ffffff;
}

/* text color */
.text-navy {
  color: #1ab394;
}

.text-primary {
  color: inherit;
}

.text-success {
  color: #1c84c6;
}

.text-info {
  color: #23c6c8;
}

.text-warning {
  color: #f8ac59;
}

.text-danger {
  color: #ed5565;
}

.text-muted {
  color: #888888;
}

/* image */
.img-circle {
  border-radius: 50%;
}

.img-lg {
  width: 120px;
  height: 120px;
}

.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
}

/* 拖拽列样式 */
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}

.top-right-btn {
  position: relative;
  float: right;
}
</style>

<script>
import { getApi } from '@/api/10_system/cache/cache'
import echarts from 'echarts'

export default {
  name: 'Cache',
  data () {
    return {
      // 统计命令信息
      commandstats: null,
      // 使用内存
      usedmemory: null,
      // cache信息
      cache: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    /** 查缓存询信息 */
    getData () {
      this.showLoading('正在加载缓存监控数据，请稍候...')
      getApi().then((response) => {
        this.cache = response.data
        this.closeLoading()

        this.commandstats = echarts.init(this.$refs.commandstats, 'macarons')
        this.commandstats.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '命令',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: response.data.commandStats,
              animationEasing: 'cubicInOut',
              animationDuration: 1000
            }
          ]
        })
        this.usedmemory = echarts.init(this.$refs.usedmemory, 'macarons')
        this.usedmemory.setOption({
          tooltip: {
            formatter: '{b} <br/>{a} : ' + this.cache.info.used_memory_human
          },
          series: [
            {
              name: '峰值',
              type: 'gauge',
              min: 0,
              max: 1000,
              detail: {
                formatter: this.cache.info.used_memory_human
              },
              data: [
                {
                  value: parseFloat(this.cache.info.used_memory_human),
                  name: '内存消耗'
                }
              ]
            }
          ]
        })
      })
    }
  }
}
</script>
