<template>
  <div
    :class="{'hidden':hidden}"
    class="pagination-container"
  >
    <el-skeleton
      :loading="loading"
      :rows="1"
      animated
    >
      <el-pagination
        :background="background"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="total"
        v-bind="$attrs"
        next-text="下一页"
        prev-text="上一页"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <ul
          class="el-pager"
        >
          <li
            v-for="pager in dataJson.pagers"
            :key="pager"
            :class="{ active: currentPage === pager }"
            class="number"
            @click="onPagerClick"
          >{{ pager }}</li>
        </ul>
      </el-pagination>
    </el-skeleton>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'PaginationNoCount',
  props: {
    loading: {
      default: true,
      type: Boolean
    },
    /** 当前页后总条数 */
    total: {
      required: true,
      type: Number
    },
    /** 第几页 */
    page: {
      type: Number,
      default: 1
    },
    /** 每页条数 */
    limit: {
      type: Number,
      default: 20
    },
    /** 设置每页条数 */
    pageSizes: {
      type: Array,
      default () {
        return [20, 50, 100, 200]
      }
    },
    layout: {
      type: String,
      default: 'sizes, prev, slot, next'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataJson: {
        pagers: []
      }
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.page
      },
      set (val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get () {
        return this.limit
      },
      set (val) {
        this.$emit('update:limit', val)
      }
    }
  },
  watch: {
    // 输入信息是否有变更监控，如果有变化则情况错误信息
    total: {
      handler (newVal, oldVal) {
        this.initPagers()
      },
      immediate: true
    },
    currentPage: {
      handler (newVal, oldVal) {
        this.initPagers()
      },
      immediate: true
    },
    limit: {
      handler (newVal, oldVal) {
        this.initPagers()
      },
      immediate: true
    },
    loading: {
      handler (newVal, oldVal) {
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 页数数组方法
     */
    pushPage (_page) {
      const calc_page = this.currentPage + _page
      if (_page >= 0) {
        // 当前页后面的页计算
        // 判断 当前页后面的页是否存在，存在push否则pass
        if (Math.floor(this.total / this.limit) >= calc_page) {
          this.dataJson.pagers.push(this.currentPage + _page)
        }
      } else {
        // 当前页前面的页计算
        if ((this.currentPage + _page) > 0) {
          // 判断 当前页后面的页是否存在，存在push否则pass
          this.dataJson.pagers.push(this.currentPage + _page)
        }
      }
    },
    /**
     * 初始化页数
     */
    initPagers () {
      this.dataJson.pagers = []
      this.pushPage(0)
      this.pushPage(1)
      this.pushPage(-1)
      this.pushPage(2)
      this.pushPage(-2)
      this.pushPage(3)
      this.pushPage(-3)
      this.pushPage(4)
      this.pushPage(-4)
      this.pushPage(5)
      this.pushPage(-5)
      this.pushPage(6)
      this.pushPage(-6)
      this.pushPage(7)
      this.pushPage(-7)
      this.pushPage(8)
      this.pushPage(-8)
      this.pushPage(9)
      this.pushPage(-9)
      this.dataJson.pagers.sort(function (a, b) {
        return a - b
      })

      /**
       * 当 this.currentPage
       */
      for (var i = this.dataJson.pagers.length; i >= 0; i--) {
        if (this.currentPage <= 6) {
          // 不显示 10 以外的页数
          if (this.dataJson.pagers[i] > 10) {
            this.dataJson.pagers.splice(i, 1)
          }
        } else {
          // between:current page - 5,current page + 4
          // 不显示 10 以外的页数
          if (this.dataJson.pagers[i] > this.currentPage + 4) {
            this.dataJson.pagers.splice(i, 1)
          }
          if (this.dataJson.pagers[i] < this.currentPage - 5) {
            this.dataJson.pagers.splice(i, 1)
          }
        }
      }
    },
    onPagerClick (event) {
      let newPage = Number(event.target.textContent)
      if (!isNaN(newPage)) {
        if (newPage < 1) {
          newPage = 1
        }
      }
      this.handleCurrentChange(newPage)
    },
    handleSizeChange (val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.slot-div {
  display: inline-block;
  vertical-align: top;
}
.pagination-container {
  background: #fff;
  padding: 10px 10px 0px 10px;
  /* padding: 32px 16px; */
}
.pagination-container.hidden {
  display: none;
}

.btn-prev:before {
  content: '上一页';
}
.btn-next:before {
  content: '下一页';
}
</style>
