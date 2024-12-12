<template>
  <div :style="{height:height,width:width}">
    <el-tabs
      type="card"
      class=""
      @tab-click="handleTabsClick"
    >
      <el-tab-pane>
        <template slot="label">我的待办
          <el-badge
            :value="dataJson.tabsCount.todo"
            type="danger"
          />
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template slot="label">我的已办
          <!-- <el-badge
            :value="dataJson.tabsCount.already"
            type="danger"
          /> -->
        </template>
      </el-tab-pane>
    </el-tabs>
    <div v-show="dataJson.tab_index === '0'">
      <el-table
        ref="multipleTable"
        v-loading="settings.loading"
        :data="dataJson.listData_one"
        :element-loading-text="'正在拼命加载中...'"
        element-loading-background="rgba(255, 255, 255, 0.5)"
        :height="settings.tableHeight"
        :default-sort="{prop: 'c_time', order: 'descending'}"
        stripe
        border
        fit
        highlight-current-row
        style="width: 100%"
        @sort-change="handleToDoSortChange"
      >
        <el-table-column
          label="No"
          type="index"
          width="50"
          align="center"
        >
          <template v-slot="scope">
            <span>{{ (dataJson.searchForm.pageCondition.current - 1) * dataJson.searchForm.pageCondition.size + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="60"
          label="操作"
        >
          <template slot-scope="scope">
            <router-link :to="{path:scope.row.path,query:{code:scope.row.serial_code}}"><a href="javascript:void(0)">办理</a></router-link>
          </template>
        </el-table-column>
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="80"
          prop="serial_name"
          label="类型"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="120"
          prop="serial_code"
          label="业务单号"
          :auto-fit="true"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="100"
          prop="owner_name"
          label="货主"
          :auto-fit="true"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="80"
          prop="warehouse_name"
          label="仓库"
          :auto-fit="true"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="80"
          prop="sku_name"
          label="物料"
          :auto-fit="true"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="120"
          prop="qty"
          label="数量"
          align="right"
        >
          <template v-slot="scope">
            {{ scope.row.qty == null? '': formatNumber(scope.row.qty * 1,true,4) }}
          </template>
        </el-table-column>
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="80"
          prop="unit_name"
          label="单位"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          :auto-fit="true"
          min-width="130"
          prop="c_time"
          label="发起时间"
        >
          <template v-slot="scope">
            {{ scope.row.c_time == null?'':formatDateTime(scope.row.c_time) }}
          </template>
        </el-table-column>

        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          :auto-fit="true"
          min-width="120"
          prop="c_name"
          label="发起人"
        />
      </el-table>
      <pagination
        :total="dataJson.paging_one.total"
        :page.sync="dataJson.paging_one.current"
        :limit.sync="dataJson.paging_one.size"
        @pagination="getDataList"
      />
    </div>

    <div v-show="dataJson.tab_index === '1'">
      <el-table
        ref="multipleTable"
        v-loading="settings.loading"
        :data="dataJson.listData_two"
        :element-loading-text="'正在拼命加载中...'"
        element-loading-background="rgba(255, 255, 255, 0.5)"
        :height="settings.tableHeight"
        :default-sort="{prop: 'c_time', order: 'descending'}"
        stripe
        border
        fit
        highlight-current-row
        style="width: 100%"
        @sort-change="handleToDoSortChange"
      >
        <el-table-column
          label="No"
          type="index"
          width="50"
          align="center"
        >
          <template v-slot="scope">
            <span>{{ (dataJson.searchForm.pageCondition.current - 1) * dataJson.searchForm.pageCondition.size + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :sort-orders="settings.sortOrders"
          :auto-fit="true"
          min-width="60"
          label="操作"
        >
          <template slot-scope="scope">
            <router-link :to="{path:scope.row.path,query:{code:scope.row.serial_code}}"><a href="javascript:void(0)">查看</a></router-link>
          </template>
        </el-table-column>
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="80"
          prop="serial_name"
          label="类型"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="120"
          prop="serial_code"
          label="业务单号"
          :auto-fit="true"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="100"
          prop="owner_name"
          label="货主"
          :auto-fit="true"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="80"
          prop="warehouse_name"
          label="仓库"
          :auto-fit="true"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="80"
          prop="sku_name"
          label="物料"
          :auto-fit="true"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="120"
          prop="qty"
          label="数量"
          align="right"
        >
          <template v-slot="scope">
            {{ scope.row.qty == null? '': formatNumber(scope.row.qty * 1,true,4) }}
          </template>
        </el-table-column>
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          min-width="80"
          prop="unit_name"
          label="单位"
        />
        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          :auto-fit="true"
          min-width="130"
          prop="c_time"
          label="发起时间"
        >
          <template v-slot="scope">
            {{ scope.row.c_time == null?'':formatDateTime(scope.row.c_time) }}
          </template>
        </el-table-column>

        <el-table-column
          :sort-orders="settings.sortOrders"
          sortable="custom"
          :auto-fit="true"
          min-width="120"
          prop="c_name"
          label="发起人"
        />
      </el-table>
      <pagination
        :total="dataJson.paging_two.total"
        :page.sync="dataJson.paging_two.current"
        :limit.sync="dataJson.paging_two.size"
        @pagination="getAlreadyDataList"
      />
    </div>

  </div>
</template>

<style scoped>
a {
  color: #52b5f2;
}
</style>

<script>
import deepCopy from 'deep-copy'
import Pagination from '@/components/Pagination'
import { getListApi, getAlreadyDoListApi } from '@/api/40_business/todo/todo'

export default {
  components: { Pagination },
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
      default: '405px'
    }
  },
  data () {
    return {
      dataJson: {
        tab_index: '0',
        tabsCount: {
          do: 0,
          todo: 0
        },
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION)
        },
        paging_one: deepCopy(this.PARAMETERS.PAGE_JSON),
        paging_two: deepCopy(this.PARAMETERS.PAGE_JSON),
        listData_one: [],
        listData_two: []
      },
      settings: {
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // loading 状态
        loading: true,
        duration: 4000
      }
    }
  },
  mounted () {
    this.getDataList()
    this.setUIheight()
    // this.getAlreadyDataList()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getDataList () {
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging_one.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging_one.size
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.listData_one = response.data.records
        this.dataJson.paging_one = response.data
        this.dataJson.paging_one.records = {}
        if (response.data.total > 99) {
          this.dataJson.tabsCount.todo = '99+'
        } else {
          this.dataJson.tabsCount.todo = response.data.total
        }
      }).finally(() => {
        this.settings.loading = false
      })

      // this.getCount()
    },
    getAlreadyDataList () {
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging_two.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging_two.size
      // 查询逻辑
      this.settings.loading = true
      getAlreadyDoListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.listData_two = response.data.records
        this.dataJson.paging_two = response.data
        this.dataJson.paging_two.records = {}
        this.dataJson.tabsCount.already = response.data.total
      }).finally(() => {
        this.settings.loading = false
      })

      // this.getCount()
    },

    handleTabsClick (tab, event) {
      this.dataJson.tab_index = tab.index
      if (this.dataJson.searchForm.active_tabs_index === tab.index) {
        return
      }
      this.dataJson.searchForm.pageCondition.current = 1

      switch (tab.index) {
        case '0':
          // 待办
          this.dataJson.paging_one.current = 1
          this.dataJson.searchForm.todo_status = '0'
          this.getDataList()
          break
        case '1':
          // 已办
          this.dataJson.paging_two.current = 1
          this.dataJson.searchForm.todo_status = '1'
          this.getAlreadyDataList()
          break
      }
      this.dataJson.searchForm.active_tabs_index = tab.index
    },
    handleToDoSortChange (column) {
      // 服务器端排序
      if (column.order === 'ascending') {
        this.dataJson.searchForm.pageCondition.sort = column.prop
      } else if (column.order === 'descending') {
        this.dataJson.searchForm.pageCondition.sort = '-' + column.prop
      }
      switch (this.dataJson.tab_index) {
        case '0':
          // 待办
          this.getDataList()
          break
        case '1':
          // 已办
          this.getAlreadyDataList()
          break
      }
    },
    setUIheight () {
      try {
        // 定义高度
        const elementHeight = document.documentElement.clientHeight - 85
        // 获取所有的ref，主要判断minus的refs
        const listRefsNames = Object.keys(this.$refs).map((key) => {
          return this.$refs[key]
        })
        let val = 0

        for (let i = 0; i < Object.keys(this.$refs).length; i++) {
          if (Object.keys(this.$refs)[i].indexOf('minus') >= 0) {
            val = val + listRefsNames[i].$el.offsetHeight
          }
        }
        const rtnVal = elementHeight - val - 180

        // 此处使用的是页面上的值
        this.settings.tableHeight = rtnVal

        // return rtnVal
      } catch (error) {
        console.log('mixin error')
      }
    }
  }
}
</script>
