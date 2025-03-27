import { NextRequest, NextResponse } from 'next/server'
import { ADMINBOARD_PAGES } from './config/pages-url.config'
import { decodeToken } from './services/token.service'

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request

	const accessToken = cookies.get('AccessToken')?.value

	const decodedUser = accessToken ? decodeToken(accessToken) : null

	const allowedPagesForUser = [ADMINBOARD_PAGES.MENU, ADMINBOARD_PAGES.USER, ADMINBOARD_PAGES.SETTINGS]
	const isAuthPage = url.includes(ADMINBOARD_PAGES.AUTH)
	const baseUrl = request.nextUrl.origin

	if (decodedUser) {
		if (isAuthPage && accessToken && decodedUser.roles.includes('admin')) {
			return NextResponse.redirect(new URL(ADMINBOARD_PAGES.ADMIN, baseUrl))
		}

		if (isAuthPage && accessToken && decodedUser.roles.includes('user')) {
			return NextResponse.redirect(new URL(ADMINBOARD_PAGES.USER, baseUrl))
		}

		if (isAuthPage && accessToken && decodedUser.roles.includes('customer')) {
			return NextResponse.redirect(new URL(ADMINBOARD_PAGES.CUSTOMER, baseUrl))
		}
	}

	if (isAuthPage) {
		return NextResponse.next()
	}

	if (!accessToken) {
		return NextResponse.redirect(new URL(ADMINBOARD_PAGES.AUTH, baseUrl))
	}

	if (decodedUser) {
		if (decodedUser.roles.includes('admin')) {
			return NextResponse.next()
		}

		if (decodedUser.roles.includes('user')) {
			const isAllowedPage = allowedPagesForUser.some(page => url.includes(page))
			if (isAllowedPage) {
				return NextResponse.next()
			}
		}
	}

	return NextResponse.redirect(new URL(ADMINBOARD_PAGES.CUSTOMER, baseUrl))
}

export const config = {
	matcher: ['/i/:path*', '/auth/:path*'],
}