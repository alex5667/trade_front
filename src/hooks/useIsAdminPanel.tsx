import { usePathname } from 'next/navigation'

import { URLS } from '@/config/url.config'

export const useIsAdminPanel = () => {
	const pathName = usePathname()
	const isAdminPanel = pathName.startsWith(URLS.ADMIN_PANEL_URL)
	return { pathName, isAdminPanel }
}
