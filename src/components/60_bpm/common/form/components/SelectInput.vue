<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-select v-if="!expanding" v-model="_value" class="max-fill" size="medium" disabled :placeholder="placeholder" />
      <el-radio-group v-else v-model="_value">
        <el-radio v-for="(op, index) in options" :key="index" disabled :label="op">{{ op }}</el-radio>
      </el-radio-group>
    </div>
    <div v-else>
      <template v-if="!readerMode">
        <el-select v-if="!expanding" v-model="_value" class="max-fill" size="medium" clearable :placeholder="placeholder">
          <el-option v-for="(op, index) in options" :key="index" :value="op" :label="op" />
        </el-select>
        <el-radio-group v-else v-model="_value">
          <el-radio v-for="(op, index) in options" :key="index" :label="op">{{ op }}</el-radio>
        </el-radio-group>
      </template>
      <template v-else>
        <div v-text="_value" />
      </template>
    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'

export default {
  name: 'SelectInput',
  components: {},
  mixins: [componentMinxins],
  props: {
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择选项'
    },
    expanding: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    readerMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>

</style>

