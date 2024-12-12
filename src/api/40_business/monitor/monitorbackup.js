import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/monitor/backup/list',
    method: 'post',
    data: query
  })
}

/**
 * 详情查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/monitor/backup/get',
    method: 'post',
    data: query
  })
}

/**
 * 监管任务附件修改逻辑
 * @param {*} data
 */
export function saveFileApi (query) {
  return request({
    url: '/api/v1/monitor/file/save',
    method: 'post',
    data: query
  })
}

/**
 * 导出影像文件逻辑
 * @param {*} data
 */
export function exportApi (query) {
  return request({
    url: '/api/v1/monitor/backup/export_file',
    method: 'post',
    data: query
  })
}

/**
 * 导出全部影像文件数据
 * @param {*} data
 */
export function exportAllApi (query) {
  return request({
    url: '/api/v1/monitor/exportall',
    method: 'post',
    data: query
  })
}

/**
 * 导出数据逻辑
 * @param {*} data
 */
export function exportDataApi (data) {
  return request({
    url: '/api/v1/monitor/backup/export_data',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出数据逻辑
 * @param {*} data
 */
export function exportAllDataApi (data) {
  return request({
    url: '/api/v1/monitor/backup/exportall_data',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 入库审核
 * @param {*} data
 */
export function auditInApi (query) {
  return request({
    url: '/api/v1/monitor/in/audit',
    method: 'post',
    data: query
  })
}

/**
 * 出库审核
 * @param {*} data
 */
export function auditOutApi (query) {
  return request({
    url: '/api/v1/monitor/out/audit',
    method: 'post',
    data: query
  })
}

/**
 * 获取附件信息
 * @param {*} data
 */
export function getMonitorFileApi (query) {
  return request({
    url: '/api/v1/monitor/backup/getfiles',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListSumApi (query) {
  return request({
    url: '/api/v1/monitor/backup/sum',
    method: 'post',
    data: query
  })
}

/**
 * 恢复逻辑
 * @param {*} data
 */
export function restoreApi (query) {
  return request({
    url: '/api/v1/monitor/backup/restore',
    method: 'post',
    data: query
  })
}
