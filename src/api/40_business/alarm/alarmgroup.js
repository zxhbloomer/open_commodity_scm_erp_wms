import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/alarm/group/page_list',
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
    url: '/api/v1/alarm/group/insert',
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
    url: '/api/v1/alarm/group/update',
    method: 'post',
    data: query
  })
}

/**
 * 穿梭框
 * @param {*} data
 */
export function getStaffTransferListApi (query) {
  return request({
    url: '/api/v1/alarm/group/staff/transfer/list',
    method: 'post',
    data: query
  })
}

/**
 * 穿梭框 添加员工
 * @param {*} data
 */
export function setStaffTransferApi (query) {
  return request({
    url: '/api/v1/alarm/group/staff/transfer/save',
    method: 'post',
    data: query
  })
}