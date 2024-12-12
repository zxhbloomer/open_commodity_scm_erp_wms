<template>
  <div style="margin-top: 10px">
    <el-tag
      v-for="(org, index) in _value"
      :key="index + '_org'"
      class="org-item"
      :type="org.type === 'dept'?'':'info'"
      closable
      size="mini"
      @close="removeOrgItem(index)"
    >
      {{ org.name }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'OrgItems',
  components: {},
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    removeOrgItem (index) {
      this._value.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.org-item {
  margin: 5px;
}
</style>

