<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-date-picker size="medium" disabled :type="type" :placeholder="placeholder" />
    </div>
    <div v-else>
      <el-date-picker v-if="!readerMode" v-model="_value" :value-format="format" size="medium" clearable :type="type" :placeholder="placeholder" />
      <div v-else v-text="value" />
    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'

export default {
  name: 'DateTime',
  components: {},
  mixins: [componentMinxins],
  props: {
    value: {
      type: null,
      default: null
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd HH:mm'
    },
    placeholder: {
      type: String,
      default: '请选择日期时间'
    },
    readerMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    type () {
      switch (this.format) {
        case 'yyyy':
          return 'year'
        case 'yyyy-MM':
          return 'month'
        case 'yyyy-MM-dd':
          return 'date'
        case 'yyyy-MM-dd HH:mm':
          return 'datetime'
        default:
          return 'datetime'
      }
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>

