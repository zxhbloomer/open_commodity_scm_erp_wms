import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/monitor/server/info',
    method: 'post',
    data: query
  })
}

