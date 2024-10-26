'use client'

import { LazyMotion, domAnimation } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { store } from '@/store/store'

export function Providers({ children }: PropsWithChildren) {
	return (
		<Provider store={store}>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
			>
				<LazyMotion features={domAnimation}>{children}</LazyMotion>
			</ThemeProvider>
		</Provider>
	)
}
