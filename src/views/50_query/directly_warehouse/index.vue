<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <span class="count">
          共{{ dataJson.count }}条
        </span>
        <el-form
          :inline="true"
          :model="dataJson.searchForm"
          class="floatRight"
        >
          <el-form-item>
            <el-input
              v-model.trim="dataJson.searchForm.warehouse_name"
              clearable
              placeholder="请输入库点名称"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              plain
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              v-popover:popover
              type="primary"
              plain
              icon="perfect-icon-reset"
              @click="doResetSearch"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div
      :style="settings.height"
      class="app-container infinite-list-wrapper"
    >
      <div
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
      >
        <warehouseCard
          ref="childData"
          :data="dataJson.listData"
        />
        <p v-if="settings.loading">加载中...</p>

      </div>
    </div>
  </div>
</template>
<style scoped>
.infinite-list-wrapper {
  height: 100%;
  margin: 0;
  text-align: center;
}
.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}
li {
  list-style-type: none;
}
ul {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
  *margin-left: 0;
}
p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  text-align: center;
}
.el-col-24 {
  height: 30px;
  background: #f4f4f5;
}
.count {
  display: inline-block;
  height: 30px;
  text-align: center;
  line-height: 30px;
}

.floatRight {
  float: right;
}
.el-form--inline {
  height: 10%;
}
</style>

<script>
import { getDirectlyWarehouseApi } from '@/api/50_query/directly_warehouse'
import resizeMixin from './mixin/resizeHandlerMixin'
import permission from '@/directive/permission/index.js' // 权限判断指令
import warehouseCard from './components/warehouse_card_directly.vue'

export default {
  components: { warehouseCard },
  directives: { permission },
  mixins: [resizeMixin],
  props: {
  },
  data () {
    return {
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: {
            current: 0,
            size: 1
          },
          count: 0
        },
        paging: {
          current: 0,
          size: 10,
          total: 0
        },
        // table使用的json
        listData: [],
        labelStyle: {
          'width': '170px',
          'text-align': 'right',
          'font-size': '20px'
        },
        contentStyle: {
          'font-size': '18px',
          'width': '120px'
        }
      },
      settings: {
        loading: false,
        tableHeight: this.setUIheight(),
        height: ''
      }
    }
  },
  computed: {
    noMore () {
      return (this.dataJson.count <= this.dataJson.paging.current * this.dataJson.paging.size)
    },
    disabled () {
      return (this.settings.loading || this.noMore)
    }
  },
  // 监听器
  watch: {
  },
  activated () {
    this.settings.loading = false
  },
  created () {
    // 定义高度
    const elementHeight = document.documentElement.clientHeight - 50
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
    const height = elementHeight - val - 100
    this.settings.height = 'overflow:auto; height: ' + height + 'px'
  },
  mounted () {
    // 描绘完成
  },
  methods: {
    getDataList () {
      this.settings.loading = true
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      getDirectlyWarehouseApi(this.dataJson.searchForm).then(response => {
        const listData1 = response.data.records
        if (listData1 && listData1.length) {
          for (var key in listData1) {
            if (listData1[key].file_json && listData1[key].file_json.length) {
              listData1[key].file_json.sort((a, b) => {
                return b.pending_count - a.pending_count
              })
            }
            this.dataJson.listData.push(listData1[key])
          }
        }
        this.dataJson.count = response.data.total
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 页面懒加载
    load () {
      this.dataJson.paging.current++
      this.getDataList()
    },
    // 查询
    handleSearch () {
      // 查询
      this.dataJson.searchForm.pageCondition.current = 1
      this.dataJson.paging.current = 1
      this.dataJson.listData = []
      this.getDataList()
      // 清空选择
      this.dataJson.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.dataJson.searchForm.reset1 = true
    }
  }
}
</script>
