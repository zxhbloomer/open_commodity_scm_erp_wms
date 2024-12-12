import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getPageListApi (query) {
  return request({
    url: '/api/v1/worouter/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 新增
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/worouter/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/worouter/update',
    method: 'post',
    data: data
  })
}

/**
 * 查看详情
 * @param {*} data
 */
export function getApi (data) {
  return request({
    url: '/api/v1/worouter/getDetail',
    method: 'post',
    data: data
  })
}

/**
 * 启用
 * @param {*} data
 */
export function enableApi (data) {
  return request({
    url: '/api/v1/worouter/enable',
    method: 'post',
    data: data
  })
}

/**
 * 禁用
 * @param {*} data
 */
export function disabledApi (data) {
  return request({
    url: '/api/v1/worouter/disabled',
    method: 'post',
    data: data
  })
}
