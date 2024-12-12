
<template>
  <div class="app-container">
    <div class="container">
      <div class="container-content">
        <div
          v-for="( value, index) in dataJson.listData"
          :key="index"
          class="rowStyle"
          @click.stop="openNotice(value)"
        >
          <span v-if="value.is_read !== '1'" class="redDot">•</span>
          {{ value.title }}
          <br>
          {{ value.c_time }}
          <el-divider v-if="dataJson.listData.length - 1 > 0" />
        </div>
      </div>
      <div>
        <el-divider />
        <el-button
          type="text"
          @click="openNoticeList"
        >
          查看更多
        </el-button>
        <div />
      </div>
    </div>
  </div>
</template>

<script>
import { getPageList } from '@/api/10_system/notice/pcnotice'
import deepCopy from 'deep-copy'

export default {
  data () {
    return {
      dataJson: {
        searchForm: {
          pageCondition: deepCopy(this.PARAMETERS.PAGE_CONDITION_C_TIME)
        },
        listData: []
      }
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据
    getDataList () {
      getPageList(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data.records
      })
    },
    // 打开通知详情页
    openNotice (row) {
      this.$router.push({
        name: this.PROGRAMS.P_NOTICE, query: { p1: row.id }
      })
    },
    openNoticeList () {
      this.$router.push({ name: this.PROGRAMS.P_NOTICE })
    }
  }
}
</script>

<style scoped>
.container {
  height: 299px;
  .container-content {
    height: 272px;
    .rowStyle {
      cursor: pointer;
    }
  }
}
.el-divider--horizontal {
  margin: 0 0 7px 0;
}
.redDot{
  color: red;
  font-size: 30px;
  vertical-align: middle;
  display: inline-block;
  line-height: 10px;
}
</style>
