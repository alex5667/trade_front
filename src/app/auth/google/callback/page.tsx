// app/auth/google/callback/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import GoogleCallbackClient from './GoogleCallbackClient'
import styles from '@/app/auth/AuthCommon.module.scss'

export const metadata: Metadata = {
	title: 'Google callback',
	...NO_INDEX_PAGE
}

export default function GoogleCallBackPage() {
	return (
		<Suspense
			fallback={
				<div className={styles.centerScreen}>
					<div className={styles.textCenter}>
						<h1 className={styles.title}>Completing authentication...</h1>
						<div className={styles.spinner}></div>
					</div>
				</div>
			}
		>
			<GoogleCallbackClient />
		</Suspense>
	)
}
