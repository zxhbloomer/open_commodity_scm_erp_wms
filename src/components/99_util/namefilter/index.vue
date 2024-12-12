<template>
  <span class="info-title">
    {{ name | ellipsis }}
  </span>
</template>

<style scoped>
</style>

<script>
export default {
  filters: {
    /** 文件名超出个字符后显示省略号 */
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 4) {
        return value.slice(0, 4) + '...'
      }
      return value
    }
  },
  props: {
    name: {
      type: String,
      default: null
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
