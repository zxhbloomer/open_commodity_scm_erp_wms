import { TableColumn } from 'element-ui'
import { max, map, isEmpty } from './util'
import {
  parseMinWidth
} from 'element-ui/packages/table/src/util.js'

export default {
  name: 'ElTableColumn',
  extends: TableColumn,
  props: {
    fitByClass: {
      type: String,
      default: 'cell'
    },
    autoFit: {
      type: Boolean,
      default: false
    },
    fitGap: {
      type: Number,
      default: 0
    },
    fitHeader: {
      type: Boolean,
      default: false
    },
    mergeCells: {
      type: Boolean,
      default: false
    },
    mergeGroup: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      autoWidth: 0
    }
  },
  computed: {
    // 覆盖el-clumns中的方法
    realMinWidth () {
      if (this.autoFit) {
        return parseMinWidth(max([this.minWidth, this.autoWidth]))
      }
      return TableColumn.computed.realMinWidth.call(this)
    },
    realWidth () {
      if (this.autoFit) {
        return parseMinWidth(max([this.minWidth, this.autoWidth]))
      }
      return TableColumn.computed.realWidth.call(this)
    }
    // // table数据
    // values () {
    //   const data = this.$parent.data
    //   return data
    // }
  },
  // watch: {
  //   values: {
  //     handler (newVal, oldVal) {
  //       this.updateAutoWidth()
  //     }
  //   }
  // },
  methods: {
    updateAutoWidth (val) {
      // if (!this.autoFit) {
      //   return { autoFit: false }
      // }

      const cellWrapperClass = this.fitHeader ? `.${this.columnId}` : `td.${this.columnId}`

      let cells = window.document.querySelectorAll(`${cellWrapperClass} .${this.fitByClass}`)
      if (isEmpty(cells)) {
        cells = window.document.querySelectorAll(`${cellWrapperClass} `)
      }
      if (isEmpty(cells)) {
        return { nothing: true }
      }

      if (cells[0].parentElement.className.indexOf('is-right') > 1) {
        return { donothing: true }
      }

      // 动态设置css
      map(cells, item => {
        item.setAttribute('style', 'white-space: nowrap ;  width: fit-content ; ')
      })

      const autoMinWidth = max(map(cells, item => item.getBoundingClientRect().width)) + this.fitGap + 1

      if (this.autoWidth !== autoMinWidth) {
        // 如果自适应行间距变小，则忽略
        if (this.autoWidth >= autoMinWidth) {
          // return
        } else {
          this.autoWidth = autoMinWidth
        }
      }
      TableColumn.methods.setColumnWidth.call(this, this.columnConfig)
      this.columnConfig.width = this.autoWidth
      return { width: max([this.minWidth, this.autoWidth]), realWidth: max([this.minWidth, this.autoWidth]) }
    },
    /**
       * 合并单元格
       * @param val
       * @returns {{width: any, realWidth: any}|{nothing: boolean}}
       */
    setMergeCells (val) {
      const cellWrapperClass = this.fitHeader ? `.${this.columnId}` : `td.${this.columnId}`
      let cells = window.document.querySelectorAll(`${cellWrapperClass} .${this.fitByClass}`)
      if (isEmpty(cells)) {
        cells = window.document.querySelectorAll(`${cellWrapperClass} `)
      }
      if (isEmpty(cells)) {
        return { nothing: true }
      }
      map(cells, item => {
        item.setAttribute('style', 'white-space: nowrap ;  width: fit-content ')
        const hasMergeCells = Array.from(item.classList).some(className => className.includes('merge_cells'))
        if (!hasMergeCells) {
          item.classList.remove('cell')
        }
      })

      const autoMinWidth = max(map(cells, item => item.getBoundingClientRect().width)) + this.fitGap + 1
      if (this.autoWidth !== autoMinWidth) {
        // 如果自适应行间距变小，则忽略
        if (this.autoWidth >= autoMinWidth) {
          // return
        } else {
          this.autoWidth = autoMinWidth
        }
      }
      TableColumn.methods.setColumnWidth.call(this, this.columnConfig)
      this.columnConfig.width = max([this.columnConfig.minWidth, this.autoWidth])
      map(cells, item => {
        item.setAttribute('style', `white-space: nowrap; width: ${this.columnConfig.width}px`)
      })
      return { width: max([this.minWidth, this.autoWidth]), realWidth: max([this.minWidth, this.autoWidth]) }
    }

  },
  mounted () {
  }
}
