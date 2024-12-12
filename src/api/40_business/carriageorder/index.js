import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} query
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/carriage/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} query
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/carriage/export',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}

/**
 * 新增
 * @param {*} query
 */
export function insertApi (query) {
  return request({
    url: '/api/v1/carriage/insert',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} query
 */
export function getApi (query) {
  return request({
    url: '/api/v1/carriage/get',
    method: 'post',
    data: query
  })
}

/**
 * 更新
 * @param {*} query
 */
export function updateApi (query) {
  return request({
    url: '/api/v1/carriage/update',
    method: 'post',
    data: query
  })
}
