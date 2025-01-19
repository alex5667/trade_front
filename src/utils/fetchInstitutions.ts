import { URLS } from '@/config/urls'
import { InstitutionResponse } from '@/types/institution.type'

export const fetchInstitutions = async () => {
	const res = await fetch(`${process.env.BASE_URL}${URLS.INSTITUTIONS}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		mode: 'cors'
	})
	if (!res.ok) {
		throw new Error('Failed to fetch menu items')
	}

	const data: InstitutionResponse[] = await res.json()
	return data
}