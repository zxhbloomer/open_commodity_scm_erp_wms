<template>
  <el-form
    ref="form"
    :model="dataJson.tempJson"
    :rules="rules"
    label-width="120px"
  >
    <el-form-item
      label="table全局高度"
      prop="height"
    >
      <el-input
        v-model="dataJson.tempJson.height"
        placeholder="请输入table全局高度"
        type="text"
      />
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>

<script>
export default {
  name: 'SystemSettings',
  data () {
    return {
      dataJson: {
        tempJson: {

        }
      },
      rules: {

      }
    }
  },
  methods: {

  }
}

</script>
