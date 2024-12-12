<template>
  <div class="app-container">
    <div class="edit-container">
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="90px"
        status-icon
      >
        <el-form-item
          label="通知标题:"
          prop="title"
        >
          <el-input
            v-model="dataJson.tempJson.title"
            placeholder="请输入标题名称"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="通知类型:"
          prop="type"
        >
          <SelectDict
            v-model="dataJson.tempJson.type"
            :value="dataJson.tempJson.type"
            :para="CONSTANTS.DICT_B_NOTICE_TYPE"
            init-placeholder="请选择通知类型"
            style="width:94%"
          />
        </el-form-item>
        <el-form-item
          label="通知人:"
          prop="staff_list"
        >
          <el-button
            style="margin-right: 10px;"
            type="primary"
            size="mini"
            @click="handleSelectStaff"
          >选择通知人</el-button>
          <el-tag
            v-for="(item, key) in dataJson.tempJson.staff_list"
            :key="key"
            closable
            :disable-transitions="false"
            @close="handleDelete(key)"
          >
            {{ item.name }}
          </el-tag>
        </el-form-item>
        <el-form-item
          label="通知内容:"
          prop="content"
        >
          <Markdown
            ref="editor"
            :initial-value="dataJson.tempJson.msg"
            height="500px"
            style="width:94%"
            @text-changed="onEditorChange"
          />
        </el-form-item>
        <el-form-item class="center-buttons">
          <el-button
            type="primary"
            size="mini"
            @click="doSend"
          >发布</el-button>
          <el-button
            v-if="settings.btnShowStatus.showInsert"
            type="primary"
            size="mini"
            @click="saveDraft"
          >保存</el-button>
          <el-button
            v-if="settings.btnShowStatus.showUpdate"
            type="primary"
            size="mini"
            @click="doUpdate"
          >保存</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleClose"
          >关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
    <select-staff
      v-if="settings.popsettings.one.visible"
      :visible="settings.popsettings.one.visible"
      :data="settings.popsettings.one.props.data"
      @emitInsertStaffOk="handleInsertStaffOk"
      @emitCloseCancel="handleSelectStaffCancel"
    />
  </div>
</template>
<script>
import SelectDict from '@/components/00_dict/select/SelectDict.vue'
import Markdown from '@/components/markdown/editor.vue'
import SelectStaff from '@/views/10_system/systemnotice/components/staffTreeDialog/index'
import deepCopy from 'deep-copy'
import { insertApi, getApi, updateApi } from '@/api/10_system/notice/systemnotice'

export default {
  components: { Markdown, SelectDict, SelectStaff },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    editStatus: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editorText: '',
      editorOptions: {
        hideModeSwitch: true
      },
      dataJson: {
        tempJsonOriginal: {
          title: '',
          staff_list: []
        },
        tempJson: {}
      },
      settings: {
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
        rules: {
          title: [
            { required: true, message: '请输入标题名称', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择通知类型', trigger: 'change' }
          ]
        },
        loading: false,
        popsettings: {
          // 弹出编辑页面
          one: {
            visible: false,
            props: {
              id: undefined,
              data: [],
              dialogStatus: ''
            }
          }
        }
      }
    }
  },
  watch: {
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化处理
    init () {
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      console.log('==================' + this.editStatus)
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

      this.settings.loading = false
    },
    initUpdateModel () {
      this.getData()
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 设置按钮
      this.settings.btnShowStatus.showUpdate = true
      // 控件focus
      this.$nextTick(() => {
      })
    },
    // 新增时的初始化
    initInsertModel () {
      // 数据初始化
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 设置按钮
      this.settings.btnShowStatus.showInsert = true
      // 控件focus
      this.$nextTick(() => {
      })
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(
        this
      ).settings.btnDisabledStatus
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(
        this
      ).settings.btnShowStatus
    },
    onEditorChange (event) {
      this.dataJson.tempJson.msg = event
    },
    // 关闭编辑页面
    handleClose () {
      this.$emit('emitReturn')
    },
    // 查询详情
    getData () {
      // 查询逻辑
      this.settings.loading = true
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 保存草稿
    saveDraft () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.status = '0'
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
    // 发布
    doSend () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.status = '1'
          this.settings.loading = true
          if (this.editStatus === this.PARAMETERS.STATUS_INSERT) {
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
          } else if (this.editStatus === this.PARAMETERS.STATUS_UPDATE) {
            updateApi(tempData)
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
        }
      })
    },
    // 更新
    doUpdate () {
      this.$refs['dataSubmitForm'].validate(valid => {
        if (valid) {
          const tempData = deepCopy(this.dataJson.tempJson)
          tempData.status = '0'
          this.settings.loading = true
          updateApi(tempData)
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
    // 打开选择人员弹窗
    handleSelectStaff () {
      this.settings.popsettings.one.visible = true
      this.settings.popsettings.one.props.data = this.dataJson.tempJson.staff_list
    },
    // 取消选择人员
    handleSelectStaffCancel () {
      this.settings.popsettings.one.visible = false
    },
    // 选择人员成功
    handleInsertStaffOk (data) {
      this.handleSelectStaffCancel()
      this.dataJson.tempJson.staff_list = data
    },
    // 删除某个标签
    handleDelete (key) {
      this.dataJson.tempJson.staff_list.splice(key, 1)
    }

  }
}
</script>

<style scoped>
.el-input {
  width: 94%;
}
.center-buttons{
  display: flex;
  justify-content: center;
}
</style>
