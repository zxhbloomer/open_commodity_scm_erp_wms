<template>
  <div>
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
    >
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.serial_code"
          clearable
          placeholder="标题"
          @keyup.enter.native="handleSearch"
        />
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
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      stripe
      highlight-current-row
      :default-sort="{prop: 'c_time', order: 'descending'}"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="45"
        prop="id"
      />
      <el-table-column
        type="index"
        width="40"
        label="No"
      />
      <el-table-column
        width="20"
        align="left"
        style="padding-left: 0"
      >
        <template v-slot="scope">
          <div v-if="scope.row.is_read !== '1'" style="color: red;font-size: 30px;">•</div>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="200"
        :sort-orders="settings.sortOrders"
        prop="type_name"
        label="通知类型"
      />
      <el-table-column
        sortable="custom"
        :auto-fit="true"
        min-width="300"
        :sort-orders="settings.sortOrders"
        prop="title"
        label="标题"
      >
        <template v-slot="scope">
          <el-button
            type="text"
            @click="handleView(scope.row)"
          >
            {{ scope.row.title }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        min-width="150"
        :sort-orders="settings.sortOrders"
        prop="c_time"
        label="发布时间"
      >
        <template v-slot="scope">
          {{ formatDateTime(scope.row.c_time) }}
        </template>
      </el-table-column>
    </el-table>

    <pagination
      ref="minusPaging"
      :total="dataJson.paging.total"
      :page.sync="dataJson.paging.current"
      :limit.sync="dataJson.paging.size"
      @pagination="getDataList"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination/index.vue'
import deepCopy from 'deep-copy'
import mixin from '../mixin/tableresizeHandlerMixin'
import { getPageList } from '@/api/10_system/notice/pcnotice'

export default {
  components: { Pagination },
  mixins: [mixin],
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dataJson: {
        searchForm: {
          pageCondition: this.PARAMETERS.PAGE_CONDITION_C_TIME,
          status: '',
          serial_type: '',
          serial_code: '',
          sync_time: ''
        },
        paging: this.PARAMETERS.PAGE_JSON,
        listData: [],
        syncStatusList: []
      },
      settings: {
        loading: false,
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        tableHeight: this.setUIheight(),
        popSettings: {
          one: {
            visible: false,
            props: {
              id: '',
              data: {},
              dialogStatus: ''
            }
          }
        }
      }
    }
  },
  watch: {
    data: {
      handler (newVal, oldVal) {
        this.dataJson.searchForm.is_read = newVal.is_read
        this.$nextTick(() => {
          this.getDataList()
        })
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    handleSearch () {
      if (this.dataJson.searchForm.sync_time !== null && this.dataJson.searchForm.sync_time !== undefined && this.dataJson.searchForm.sync_time !== '') {
        this.dataJson.searchForm.c_time_start = this.dataJson.searchForm.sync_time[0]
        this.dataJson.searchForm.c_time_end = this.dataJson.searchForm.sync_time[1]
      }
      // 查询
      this.dataJson.searchForm.pageCondition.current = 1
      this.dataJson.paging.current = 1
      this.getDataList()
      // 清空选择
      this.dataJson.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    getDataList () {
      getPageList(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data.records
      })
    },
    handleView (row) {
      this.$emit('handleView', row)
    }
  }
}
</script>

<style scoped>

</style>
