import request from '@/utils/request'

/**
 * 根据仓库类型查询合计信息
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/query/report/warehouse_type/list',
    method: 'post',
    data: query
  })
}
