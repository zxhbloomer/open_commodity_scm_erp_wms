<template>
  <div>
    <el-form-item label="提示文字">
      <el-input v-model="value.placeholder" size="small" placeholder="提醒添加记录的提示" />
    </el-form-item>
    <el-form-item label="最大行数">
      <tip slot="label" content="允许添加多少条记录（为0则不限制）">最大行数</tip>
      <el-input-number v-model="value.maxSize" controls-position="right" :precision="0" :max="100" :min="0" size="small" placeholder="限制条数" />
    </el-form-item>
    <el-form-item label="布局方式">
      <el-radio v-model="value.rowLayout" name="layout" :label="true">按表格</el-radio>
      <el-radio v-model="value.rowLayout" name="layout" :label="false">按表单</el-radio>
    </el-form-item>
    <el-form-item label="展示合计">
      <el-switch v-model="value.showSummary" />
      <el-select v-if="value.showSummary" v-model="value.summaryColumns" style="width: 100%;" size="small" multiple clearable placeholder="请选择合计项">
        <el-option v-for="column in columns" :key="column.id" :label="column.title" :value="column.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="展示边框">
      <el-switch v-model="value.showBorder" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'TableListConfig',
  components: {},
  props: {
    value: {
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
    columns () {
      return this.value.columns.filter(c => c.valueType === 'Number')
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>

