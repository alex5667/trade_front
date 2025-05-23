/**
 * Helper function to format volume with B/M suffix
 */
export const formatVolumeValue = (value?: number): string => {
	if (value === undefined) return '0'

	if (value >= 1_000_000_000) {
		return `${(value / 1_000_000_000).toFixed(2)}B`
	} else if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(2)}M`
	} else {
		return value.toLocaleString()
	}
}