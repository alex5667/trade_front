// app/auth/google/callback/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import GoogleCallbackClient from './GoogleCallbackClient'

export const metadata: Metadata = {
	title: 'Google callback',
	...NO_INDEX_PAGE
}

export default function GoogleCallBackPage() {
	return (
		<Suspense
			fallback={
				<div className='flex items-center justify-center min-h-screen'>
					<div className='text-center'>
						<h1 className='text-2xl font-bold mb-4'>
							Completing authentication...
						</h1>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
					</div>
				</div>
			}
		>
			<GoogleCallbackClient />
		</Suspense>
	)
}
