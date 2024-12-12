<template>
  <div>
    <div class="container">
      <el-row
        v-for="( value, index) in dataJson.listData"
        :key="index"
        class="rowStyle"
      >
        <!-- <el-tooltip
          class="item"
          effect="dark"
          :content="value.msg"
          placement="top-end"
        > -->
        <el-col :span="24">
          <el-link target="_blank">
            <router-link
              :to="{name:value.pageCode,query:{code:value.serial_code,serial_id:value.serial_id, fullpath:true}}"
              @click.native="closeTable"
            >
              <a href="javascript:void(0)">
                {{ value.msg }}
              </a></router-link>
          </el-link>
          <br>
          <span class="labelStyle">
            <font
              color="white"
              :style="{'padding' : '5px'}"
            >
              {{ value.label }}
            </font>
          </span>
          <span>
            {{ formatDateTime(value.c_time) }}
          </span>
          <span style="float: right">
            预警
          </span>
          <el-divider />
        </el-col>
        <!-- </el-tooltip> -->
      </el-row>
    </div>
    <span class="pagerStyle">
      <Pagination
        v-if="dataJson.paging.total"
        :page-size="dataJson.searchForm.pageCondition.size"
        :total="dataJson.paging.total"
        :cur-page="dataJson.searchForm.pageCondition.current"
        @pagination="gotoPage"
      />
    </span>
  </div>
</template>

<script>
import { getHeaderPageList } from '@/api/10_system/message'
import Pagination from '@/components/Pagination_for_notice'
import constants_program from '@/common/constants/constants_program'
import deepCopy from 'deep-copy'

export default {
  components: { Pagination },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 30) {
        return value.slice(0, 30) + '...'
      }
      return value
    }
  },
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
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION_C_TIME),
          // 查询条件
          name: '',
          code: '',
          status: null
        },
        listData: [],
        paging: {},
        // 页面code
        pageCode: null
      }
    }
  },
  created () {
    this.getDataList()
  },
  beforeDestroy () {
    // alert('销毁了')
  },
  methods: {
    closeTable () {
      this.$emit('closeTable')
    },
    getDataList () {
      this.dataJson.searchForm.pageCondition.current = 1
      this.dataJson.searchForm.pageCondition.size = 6
      getHeaderPageList(this.dataJson.searchForm).then(response => {
        const recorders = response.data.records
        // 遍历, 添加页面
        const recordersNew = recorders.map(v => {
          if (v.serial_type === 'b_monitor' || v.serial_type === 'b_monitor_sync' || v.serial_type === 'b_monitor_unaudited' || v.serial_type === 'm_monitor_loss') {
            v.pageCode = this.constants_program.P_MONITOR
          } else if (v.serial_type === 'b_in') {
            v.pageCode = this.constants_program.P_IN
          } else if (v.serial_type === 'b_out') {
            v.pageCode = this.constants_program.P_OUT
          } else if (v.serial_type === 'b_out_plan') {
            v.pageCode = this.constants_program.P_OUT_PLAN
          } else if (v.serial_type === 'b_in_plan') {
            v.pageCode = this.constants_program.P_IN_PLAN
          } else if (v.serial_type === 'm_inventory_stag') {
            v.pageCode = this.constants_program.M_INVENTORY_STAGNATION_WARNING
          }
          return v
        })
        this.dataJson.listData = recordersNew
        this.dataJson.paging = response.data
        this.$store.commit('headNotice/UPDATE_ALARM_COUNT', response.data.total)
        this.dataJson.paging.records = {}
      }).finally(() => {
      })
    },
    gotoPage (val) {
      this.dataJson.searchForm.pageCondition.current = val
      getHeaderPageList(this.dataJson.searchForm).then(response => {
        const recorders = response.data.records
        // 遍历, 添加页面
        const recordersNew = recorders.map(v => {
          if (v.serial_type === 'b_monitor' || v.serial_type === 'm_monitor_loss') {
            v.pageCode = this.constants_program.P_MONITOR
          } else if (v.serial_type === 'b_in') {
            v.pageCode = this.constants_program.P_IN
          } else if (v.serial_type === 'b_out') {
            v.pageCode = this.constants_program.P_OUT
          } else if (v.serial_type === 'b_out_plan') {
            v.pageCode = this.constants_program.P_OUT_PLAN
          } else if (v.serial_type === 'b_in_plan') {
            v.pageCode = this.constants_program.P_IN_PLAN
          } else if (v.serial_type === 'm_inventory_stag') {
            v.pageCode = this.constants_program.M_INVENTORY_STAGNATION_WARNING
          }
          return v
        })
        this.dataJson.listData = recordersNew
        this.dataJson.paging = response.data
        this.$store.commit('headNotice/UPDATE_ALARM_COUNT', response.data.total)
        this.dataJson.paging.records = {}
      }).finally(() => {
      })
    },
    handleClose () {
      alert(111)
    }
  }
}
</script>

<style lang="scss" scoped>
br {
  display: block;
  margin: 0px;
  content: ' ';
}
.rowStyle {
  font-size: 11px;
  padding: 5px;
}
.rowStyle .labelStyle {
  background-color: red;
  border-radius: 5px;
}
.rowStyle span {
  margin-right: 10px;
}
.container {
  height: 200px;
}
.pagerStyle {
  width: 15%;
  float: right;
}
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 96%;
  margin: 3px 0 1px 0;
}
.el-link {
  font-size: 12px;
}
</style>
