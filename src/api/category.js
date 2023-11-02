import request from '@/utils/request'

export function getCategoryList(params) {
    return request({
        url: '/admin/category/list',
        method: 'get',
        params
    })
}
export function saveCategory(data) {
    return request({
        url: '/admin/category/save',
        method: 'post',
        data
    })
}

export function delCategory(params) {
    return request({
        url: '/admin/category/del',
        method: 'get',
        params
    })
}

export function getCategoryTree(params) {
    return request({
        url: '/admin/category/treeList',
        method: 'get',
        params
    })
}
