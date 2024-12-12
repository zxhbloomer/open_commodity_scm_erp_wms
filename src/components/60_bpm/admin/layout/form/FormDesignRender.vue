<template>
  <component :is="config.name" ref="form" v-model="_value" :mode="mode" v-bind="config.props" />
</template>
<script>

import components from '@/components/60_bpm/common/form/ComponentExport'

export default {
  name: 'FormRender',
  components: components,
  props: {
    mode: {
      type: String,
      default: 'DESIGN'
    },
    value: {
      type: null,
      default: undefined
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    _value: {
      get () {
        const valueType = this.config.valueType
        const value = valueType === 'Number' && this.value ? Number(this.value) : this.value
        return value
      },
      set (val) {
        const valueType = this.config.valueType
        const value = valueType === 'Number' ? Number(val) : val
        this.$emit('input', value)
      }
    }
  },
  methods: {
    validate (call) {
      this.$refs.form.validate(call)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
