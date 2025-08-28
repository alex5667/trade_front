import { ADMINBOARD_PAGES } from '@/config/pages-url.config'
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4207/api'

function decodeToken(token: string): any {
	try {
		const payload = token.split('.')[1]
		return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'))
	} catch {
		return null
	}
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	const publicRoutes = ['/', '/auth']
	const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
	if (isPublicRoute) return NextResponse.next()

	const refreshToken = request.cookies.get('refreshToken')?.value
	if (!refreshToken) {
		try {
			return NextResponse.redirect(new URL('/auth', request.url))
		} catch {
			return NextResponse.redirect(new URL('/auth', 'http://localhost:3003'))
		}
	}

	const payload = decodeToken(refreshToken)
	if (!payload) {
		try {
			return NextResponse.redirect(new URL('/auth', request.url))
		} catch {
			return NextResponse.redirect(new URL('/auth', 'http://localhost:3003'))
		}
	}

	if (pathname.startsWith('/i')) {
		const roles: string[] = payload.roles || []
		if (roles.includes('admin')) return NextResponse.next()

		const allowedPagesForUser = [
			ADMINBOARD_PAGES.MENU,
			ADMINBOARD_PAGES.SETTINGS
		]

		if (roles.includes('user')) {
			const isAllowed = allowedPagesForUser.some(page => pathname.includes(page))
			if (isAllowed) return NextResponse.next()
		}

		if (roles.includes('customer')) {
			try {
				return NextResponse.redirect(new URL(ADMINBOARD_PAGES.CUSTOMER, request.url))
			} catch {
				return NextResponse.redirect(new URL(ADMINBOARD_PAGES.CUSTOMER, 'http://localhost:3003'))
			}
		}

		try {
			return NextResponse.redirect(new URL(ADMINBOARD_PAGES.CUSTOMER, request.url))
		} catch {
			return NextResponse.redirect(new URL(ADMINBOARD_PAGES.CUSTOMER, 'http://localhost:3003'))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)']
}