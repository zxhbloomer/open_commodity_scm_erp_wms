import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/order/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑, 用于合同号是多个的情况
 * @param {*} data
 */
export function getList2Api (query) {
  return request({
    url: '/api/v1/order/list2',
    method: 'post',
    data: query
  })
}
