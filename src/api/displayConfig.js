import request from '@/utils/request'

export function getDisplayConfigList(params) {
    return request({
        url: '/admin/displayConfig/list',
        method: 'get',
        params
    })
}

export function saveDisplayConfig(data) {
    return request({
        url: '/admin/displayConfig/save',
        method: 'post',
        data
    })
}

