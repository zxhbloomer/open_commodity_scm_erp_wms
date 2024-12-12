import request from '@/utils/request'

/**
 * 分页查询预警信息
 * @param {*} data
 */
export function getHeaderPageList (query) {
  return request({
    url: '/api/v1/message/header/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 分类查询预警信息
 * @param {*} data
 */
export function getHeaderCount (query) {
  return request({
    url: '/api/v1/message/header/count',
    method: 'post',
    data: query
  })
}
