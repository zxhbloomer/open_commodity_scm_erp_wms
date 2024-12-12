<template>
  <div
    v-if="value"
    class="mf-overlay"
    :style="myStyle"
    @click="handleClick"
  />
</template>

<style scoped>
.mf-overlay {
  border-radius: inherit;
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: inherit;
  width: 100%;
  will-change: opacity;
}
</style>

<script>
export default {
  name: 'Overlay',
  props: {
    absolute: Boolean,
    color: {
      type: String,
      default: '#FFF'
    },
    opacity: {
      type: [Number, String],
      default: 0.46
    },
    value: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: [Number, String],
      default: 5
    }
  },
  computed: {
    computedOpacity () {
      return Number(this.opacity)
    },
    myStyle () {
      const style = {
        zIndex: this.zIndex,
        opacity: this.computedOpacity,
        'background-color': this.color
      }
      return style
    }
  },
  mounted () {
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>
