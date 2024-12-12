<template>
  <div
    :class="[
      inputSize ? 'el-input--' + inputSize : '',
      {
        'el-input-group': $slots.prepend || $slots.append,
        'el-input-group--append': $slots.append,
        'el-input-group--prepend': $slots.prepend,
        'el-input--prefix': $slots.prefix,
        'el-input--suffix': $slots.suffix
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div
      v-if="$slots.prepend"
      class="el-input-group__prepend"
    >
      <slot name="prepend" />
    </div>
    <span v-show="disabled">
      {{ value }}
    </span>
    <el-input
      v-show="!disabled"
      v-model.trim="value"
      readonly
      :placeholder="isPlaceholderShow('请点击进行选择')"
      @click.native="handleClick"
    >
      <el-button
        slot="append"
        type="primary"
        icon="el-icon-search"
        :disabled="disabled"
      >
        选择
      </el-button>
    </el-input>
  </div>
</template>

<style scoped>
.el-input.is-disabled::v-deep .el-input__inner {
  color: #606266 !important;
  cursor: pointer;
}
.el-input::v-deep .el-input__inner {
  color: #606266 !important;
  cursor: pointer;
}
</style>

<script>
export default {
  name: 'InputSearch',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  mounted () {
    this.initSearchBtn()
  },
  methods: {
    inputSize () {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },
    handleClick () {
      if (!this.disabled) {
        this.$emit('onInputSearch')
      }
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.disabled) {
        return ''
      } else {
        return val
      }
    },
    // 选择or重置按钮的初始化
    initSearchBtn () {
      this.$nextTick(() => {
        if (this.$slots.prepend) {
          if (this.disabled) {
            this.$children[1].$children[0].$el.parentElement.className = 'el-input-group__append'
          } else {
            this.$children[1].$children[0].$el.parentElement.className = 'el-input-group__append el-input-group__append_select'
          }
        } else {
          if (this.disabled) {
            this.$children[0].$children[0].$el.parentElement.className = 'el-input-group__append'
          } else {
            this.$children[0].$children[0].$el.parentElement.className = 'el-input-group__append el-input-group__append_select'
          }
        }
      })
    }
  }
}
</script>
