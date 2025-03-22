export const ADMINBOARD_PAGES = {
	CUSTOMER: '/',
	ADMIN: '/i',
	MENU: `/i/menu`,
	PURCHASING: `/i/purchasing`,
	USER: `/i/user`,
	EXCEL: `/i/excelLoader`,
	CONSUMPTION: `/i/consumption`,
	DISHES: `/i/dishes`,
	DBEDITOR: `/i/dbEditor`,
	INGREDIENTS: `/i/ingredients`,
	INSTITUTIONS: `/i/institutions`,
	DISHCATEGORIES: `/i/dishCategories`,
	RETAILSALE: `/i/retail-sale`,
	MEALS: `/i/meals`,
	SETTINGS: `/i/settings`,
	AUTH: '/auth',
}
export const getSiteUrl = () => process.env.NEXT_PUBLIC_APP_URL as string
export const getAdminUrl = (path = '') => `${ADMINBOARD_PAGES.ADMIN}${path}`

export type ADMINBOARD_PAGES_KEYS = keyof typeof ADMINBOARD_PAGES