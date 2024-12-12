import request from '@/utils/request'

export function getRouter(query) {
  return request({
    url: '/sys/router/list',
    method: 'post',
    params: query
  })
}
