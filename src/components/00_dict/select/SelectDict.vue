<!--字典表下拉选项框，不可多选-->
<template>
  <el-select
    :placeholder="initPlaceholder"
    :loading="dataJson.settings.loading"
    loading-text="拼命加载..."
    clearable
    filterable
    :value="value"
    :disabled="disabled"
    @input="$emit('input', $event)"
    @change="handleChange"
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
import { getDictDataApi } from '@/api/00_common/commonComponent'

export default {
  name: 'SelectDictComponent',
  props: {
    // 返回和设定的值
    value: {
      type: [Number, String],
      default: null
    },
    // placeholder
    initPlaceholder: {
      type: String,
      default: ''
    },
    // 查询的参数
    para: {
      type: String,
      default: ''
    },
    // 查询的参数
    disabled: {
      type: Boolean,
      default: false
    },
    // 查询过滤的参数
    filterPara: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      dataJson: {
        // 资源类型下拉选项json
        selectOptions: [],
        searchForm: {
          para: '',
          filterPara: []
        },
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
      this.dataJson.searchForm.para = ''
      this.getRemoteData()
    },
    getRemoteData () {
      this.dataJson.searchForm.para = this.para
      this.dataJson.searchForm.filterPara = this.filterPara
      this.dataJson.searchForm.filter_para = this.filterPara
      getDictDataApi(this.dataJson.searchForm).then((_data) => {
        this.dataJson.selectOptions = _data.data
        this.dataJson.settings.loading = false
      }, (_error) => {
      })
    },
    handleChange (val) {
      let selectedData
      this.dataJson.selectOptions.forEach((k) => {
        if (k.value === val) {
          selectedData = k
        }
      })

      this.$emit('change', val, selectedData)
    }
  }
}
</script>
