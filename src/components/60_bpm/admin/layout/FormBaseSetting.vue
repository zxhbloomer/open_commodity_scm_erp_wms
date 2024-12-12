<template>
  <div class="base-setup" @click="showIconSelect = false">
    <el-form ref="baseSetting" :model="setup" label-position="top" label-width="80px">
      <el-form-item label="表单图标">
        <i :class="setup.logo.icon" :style="'background:' + setup.logo.background" />
        <span class="change-icon">
          <span>
            <span>选择背景色</span>
            <el-color-picker v-model="setup.logo.background" show-alpha size="small" :predefine="colors" />
          </span>
          <span>
            <span>选择图标</span>
            <el-popover placement="bottom-start" width="390" trigger="click">
              <div class="icon-select">
                <i v-for="(i, id) in icons" :key="id" :class="i" @click="setup.logo.icon = i" />
              </div>
              <i slot="reference" :class="setup.logo.icon" />
            </el-popover>
            <!--<i :class="setup.icon" @click.stop="showIconSelect = true"></i>-->
          </span>
        </span>
      </el-form-item>
      <el-form-item label="表单名称" :rules="getRule('请输入表单名称')" prop="formName">
        <el-input v-model="setup.formName" size="medium" />
      </el-form-item>
      <el-form-item label="所在分组" :rules="getRule('请选择表单分组')" class="group" prop="groupId">
        <el-select v-model="setup.groupId" placeholder="请选择分组" size="medium">
          <el-option
            v-for="(op, index) in fromGroup"
            v-show="op.id > 1"
            :key="index"
            :label="op.name"
            :value="op.id"
          />
        </el-select>
        <el-popover placement="bottom-end" title="新建表单分组" width="300" trigger="click">
          <el-input v-model="newGroup" size="medium" placeholder="请输入新的分组名">
            <el-button slot="append" size="medium" type="primary" @click="addGroup">提交</el-button>
          </el-input>
          <el-button slot="reference" icon="el-icon-plus" size="medium" type="primary">新建分组</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="表单说明">
        <el-input
          v-model="setup.remark"
          placeholder="请输入表单说明"
          type="textarea"
          show-word-limit
          :autosize="{ minRows: 2, maxRows: 5}"
          maxlength="500"
        />
      </el-form-item>
      <el-form-item label="消息通知方式" :rules="getRule('请选择消息通知方式')">
        <el-select
          v-model="setup.settings.notify.types"
          value-key="name"
          placeholder="选择消息通知方式"
          style="width: 30%;"
          size="medium"
          clearable
          multiple
          collapse-tags
        >
          <el-option v-for="(wc, index) in notifyTypes" :key="index" :label="wc.name" :value="wc" />
        </el-select>
        <el-input v-model="setup.settings.notify.title" size="medium" style="width: 68%; float:right;" placeholder="消息通知标题" />
      </el-form-item>
      <el-form-item label="谁可以管理此表单">
        <el-select
          v-model="setup.settings.admin"
          value-key="name"
          class="select-u"
          placeholder="请选择可以管理此表单的人员"
          size="medium"
          clearable
          multiple
          @click.native="selectUser('admin')"
        >
          <el-option v-for="(wc, index) in setup.settings.admin" :key="index" :label="wc.name" :value="wc" />
        </el-select>
      </el-form-item>
    </el-form>
    <org-picker ref="orgPicker" title="请选择可以管理此表单的人员" multiple :selected="select" @ok="selected" />
  </div>
</template>

<script>
import OrgPicker from '@/components/60_bpm/common/OrgPicker'
import { isNotEmpty } from '@/utils'
// import { getFormGroups, updateGroup } from '@/api/design'
// import iconfont from '@/assets/iconfont/iconfont.json'

