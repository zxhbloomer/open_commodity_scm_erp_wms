<template>
  <el-dialog
    title="通知编辑"
    :visible.sync="dialogVisible"
    width="55%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :append-to-body="true"
    :modal-append-to-body="false"
  >
    <el-form
      ref="dataSubmitForm"
      :rules="settings.rules"
      :model="dataJson.tempJson"
      label-position="right"
      label-width="85px"
      status-icon
    >
      <el-form-item
        label="通知标题:"
        prop="title"
      >
        <el-input
          v-model="dataJson.tempJson.title"
          clearable
          placeholder="请输入标题名称"
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
          init-placeholder="请选择"
          style="width:100%"
        />
      </el-form-item>
      <el-form-item
        label="通知内容:"
        prop="content"
      >
        <Markdown
          v-model="editorText"
          :initial-value="editorText"
          height="400px"
          @text-changed="onEditorChange"
        />
      </el-form-item>
      <el-form-item class="center-buttons">
        <el-button
          type="primary"
          size="mini"
        >保存</el-button>
        <el-button
          type="danger"
          size="mini"
          @click="handleClose"
        >关闭</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</template>
<script>
import Markdown from '@/components/markdown/editor.vue'
import SelectDict from '@/components/00_dict/select/SelectDict.vue'

export default {
  name: 'Contentedit',
  components: { Markdown, SelectDict },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editorText: '',
      editorOptions: {
        hideModeSwitch: true
      },
      dataJson: {
        tempJson: {
          title: ''
        }
      },
      settings: {
        rules: {
          title: [
            { required: true, message: '请输入标题名称', trigger: 'blur' }
          ]
        }
      }
    }
  },
  methods: {
    // 文本框编辑内容
    onEditorChange (event) {
      this.editorText = event
    },
    handleClose () {
      this.$emit('closeCancel')
    }
  }
}
</script>

<style scoped>
.center-buttons{
  display: flex;
  justify-content: center;
}

</style>
