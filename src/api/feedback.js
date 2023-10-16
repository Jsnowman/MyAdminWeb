import request from '@/utils/request'

export function getFeedbackList(params) {
    return request({
        url: '/admin/feedback/list',
        method: 'get',
        params
    })
}
