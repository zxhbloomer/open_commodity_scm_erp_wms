<template>
  <div>
    <el-form-item label="提示文字">
      <el-input v-model="value.placeholder" size="small" placeholder="请设置日期提示" />
    </el-form-item>
    <el-form-item label="日期格式">
      <el-select v-model="value.format" size="small">
        <el-option value="yyyy" label="年" />
        <el-option value="yyyy-MM" label="年-月" />
        <el-option value="yyyy-MM-dd" label="年-月-日" />
        <el-option value="yyyy-MM-dd HH:mm" label="年-月-日 时:分" />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'DateTime',
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
