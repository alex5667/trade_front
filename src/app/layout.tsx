import { Loader } from 'lucide-react'
import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

import { RegimeAlertToast } from '@/components/regime-alert'
import Background from '@/components/ui/Background'

import { Providers } from '@/providers/providers'

import { SITE_NAME } from '@/constants/seo.constants'

import { getSiteUrl } from '@/config/pages-url.config'

import '../styles/globals.scss'

import InitColors from '@/styles/init-colors'

const zen = Noto_Sans({
	subsets: ['cyrillic', 'latin'],

	weight: ['200', '300', '400', '500', '600', '700', '900'],
	display: 'swap',
	variable: '--font-zen',
	style: ['normal']
})
export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`
	},
	description: 'Trade Management',
	metadataBase: new URL(getSiteUrl())
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='ru'
			className='dark'
			suppressHydrationWarning
		>
			<body
				className={zen.className}
				suppressHydrationWarning
			>
				<Providers>
					<InitColors />
					<Suspense fallback={<Loader />}>
						<Background />
					</Suspense>
					<div className='wrapper'>{children}</div>
					<Toaster
						theme='dark'
						position='bottom-right'
						duration={1500}
					/>
					<RegimeAlertToast />
				</Providers>
			</body>
		</html>
	)
}
