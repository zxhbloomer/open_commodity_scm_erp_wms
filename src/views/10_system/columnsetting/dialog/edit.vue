<template>
  <div>
    <!-- pop窗口 数据编辑:新增、修改 -->
    <el-dialog
      v-if="listenVisible"
      v-el-drag-dialog
      v-loading="settings.loading"
      element-loading-text="拼命加载中，请稍后..."
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :title="PARAMETERS.STATUS_TEXT_MAP[dialogStatus]"
      :visible="visible"
      :close-on-click-modal="PARAMETERS.DIALOG_CLOSE_BY_CLICK"
      :close-on-press-escape="PARAMETERS.DIALOG_CLOSE_BY_ESC"
      :show-close="PARAMETERS.DIALOG_SHOW_CLOSE"
      :append-to-body="true"
      :modal-append-to-body="true"
      width="1000px"
      destroy-on-close
    >
      <el-form
        ref="dataSubmitForm"
        :model="dataJson.tempJson"
        label-position="rigth"
        label-width="84px"
        status-icon
      >
        <el-alert
          title="页面信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="页面编号："
              prop="page_code"
            >
              <input-search
                v-model.trim="dataJson.tempJson.page_code"
                :disabled="isUpdateModel && isViewModel"
                @onInputSearch="handlePageOpen"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-alert
          title="页面列信息"
          type="info"
          :closable="false"
        />
        <br>
        <div
          v-if="!valueUpdate"
          class="columnDetail"
        >
          <el-row
            v-for="(value, key) in dataJson.tempJson.itemList"
            :key="value._index"
            :gutter="5"
          >
            <el-col :span="6">
              <el-form-item
                label="列名称："
                prop="label"
              >
                <el-input
                  v-model.trim="dataJson.tempJson.itemList[key].label"
                  clearable
                  @input="textSwitchChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="列属性："
                prop="name"
              >
                <el-input
                  v-model.trim="dataJson.tempJson.itemList[key].name"
                  clearable
                  @input="textSwitchChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item
                label="是否固定"
                prop="fix"
              >
                <template>
                  <el-tooltip
                    :content="dataJson.tempJson.itemList[key].fix === false ? '固定状态：不固定' : '固定状态：固定' "
                    placement="top"
                    :open-delay="500"
                  >
                    <el-switch
                      v-model="dataJson.tempJson.itemList[key].fix"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="true"
                      :inactive-value="false"
                      :width="30"
                      @change="textSwitchChange"
                    />
                  </el-tooltip>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item
                label="是否显示:"
                prop="is_enable"
              >
                <template>
                  <el-tooltip
                    :content="dataJson.tempJson.itemList[key].is_enable === false ? '显示状态：不显示' : '显示' "
                    placement="top"
                    :open-delay="500"
                  >
                    <el-switch
                      v-model="dataJson.tempJson.itemList[key].is_enable"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="true"
                      :inactive-value="false"
                      :width="30"
                      @change="textSwitchChange"
                    />
                  </el-tooltip>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="addColumn(key)"
              />
              <el-button
                type="primary"
                icon="el-icon-minus"
                :disabled="0 === dataJson.tempJson.itemList.length - 1"
                @click="removeColumn(key)"
              />
              <el-button
                type="primary"
                icon="el-icon-top"
                :disabled="key === 0"
                @click="upColumn(key)"
              />
              <el-button
                type="primary"
                icon="el-icon-bottom"
                :disabled="key === dataJson.tempJson.itemList.length - 1"
                @click="downColumn(key)"
              />
            </el-col>

          </el-row>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-divider />
        <el-button
          plain
          :disabled="settings.loading"
          @click="handleCancel()"
        >取消</el-button>
        <el-button
          v-show="settings.btnShowStatus.showInsert"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert "
          @click="doInsert()"
        >确定</el-button>
        <el-button
          v-show="settings.btnShowStatus.showUpdate && !isViewModel"
          plain
          type="primary"
          :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate "
          @click="doInsert()"
        >确定</el-button>
      </div>
    </el-dialog>

    <page-dialog
      v-if="popSettings.one.visible"
      :visible="popSettings.one.visible"
      @closeMeOk="handlePageCloseOk"
      @closeMeCancel="handlePageCloseCancel"
    />
  </div>
</template>

