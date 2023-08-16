import request from '@/utils/request'

export function getContentList(params) {
  return request({
    url: '/admin/content/list',
    method: 'get',
    params
  })
}
export function saveContent(data) {
  return request({
    url: '/admin/content/save',
    method: 'post',
    data
  })
}

export function delContent(params) {
  return request({
    url: '/admin/content/del',
    method: 'get',
    params
  })
}
