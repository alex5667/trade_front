export const ADMINBOARD_PAGES = {
	CUSTOMER: '/',
	ADMIN: '/i',
	MENU: `/i/menu`,
	USER: `/i/user`,
	EXCEL: `/i/excelLoader`,
	CONSUMPTION: `/i/consumption`,
	DISHES: `/i/dishes`,
	DBEDITOR: `/i/dbEditor`,
	INGREDIENTS: `/i/ingredients`,
	INSTITUTIONS: `/i/institutions`,
	MEALS: `/i/meals`,
	SETTINGS: `/i/settings`,
	AUTH: '/auth',
}
export const getSiteUrl = () => process.env.NEXT_PUBLIC_APP_URL as string
export const getAdminUrl = (path = '') => `${ADMINBOARD_PAGES.ADMIN}${path}`

export type ADMINBOARD_PAGES_KEYS = keyof typeof ADMINBOARD_PAGES