import { Loader } from 'lucide-react'
import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

import Background from '@/components/ui/Background'

import { Providers } from '@/providers/providers'

import { SITE_NAME } from '@/constants/seo.constants'

import { getSiteUrl } from '@/config/pages-url.config'

import '../styles/globals.scss'

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
					<Suspense fallback={<Loader />}>
						<Background />
					</Suspense>
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
