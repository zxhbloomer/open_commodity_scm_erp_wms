import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/check/result/list',
    method: 'post',
    data: query
  })
}

/**
 * 编辑api
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/check/result/update',
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
    url: '/api/v1/check/result/audit',
    method: 'post',
    data
  })
}

/**
 * 详情api
 * @param {*} data
 */
export function getDetailInfo (data) {
  return request({
    url: '/api/v1/check/result/getDetailInfo',
    method: 'post',
    data
  })
}

