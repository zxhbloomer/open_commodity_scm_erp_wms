<template>
  <div class="app-container">
    <previewer
      v-if="settings.visible"
      :param-data="dataJson.tempJson.preview_data"
      :index="settings.index"
    />

  </div>
</template>

<style >
.lg-actions .lg-prev {
  font-size: 40px;
}
.lg-actions .lg-next {
  font-size: 40px;
}
.lg-video-cont {
  height: 100%;
}
.lg-outer .lg-video {
  height: 88%;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getMonitorFileApi } from '@/api/40_business/monitor/monitorbackup'
import previewer from '@/components/51_previewer'
import urlUtil from '@/utils/urlUtil'

export default {
  components: { previewer },
  directives: { elDragDialog },
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // id: {
    //   type: Number,
    //   default: null
    // },
    // index: {
    //   type: Number,
    //   default: null
    // },
    data: {
      type: Object,
      default: null
    },
    editStatus: {
      type: String,
      default: constants_para.STATUS_INSERT
    }
  },
  data () {
    return {
      // 监听器
      watch: {
      },
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {

        },
        // 单条数据 json
        tempJson: {

        }
      },
      // 页面设置json
      settings: {
        type: '',
        id: null,
        // loading 状态
        loading: true,
        visible: false,
        index: 0
      }
    }
  },
  computed: {

  },
  // 监听器
  watch: {},
  created () {
    // 类型
    this.settings.type = urlUtil.getHashQueryVariable(window.location.href, 'type')
    // 主键id
    this.settings.code = urlUtil.getHashQueryVariable(window.location.href, 'code')
    // 附件序号
    this.settings.index = urlUtil.getHashQueryVariable(window.location.href, 'index') * 1
    this.init()
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
  },
  methods: {
    // 初始化处理
    init () {
      this.settings.loading = true
      // this.dataJson.tempJson = this.data
      this.settings.rules = this.settings.rulesOne
      this.initViewModel()
      this.settings.loading = false
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(this).dataJson.tempJsonOriginal
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.getData()
    },
    getData () {
      switch (this.settings.type) {
        case 'monitor':
          // 监管任务
          this.getMonitorFile()

          break
      }
    },
    getMonitorFile () {
      // 查询逻辑
      this.settings.loading = true
      this.showLoading('正在查询，请稍后...')
      const temp = {}
      temp.code = this.settings.code
      getMonitorFileApi(temp).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
        this.settings.visible = true
      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
      })
    }

  }

}
</script>
