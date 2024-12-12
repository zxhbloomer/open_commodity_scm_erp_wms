<template>
  <div>
    <viewer
      ref="viewer"
      :initial-value="editorText"
      height="500px"
    />
  </div>
</template>
<script>
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import { Viewer } from '@toast-ui/vue-editor'
export default {
  components: { Viewer },
  props: {
    editorText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editorOptions: {
        hideModeSwitch: true
      }
    }
  },
  watch: {
    editorText (val) {
      this.$refs.viewer.invoke('setMarkdown', this.editorText)
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
