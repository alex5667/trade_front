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
	console.log('accessToken', accessToken)
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: 1
	})
}

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN)
}
