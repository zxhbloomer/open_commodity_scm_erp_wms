<template>
  <div class="container">
    <el-tag
      v-for="(item, key) in dataJson.listData"
      :key="key"
      closable
      :disable-transitions="false"
      @close="handleClose(key)"
    >
      {{ item.name }}
    </el-tag>
    <span
      v-if="!dataJson.listData || dataJson.listData.length === 0"
      class="noStaff"
    >
      暂未选择用户
    </span>
  </div>
</template>
<script>
import { EventBus } from '@/common/eventbus/eventbus'

export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      dataJson: {
        listData: []
      }
    }
  },
  watch: {
    'dataJson.listData': {
      handler (newVal) {
        if (newVal.length > 0) {
          this.$emit('emitButtonDisabledStatus', true)
        } else {
          this.$emit('emitButtonDisabledStatus', false)
        }
      }
    }
  },
  created () {
    if (this.data !== undefined && this.data !== null) {
      this.dataJson.listData = this.data
    }
  },
  mounted () {
    EventBus.$on(this.EMITS.EMIT_ORG_DIALOG_STAFF_SELECT, _data => {
      this.doUpdateListData(_data)
    })
  },
  methods: {
    doUpdateListData (_data) {
      // 遍历数组_data, 如果listData中有相同的key, 则更新listData中的数据
      for (let i = 0; i < _data.length; i++) {
        const _key = _data[i].id
        // 判断 _key 是否在 listData(数组对象) 中
        const _index = this.dataJson.listData.findIndex(item => item.id === _key)
        if (_index !== -1) {
          this.dataJson.listData[_index] = _data[i]
        } else {
          this.dataJson.listData.push(_data[i])
        }
      }
    },
    handleClose (key) {
      this.dataJson.listData.splice(key, 1)
    }
  }
}
</script>

<style scoped>
.container {
  height: 60px;
  border: 1px solid #cfcfcf;
  padding: 2px;
  overflow: auto;
}
.noStaff {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
}
.el-tag--mini {
  margin-bottom: 3px;
}
</style>
