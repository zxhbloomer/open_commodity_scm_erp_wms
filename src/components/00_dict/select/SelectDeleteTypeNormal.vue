<template>
  <el-select
    placeholder="请选择删除状态"
    :loading="dataJson.settings.loading"
    loading-text="拼命加载..."
    clearable
    :value="value"
    @input="$emit('input', $event)"
  >
    <el-option
      v-for="item in dataJson.selectOptions"
      :key="item.value"
      :label="item.name"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import { getDeleteTypeNormalApi } from '@/api/00_common/commonComponent'

export default {
  name: 'SelectComponentDeleteTypeNormal',
  props: {
    // 接受参数
    value: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      dataJson: {
        // 资源类型下拉选项json
        selectOptions: [],
        settings: {
          // 页面设置json
          // loading 状态
          loading: true
        }

      }
    }
  },
  // 监听器
  watch: {

  },
  created () {
    // 初始化查询
    this.init()
  },
  mounted () {
    // 描绘完成

  },
  methods: {
    // 初始化
    init () {
      this.dataJson.settings.loading = true
      this.getRemoteData()
    },
    getRemoteData () {
      getDeleteTypeNormalApi().then((_data) => {
        this.dataJson.selectOptions = _data.data
        this.dataJson.settings.loading = false
      }, (_error) => {
      })
    }
  }
}
</script>