<style scoped>
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
.el-input.is-disabled::v-deep .el-input__inner {
  color: #606266 !important;
}
.columnDetail {
  width: 100%;
  height: 350px;
  overflow: auto;
  overflow-x: hidden;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import InputSearch from '@/components/40_input/inputSearch'
import deepCopy from 'deep-copy'
import pageDialog from '@/views/10_system/pages/page/dialog/dialog'
import { getListApi, insertApi } from '@/api/10_system/columnsetting/columnsetting'

export default {
  components: { InputSearch, pageDialog },
  directives: { elDragDialog },
  mixins: [],
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
    dialogStatus: {
      type: String,
      default: constants_para.STATUS_VIEW
    }
  },
  data () {
    return {
      contentStyle: {
        width: '18%'
      },
      labelStyle: {
        width: '6%',
        'text-align': 'right'
      },
      // 监听器
      watch: {
        unwatch_tempJson: null
      },
      dataJson: {
        searchForm: {
          // 翻页条件
          pageCondition: {
            current: 1,
            size: 100
          }
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          page_code: null,
          itemList: [{
            _index: 0,
            name: null,
            label: null,
            fix: false,
            is_enable: true,
            sort: 0
          }]
        },
        // 单条数据 json
        tempJson: {
          page_code: null,
          itemList: []
        },
        inputSettings: {
          maxLength: {
            address: 20
          }
        }
      },
      popSettings: {
        one: {
          visible: false
        }
      },
      // 页面设置json
      settings: {
        // loading 状态
        loading: true,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: false
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.dialogStatus,
        rules: {
        }
      },

      valueUpdate: false
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (
        this.dialogStatus === this.PARAMETERS.STATUS_INSERT ||
        this.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT
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
      if (this.dialogStatus === this.PARAMETERS.STATUS_VIEW) {
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
    this.getDataList()
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
    this.unWatch()
  },
  methods: {
    // 强制刷新
    textSwitchChange (index, e) {
      this.$forceUpdate()
    },
    // 初始化处理
    init () {
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      switch (this.dialogStatus) {
        case this.PARAMETERS.STATUS_INSERT:
          this.initInsertModel()
          break
        case this.PARAMETERS.STATUS_UPDATE:
          this.initUpdateModel()
          break
      }
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
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
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
    },
    // 修改时的初始化
    initUpdateModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.data)
      this.dataJson.tempJsonOriginal = deepCopy(this.data)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson',
        (newVal, oldVal) => {
          this.settings.btnDisabledStatus.disabledInsert = false
        },
        { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
    },
    // 取消按钮
    handleCancel () {
      this.$emit('closeMeCancel')
    },
    // 插入逻辑
    doInsert () {
      // 开始综合验证
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          for (var i = 0; i < tempData.itemList.length; i++) {
            tempData.itemList[i].sort = i
          }
          this.settings.loading = true
          insertApi(tempData)
            .then(
              _data => {
                this.$emit('closeMeOk', { return_flag: true, data: _data })
              },
              _error => {
                this.$emit('closeMeOk', { return_flag: false, error: _error })
              }
            )
            .finally(() => {
              this.settings.loading = false
            })
        }
      })
    },
    // ------------------页面编辑出框 start--------------------
    handlePageOpen () {
      this.popSettings.one.visible = true
    },
    handlePageCloseOk (val) {
      this.popSettings.one.selectedDataJson = val
      this.dataJson.tempJson.page_code = this.popSettings.one.selectedDataJson.code
      this.popSettings.one.visible = false
      this.getDataList()
    },
    handlePageCloseCancel () {
      this.popSettings.one.visible = false
    },
    // 增加列配置
    addColumn (val) {
      const itemList = {
        _index: 0,
        name: null,
        label: null,
        fix: false,
        is_enable: true,
        sort: 0
      }
      const index = this.dataJson.tempJson.itemList.length
      itemList._index = index
      this.dataJson.tempJson.itemList.splice(val + 1, 0, itemList)
      this.textSwitchChange()
    },
    // 删除列配置
    removeColumn (val) {
      this.dataJson.tempJson.itemList.splice(val, 1)
      this.textSwitchChange()
    },
    // 列上移
    upColumn (index) {
      if (index === 0) {
        return
      }
      const newIndex = index - 1
      const newData = this.dataJson.tempJson.itemList[newIndex]
      const oldData = this.dataJson.tempJson.itemList[index]
      this.dataJson.tempJson.itemList.splice(newIndex, 1, oldData)
      this.dataJson.tempJson.itemList.splice(index, 1, newData)
      this.textSwitchChange()
    },
    downColumn (index) {
      if (index === this.dataJson.tempJson.itemList.length - 1) {
        return
      }
      const newIndex = index + 1
      const newData = this.dataJson.tempJson.itemList[newIndex]
      const oldData = this.dataJson.tempJson.itemList[index]
      this.dataJson.tempJson.itemList.splice(newIndex, 1, oldData)
      this.dataJson.tempJson.itemList.splice(index, 1, newData)
      this.textSwitchChange()
    },
    // 获取数据
    getDataList () {
      if (this.dataJson.tempJson.page_code === null || this.dataJson.tempJson.page_code === undefined) {
        return
      }
      this.dataJson.searchForm.page_code = this.dataJson.tempJson.page_code
      // 查询逻辑
      this.settings.loading = true
      getListApi(this.dataJson.searchForm).then(response => {
        const recorders = response.data.records
        const data = this.groupBy(recorders, (item) => {
          return item.page_code
        })
        if (data.length !== 0) {
          this.dataJson.tempJson.itemList = data[0]
        }
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 分组
    groupBy: function (array, f) {
      const groups = {}
      array.forEach(function (o) {
        const group = JSON.stringify(f(o))
        groups[group] = groups[group] || []
        groups[group].push(o)
      })
      return Object.keys(groups).map(function (group) {
        return groups[group]
      })
    }
  }
}
</script>
