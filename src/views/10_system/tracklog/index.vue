<template>
  <div class="app-container">
    <el-container v-loading="settings.loading">
      <el-header style="height: 45px">
        <el-form
          ref="minusForm"
          :inline="true"
          :model="dataJson.searchForm"
          label-position="getLabelPosition()"
        >
          <el-form-item label="">
            <el-select
              v-model="dataJson.searchForm.service_type"
              :placeholder="isPlaceholderShow('请选择服务商')"
              filterable
              clearable
            >
              <el-option
                v-for="item in dataJson.serviceTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.type"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model.trim="dataJson.searchForm.vehicle_no"
              clearable
              :placeholder="isPlaceholderShow('请输入车牌号')"
            />
          </el-form-item>
          <el-form-item label="">
            <select-dict
              v-model="dataJson.searchForm.vehicle_color"
              :para="CONSTANTS.DICT_M_VEHICLE_COLOR"
              init-placeholder="请选择车辆颜色"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="dataJson.searchForm.create_dt"
              style="width: 285px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item style="float:right">
            <el-button
              type="primary"
              plain
              icon="perfect-icon-reset"
              @click="doResetSearch"
            >重置</el-button>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button
              type="primary"
              plain
              icon="el-icon-search"
              @click="handleSearch"
            >轨迹测试</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <div style="padding-left: 20px; padding-bottom: 10px">
        轨迹测试结果:
      </div>
      <el-main>
        <json-editor
          ref="jsonEditor"
          v-model="dataJson.resultMsg"
          :disabled="true"
        />
      </el-main>
    </el-container>
  </div></template>

<style scoped lang="scss">
.el-header {
  line-height: 60px;
}
.el-main {
  color: #333;
  margin-left: 10px;
  padding-top: 10px;
  //border: 1px solid #cfcfcf;
}
.json-editor {
  height: 100%;
  position: relative;

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 500px;
    }

    .CodeMirror-scroll {
      min-height: 500px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #f08047;
    }
  }
}
</style>

<script>
import { getTrackTestLogApi } from '@/api/10_system/log/logtest'
import resizeMixin from './syscodeResizeHandlerMixin'
import elDragDialog from '@/directive/el-drag-dialog'
import permission from '@/directive/permission/index.js' // 权限判断指令
import SelectDict from '@/components/00_dict/select/SelectDict.vue'
import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'
import JsonEditor from '@/components/JsonEditor/index.vue'

export default {
  components: { JsonEditor, SelectDict },
  directives: { elDragDialog, permission },
  mixins: [resizeMixin],
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
      },
      dataJson: {
        // 查询使用的json
        searchForm: {
          // 查询条件
          vehicle_color: '',
          service_type: '1',
          create_dt: []
        },
        // 车辆信息
        vehicleListData: [],
        // 服务商类型
        serviceTypeList: [
          { id: 1, type: '1', name: '腾颢' },
          { id: 2, type: '2', name: '好伙伴' }
        ],
        log_name: '',
        resultMsg: '',
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: false,
        tableHeight: this.setUIheight(),
        duration: 4000
      }
    }
  },
  computed: {},
  // 监听器
  watch: {},
  created () {},
  mounted () {},
  methods: {
    handleSearch () {
      this.getDataList()
    },
    getDataList () {
      if (this.dataJson.searchForm.create_dt !== null && this.dataJson.searchForm.create_dt !== undefined && this.dataJson.searchForm.create_dt !== '') {
        this.dataJson.searchForm.start_date = this.dataJson.searchForm.create_dt[0]
        this.dataJson.searchForm.end_date = this.dataJson.searchForm.create_dt[1]
      }
      // 查询逻辑
      this.settings.loading = true
      getTrackTestLogApi(this.dataJson.searchForm).then(response => {
        this.dataJson.resultMsg = response.data
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.dataJson.resultMsg = ''
      this.dataJson.searchForm.start_date = null
      this.dataJson.searchForm.end_date = null
    }

  }
}
</script>
