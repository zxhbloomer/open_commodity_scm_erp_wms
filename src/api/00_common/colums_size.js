import request from '@/utils/request'

/**
 * 获取列宽数据
 * @param {*} data
 */
export function getColumnsSizeApi (query) {
  return request({
    url: '/api/v1/columns/list',
    method: 'post',
    data: query
  })
}

/**
 * 保存api
 * @param {*} data
 */
export function saveColumnsSizeApi (data) {
  return request({
    url: '/api/v1/columns/save',
    method: 'post',
    data
  })
}

/**
 * 删除api
 * @param {*} data
 */
export function deleteColumnsSizeApi (data) {
  return request({
    url: '/api/v1/columns/delete',
    method: 'post',
    data
  })
}
