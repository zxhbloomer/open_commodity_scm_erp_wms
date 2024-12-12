<template>
  <div>
    <!-- <div class="fixed"> -->
    <!-- <el-row
        class="configTitle"
        fixed
      >
        <el-col :span="1" />
        <el-col
          :span="5"
          class="tal"
        >
          业务类型
        </el-col>
        <el-col
          :span="8"
          class="tal"
        >
          业务单号
        </el-col>
        <el-col
          :span="10"
          class="tal"
        >
          同步时间&nbsp;
          <el-button
            v-if="dataJson.listData.length"
            type="text"
            @click="handleSyncAll"
          >(重新同步)</el-button>
        </el-col>
      </el-row> -->
    <!-- </div>
    <el-divider /> -->
    <div
      v-if="showAlarm"
      class="infinite-list-wrapper"
      style="overflow:auto"
    >
      <ul
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        class="list"
      >
        <li
          v-for="item in dataJson.listData"
          :key="item.id"
        >
          <el-row class="configData">
            <el-col
              :span="5"
              class="tal"
            >
              {{ item.serial_type_name }}
            </el-col>
            <el-col
              :span="8"
              class="tal"
            >
              <template>
                <router-link
                  v-if="item.serial_type === 'b_in_plan'"
                  :to="{name:dataJson.constants_program.P_IN_PLAN,query:{serial_code:item.serial_code, fullpath:true}}"
                  @click.native="closeTable"
                ><a href="javascript:void(0)">{{ item.serial_code }}</a></router-link>
                <router-link
                  v-if="item.serial_type === 'b_out_plan'"
                  :to="{name:dataJson.constants_program.P_OUT_PLAN,query:{serial_code:item.serial_code, fullpath:true}}"
                  @click.native="closeTable"
                ><a href="javascript:void(0)">{{ item.serial_code }}</a></router-link>
                <router-link
                  v-if="item.serial_type === 'b_out'"
                  :to="{name:dataJson.constants_program.P_OUT,query:{serial_code:item.serial_code,fullpath:true}}"
                  @click.native="closeTable"
                ><a href="javascript:void(0)">{{ item.serial_code }}</a></router-link>
                <router-link
                  v-if="item.serial_type === 'b_in'"
                  :to="{name:dataJson.constants_program.P_IN,query:{serial_code:item.serial_code, fullpath:true}}"
                  @click.native="closeTable"
                ><a href="javascript:void(0)">{{ item.serial_code }}</a></router-link>
              </template>
            </el-col>
            <el-col
              :span="9"
              class="tal"
            >
              {{ formatDateTime(item.c_time) }}
            </el-col>
          </el-row>
        </li>
      </ul>
      <!-- <el-button
        v-if="settings.lazyLoad.showLoadingMore"
        type="text"
        @click="hanleSearch"
      >加载更多</el-button> -->
      <!-- <div v-if="settings.lazyLoad.showNoNore">没有更多了</div> -->
    </div>
    <el-pagination
      small
      layout="prev, pager, next"
      :total="50"
    />
  </div>
</template>

<style scoped>
.infinite-list-wrapper {
  height: 360px;
  margin: 0;
  width: 100%;
  text-align: center;
}
.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}
.tal {
  text-align: left;
}
.configTitle {
  margin-bottom: 7px;
}
.configData {
  margin-bottom: 5px;
}
a {
  color: #52b5f2;
}
.el-divider--horizontal {
  height: 1px;
  width: 100%;
  margin: 0px 0 5px 0;
}
.el-button--text {
  border-color: transparent;
  color: #1890ff;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
  padding: 0px 0;
}
/* 固定导航栏 */
.fixed {
  position: sticky;
}
</style>

<script>
import constants_program from '@/common/constants/constants_program'
import { getListApi } from '@/api/10_system/log/logsync'
import resizeMixin from '../mixin/resizeHandlerMixin'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { syncApi as syncInPlanApi } from '@/api/40_business/inplan/inplan'
import { syncApi as syncInApi } from '@/api/40_business/in/in'
import { syncApi as syncOutPlanApi } from '@/api/40_business/outplan/outplan'
import { syncApi as syncOutApi } from '@/api/40_business/out/out'
// import Pagination from '@/components/Pagination_no_count'
// import editDialog from '@/views/10_system/synclog/dialog/edit'

