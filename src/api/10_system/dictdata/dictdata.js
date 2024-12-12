import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/dictdata/list',
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
    url: '/api/v1/dictdata/save',
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
    url: '/api/v1/dictdata/insert',
    method: 'post',
    data
  })
}

/**
 * 导出逻辑，全部导出
 * @param {*} data
 */
export function exportAllApi (data) {
  return request({
    url: '/api/v1/dictdata/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出逻辑，部分导出
 * @param {*} data
 */
export function exportSelectionApi (data) {
  return request({
    url: '/api/v1/dictdata/export_selection',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导入逻辑
 * @param {*} data
 */
export function importExcelApi (data) {
  return request({
    url: '/api/v1/dictdata/import',
    method: 'post',
    data
  })
}

/**
 * 删除逻辑
 * @param {*} data
 */
export function deleteApi (data) {
  return request({
    url: '/api/v1/dictdata/delete',
    method: 'post',
    data
  })
}

/**
 * 启用逻辑
 * @param {*} data
 */
export function enableApi (data) {
  return request({
    url: '/api/v1/dictdata/enable',
    method: 'post',
    data
  })
}

/**
 * 排序逻辑
 * @param {*} data
 */
export function saveListApi (data) {
  return request({
    url: '/api/v1/dictdata/save_list',
    method: 'post',
    data
  })
}

/**
 * 排序 上
 * @param data
 * @returns {AxiosPromise}
 */
export function sortUpApi (data) {
  return request({
    url: '/api/v1/dictdata/update_sort_up',
    method: 'post',
    data
  })
}

/**
 * 排序 下
 * @param data
 * @returns {AxiosPromise}
 */
export function sortDownApi (data) {
  return request({
    url: '/api/v1/dictdata/update_sort_down',
    method: 'post',
    data
  })
}
