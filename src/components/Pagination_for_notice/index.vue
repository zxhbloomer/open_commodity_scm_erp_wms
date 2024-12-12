<template>
  <div class="pager">
    <el-button
      :disabled="showPrevPage"
      icon="el-icon-arrow-left"
      type="text"
      @click="prevPage"
    />
    <span>{{ curPage }}/{{ pageCount }}</span>
    <el-button
      :disabled="showNextPage"
      icon="el-icon-arrow-right"
      type="text"
      @click="nextPage"
    />
  </div>
</template>

<script>

export default {
  name: 'Pager',
  props: {
    pageSize: {
      required: true,
      type: Number
    },
    curPage: {
      required: true,
      type: Number
    },
    total: {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      'showPrevPage': false,
      'showNextPage': false
    }
  },
  computed: {
    // 总页数
    pageCount () {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  watch: {
    'curPage': 'curPageWatch' // 监控curPage
  },
  mounted () {
    this.$nextTick(() => { this.initPager() }) // 需要延迟初始化
  },
  methods: {
    nextPage () { // 下一页
      this.$emit('pagination', this.curPage + 1) // 调用父组件方法
    },
    prevPage () { // 上一页
      this.$emit('pagination', this.curPage - 1) // 调用父组件方法
    },

    curPageWatch () {
      this.initPager()
    },
    initPager () {
      // console.log('++++++++++++' + this.curPage)
      // console.log('--------------' + this.pageSize)
      // console.log('.................' + this.total)
      if (this.curPage <= 1) {
        this.showPrevPage = true
      } else if (this.curPage > 1) {
        this.showPrevPage = false
      }
      if (this.curPage * this.pageSize >= this.total) {
        this.showNextPage = true
      } else if (this.curPage * this.pageSize < this.total) {
        this.showNextPage = false
      }
    }
  }
}
</script>

<style scoped>
.pager {
  height: 10px;
}
</style>
