export const formatValue = (value: any): string => {
	if (typeof value === 'string' || typeof value === 'number') return value.toString()
	if (value instanceof Date) return value.toISOString()
	if (typeof value === 'object' && value !== null) return JSON.stringify(value)
	return ''
}