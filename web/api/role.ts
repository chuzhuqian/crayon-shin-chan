import request from './request'
import type { Role } from './types/role'

export function getRoleList() {
  return request<Role[]>({
    url: '/role/list',
    method: 'get'
  })
}