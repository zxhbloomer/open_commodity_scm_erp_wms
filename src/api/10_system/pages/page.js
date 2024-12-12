import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/sys/pages/list',
    method: 'post',
    data: query
  })
}

/**
 * 更新api
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/sys/pages/save',
    method: 'post',
    data
  })
}

/**
 * 插入api
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/sys/pages/insert',
    method: 'post',
    data
  })
}

/**
 * 物理删除选择数据
 * @param {*} data
 */
export function realDeleteSelectionApi (data) {
  return request({
    url: '/api/v1/sys/pages/delete',
    method: 'post',
    data
  })
}

/**
 *模板文件下载
 * @param {*} data
 */
export function getPageApi (data) {
  return request({
    url: '/api/v1/sys/pages/get',
    method: 'post',
    data
  })
}

/**
 *模板文件下载
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: '/api/v1/sys/pages/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
