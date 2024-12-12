<template>
  <el-radio-group
    :value="value"
    :disabled="disabled"
    @input="handleChange"
  >
    <el-radio-button
      v-for="item in dataJson.selectOptions"
      :key="item.value"
      :value="item.value"
      :label="item.value"
    >{{ item.name }}
    </el-radio-button>
  </el-radio-group>
</template>

<script>
import { getDictDataApi } from '@/api/00_common/commonComponent'

export default {
  name: 'RadioDictComponent',
  props: {
    // 返回和设定的值
    value: {
      type: String,
      default: null
    },
    // 查询的参数
    para: {
      type: String,
      default: ''
    },
    filterPara: {
      type: Array,
      default: null
    },
    // 查询的参数
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modelValue: '',
      dataJson: {
        // 下拉选项json
        selectOptions: [],
        searchForm: {
          para: ''
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
      this.modelValue = this.initValue
      this.dataJson.settings.loading = true
      this.dataJson.searchForm.para = ''
      this.getRemoteData()
    },
    getRemoteData () {
      this.dataJson.searchForm.para = this.para
      this.dataJson.searchForm.filter_para = this.filterPara
      getDictDataApi(this.dataJson.searchForm).then((_data) => {
        this.dataJson.selectOptions = _data.data
        this.dataJson.settings.loading = false
      }, (_error) => {
      })
    },
    handleChange (val) {
      this.$emit('change', val)
    }
  }
}
</script>
