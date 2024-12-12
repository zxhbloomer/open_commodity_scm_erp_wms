<template>
  <div>
    <el-select
      :placeholder="initPlaceholder"
      :loading="dataJson.settings.loading"
      loading-text="拼命加载..."
      clearable
      filterable
      :disabled="disabled"
      :value="value"
      @change="handleChange"
    >
      <el-option
        v-for="item in dataJson.selectOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { getListApi } from '@/api/30_wms/businesstype/businesstype'

export default {
  name: 'BusinessSelect',
  props: {
    // placeholder
    initPlaceholder: {
      type: String,
      default: '请选择业务板块'
    },
    // 是否启用
    disabled: {
      type: Boolean,
      default: false
    },
    // 返回和设定的值
    value: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      dataJson: {
        // 下拉框资源
        selectOptions: [],
        // 查询参数
        searchFrom: {

        },
        settings: {
          // loading 状态
          loading: true
        }
      }
    }
  },
  created () {
    this.getDataList()
  },
  methods: {

    getDataList () {
      this.dataJson.settings.loading = true
      getListApi(this.dataJson.searchForm).then((_data) => {
        this.dataJson.selectOptions = _data.data
        this.dataJson.settings.loading = false
      }, (_error) => {
      })
    },

    handleChange (val) {
      let selectedData
      this.dataJson.selectOptions.forEach((k) => {
        if (k.id === parseInt(val)) {
          selectedData = k
        }
      })
      this.$emit('change', val, selectedData)
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}

</style>
