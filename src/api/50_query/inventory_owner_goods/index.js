import request from '@/utils/request'

/**
 * 查询库存明细
 * @param {*} data
 */
export function queryInventoryOwnerGoods (query) {
  return request({
    url: '/api/v1/query/inventory/owner_goods/list',
    method: 'post',
    data: query
  })
}

