import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/materialconvert/get',
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
    url: '/api/v1/materialconvert/list',
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
    url: '/api/v1/materialconvert/insert',
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
    url: '/api/v1/materialconvert/update',
    method: 'post',
    data: query
  })
}

/**
 * 启用禁用api
 * @param {*} data
 */
export function enableApi (data) {
  return request({
    url: '/api/v1/materialconvert/enable',
    method: 'post',
    data
  })
}

/**
 * 提交api
 * @param {*} data
 */
export function submitApi (data) {
  return request({
    url: '/api/v1/materialconvert/submit',
    method: 'post',
    data
  })
}

/**
 * 审核api
 * @param {*} data
 */
export function auditApi (data) {
  return request({
    url: '/api/v1/materialconvert/audit',
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
    url: '/api/v1/materialconvert/list1',
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
    url: '/api/v1/materialconvert/getDetailList',
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
    url: '/api/v1/materialconvert/get1',
    method: 'post',
    data: query
  })
}

/**
 * 启用禁用api
 * @param {*} data
 */
export function enable1Api (data) {
  return request({
    url: '/api/v1/materialconvert/enable1',
    method: 'post',
    data
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
