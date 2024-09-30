import { InstitutionResponse } from '@/types/institution.type'
import { MenuItemDataFilters } from '@/types/menuItem.type'
import { PageSlugParam } from '@/types/page-params'

import { URLS } from '@/config/urls'

import { getDatesForNextWeek } from '@/utils/getDatesForNextWeek'

import { MenuView } from './(view)/MenuView'
import { fetchMenuByInstitutionSlugAndWeek } from '@/app/[slug]/page'

export const revalidate = 60

export default async function MenuPage({ params }: PageSlugParam) {
	// const data = await fetchMenuByInstitutionSlug(params.slug)
	const dates = getDatesForNextWeek()

	const items = await fetchMenuByInstitutionSlugAndWeek({
		startDate: dates[0],
		endDate: dates[dates.length - 1],
		institutionSlug: params.slug
	} as MenuItemDataFilters)

	return (
		<MenuView
			items={items.length > 0 ? items : []}
			institutionSlug={params.slug}
		/>
	)
}

// export async function fetchMenuByInstitutionSlug(
// 	slug: string
// ): Promise<MenuItemResponse[]> {
// 	const res = await fetch(
// 		`${process.env.BASE_URL}${URLS.MENU_ITEM_BY_INSTITUTION}/${slug}`,
// 		{
// 			method: 'GET',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			}
// 		}
// 	)

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
