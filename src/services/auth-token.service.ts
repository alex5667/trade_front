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
	console.log('refreshToken getRefreshToken', refreshToken)
	return refreshToken || null
}

export const saveTokenStorage = (accessToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: 'menu-app-1810-074608cb794e.herokuapp.com',
		sameSite: 'none',
		secure: true,
		expires: 1
	})
}

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN)
}
