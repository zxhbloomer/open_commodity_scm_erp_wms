<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-input size="medium" disabled :placeholder="placeholder" show-word-limit :rows="2" type="textarea" />
    </div>
    <div v-else>
      <el-input v-if="!readerMode" v-model="_value" size="medium" clearable :maxlength="255" :placeholder="placeholder" show-word-limit :rows="3" type="textarea" />
      <div v-else v-text="_value" />

    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'

export default {
  name: 'TextareaInput',
  components: {},
  mixins: [componentMinxins],
  props: {
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: '请输入内容'
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
    _value: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>

