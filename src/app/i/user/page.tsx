import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'UserPage',
	...NO_INDEX_PAGE
}

export default function UserPage() {
	return <div>UserPage</div>
}
