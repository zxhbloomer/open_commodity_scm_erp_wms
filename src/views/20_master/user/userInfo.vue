<template>
  <el-form
    ref="form"
    :model="dataJson.tempJson"
    :rules="rules"
    label-width="80px"
  >
    <el-form-item
      label="用户名称"
      prop="name"
    >
      <el-input
        v-model="dataJson.tempJson.name"
        maxlength="30"
      />
    </el-form-item>
    <el-form-item
      label="手机号码"
      prop="mobile_phone"
    >
      <el-input
        v-model="dataJson.tempJson.mobile_phone"
        maxlength="11"
      />
    </el-form-item>
    <el-form-item
      label="邮箱"
      prop="email"
    >
      <el-input
        v-model="dataJson.tempJson.email"
        maxlength="50"
      />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="dataJson.tempJson.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="mini"
        @click="submit"
      >保存</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="close"
      >关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateSelfApi } from '@/api/20_master/staff/staff'
//
export default {
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      settings: {
        duration: 4000
      },
      // 表单校验
      dataJson: {
        // 单条数据 json
        tempJson: {
          user_name: '',
          email: '',
          phone: ''
        }
      },
      rules: {
        user_name: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.dataJson.tempJson = this.user.user_session_bean.staff_info
  },
  methods: {
    submit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.showLoading('数据保存中...')
          updateSelfApi(this.dataJson.tempJson).then((_data) => {
            this.$notify({
              title: '更新处理成功',
              message: _data.message,
              type: 'success',
              duration: this.settings.duration
            })
          }, (_error) => {
            this.$notify({
              title: '更新处理失败',
              message: _error.message,
              type: 'error',
              duration: this.settings.duration
            })
          }).finally(() => {
            this.closeLoading()
          })
        }
      })
    },
    close () {
      // this.$tab.closePage()
      this.$routerTab.close()
    }
  }
}
</script>
<style scoped>
.el-form-item {
  margin-bottom: 22px;
}
.el-input--medium .el-input__inner {
  height: 36px;
  line-height: 36px;
}
</style>
