export const DASHBOARD_PAGES = {
	HOME: '/',
	MENU_SCHOOL: `/i/menu-school`,
	MENU_KINDERGARTEN: `/i/menu-kindergarten`,
	MENU_BUFFET: `/i/menu-buffet`,
	DISHES: `/i/dishes`,
	INGREDIENTS: `/i/ingredients`,
	SETTINGS: `/i/settings`,
	ADMIN_PANEL_URL: '/i',
	AUTH: '/auth',


}
export const getSiteUrl = () => process.env.APP_URL as string
export const getAdminUrl = (path = '') => `${DASHBOARD_PAGES.ADMIN_PANEL_URL}${path}`