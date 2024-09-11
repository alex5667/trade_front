import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Admin board',
	...NO_INDEX_PAGE
}

export default function AdminBoardPage() {
	return <>AdminBoardPage</>
}
