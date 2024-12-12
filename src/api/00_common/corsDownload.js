import request from '@/utils/request'

export function exportCorsFileApi (data) {
  return request({
    url: '/api/v1/file/cors/download',
    method: 'get',
    params: data,
    responseType: 'arraybuffer'
  })
}
