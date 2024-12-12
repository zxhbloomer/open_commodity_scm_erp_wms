<template>
  <div>
    <el-form-item label="提示文字">
      <el-input v-model="value.placeholder" size="small" placeholder="请设置提示语" />
    </el-form-item>
    <el-form-item label="保留小数">
      <el-input-number v-model="value.precision" controls-position="right" :precision="0" :max="3" :min="0" size="small" placeholder="小数位数" />
      位
    </el-form-item>
    <el-form-item label="展示大写">
      <el-switch v-model="value.showChinese" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'AmountInputConfig',
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
  methods: {}
}
</script>

<style scoped>

</style>
