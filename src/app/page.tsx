import Header from '@/components/ui/home/Header'

import { MenuItemDataFilters } from '@/types/menuItem.types'

import { URLS } from '@/config/urls'

import Home from './Home'
import styles from './HomePage.module.scss'

export const revalidate = 3600

export default async function HomePage() {
	const items = await getMenuItems({})
	return (
		<>
			<Header />
			<main className={styles.main__container}>
				<Home items={items} />
			</main>
		</>
	)
}

const getMenuItems = async (
	params: MenuItemDataFilters = {} as MenuItemDataFilters
) => {
	const queryString = new URLSearchParams(
		params as MenuItemDataFilters
	).toString()
	const urlBase = process.env.BASE_URL
	const url = `${urlBase}${URLS.MENU_ITEM}?${queryString}`
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error('Fetch error:', errorText)
			throw new Error(`Network response was not ok: ${response.statusText}`)
		}

		return response.json()
	} catch (error) {
		console.error('Error fetching menu items:', error)
		throw error
	}
}
