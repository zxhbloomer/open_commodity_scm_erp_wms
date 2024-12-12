import request from '@/utils/request'

/**
 * 按类型查询合同量
 * @param {*} data
 */
export function getDirectlyWarehouseApi (query) {
  return request({
    url: '/api/v1/warehouse/directly/list',
    method: 'post',
    data: query
  })
}
