<template>
  <el-form
    ref="form"
    :model="user"
    :rules="rules"
    label-width="80px"
  >
    <el-form-item
      label="旧密码"
      prop="oldPassword"
    >
      <el-input
        v-model="user.oldPassword"
        placeholder="请输入旧密码"
        type="password"
        show-password
      />

    </el-form-item>
    <el-form-item
      label="新密码"
      prop="newPassword"
    >
      <!--      <el-input-->
      <!--        v-model="user.newPassword"-->
      <!--        placeholder="请输入新密码"-->
      <!--        type="password"-->
      <!--        show-password-->
      <!--      />-->
      <password
        v-model="user.newPassword"
        placeholder="请输入新密码"
        type="password"
      />

    </el-form-item>
    <el-form-item
      label="确认密码"
      prop="confirmPassword"
    >
      <el-input
        v-model="user.confirmPassword"
        placeholder="请确认新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="mini"
        @click="submit"
      >保存
      </el-button>
      <el-button
        type="danger"
        size="mini"
        @click="close"
      >关闭
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import { updatePwd } from '@/api/10_system/user/user'
import Password from '@/components/pwdMeter/pwdMeter.vue'

export default {
  components: { Password },
  data () {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // 页面设置json
      settings: {
        duration: 4000
      },
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 8, message: '长度需大于8位', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/[A-Z]/.test(value)) {
                callback(new Error('密码必须包含大写字母'))
              } else if (!/[a-z]/.test(value)) {
                callback(new Error('密码必须包含小写字母'))
              } else if (!/[0-9]/.test(value)) {
                callback(new Error('密码必须包含数字'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.showLoading('数据保存中...')
          const tempJson = {}
          tempJson.pwd_his_pwd = this.user.oldPassword
          tempJson.pwd = this.user.newPassword
          updatePwd(tempJson).then((_data) => {
            this.$notify({
              title: '更新处理成功',
              message: _data.message,
              type: 'success',
              duration: this.settings.duration
            })
            this.logout()
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
      this.$tab.closePage()
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
