export const ADMINBOARD_PAGES = {
	HOME: '/',
	MENU_Slon_1: `/i/menu/Slon_1`,
	// MENU_Slon_2: `/i/menu-school`,
	// MENU_Slon_3: `/i/menu-school`,
	MENU_KINDERGARTEN: `/i/menu-kindergarten`,
	MENU_BUFFET: `/i/menu-buffet`,
	DISHES: `/i/dishes`,
	INGREDIENTS: `/i/ingredients`,
	SETTINGS: `/i/settings`,
	ADMIN_PANEL_URL: '/i',
	AUTH: '/auth',


}
export const getSiteUrl = () => process.env.APP_URL as string
export const getAdminUrl = (path = '') => `${ADMINBOARD_PAGES.ADMIN_PANEL_URL}${path}`