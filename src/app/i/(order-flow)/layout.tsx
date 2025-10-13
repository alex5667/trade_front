/**
 * Order Flow Layout
 * --------------------------------
 * Layout для страниц Order Flow
 */
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Order Flow Dashboard',
	description: 'Мониторинг Order Flow данных, Delta спайков и торговых сигналов'
}

export default function OrderFlowLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}
