<template>
  <div v-loading="loading">
    <div v-if="!loading">
      <!--渲染表单-->
      <form-render ref="form" v-model="formData" class="process-form" :forms="forms" />
    </div>
    <el-divider>审批流程</el-divider>
    <div>
      <!--渲染流程执行过程-->
      <el-alert type="warning" description="开源版后台只是为了演示流程设计功能，后台无法处理流程发起的后续步骤，如需要完整的工作流功能请移步 👉 pro 版本" />
      <el-link href="http://106.13.16.28:83">访问pro👉 </el-link>
      <el-timeline :reverse="false">
        <!--<el-timeline-item v-for="(activity, index) in activities" :key="index">

          </el-timeline-item>-->
      </el-timeline>
    </div>
  </div>
</template>

<script>
import FormRender from '@/components/60_bpm/common/form/FormRender'
// import FormDesignRender from '@/components/60_bpm/admin/layout/form/FormDesignRender'
// import { getFormDetail } from '@/api/design'

export default {
  name: 'InitiateProcess',
  components: {
    // FormDesignRender,
    FormRender },
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      formData: {},
      form: {
        formId: '',
        formName: '',
        logo: {},
        formItems: [],
        process: {},
        remark: ''
      }
    }
  },
  computed: {
    forms () {
      return this.$store.getters.bpm_design.formItems
    }
  },
  mounted () {
    this.loadFormInfo(this.code)
  },
  methods: {
    loadFormInfo (formId) {
      this.loading = true
      // getFormDetail(formId).then(rsp => {
      //   this.loading = false
      //   console.log(rsp.data)
      //   const form = rsp.data
      //   form.logo = JSON.parse(form.logo)
      //   form.settings = JSON.parse(form.settings)
      //   form.formItems = JSON.parse(form.formItems)
      //   form.process = JSON.parse(form.process)
      //   this.form = form
      //   // 构建表单及校验规则
      //   this.$store.getters.bpm_design = form
      // }).catch(err => {
      //   this.loading = false
      //   this.$message.error(err)
      // })
    },
    validate (call) {
      this.$refs.form.validate(call)
    }
  }
}
</script>

<style lang="less" scoped>
.process-form {
  /deep/ .el-form-item__label {
    padding: 0 0;
  }
}
</style>
