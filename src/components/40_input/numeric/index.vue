<template>
  <div :class="getClass()">
    {{ prefix }}
    <vue-autonumeric
      ref="refNumber"
      v-model="amount"
      :options="dataJson.options"
      class="el-input__inner"
      :disabled="disabled"
      :style="getStyle()"
    />
    {{ suffix }}
  </div>
</template>

<style scoped>
</style>

<script>
import VueAutonumeric from 'vue-autonumeric/src/components/VueAutonumeric.vue'

export default {
  name: 'NumberCurrency',
  components: { VueAutonumeric },
  directives: {},
  mixins: [],
  props: {
    // 启用禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 如果不需要显示货币符号，可以传空，代表为数值
    currencySymbol: {
      type: String,
      default: '¥'
    },
    // 如果没有填写数据，默认显示0
    emptyInputBehavior: {
      type: String,
      default: 'zero'
    },
    // 最小值，0意味着不可输入负数
    minimumValue: {
      type: Number,
      default: 0
    },
    // 最大值，1意味着不可大于1
    maximumValue: {
      type: Number,
      default: 10000000000
    },
    // 小数点
    decimalPlaces: {
      type: Number,
      default: 0
    },
    // 宽度百分比
    widthCss: {
      type: String,
      default: '100%'
    },
    // 前缀
    prefix: {
      type: String,
      default: ''
    },
    // 后缀
    suffix: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      amount: this.value,
      dataJson: {
        // autonumeric的配置
        options: {
          currencySymbol: this.currencySymbol,
          emptyInputBehavior: this.emptyInputBehavior,
          minimumValue: this.minimumValue,
          maximumValue: this.maximumValue,
          decimalPlaces: this.decimalPlaces
          // readOnly: this.disabled // 若不去掉禁止输入会有问题
        }
      }
    }
  },
  computed: {
  },
  // 监听器
  watch: {
    amount: function (newVal) {
      this.$emit('input', newVal)
    },
    value: function (newVal, oldVal) {
      this.amount = newVal
      this.$emit('input', newVal)
    }
  },
  mounted () {
  },
  methods: {
    getClass () {
      if (this.disabled) {
        return 'el-input el-input--mini is-disabled el-input--suffix'
      }
      return 'el-input el-input--mini el-input--suffix'
    },
    getStyle () {
      return 'width:' + this.widthCss
    }
  }
}
</script>
