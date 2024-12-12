<template>
  <div>
    <el-form-item label="提示内容">
      <el-input v-model="value.placeholder" size="small" placeholder="请设置提示内容" />
    </el-form-item>
    <el-form-item label="文字颜色">
      <el-color-picker v-model="value.color" size="medium" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'Description',
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
