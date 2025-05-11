import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import SignalTest from '@/test/signal-test'

export const metadata: Metadata = {
	title: 'Signal Test Panel',
	...NO_INDEX_PAGE
}

export default function TestPage() {
	return <SignalTest />
}
