import { URLS } from '@/config/urls'
import { MenuItemDataFilters, MenuItemResponse } from '@/types/menuItem.type'

export async function fetchMenuByInstitutionSlugAndWeek(
	params: MenuItemDataFilters = {} as MenuItemDataFilters
): Promise<MenuItemResponse[]> {
	const queryString = new URLSearchParams(
		params as MenuItemDataFilters
	).toString()
	const urlBase = process.env.BASE_URL
	const url = `${urlBase}${URLS.MENU_ITEM}?${queryString}`

	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}, mode: 'cors',

	})

	if (!res.ok) {
		throw new Error('Failed to fetch menu items')
	}

	const data: MenuItemResponse[] = await res.json()
	return data
}