import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getUnitSelectDataApi (query) {
  return request({
    url: '/api/v1/unit/list',
    method: 'post',
    data: query
  })
}

/**
 * 分页查询逻辑
 * @param {*} data
 */
export function getPageListApi (query) {
  return request({
    url: '/api/v1/unit/pagelist',
    method: 'post',
    data: query
  })
}

