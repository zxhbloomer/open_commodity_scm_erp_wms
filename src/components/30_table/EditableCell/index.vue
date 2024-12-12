<template>
  <div>
    <div v-if="settings.showModal" class="modal_class" @click="settings.showModal=false" />
    <div class="el-input__inner perfect_edit_cell" @click="onFieldClick">
      <el-tooltip
        :placement="toolTipPlacement"
        :open-delay="toolTipDelay"
        :content="toolTipContent"
      >
        <div v-popover:popover @keyup.enter="onFieldClick">
          <slot name="edit-cell-content" />
        </div>
      </el-tooltip>
      <div :v-if="editMode || showInput">
        <el-popover
          ref="popover"
          :v-if="editMode || showInput"
          title="快速编辑"
          width="250"
          popper-class="perfect_popper"
        >
          <el-form
            :inline="true"
            :model="dataJson.form"
            label-position="getLabelPosition()"
          >
            <el-form-item label="">
              <component
                :is="editableComponent"
                v-if="editMode || showInput"
                ref="input"
                v-model.trim="dataJson.form.data"
                v-popover:edit_cell_popover
                v-bind="$attrs"
                @focus="onFieldClick"
                @keyup.enter.native="onInputExit"
              >
                <slot name="edit-component-slot" />
              </component>
            </el-form-item>
            <el-divider />
            <div style="text-align: right; margin: 0">
              <el-button type="text" @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleSubmit">提交</el-button>
            </div>
          </el-form>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal_class {
    background-color: #000;
    opacity: 0.5;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1400
  }
  .perfect_edit_cell {
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    border-color:#1a90ff;
  }
</style>

<script>
export default {
  name: 'EditableCell',
  inheritAttrs: false,
  props: {
    // value: {
    //   type: String,
    //   default: ''
    // },
    // eslint-disable-next-line vue/require-default-prop
    value: [String, Number],
    toolTipContent: {
      type: String,
      default: '点击我可编辑'
    },
    toolTipDelay: {
      type: Number,
      default: 500
    },
    toolTipPlacement: {
      type: String,
      default: 'top-start'
    },
    showInput: {
      type: Boolean,
      default: false
    },
    editableComponent: {
      type: String,
      default: 'el-input'
    },
    rowData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      editMode: false,
      dataJson: {
        form: {
          data: undefined
        }
      },
      settings: {
        showModal: false
      }
    }
  },
  computed: {
    // model: {
    //   get() {
    //     return this.value
    //   },
    //   set(val) {
    //     this.$emit('input', val)
    //   }
    // }
  },
  created() {
  },
  methods: {
    onFieldClick() {
      this.dataJson.form.data = this.value
      this.settings.showModal = true
      this.editMode = true
      this.$nextTick(() => {
        const inputRef = this.$refs.input
        if (inputRef) {
          inputRef.focus()
        }
      })
    },
    onInputChange(val) {
      this.$emit('input', val)
    },
    handleSubmit() {
      this.$refs.popover.doClose()
      this.settings.showModal = false
      this.$emit('closeMeOk', this.rowData, this.dataJson.form.data)
    },
    handleReset() {
      this.dataJson.form.data = this.value
      this.$nextTick(() => {
        const inputRef = this.$refs.input
        if (inputRef) {
          inputRef.focus()
        }
      })
    }
  }
}
</script>
