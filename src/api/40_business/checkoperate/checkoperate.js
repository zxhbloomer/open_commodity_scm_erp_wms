import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getListApi (query) {
  return request({
    url: '/api/v1/check/operate/list',
    method: 'post',
    data: query
  })
}

/**
 * 启动盘点api
 * @param {*} data
 */
export function startApi (data) {
  return request({
    url: '/api/v1/check/operate/start',
    method: 'post',
    data
  })
}

/**
 * 启动盘点api
 * @param {*} data
 */
export function finishApi (data) {
  return request({
    url: '/api/v1/check/operate/finish',
    method: 'post',
    data
  })
}

/**
 * 编辑api
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/check/operate/update',
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
    url: '/api/v1/check/operate/getDetailInfo',
    method: 'post',
    data
  })
}

