<template>
  <div>
    <div class="border" :style="'height:' + settings.tableHeight + 'px' ">
      <div class="title">
        {{ dataJson.tempJson.title }}
        <br>
        <div class="title-time">
          {{ dataJson.tempJson.c_time }}
        </div>
        <el-divider class="custom-divider" />
      </div>
      <div class="content">
        <Markdown
          ref="viewer"
          :editor-text="dataJson.tempJson.msg"
          height="500px"
        />
      </div>
    </div>
    <el-button
      style="float: right; margin-right: 20px; margin-top: 10px"
      @click="closeDetail"
    >
      返回
    </el-button>

  </div>
</template>

<script>
import Markdown from '@/components/markdown/viewer.vue'
import mixin from '@/views/10_system/systemnotice/mixin/resizeDetailHandlerMixin'
import { getPcDetailApi } from '@/api/10_system/notice/systemnotice'
import deepCopy from 'deep-copy'

export default {
  components: { Markdown },
  mixins: [mixin],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
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
        tempJson: {}
      },
      settings: {
        tableHeight: this.setUIheight()
      }
    }
  },
  watch: {
    '$route': {
      handler: function (newVal, oldVal) {
        this.data.id = newVal.query.p1
        this.$nextTick(() => {
          this.getData()
        })
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    this.getData()
  },
  methods: {
    closeDetail () {
      this.$emit('closeDetail')
    },
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getPcDetailApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
      }).finally(() => {
        this.settings.loading = false
      })
    }
  }

}
</script>

<style scoped>
.title{
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
  padding-top: 10px;
  .title-time{
    font-size: 18px;
  }
}
.border{
  border: 1px solid #ebeef5;
  width: 99%;
}
.custom-divider {
  width: 95%;
  margin: auto;
}
.content {
  padding-left: 20px;
}
.el-button-group {
  margin-bottom: 10px;
}
.el-button--mini {
  padding: 10px 15px;
  font-size: 13px;
  border-radius: 3px;
}

</style>
