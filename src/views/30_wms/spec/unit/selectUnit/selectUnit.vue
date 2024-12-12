<template>
  <div>
    <!-- sku_id不为空时，显示数据 -->
    <div v-show="!(skuId===null)">
      <!-- 只有一条数据时 -->
      <div v-show="settings.only_one_unit">
        {{ dataJson.tempJson.src_unit }}
        <el-button
          type="primary"
          @click="initCreated"
        >
          刷新
        </el-button>
      </div>

      <!-- 多条数据时，需要手动选择 -->
      <el-select
        v-show="!settings.only_one_unit"
        v-model="dataJson.unit_data"
        :placeholder="placeholder"
        :loading="settings.loading"
        loading-text="拼命加载..."
        :clearable="clearable"
        :disabled="disabled"
        value-key="id"
        style="width: 100%"
        @change="handleChange"
        @focus="initCreated"
      >
        <el-option
          v-for="item in dataJson.dataList"
          :key="item.id"
          :label="item.src_unit"
          :value="item"
        />
      </el-select>
    </div>
    <!-- sku_id为空时，显示提示信息 -->
    <div v-show="(skuId===null)">
      请先选择物料商品
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
import deepCopy from 'deep-copy'
import { getListApi } from '@/api/30_wms/spec/unit/unitCalc'
import { isNotEmpty } from '@/utils'
export default {
  name: 'SelectWarehouseBinGrid', // 页面id，和router中的name需要一致，作为缓存
  components: {},
  mixins: [],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择单位'
    },
    // skuid
    skuId: {
      type: Number,
      default: null
    },
    value: {
      type: Number,
      default: null
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dataJson: {
        unit_data: null,
        // 查询使用的json
        searchForm: {
          sku_id: this.skuId
        },
        tempJson: null,
        tempJsonOriginal: {
          unit: '',
          src_unit: ''
        },
        dataList: null
      },
      settings: {
        // 根据商品id，找到了唯一的单位
        only_one_unit: false,
        loading: true
      }
    }
  },
  computed: {

  },
  // 监听器
  watch: {
    'skuId': {
      handler () {
        this.dataJson.searchForm.sku_id = this.skuId
        this.getDataList()
      }
    }
  },
  created () {
    // 页面初始化
    this.initCreated()
  },
  mounted () {
    // 描绘完成
  },
  methods: {
    // 页面初始化
    initCreated () {
      this.getDataList()
    },
    getDataList () {
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      if (this.dataJson.searchForm.sku_id === null) {
        this.settings.only_one_unit = false
        return
      }
      getListApi(this.dataJson.searchForm).then((_data) => {
        if (_data.data.length === 1) {
          this.dataJson.tempJson = _data.data[0]
          this.settings.only_one_unit = true
          this.$emit('change', this.dataJson.tempJson)
        } else {
          this.settings.only_one_unit = false
        }
        this.dataJson.dataList = _data.data
        if (isNotEmpty(this.value)) {
          const obj = _data.data.find((item) => {
            return item.src_unit_id === this.value
          })
          this.dataJson.unit_data = obj
          this.$emit('change', obj)
        }
        this.settings.loading = false
      }, (_error) => {
      })
    },
    handleChange (val) {
      this.$emit('change', val)
    }

  }
}
</script>
