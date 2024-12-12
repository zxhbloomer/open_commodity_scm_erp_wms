import request from '@/utils/request'

/**
 * 查询逻辑列表
 * @param {*} data
 */
export function getListApi () {
  return request({
    url: '/api/v1/container/list',
    method: 'get'
  })
}

/**
 * 查询分页列表
 * @param {*} data
 */
export function getPageListApi (query) {
  return request({
    url: '/api/v1/container/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 插入api
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/container/insert',
    method: 'post',
    data
  })
}

/**
 * 更新api
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/container/save',
    method: 'post',
    data
  })
}

/**
 * 导出
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: '/api/v1/container/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 删除
 * @param {*} data
 */
export function deleteApi (data) {
  return request({
    url: '/api/v1/container/delete',
    method: 'post',
    data
  })
}
