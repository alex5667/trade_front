import dayjs from 'dayjs'
import { Metadata } from 'next'

import Footer from '@/components/home/Footer'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { InstitutionResponse } from '@/types/institution.type'
import { MenuItemDataFilters } from '@/types/menuItem.type'
import { PageSlugParam } from '@/types/page-params'

import { URLS } from '@/config/urls'

import { fetchMenuByInstitutionSlugAndWeek } from '@/utils/fetchMenuByInstitutionSlugAndWeek'
import { getDatesOfWeek } from '@/utils/getDatesOfWeek'

import CustomerMenu from './CustomerMenu'

export const metadata: Metadata = {
	title: 'Home page',
	...NO_INDEX_PAGE
}

export const revalidate = 600
const https = require('https')

const agent = new https.Agent({
	rejectUnauthorized: false // Отключает проверку сертификата
})

export default async function CustomerPage({ params }: PageSlugParam) {
	const today = dayjs()
	const isSaturday = today.day() === 0
	let weekOffset = isSaturday ? 1 : 0

	const { startOfWeek, endOfWeek } = getDatesOfWeek(weekOffset)

	let items = await fetchMenuByInstitutionSlugAndWeek({
		startDate: startOfWeek,
		endDate: endOfWeek,
		institutionSlug: params.slug
	} as MenuItemDataFilters)

	if (items.length === 0) {
		weekOffset = -1
		const { startOfWeek, endOfWeek } = getDatesOfWeek(weekOffset)

		items = await fetchMenuByInstitutionSlugAndWeek({
			startDate: startOfWeek,
			endDate: endOfWeek,
			institutionSlug: params.slug
		} as MenuItemDataFilters)
	}

	return (
		<>
			{/* <Header /> */}
			<main className='main__container'>
				<CustomerMenu items={items} />
			</main>
			<Footer />
		</>
	)
}

// export async function fetchMenuByInstitutionSlugAndWeek(
// 	params: MenuItemDataFilters = {} as MenuItemDataFilters
// ): Promise<MenuItemResponse[]> {
// 	const queryString = new URLSearchParams(
// 		params as MenuItemDataFilters
// 	).toString()
// 	const urlBase = process.env.BASE_URL
// 	const url = `${urlBase}${URLS.MENU_ITEM}?${queryString}`

// 	const res = await fetch(url, {
// 		method: 'GET',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		}
// 	})

// 	if (!res.ok) {
// 		throw new Error('Failed to fetch menu items')
// 	}

// 	const data: MenuItemResponse[] = await res.json()
// 	return data
// }

export async function generateStaticParams() {
	const res = await fetch(`${process.env.BASE_URL}${URLS.INSTITUTIONS}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if (!res.ok) {
		throw new Error('Failed to fetch menu items')
	}

	const data: InstitutionResponse[] = await res.json()

	return data.map(institution => {
		return { params: { slug: institution.slug } }
	})
}
