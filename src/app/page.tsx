import { Metadata } from 'next'

import { SignalTable } from '@/components/signal-table/SignalTable'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Головна сторінка',
	...NO_INDEX_PAGE
}

export default async function HomePage() {
	return (
		<div className='w-[70%]  m-auto flex flex-col items-center justify-start'>
			<SignalTable />
		</div>
	)
}
