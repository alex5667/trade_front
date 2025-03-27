import { User } from '@/types/auth.types'
import { jwtDecode } from 'jwt-decode'

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