export default {
  name: 'FormBaseSetting',
  components: { OrgPicker },
  data () {
    return {
      nowUserSelect: null,
      showIconSelect: false,
      select: [],
      newGroup: '',
      fromGroup: [],
      notifyTypes: [
        { type: 'APP', name: '应用内通知' },
        { type: 'EMAIL', name: '邮件通知' },
        { type: 'SMS', name: '短信通知' },
        { type: 'WX', name: '微信通知' },
        { type: 'DING', name: '钉钉通知' }
      ],
      colors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      icons: [
        'el-icon-delete-solid',
        'el-icon-s-tools',
        'el-icon-s-goods',
        'el-icon-warning',
        'el-icon-circle-plus',
        'el-icon-camera-solid',
        'el-icon-s-promotion',
        'el-icon-s-cooperation',
        'el-icon-s-platform',
        'el-icon-s-custom',
        'el-icon-s-data',
        'el-icon-s-check',
        'el-icon-s-claim'
      ],
      rules: {
        formName: [{}],
        groupId: []
      }
    }
  },
  computed: {
    setup () {
      return this.$store.getters.bpm_design
    }
  },
  created () {
    this.loadIconfont()
  },
  mounted () {
    this.getGroups()
  },
  methods: {
    getRule (msg) {
      return [{ required: true, message: msg, trigger: 'blur' }]
    },
    loadIconfont () {
      // if (iconfont && iconfont.id) {
      //   iconfont.glyphs.forEach(icon => {
      //     this.icons.push(`${iconfont.font_family} ${iconfont.css_prefix_text}${icon.font_class}`)
      //   })
      // }
    },
    getGroups () {
      // getFormGroups().then(rsp => {
      //   this.fromGroup = rsp.data
      // }).catch(
      //   err => {
      //     console.error(err)
      //     this.$message.error('获取分组异常')
      //   }
      // )
    },
    addGroup () {
      if (this.newGroup.trim() !== '') {
        // updateGroup({ name: this.newGroup.trim() }, 'post').then(rsp => {
        //   this.$message.success(rsp.data)
        //   this.getGroups()
        // }).catch(err => this.$message.error(err.response.data))
      }
    },
    selected (select) {
      this.$set(this.setup.settings, this.nowUserSelect, select)
      // this.setup[this.nowUserSelect] = select
    },
    selectUser (key) {
      this.select = this.setup.settings[key]
      this.nowUserSelect = key
      this.$refs.orgPicker.show()
    },
    validate () {
      this.$refs.baseSetting.validate()
      const err = []
      if (!isNotEmpty(this.setup.formName)) {
        err.push('表单名称未设置')
      }
      if (!isNotEmpty(this.setup.groupId)) {
        err.push('表单分组未设置')
      }
      if (this.setup.settings.notify.types.length === 0) {
        err.push('审批消息通知方式未设置')
      }
      return err
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-select-dropdown {
  display: none;
}

.icon-select {
  display: flex;
  flex-wrap: wrap;
  i {
    cursor: pointer;
    font-size: large;
    padding: 10px;
    max-width: 38px !important;
    &:hover {
      box-shadow: 0 0 10px 2px #C2C2C2;
    }
  }
}

/deep/ .select-u {
  width: 100%;
}

.base-setup {
  overflow: auto;
  margin: 0 auto;
  width: 600px;
  height: calc(100vh - 105px);
  background: #ffffff;
  margin-top: 10px;
  padding: 15px 20px;

  i:first-child {
    position: relative;
    cursor: pointer;
    font-size: xx-large;
    color: #ffffff;
    border-radius: 10px;
    padding: 10px;
  }

  .change-icon {
    margin-left: 20px;

    span {
      font-size: small;
      color: #7a7a7a;
      margin-right: 15px;
    }

    i {
      cursor: pointer;
      color: #7a7a7a;
      font-size: x-large;
    }
  }

  /deep/ .el-form-item__label {
    padding: 0;
    font-weight: bold;
  }

  /deep/ .el-form-item {
    margin-bottom: 5px;
  }
}

/deep/ .group {
  .el-select {
    width: calc(100% - 130px);
  }

  .el-button {
    margin-left: 10px;
    width: 120px;
  }
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: #f8f8f8;
}

::-webkit-scrollbar-thumb {
  border-radius: 16px;
  background-color: #e8e8e8;
}
</style>
