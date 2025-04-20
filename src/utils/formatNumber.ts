export const formatNumber = (value: number | string | undefined) => {
	if (!value) return '0'

	return new Intl.NumberFormat('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(Number(value))
}