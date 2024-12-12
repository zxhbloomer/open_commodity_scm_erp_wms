import request from '@/utils/request'

/**
 * 查询逻辑：省
 * @param {*} data
 */
export function getProvincerListApi (query) {
  return request({
    url: '/api/v1/common/areas/province/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：市
 * @param {*} data
 */
export function getCityListApi (query) {
  return request({
    url: '/api/v1/common/areas/city/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：区
 * @param {*} data
 */
export function getAreaListApi (query) {
  return request({
    url: '/api/v1/common/areas/area/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑：级联
 * @param {*} data
 */
export function getAreasCascaderApi (query) {
  return request({
    url: '/api/v1/common/areas/area/casca',
    method: 'post',
    data: query
  })
}
