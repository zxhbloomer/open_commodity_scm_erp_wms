<template>
  <div>
    <el-select
      :placeholder="initPlaceholder"
      :loading="settings.loading"
      loading-text="拼命加载..."
      clearable
      filterable
      :disabled="disabled"
      :multiple="isMultiple"
      :value="value"
      @change="handleChange"
    >
      <el-option
        v-for="item in dataJson.selectOptions"
        :key="item.id"
        :label="showFullName ? item.name : item.short_name "
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { getWarehouseComboListApi } from '@/api/30_wms/warehouse/warehouse'

export default {
  name: 'BusinessSelect',
  props: {
    // placeholder
    initPlaceholder: {
      type: String,
      default: '请选择仓库'
    },
    // 是否可多选
    isMultiple: {
      type: Boolean,
      default: false
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
    },
    showFullName: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataJson: {
        // 下拉框资源
        selectOptions: [],
        // 查询参数
        searchFrom: {

        }
      },
      settings: {
        // loading 状态
        loading: true
      }
    }
  },
  created () {
    this.getWarehouseData()
  },
  methods: {
    getWarehouseData () {
      getWarehouseComboListApi({ enable: true }).then((_data) => {
        this.dataJson.selectOptions = _data.data
        this.settings.loading = false
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
