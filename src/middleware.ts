import { NextRequest, NextResponse } from 'next/server'


import { ADMINBOARD_PAGES } from './config/pages-url.config'
import { URLS } from './config/urls'
import { EnumTokens } from './services/auth-token.service'

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request
	const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value
	// const isAdminBoard = url.includes(DASHBOARD_PAGES.ADMIN_PANEL_URL)
	const isAuthPage = url.includes(URLS.AUTH)


	if (isAuthPage && refreshToken) {
		return NextResponse.redirect(new URL(ADMINBOARD_PAGES.ADMIN_PANEL_URL, url))
	}
	if (isAuthPage) {
		return NextResponse.next()
	}
	if (!refreshToken) {
		return NextResponse.redirect(new URL(ADMINBOARD_PAGES.AUTH, url))
	}
	return NextResponse.next()
}

export const config = {
	matcher: ['/i/:path*', '/auth/:path']
}
