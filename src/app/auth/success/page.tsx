// app/auth/success/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import AuthSuccessClient from './AuthSuccessClient'
import styles from '@/app/auth/AuthCommon.module.scss'

export const metadata: Metadata = {
	title: 'Auth Success',
	...NO_INDEX_PAGE
}

export default function AuthSuccessPage() {
	return (
		<Suspense
			fallback={
				<div className={styles.centerScreen}>
					<div className={styles.textCenter}>
						<h1 className={styles.title}>Processing login...</h1>
						<div className={styles.spinner}></div>
					</div>
				</div>
			}
		>
			<AuthSuccessClient />
		</Suspense>
	)
}
