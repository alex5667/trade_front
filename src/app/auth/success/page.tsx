// app/auth/success/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import AuthSuccessClient from './AuthSuccessClient'

export const metadata: Metadata = {
	title: 'Auth Success',
	...NO_INDEX_PAGE
}

export default function AuthSuccessPage() {
	return (
		<Suspense
			fallback={
				<div className='flex items-center justify-center min-h-screen'>
					<div className='text-center'>
						<h1 className='text-2xl font-bold mb-4'>Processing login...</h1>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-Gray-900 mx-auto'></div>
					</div>
				</div>
			}
		>
			<AuthSuccessClient />
		</Suspense>
	)
}
