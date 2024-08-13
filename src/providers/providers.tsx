'use client'

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
				{children}
			</ThemeProvider>
		</Provider>
	)
}
