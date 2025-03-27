import Cookies from 'js-cookie'

export enum EnumTokens {
	'ACCESS_TOKEN' = 'AccessToken',
	'REFRESH_TOKEN' = 'refreshToken'
}

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
	return accessToken || null
}

export const getRefreshToken = () => {
	const refreshToken = Cookies.get(EnumTokens.REFRESH_TOKEN)
	return refreshToken || null
}

export const saveTokenStorage = (accessToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: 1
	})
}

export const saveRefreshToken = (refreshToken: string) => {
	Cookies.set(EnumTokens.REFRESH_TOKEN, refreshToken, {
		domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: 7 // Refresh token живет дольше
	})
}

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN)
	Cookies.remove(EnumTokens.REFRESH_TOKEN)
}
