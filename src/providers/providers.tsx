'use client'

import { LazyMotion, domAnimation } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren, useEffect } from 'react'
import { Provider } from 'react-redux'

import { store } from '@/store/store'

export function Providers({ children }: PropsWithChildren) {
	// Экспортируем store в window для отладки
	useEffect(() => {
		if (typeof window !== 'undefined') {
			;(window as any).store = store
			console.log('✅ Redux store доступен в window.store для отладки')
		}
	}, [])

	return (
		<Provider store={store}>
			<ThemeProvider
				attribute='class'
				defaultTheme='dark'
				enableSystem
			>
				<LazyMotion features={domAnimation}>{children}</LazyMotion>
			</ThemeProvider>
		</Provider>
	)
}
