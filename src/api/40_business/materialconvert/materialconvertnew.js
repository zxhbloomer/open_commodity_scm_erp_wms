import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/materialconvert/new/get',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑， 第一版， 以 detail 表作为主表
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/materialconvert/new/list',
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
    url: '/api/v1/materialconvert/new/insert',
    method: 'post',
    data: query
  })
}

/**
 * 编辑逻辑
 * @param {*} data
 */
export function updateApi (query) {
  return request({
    url: '/api/v1/materialconvert/new/update',
    method: 'post',
    data: query
  })
}

/**
 * 启用禁用api
 * @param {*} data
 */
export function enableByConvertIdApi (data) {
  return request({
    url: '/api/v1/materialconvert/new/enable1',
    method: 'post',
    data
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getList1Api (query) {
  return request({
    url: '/api/v1/materialconvert/new/list',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function getDetailListApi (query) {
  return request({
    url: '/api/v1/materialconvert/new/getDetailList',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function get1Api (query) {
  return request({
    url: '/api/v1/materialconvert/new/get1',
    method: 'post',
    data: query
  })
}

/**
 * 查询逻辑
 * @param {*} data
 */
export function executeApi (query) {
  return request({
    url: '/api/v1/materialconvert/new/execute',
    method: 'post',
    data: query
  })
}

/**
 * 第三版， 以 主表作为 ID， 一对一
 * @param {*} data
 */
export function getList2Api (query) {
  return request({
    url: '/api/v1/materialconvert/list2',
    method: 'post',
    data: query
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportApi (data) {
  return request({
    url: '/api/v1/materialconvert/new/export',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

/**
 * 导出逻辑
 * @param {*} data
 */
export function exportAllApi (data) {
  return request({
    url: '/api/v1/materialconvert/new/export_all',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

