import ExTable from './ExTable'
import ExTableColumn from './ExTableColumn'

ExTable.install = (Vue, {
  table = 'ElTable',
  column = 'ElTableColumn'
} = {}) => {
  Vue.component(table || ExTable.name, ExTable)
  Vue.component(column || ExTableColumn.name, ExTableColumn)
}

export {
  ExTable,
  ExTableColumn
}

export default ExTable
