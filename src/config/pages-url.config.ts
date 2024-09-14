export const ADMINBOARD_PAGES = {
	HOME: '/',
	MENU: `/i/menu`,
	USER: `/i/user`,
	DISHES: `/i/dishes`,
	INGREDIENTS: `/i/ingredients`,
	SETTINGS: `/i/settings`,
	ADMIN_PANEL_URL: '/i',
	AUTH: '/auth',
}
export const getSiteUrl = () => process.env.APP_URL as string
export const getAdminUrl = (path = '') => `${ADMINBOARD_PAGES.ADMIN_PANEL_URL}${path}`