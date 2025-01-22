'use client'

import Link from 'next/link'

import Loader from '@/components/ui/Loader'

import { ADMINBOARD_PAGES, getSiteUrl } from '@/config/pages-url.config'

import { useGetAllInstitutionsQuery } from '@/services/institution.service'

const Menu = () => {
	const { data, isLoading } = useGetAllInstitutionsQuery()
	if (isLoading) return <Loader />
	return (
		<div className='w-[70%]  m-auto flex flex-col items-center justify-start'>
			{data &&
				data.map(institution => {
					const link = `${getSiteUrl()}${ADMINBOARD_PAGES.MENU}/${institution.slug}`

					return (
						<Link
							key={institution.id}
							href={link}
							className='min-w-full  text-center text-black hover:bg-lightPrimary bg-primary/50  hover:text-primary-hover   py-4 px-10 mb-3 border rounded-md '
						>
							<h2 className='tracking-wide font-medium text-base text-black md:text-lg'>
								{institution.printName}
							</h2>
						</Link>
					)
				})}
		</div>
	)
}
export default Menu
