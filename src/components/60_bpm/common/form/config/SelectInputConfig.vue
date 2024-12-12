<template>
  <div>
    <el-form-item label="提示文字">
      <el-input v-model="value.placeholder" size="small" placeholder="请设置提示语" />
    </el-form-item>
    <el-form label-position="top">
      <el-form-item label="选项设置" class="options">
        <div slot="label" class="option-item-label">
          <span>选项设置</span>
          <el-button
            icon="el-icon-plus"
            type="text"
            size="mini"
            @click="value.options.push('新选项')"
          >新增选项</el-button>
        </div>
        <draggable :list="value.options" group="option" handler=".el-icon-rank" :options="dragOption">
          <div v-for="(op, index) in value.options" :key="index" class="option-item">
            <i class="el-icon-rank" />
            <el-input v-model="value.options[index]" size="medium" placeholder="请设置选项值" clearable>
              <el-button
                slot="append"
                icon="el-icon-delete"
                type="danger"
                size="medium"
                @click="value.options.splice(index, 1)"
              />
            </el-input>
          </div>
        </draggable>

      </el-form-item>
    </el-form>
    <el-form-item label="选项展开">
      <el-switch v-model="value.expanding" />
    </el-form-item>

  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'SelectInputConfig',
  components: { draggable },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dragOption: {
        animation: 300,
        sort: true
      }
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
/deep/ .options{
  .el-form-item__label{
    display: block;
    width: 100%;
    text-align: left;
  }
  .el-icon-rank{
    padding-right: 5px;
    cursor: move;
  }
  .option-item{
    .el-input{
      width: 250px;
      float:right;
    }
  }
}

.option-item-label{
  height: 30px;
  line-height: 30px;
  button{
    float:right;
  }
}

/*/deep/ .el-form-item {
  margin-bottom: 10px;

  .el-form-item__label {
    padding: 0;
  }
  .options{
    .el-icon-rank{
      cursor: move;
    }
  }
}*/
</style>

