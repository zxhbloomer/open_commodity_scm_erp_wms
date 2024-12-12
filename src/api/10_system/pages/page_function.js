import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/sys/pages_fun/list',
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
    url: '/api/v1/sys/pages_fun/save',
    method: 'post',
    data
  })
}

/**
 * 更新指定字段的api
 * @param {*} data
 */
export function updateAssignApi (data) {
  return request({
    url: '/api/v1/sys/pages_fun/save_assign',
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
    url: '/api/v1/sys/pages_fun/insert',
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
    url: '/api/v1/sys/pages_fun/delete',
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
    url: '/api/v1/sys/pages_fun/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

