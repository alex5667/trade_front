import { NextRequest, NextResponse } from 'next/server'


import { DASHBOARD_PAGES } from './config/pages-url.config'
import { URLS } from './config/urls'
import { EnumTokens } from './services/auth-token.service'

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request
	const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value
	// const isAdminBoard = url.includes(DASHBOARD_PAGES.ADMIN_PANEL_URL)
	const isAuthPage = url.includes(URLS.AUTH)

	// if (refreshToken) {
	// 	const userResponse = await fetch('https://your-backend-url.com/api/user', {
	// 		method: 'GET',
	// 		headers: {
	// 			Authorization: `Bearer ${refreshToken}`,
	// 		},
	// 	})

	// 	if (userResponse.ok) {
	// 		const userData = await userResponse.json()

	// 		// Проверяем роль пользователя
	// 		if (userData.role !== 'desiredRole') {
	// 			// Если роль не соответствует, перенаправляем на страницу "Неавторизовано"
	// 			return NextResponse.redirect(new URL(URLS.UNAUTHORIZED, url))
	// 		}
	// 	} else {
	// 		// Если токен недействителен, перенаправляем на страницу авторизации
	// 		return NextResponse.redirect(new URL(URLS.AUTH, url))
	// 	}
	// }
	if (isAuthPage && refreshToken) {
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.ADMIN_PANEL_URL, url))
	}
	if (isAuthPage) {
		return NextResponse.next()
	}
	if (!refreshToken) {
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.AUTH, url))
	}
	return NextResponse.next()
}

export const config = {
	matcher: ['/i/:path*', '/auth/:path']
}
