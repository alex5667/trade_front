import { PageSlugParam } from '@/types/page-params'

import { MenuView } from './(view)/MenuView'

export default function MenuPage({ params }: PageSlugParam) {
	return <MenuView institutionSlug={params.slug} />
}