export default {
  components: {},
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
  props: {
    // 是否显示
    showAlarm: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION_ID),
          // 查询条件
          name: '',
          code: '',
          status: null
        },
        // 分页控件的json
        // paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        paging: {
          current: 1,
          size: 20,
          total: 0
        },
        // table使用的json
        listData: [],
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        constants_program: constants_program,
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
        popSettings: {
        },
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnShowStatus: {
          showUpdate: false
        },
        lazyLoad: {
          // 加载更多按钮
          showLoadingMore: false,
          // 没有更多了
          showNoNore: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000
      },
      popSettingsData: {
        // 弹出窗口状态名称
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
  },
  created () {
    this.initShow()
  },
  mounted () {
  },
  methods: {
    initShow () {
      // 初始化查询
      this.getDataList()
    },
    getDataList (val) {
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        if (val) {
          this.dataJson.listData = []
        }
        const data = response.data.records
        // debugger
        if (data && data.length) {
          // debugger
          this.dataJson.listData.push(...data)
          // this.$store.commit('headNotice/UPDATE_ALARM_COUNT', response.data.total)
        }
        // 如果查询到的条数不够查询条数, 则显示没有更多了
        if (!data || data.length < this.dataJson.paging.size) {
          this.settings.lazyLoad.showNoNore = true
        }
        this.dataJson.paging = response.data
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 懒加载
    load () {
      if (!this.settings.lazyLoad.showNoNore) {
        this.settings.lazyLoad.showLoadingMore = true
      } else {
        this.settings.lazyLoad.showLoadingMore = false
      }
    },
    // 翻页
    hanleSearch () {
      this.dataJson.paging.current++
      this.getDataList()
    },
    // 重新同步
    handleSyncAll () {
      this.$confirm('确认全部同步吗', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '全部同步',
        cancelButtonText: '取消'
      }).then(() => {
        this.handleSyncAllData()
      }).catch(action => {
        // 右上角X
        if (action !== 'close') {
          // 当前页所选择的数据导出
          return
        }
      })
    },
    async handleSyncAllData () {
      if (this.dataJson.listData.length) {
        const bInPlanList = []
        const bInList = []
        const bOutPlanList = []
        const bOutList = []
        this.dataJson.listData.forEach(item => {
          switch (item.serial_type) {
            case 'b_in_plan':
              if (item.serial_detail_id !== null) {
                bInPlanList.push({ 'id': item.serial_detail_id })
              }
              break
            case 'b_out_plan':
              if (item.serial_detail_id !== null) {
                bOutPlanList.push({ 'id': item.serial_detail_id })
              }
              break
            case 'b_out':
              if (item.serial_detail_id !== null) {
                bOutList.push({ 'id': item.serial_detail_id })
              }
              break
            case 'b_in':
              if (item.serial_detail_id !== null) {
                bInList.push({ 'id': item.serial_detail_id })
              }
              break
            default:
              break
          }
        })
        // 发送api
        if (bInPlanList.length) {
          this.handleInPlanSync(bInPlanList)
        }
        if (bInList.length) {
          this.handleInSync(bInList)
        }
        if (bOutPlanList.length) {
          this.handleOutPlanSync(bOutPlanList)
        }
        if (bOutList.length) {
          this.handleOutSync(bOutList)
        }
      }
      this.$emit('handlerCount')
    },
    // 入库计划单同步
    handleInPlanSync (val) {
      // 开始同步
      syncInPlanApi(val).then((_data) => {
        // this.getDataList(val)
      }, (_error) => {
      }).finally(() => {
        // this.settings.loading = false
      })
    },
    // 入库单同步
    handleInSync (val) {
      // 开始同步
      syncInApi(val).then((_data) => {
        // this.getDataList(val)
      }, (_error) => {
      }).finally(() => {
        // this.settings.loading = false
      })
    },
    // 出库计划单同步
    handleOutPlanSync (val) {
      // 开始同步
      syncOutPlanApi(val).then((_data) => {
        // this.getDataList(val)
      }, (_error) => {
      }).finally(() => {
        // this.settings.loading = false
      })
    },
    // 出库单同步
    handleOutSync (val) {
      // 开始同步
      syncOutApi(val).then((_data) => {
        // this.getDataList(val)
      }, (_error) => {
      }).finally(() => {
        // this.settings.loading = false
      })
    },
    // 关闭弹窗
    closeTable () {
      this.$emit('closeTable', true)
    },
    // records置空
    setDataEmity () {
      this.dataJson.listData = []
    }
  }
}
</script>
