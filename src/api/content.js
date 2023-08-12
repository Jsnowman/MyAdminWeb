import request from '@/utils/request'

export function getContentList(params) {
  return request({
    url: '/admin/content/list',
    method: 'get',
    params
  })
}
