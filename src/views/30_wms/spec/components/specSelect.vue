<template>
  <div>
    <el-select
      :placeholder="initPlaceholder"
      :loading="dataJson.settings.loading"
      loading-text="拼命加载..."
      :clearable="clearable"
      filterable
      :disabled="disabled"
      :value="value"
      @change="handleChange"
    >
      <el-option
        v-for="item in dataJson.selectOptions"
        :key="item.id"
        :label="item.spec"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { getListByGoodsIdApi } from '@/api/30_wms/spec/spec'

export default {
  name: 'SpecSelect',
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
    },
    clearable: {
      type: Boolean,
      default: true
    },
    goodsId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      dataJson: {
        // 下拉框资源
        selectOptions: [],
        // 查询参数
        searchForm: {
        },
        settings: {
          // loading 状态
          loading: true
        }
      }
    }
  },
  watch: {
    goodsId () {
      this.getDataList()
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataJson.settings.loading = true
      this.dataJson.searchForm.goods_id = this.goodsId
      getListByGoodsIdApi(this.dataJson.searchForm).then((_data) => {
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
