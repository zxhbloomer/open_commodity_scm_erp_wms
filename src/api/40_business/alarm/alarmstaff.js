import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/alarm/staff/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 新增逻辑
 * @param {*} data
 */
export function insertApi (query) {
  return request({
    url: '/api/v1/alarm/staff/insert',
    method: 'post',
    data: query
  })
}

/**
 * 更新逻辑
 * @param {*} data
 */
export function updateApi (query) {
  return request({
    url: '/api/v1/alarm/staff/update',
    method: 'post',
    data: query
  })
}
