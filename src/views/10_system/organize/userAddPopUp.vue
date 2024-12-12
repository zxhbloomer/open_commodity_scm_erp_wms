<template>
  <div>
    <!-- pop窗口1 -->
    <el-dialog
      v-el-drag-dialog
      :title="dialogName[dialogStatus]"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :append-to-body="true"
      :modal-append-to-body="false"
    >
      <el-form
        ref="dataForm"
        :rules="validating"
        :model="currentData"
        :size="getSize()"
        label-position="rigth"
        label-width="120px"
        status-icon
        inline
      >
        <el-form-item
          label="用户账号"
          prop="name1"
        >
          <el-input placeholder="用户账号" />
        </el-form-item>
        <el-form-item label="所属用户组">
          <el-input
            placeholder="所属用户组"
            prop="name2"
          />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-input
            placeholder="用户类型"
            prop="name2"
          />
        </el-form-item>
        <el-form-item label="所属组织">
          <el-input
            placeholder="所属组织"
            prop="name2"
          />
        </el-form-item>
        <el-form-item label="用户实名">
          <el-input
            placeholder="用户实名"
            prop="name2"
          />
        </el-form-item>
        <el-row>
          <el-form-item label="账号失效日期">
            <el-input
              placeholder="账号失效日期"
              prop="name2"
            />
          </el-form-item>
          <el-form-item label="账号生效日期">
            <el-input
              placeholder="账号生效日期"
              prop="name2"
            />
          </el-form-item>
        </el-row>
        <el-form-item label="密码生效日期">
          <el-input
            placeholder="密码生效日期"
            prop="name2"
          />
        </el-form-item>
        <el-form-item label="密码失效日期">
          <el-input
            placeholder="密码失效日期"
            prop="name2"
          />
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input
            placeholder="电子邮箱"
            prop="name2"
          />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            placeholder="手机号码"
            prop="name2"
          />
        </el-form-item>
        <el-form-item label="办公电话">
          <el-input
            placeholder="办公电话"
            prop="name2"
          />
        </el-form-item>
        <el-row>
          <el-form-item label="说明">
            <el-input
              type="textarea"
              placeholder="说明"
              prop="name2"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():doUpdateData()"
        >确定</el-button>
        <el-button
          type="info"
          @click="doCloseDialog()"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateData } from '@/api/10_system/organize/organize'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'UserAddPopUp',
  directives: { elDragDialog },
  props: {
    // 参数：
    // 1:窗口参数
    dialogStatus: {
      type: String,
      default: () => { }
    },
    dialogVisible: {
      type: Boolean,
      default: () => { }
    }
  },
  data () {
    return {
      // 返回值
      'rtnPara': this.paraObject,
      // 当前数据 json
      currentData: {
        id: undefined,
        create_dt: '',
        role_name: ''
      },
      // 弹出窗口状态名称
      dialogName: {
        update: '修改',
        create: '新增',
        copyInsert: '复制新增'
      },
      name1: '',
      name2: '',
      validating: {
        name1: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
  },
  methods: {
    createData () {
      this.$refs['dataForm'].validate((valid) => {
      })
    },
    // 关闭弹出框状态
    doCloseDialog () {
      this.$emit('setDialogVisible', { dialogVisible: false })
    },
    doUpdateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.currentData)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateData(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.currentData.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.currentData)
                break
              }
            }
            this.doCloseDialog()
            this.$notify({
              title: '成功',
              message: '更新处理成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
