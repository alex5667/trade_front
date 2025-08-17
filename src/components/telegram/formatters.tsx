export const isTimeLikeKey = (key: string) =>
	[
		'time',
		'timestamp',
		'createdAt',
		'updatedAt',
		'date',
		'receivedAt'
	].includes(key)

export const formatCell = (key: string, value: any) => {
	if (value === null || value === undefined) return '-'

	// Специальная обработка для поля entry - показываем как raw string
	if (key === 'entry') {
		return String(value || '')
	}

	// Специальная обработка для поля direction
	if (key === 'direction') {
		const direction = String(value || '').toLowerCase()
		if (direction.includes('long') || direction.includes('buy')) {
			return (
				<span className='text-green-400 font-medium'>📈 {String(value)}</span>
			)
		}
		if (direction.includes('short') || direction.includes('sell')) {
			return (
				<span className='text-red-400 font-medium'>📉 {String(value)}</span>
			)
		}
		return String(value)
	}

	// Специальная обработка для поля leverage
	if (key === 'leverage') {
		if (value && Number(value) > 1) {
			return <span className='text-yellow-400 font-medium'>{value}x</span>
		}
		return value || '-'
	}

	// Специальная обработка для поля riskPct
	if (key === 'riskPct') {
		if (value) {
			const num = parseFloat(String(value).replace('%', ''))
			if (!isNaN(num)) {
				const color =
					num > 5
						? 'text-red-400'
						: num > 2
							? 'text-yellow-400'
							: 'text-green-400'
				return <span className={`${color} font-medium`}>{value}</span>
			}
		}
		return value || '-'
	}

	// Специальная обработка для поля tpPct
	if (key === 'tpPct') {
		if (value) {
			const num = parseFloat(String(value).replace('%', ''))
			if (!isNaN(num)) {
				const color =
					num > 10
						? 'text-green-400'
						: num > 5
							? 'text-yellow-400'
							: 'text-blue-400'
				return <span className={`${color} font-medium`}>{value}</span>
			}
		}
		return value || '-'
	}

	if (key === 'tp') {
		try {
			let data = value
			if (typeof value === 'string') {
				const trimmed = value.trim()
				if (!trimmed) return '-'
				if (
					(trimmed.startsWith('[') && trimmed.endsWith(']')) ||
					(trimmed.startsWith('{') && trimmed.endsWith('}'))
				) {
					data = JSON.parse(trimmed)
				}
			}
			const isEmptyArray = Array.isArray(data) && data.length === 0
			const isEmptyObject =
				typeof data === 'object' &&
				!Array.isArray(data) &&
				data &&
				Object.keys(data).length === 0

			// Для массива tp убираем скобки и показываем только значения
			if (Array.isArray(data)) {
				return data.join(', ')
			}

			const pretty = JSON.stringify(data, null, 2)
			return (
				<pre className='whitespace-pre text-xs font-mono max-h-40 overflow-auto p-2 bg-gray-100 text-gray-800 rounded'>
					{isEmptyArray ? '[]' : isEmptyObject ? '{}' : pretty}
				</pre>
			)
		} catch {
			return String(value)
		}
	}

	if (Array.isArray(value)) {
		if (value.length === 0) return '-'
		const parts = value
			.map(v => {
				if (v === null || v === undefined) return ''
				if (typeof v === 'number') return String(v)
				if (typeof v === 'string') return v
				try {
					return JSON.stringify(v)
				} catch {
					return String(v)
				}
			})
			.filter(Boolean)
		return parts.length ? parts.join(', ') : '-'
	}

	if (isTimeLikeKey(key)) {
		const ms = typeof value === 'number' ? value : Date.parse(String(value))
		if (!Number.isNaN(ms)) {
			// Показываем полную дату и время
			return new Date(ms).toLocaleString()
		}
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
