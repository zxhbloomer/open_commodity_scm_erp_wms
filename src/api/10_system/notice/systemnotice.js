import request from '@/utils/request'

/**
 *
 * @param {*} data
 */
export function getPageList (query) {
  return request({
    url: '/api/v1/system/notice/pagelist',
    method: 'post',
    data: query
  })
}

/**
 * 新增接口
 * @param {*} data
 */
export function insertApi (data) {
  return request({
    url: '/api/v1/system/notice/insert',
    method: 'post',
    data: data
  })
}

/**
 * 查询详情
 * @param {*} data
 */
export function getApi (data) {
  return request({
    url: '/api/v1/system/notice/get',
    method: 'post',
    data: data
  })
}

/**
 * 更新接口
 * @param {*} data
 */
export function updateApi (data) {
  return request({
    url: '/api/v1/system/notice/update',
    method: 'post',
    data: data
  })
}

/**
 * 查询查看详情
 * @param {*} data
 */
export function getPcDetailApi (data) {
  return request({
    url: '/api/v1/pc/notice/get',
    method: 'post',
    data: data
  })
}
