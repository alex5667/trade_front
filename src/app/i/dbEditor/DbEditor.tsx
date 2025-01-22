import Link from 'next/link'

import { DBEDITORMENU } from './dbEditor-data'

const DbEditor = () => {
	return (
		<div className='w-[70%]  m-auto flex flex-col items-center justify-start'>
			{DBEDITORMENU.map(item => {
				// const link = `${getSiteUrl()}/${ADMINBOARD_PAGES.CUSTOMER}/${item.slug}`
				return (
					<Link
						key={item.name}
						href={item.link}
						className='min-w-full  text-center hover:bg-lightPrimary bg-primary/50 text-white hover:text-primary-hover   py-4 px-10 mb-3 border rounded-md '
					>
						<h2 className='tracking-wide font-medium text-base md:text-lg'>
							{item.name}
						</h2>
					</Link>
				)
			})}
		</div>
	)
}

export default DbEditor
