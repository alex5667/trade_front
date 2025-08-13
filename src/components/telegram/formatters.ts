export const isTimeLikeKey = (key: string) => ['time', 'timestamp', 'createdAt', 'updatedAt', 'date', 'receivedAt'].includes(key)

export const formatCell = (key: string, value: any) => {
	if (value === null || value === undefined) return '-'
	if (key === 'tp') {
		try {
			let data = value
			if (typeof value === 'string') {
				const trimmed = value.trim()
				if (!trimmed) return '-'
				if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
					data = JSON.parse(trimmed)
				}
			}
			const isEmptyArray = Array.isArray(data) && data.length === 0
			const isEmptyObject = typeof data === 'object' && !Array.isArray(data) && data && Object.keys(data).length === 0
			const pretty = JSON.stringify(data, null, 2)
			return (
				<pre className= 'whitespace-pre text-xs font-mono max-h-40 overflow-auto p-2 bg-gray-100 text-gray-800 rounded' >
				{ isEmptyArray? '[]': isEmptyObject ? '{}' : pretty }
				</pre>
			)
		} catch {
	return String(value)
}
	}
if (Array.isArray(value)) {
	if (value.length === 0) return '-'
	const parts = value.map(v => {
		if (v === null || v === undefined) return ''
		if (typeof v === 'number') return String(v)
		if (typeof v === 'string') return v
		try { return JSON.stringify(v) } catch { return String(v) }
	}).filter(Boolean)
	return parts.length ? parts.join(', ') : '-'
}
if (isTimeLikeKey(key)) {
	const ms = typeof value === 'number' ? value : Date.parse(String(value))
	if (!Number.isNaN(ms)) return new Date(ms).toLocaleTimeString()
}
if (typeof value === 'object') {
	try {
		const json = JSON.stringify(value)
		return json.length > 200 ? json.slice(0, 200) + '…' : json
	} catch {
		return String(value)
	}
}
if (typeof value === 'boolean') return value ? 'true' : 'false'
return String(value)
} 