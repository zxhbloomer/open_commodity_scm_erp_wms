<template>

  <el-tabs type="card">
    <el-tab-pane v-if="settings.showView1">
      <template slot="label">物流订单(公运)</template>
      <edit-template1
        :data="data"
        :edit-status="editStatus"
        @emitReturn="handleReturn"
      />

    </el-tab-pane>
    <el-tab-pane v-if="settings.showView2">
      <template slot="label">物流调度(铁水联运)</template>
      <edit-template2
        :data="data"
        :edit-status="editStatus"
        @emitReturn="handleReturn"
      />

    </el-tab-pane>
  </el-tabs>

</template>

<style scoped>
</style>

<script>
import editTemplate1 from '../tabs/edit1'
import editTemplate2 from '../tabs/edit2'
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import mixin from './mixin/editResizeHandlerMixin'

export default {
  components: { editTemplate1, editTemplate2 },
  directives: { elDragDialog },
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
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
      detailListData: [],
      // 监听器
      watch: {
        unwatch_tempJson: null
      },

      popSettingsData: {

      },
      dataJson: {

        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {

        },
        // 单条数据 json
        tempJson: {

        },
        inputSettings: {
          maxLength: {

          }
        }
      },
      // 页面设置json
      settings: {
        showView1: true,
        showView2: true,
        // loading 状态
        loading: true,
        duration: 4000,

        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.editStatus,
        // pop的check内容
        rules: {

        }
      }
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (
        this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT ||
        this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT
      ) {
        return false
      } else {
        return true
      }
    },
    listenVisible () {
      return this.visible
    },
    isViewModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_VIEW) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {},
  created () {
    this.init()
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 初始化处理
    init () {
      // this.dataJson.tempJson = this.data
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.editStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          break
        case this.PARAMETERS.STATUS_VIEW:
          this.initViewModel()
          break
      }
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    // 弹出框设置初始化
    initDialogStatus () {
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(
        this
      ).dataJson.tempJsonOriginal
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(
        this
      ).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(
        this
      ).settings.btnDisabledStatus
    },
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 控件focus
      // this.$nextTick(() => {
      //   this.$refs['refFocusOne'].focus()
      // })
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 修改时的初始化
    initUpdateModel () {
      this.initViewModel()
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)

      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // 设置按钮
      // this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
        this.$refs['refFocusOne'].focus()
      })
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      if (this.data.type === '2') {
        this.settings.showView1 = false
        this.settings.showView2 = true
      } else {
        this.settings.showView1 = true
        this.settings.showView2 = false
      }
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson',
        (newVal, oldVal) => {
          this.settings.btnDisabledStatus.disabledInsert = false
          this.settings.btnDisabledStatus.disabledUpdate = false

          if (this.dataJson.tempJson.out_type === this.CONSTANTS.DICT_MONITOR_TYPE_OUT_ONE) {
            this.settings.outRuleStatus = true
          } else {
            this.settings.outRuleStatus = false
          }
        },
        { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },

    handleReturn (_data) {
      const operate_tab_data = {
        data: _data
      }
      this.$router.push({
        query: {}
      })

      this.$emit('emitReturn', operate_tab_data)
    }
  }

}
</script>
