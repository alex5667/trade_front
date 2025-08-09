'use client'

import { useEffect } from 'react'

import { URLS } from '@/config/urls'

import styles from '@/app/auth/AuthCommon.module.scss'

export default function GoogleAuth() {
	useEffect(() => {
		// Открываем URL авторизации напрямую через бэкенд
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
		const authUrl = `${apiBaseUrl}${URLS.AUTH_GOOGLE}`

		// Используем window.location.replace вместо href для лучшего UX
		window.location.replace(authUrl)
	}, [])

	return (
		<div className={styles.centerScreen}>
			<div className={styles.textCenter}>
				<h1 className={styles.title}>Redirecting to Google login...</h1>
				<div className={styles.spinner}></div>
			</div>
		</div>
	)
}
