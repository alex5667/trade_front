export const URLS = {
	AUTH_LOGIN_ACCESS_TOKEN: 'auth/login/access-token',
	AUTH_LOGIN: '/auth/login',
	AUTH: '/auth',
	AUTH_REGISTER: '/auth/register',
	AUTH_LOGOUT: '/auth/logout',
	ADMIN_PANEL_URL: '/admin',
	MENU_ITEM: '/menu-item',


}

export const getSiteUrl = () => process.env.APP_URL as string
export const getAdminUrl = (path = '') => `${URLS.ADMIN_PANEL_URL}${path}`