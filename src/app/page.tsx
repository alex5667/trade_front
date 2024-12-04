import { Metadata } from 'next'
import Link from 'next/link'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { ADMINBOARD_PAGES, getSiteUrl } from '@/config/pages-url.config'

import { fetchInstitutions } from '@/utils/fetchInstitutions'

export const metadata: Metadata = {
	title: 'Главная страница',
	...NO_INDEX_PAGE
}

export default async function HomePage() {
	const data = await fetchInstitutions()

	return (
		<div className='w-[70%}  m-auto flex flex-col items-center justify-start'>
			{data.map(institution => {
				const link = `${getSiteUrl()}/${ADMINBOARD_PAGES.CUSTOMER}/${institution.slug}`
				return (
					<Link
						key={institution.id}
						href={link}
						className='min-w-full  text-center hover:bg-lightPrimary bg-primary/50 text-white hover:text-primary-hover   py-4 px-10 mb-3 border rounded-md '
					>
						<h2 className='tracking-wide font-medium text-base md:text-lg'>
							{institution.printName}
						</h2>
					</Link>
				)
			})}
		</div>
	)
}
