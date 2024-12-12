import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getPageListApi (query) {
  return request({
    url: '/api/v1/log/mq/consumer/page_list',
    method: 'post',
    data: query
  })
}

/**
 * 查询详情
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/log/mq/consumer/get',
    method: 'post',
    data: query
  })
}
