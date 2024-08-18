import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import { Toaster } from 'sonner'

import { Providers } from '@/providers/providers'

import { SITE_NAME } from '@/constants/seo.constants'

import { getSiteUrl } from '@/config/urls'

import '../styles/globals.scss'

const zen = Noto_Sans({
	subsets: ['cyrillic', 'latin'],

	weight: ['200', '300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-zen',
	style: ['normal']
})
export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`
	},
	description: 'Best one for planning menu',
	metadataBase: new URL(getSiteUrl())
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='uk'>
			<body className={zen.className}>
				<Providers>
					<div className='wrapper'>{children}</div>
					<Toaster
						theme='dark'
						position='bottom-right'
						duration={1500}
					/>
				</Providers>
			</body>
		</html>
	)
}
