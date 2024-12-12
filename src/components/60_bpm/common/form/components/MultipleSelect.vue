<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-select v-if="!expanding" v-model="_value" class="max-fill" size="medium" multiple disabled :placeholder="placeholder" />
      <el-checkbox-group v-else v-model="_value">
        <el-checkbox v-for="(op, index) in options" :key="index" disabled :label="op">{{ op }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-else>
      <template v-if="!readerMode">
        <el-select v-if="!expanding" v-model="_value" class="max-fill" multiple size="medium" clearable :placeholder="placeholder">
          <el-option v-for="(op, index) in options" :key="index" :value="op" :label="op" />
        </el-select>
        <el-checkbox-group v-else v-model="_value">
          <el-checkbox v-for="(op, index) in options" :key="index" :label="op">{{ op }}</el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-else>
        <span>{{ readerValue }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'

export default {
  name: 'MultipleSelect',
  components: {},
  mixins: [componentMinxins],
  props: {
    placeholder: {
      type: String,
      default: '请选择选项'
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
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
    return {
      checks: []
    }
  },
  computed: {
    readerValue () {
      return this.value.join(', ')
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>

