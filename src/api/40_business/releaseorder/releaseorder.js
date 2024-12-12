import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/releaseorder/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/releaseorder/get',
    method: 'post',
    data: query
  })
}

/**
 * 新增
 * @param {*} data
 */
export function insertApi (query) {
  return request({
    url: '/api/v1/releaseorder/insert',
    method: 'post',
    data: query
  })
}

/**
 * 更新
 * @param {*} data
 */
export function updateApi (query) {
  return request({
    url: '/api/v1/releaseorder/update',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getOrderDetailApi (query) {
  return request({
    url: '/api/v1/releaseorder/detail/get',
    method: 'post',
    data: query
  })
}

/**
 * 查询订单信息列表, 带商品
 * @param {*} data
 */
export function getListCommApi (query) {
  return request({
    url: '/api/v1/releaseorder/pagecommlist',
    method: 'post',
    data: query
  })
}
