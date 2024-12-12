import request from '@/utils/request'

export function getList (query) {
  return request({
    url: '/sys/org/list',
    method: 'post',
    params: query
  })
}

export function updateData (data) {
  return request({
    url: '/sys/org/update',
    method: 'post',
    data
  })
}
