import request from '@/utils/request'

/**
 * 查询逻辑
 * @param {*} data
 */
export function getApi (query) {
  return request({
    url: '/api/v1/monitor/cache/info',
    method: 'post',
    data: query
  })
}

