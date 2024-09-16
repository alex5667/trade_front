import { jwtDecode } from 'jwt-decode'

export interface User {
  id: number
  roles: string[]
}

export const decodeToken = (token: string): User | null => {
  if (!token) {
    return null
  }

  try {
    const decoded = jwtDecode<User>(token)
    return decoded
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}