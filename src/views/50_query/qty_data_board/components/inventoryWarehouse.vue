<template>
  <div class="warehouse">
    <el-alert
      title="库存量"
      type="info"
      :closable="false"
    />
    <br>
    <el-skeleton
      :loading="settings.loading"
      :rows="6"
      :throttle="500"
      animated
    >
      <el-table
        v-loading="settings.loading"
        :data="dataJson.listData"
        :element-loading-text="'正在拼命加载中...'"
        element-loading-background="rgba(255, 255, 255, 0.5)"
        border
        fit
        style="width: 100%"
        :cell-style="{fontSize:'18px'}"
        :header-cell-style="{fontSize:'18px'}"
      >
        <el-table-column
          :auto-fit="true"
          align="left"
          min-width="20%"
          prop="warehouse_type_name"
          label="仓库类型"
        >
          <template v-slot="scope">
            <router-link :to="{name:dataJson.constants_program.P_INVENTORY_WAREHOUS,query:{type:scope.row.warehouse_type,batch: batch, fullpath:true}}"><a href="javascript:void(0)">{{ scope.row.warehouse_type_name }}</a></router-link>
          </template>
        </el-table-column>
        <el-table-column
          :auto-fit="true"
          align="right"
          min-width="20%"
          prop="in_qty"
          label="合计入库库存数量"
        >
          <template v-slot="scope">
            <router-link :to="{name:dataJson.constants_program.P_WAREHOUSE_GOODS_IN,query:{type:scope.row.warehouse_type,batch: batch, fullpath:true}}"><a href="javascript:void(0)"> {{ scope.row.in_qty === null?'': isZhongLin ? formatNumber3(scope.row.in_qty) : formatNumberTwo(scope.row.in_qty,true,2) }}</a></router-link>
          </template>
        </el-table-column>
        />
        <el-table-column
          :auto-fit="true"
          min-width="20%"
          align="right"
          prop="out_qty"
          label="合计出库库存数量"
        >
          <template v-slot="scope">
            <router-link :to="{name:dataJson.constants_program.P_WAREHOUSE_GOODS_OUT,query:{type:scope.row.warehouse_type,batch: batch, fullpath:true}}"><a href="javascript:void(0)"> {{ scope.row.out_qty === null?'': isZhongLin ? formatNumber3(scope.row.out_qty) : formatNumberTwo(scope.row.out_qty,true,2) }}</a></router-link>
          </template>
        </el-table-column>
        <el-table-column
          :auto-fit="true"
          min-width="20%"
          align="right"
          prop="qty_diff"
          label="合计调整库存数量"
        >
          <template v-slot="scope">
            <router-link :to="{name:dataJson.constants_program.P_WAREHOUSE_GOODS_ADJUST,query:{type:scope.row.warehouse_type,batch: batch, fullpath:true}}"><a href="javascript:void(0)"> {{ scope.row.adjust_qty === null?'': isZhongLin ? formatNumber3(scope.row.qty_diff) : formatNumberTwo(scope.row.qty_diff,true,2) }}</a></router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          :auto-fit="true"
          min-width="20%"
          prop="qty"
          label="存货合计"
        >
          <template v-slot="scope">
            <router-link :to="{name:dataJson.constants_program.P_WAREHOUSE_GOODS_TOTAL,query:{type:scope.row.warehouse_type,batch: batch, fullpath:true}}"><a href="javascript:void(0)"> {{ scope.row.qty === null?'': isZhongLin ? formatNumber3(scope.row.qty) : formatNumberTwo(scope.row.qty,true,2) }}</a></router-link>
          </template>
        </el-table-column>
      </el-table>

    </el-skeleton>
  </div>
</template>

<style scoped>
::v-deep .el-tabs__item {
  height: 30px;
  line-height: 30px;
}
::v-deep .el-tabs__header {
  margin: 0 0 5px;
}
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 371px;
}
.el-button-group {
  margin-bottom: 10px;
  max-width: 50%;
}
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.el-input-group__append_reset {
  color: #ffffff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
a {
  color: #52b5f2;
}
.right {
  position: absolute;
  right: 10px;
  margin-right: 10px;
}
.left {
  position: absolute;
  left: 10px;
  margin-left: 10px;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
</style>
<style>
.warehouse .el-alert__title {
  font-size: 20px;
}
</style>
<script>
import { getListApi } from '@/api/50_query/inventory_warehouse_type'
import constants_program from '@/common/constants/constants_program'
import resizeMixin from './mixin/resizeHandlerMixin'

export default {
  components: {},
  directives: {},
  mixins: [resizeMixin],
  props: {
    // 起始日期
    batch: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataJson: {
        // 页面跳转
        constants_program: constants_program,
        // 查询使用的json
        searchForm: {
        },
        // table使用的json
        listData: null
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true
      }
    }
  },
  computed: {
    // 判断是否是中林环境
    isZhongLin () {
      const href = window.location.href
      if (href.indexOf('shyiyuanth') !== -1 || href.indexOf('172.21.1.249') !== -1 || href.indexOf('localhost') !== -1) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {
  },
  created () {
    // 初始化查询
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList () {
      // 查询逻辑
      this.settings.loading = true
      this.dataJson.searchForm.batch = this.batch
      getListApi(this.dataJson.searchForm).then(response => {
        // 增加对象属性，columnTypeShowIcon，columnNameShowIcon
        this.dataJson.listData = response.data
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
    }

  }
}
</script>
