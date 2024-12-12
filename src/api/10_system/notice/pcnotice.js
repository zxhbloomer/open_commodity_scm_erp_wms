import request from '@/utils/request'

/**
 * 查询消息中心全部数量
 * @param {*} data
 */
export function getCountApiApi (query) {
  return request({
    url: '/api/v1/notice/center/count',
    method: 'get',
    data: query
  })
}

/**
 *
 * @param {*} data
 */
export function getPageList (query) {
  return request({
    url: '/api/v1/pc/notice/pagelist',
    method: 'post',
    data: query
  })
}
