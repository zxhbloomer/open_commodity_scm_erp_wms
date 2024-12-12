import { Table } from 'element-ui'

import { getColumnsSizeApi, saveColumnsSizeApi, deleteColumnsSizeApi } from '@/api/00_common/colums_size'
import { getTableConfigApi } from '@/api/00_common/table_config'

import { isNotEmpty } from '@/utils/index.js'
// import deepCopy from 'deep-copy'

export default {
  name: 'ElTable',
  extends: Table,
  props: {
    // 启用列调整后记录模式
    setColumnSize: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: undefined
    },
    page_code: {
      type: String,
      default: undefined
    }
  },
  created () {
    if (this.setColumnSize) {
      // 设置拖动列宽的事件
      this.$on('header-dragend', function (newWidth, oldWidth, column, event) {
        this.saveColumnsSize(this, this.$parent.$options.name, column)
      })
    }
  },
  mounted () {
    // 描绘完成
    const { componentInstance: $table } = this.$vnode
    if (!$table) { return }
    // 设置参数
    const page_code = $table.$parent.$options.name
    let table_type
    if (this.type) {
      table_type = this.type
    }

    // 设置列属性，顺序、隐藏正式使用，读取数据库配置文件
    this.getTableConfig()
    // 设置列属性，顺序、隐藏 测试使用
    // this.tableColumnsConfig()

    // 调用调整列宽方法
    this.setColumnsSize($table, page_code, table_type)

    $table.doLayout()
  },
  activated () {
    // 解决切换tab页签，表格列宽度不正确问题
    this.$nextTick(() => {
      this.autoResizeOrMergeCell()
      this.doLayout()
    })
  },
  computed: {
    // table数据
    values () {
      const data = this.data
      return data
    }
  },
  watch: {
    values: {
      handler (newVal, oldVal) {
        if (isNotEmpty(this.data)) {
          this.$nextTick(() => {
            // 宽度自适应 和 一单元格多行数据处理
            this.autoResizeOrMergeCell()
          })
        }
      }
    },
    '$store.getters.customColumns': function (val) {
      // 你需要执行的代码
      this.deleteColumnsSize(val.page_code)
    }
  },
  methods: {
    // tableColumnsConfig () {
    //   const { componentInstance: $table } = this.$vnode
    //   /**
    //  * 关于列的排序：显示、隐藏、顺序
    //  * 在页面上el-table，增加属性：columns_index_key="columns_index_key"
    //  * 在这里判断属性：$table.$attrs.columns_index_key="columns_index_key"
    //  * $table.columns.splice(2 - 1, 0, $table.columns.splice(2, 1)[0]);
    //  *
    //  * $table.store.states.originColumns.splice(2 - 1, 0, $table.store.states.originColumns.splice(2, 1)[0]);
    //  */
    //   if ($table.$attrs.columns_index_key === 'true') {
    //     /**
    //    * 隐藏列，只能删除列的数组了
    //    * 先循环删除不需要显示的列
    //    * 再排序
    //    */

    //     // 具体明细数据
    //     var _colums = deepCopy($table.columns)
    //     _colums.splice(1, 1)
    //     $table.columns.splice(0, $table.columns.length)
    //     $table.columns.splice(0, 0, ..._colums)

    //     // 头部
    //     var originColumns = deepCopy($table.store.states.originColumns)
    //     originColumns.splice(1, 1)
    //     $table.store.states.originColumns.splice(0, $table.store.states.originColumns.length)
    //     $table.store.states.originColumns.splice(0, 0, ...originColumns)
    //   }
    // },

    autoResizeOrMergeCell () {
      // 表格自适应
      for (let i = 0, j = this.$children.length; i < j; i++) {
        const element = this.$children[i]
        const _colums = this.columns
        // 判断是否有children，如果有循环children
        if (element.mergeGroup) {
          for (let _i = 0, _j = element.$children.length; _i < _j; _i++) {
            const __element = element.$children[_i]
            if (__element.mergeCells) {
              __element.setMergeCells(__element)
            }
            if (__element.autoFit) {
              var _rtn = __element.updateAutoWidth(__element)
              if (_rtn.nothing) {
                // 没有数据，执行跳出
                break
              }
              if (_rtn.donothing) {
                // 无需执行，下一列
                continue
              }
              const __data = element.$children.find(item => item.id === __element.columnConfig.id)
              if (__data) {
                __data.realWidth = _rtn.realWidth
                __data.width = _rtn.width
              }
            }
          }
        }

        // 多条数据在一个单元格中的处理
        if (element.mergeCells) {
          element.setMergeCells(element)
        }
        if (element.autoFit) {
          var rtn = element.updateAutoWidth(element)
          if (rtn.nothing) {
            // 没有数据，执行跳出
            break
          }
          if (rtn.donothing) {
            // 无需执行，下一列
            continue
          }

          const _data = _colums.find(item => item.id === element.columnConfig.id)
          if (_data) {
            _data.realWidth = rtn.realWidth
            _data.width = rtn.width
          }
        }
      }
    },

    // 删除列宽度
    deleteColumnsSize (page_code) {
      // this.showLoading('正在重置...')
      // 获取数据
      deleteColumnsSizeApi({
        page_code: page_code
      }).then(response => {
      }).finally(() => {
        const { componentInstance: $table } = this.$vnode
        this.$nextTick(() => {
          this.autoResizeOrMergeCell()
          $table.doLayout()
          // 需要触发resize事件
          this.$parent.$forceUpdate()
          // this.closeLoading()
        })
      })
    },

    // 设置表格上的列宽度，如果有数据
    saveColumnsSize (table_obj, page_code, column) {
      // 获取当前列的index
      if (page_code === undefined || page_code === 'ElForm') {
        return
      }
      let column_index = 0
      for (var i = 0; i < table_obj.columns.length; i++) {
        if (table_obj.columns[i].id === column.id) {
          column_index = i
          break
        }
      }
      // 获取数据
      saveColumnsSizeApi({
        page_code: page_code,
        column_label: column.label,
        column_property: column.property,
        column_index: column_index,
        type: this.type,
        min_width: column.minWidth,
        real_width: column.realWidth
      }).then(response => {
      }).finally(() => {
      })
    },
    // 调整列宽方法
    setColumnsSize (table_object, page_code, table_type) {
      if (page_code !== undefined && page_code !== 'ElMain' && page_code !== 'ElForm') {
        // 获取数据
        getColumnsSizeApi({ page_code: page_code, type: table_type }).then(response => {
          for (const item of response.data) {
            // for (const column of table_object.columns) {
            //   if (item.column_id === column.id) {
            //     column.width = item.real_width
            //   }
            // }
            table_object.columns[item.column_index].width = item.real_width
            table_object.columns[item.column_index].realWidth = item.real_width
          }
        }).finally(() => {
          // table_object.doLayout()
        })
      }
    }, // // 设置列宽
    // setColgroupWidth () {
    //   const cols = this.$el.querySelectorAll('colgroup > col')
    //   if (!cols.length) return
    //   // const flattenColumns = deepCopy(_colums)
    //   const flattenColumns = this.layout.getFlattenColumns()
    //   const columnsMap = {}
    //   flattenColumns.forEach((column) => {
    //     columnsMap[column.id] = column
    //   })
    //   for (let i = 0, j = cols.length; i < j; i++) {
    //     const col = cols[i]
    //     const name = col.getAttribute('name')
    //     const column = columnsMap[name]
    //     if (column) {
    //       col.setAttribute('width', column.realWidth || column.width)
    //     }
    //   }
    // }
    getTableConfig () {
      // 设置参数，主要为el-table的vnode的object
      const { componentInstance: $table } = this.$vnode
      const table_object = $table
      var _chileren = this.$children

      // 设置参数，获取该表格对应的页面编号，唯一，通过此编号找到列配置数据
      const page_code = $table.$parent.$options.name

      /**
       * 根据自定义属性：columns_index_key，启动/不启动列属性配置逻辑
       *
       * 逻辑功能描述：根据列配置数据（列隐藏、顺序），来循环下述3个数组，主要是进行数组的排序和删除【key：sort（顺序）、is_enable（启用）、name（el-table-column.prop）】
       *
       * 注意1：本方法需要使用到$table vnode中的三个数据/数组，都需要进行循环操作
       *    1、$table.store.states.originColumns：页面中表格的表头列（key：$table.store.states.originColumns[j].property）
       *    2、$table.columns                   ：页面中表格的数据列（key：$table.columns[i].property）
       *    3、this.$children                   ：本vue的$children（key：this.$children[i].prop）
       *
       * 注意2：本方法限制
       *    1、重要：在设置列页面打开修改后，点击提交。需要刷新页面才能生效
       *    2、解决方案：在设置列页面打开修改后，点击提交，刷新本页签，完成重新加载，才能调用本方法生效列的设置
       *
       */
      if (table_object.$attrs.columns_index_key === 'true') {
        if (page_code !== undefined && page_code !== 'ElMain') {
          // 获取列属性配置数据
          getTableConfigApi({ page_code: page_code }).then(response => {
            /**
             * $table.columns的vnode中，通过下述循环，增加sort和is_enable属性
             */
            for (const item of response.data) {
              for (var i = 0; i < $table.columns.length; i++) {
                if ($table.columns[i].property === item.name) {
                  $table.columns[i].sort = item.sort
                  $table.columns[i].is_enable = item.is_enable
                }

                if (_chileren[i].prop === item.name) {
                  _chileren[i].is_enable = item.is_enable
                }
              }

              for (var j = 0; j < $table.store.states.originColumns.length; j++) {
                if ($table.store.states.originColumns[j].property === item.name) {
                  $table.store.states.originColumns[j].sort = item.sort
                  $table.store.states.originColumns[j].is_enable = item.is_enable
                }
              }
            }

            // 表头，数据，vue对象 根据列排序数据筛选出需要展示的字段
            // 具体数据
            const columns = table_object.columns.filter(item => {
              return item.is_enable !== false && item.is_delete !== true
            })
            table_object.columns.splice(0, table_object.columns.length)
            table_object.columns.splice(table_object.columns.length, '', ...columns)
            // 表头
            const originColumns = table_object.store.states.originColumns.filter(item => {
              return item.is_enable !== false && item.is_delete !== true
            })
            table_object.store.states.originColumns.splice(0, table_object.store.states.originColumns.length)
            table_object.store.states.originColumns.splice(table_object.store.states.originColumns.length, '', ...originColumns)

            // vue对象
            _chileren = _chileren.filter(item => {
              return item.is_enable === true && item.is_delete !== true
            })
            this.$children.splice(0, this.$children.length)
            this.$children.splice(this.$children.length, '', ..._chileren)

            // 表头，数据，vue对象 排序
            // 表头
            table_object.store.states.originColumns.sort(this.compare)
            // 具体数据
            table_object.columns.sort(this.compare)
            // vue对象
            _chileren.sort(this.compare)

            this.$nextTick(() => {
              this.autoResizeOrMergeCell()
              $table.doLayout()
              // 需要触发resize事件
              this.$parent.$forceUpdate()
              // this.closeLoading()
            })
          }).finally(() => {
            // this.setColumnsSize(table_object, page_code, '')
            // this.autoResizeOrMergeCell()
          })
        }
      }
    },
    compare (obj1, obj2) {
      return obj1.sort - obj2.sort
    }
  }
}
