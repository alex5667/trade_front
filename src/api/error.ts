// export const errorCatch = (error: any): string => {
// 	const message = error?.response?.data?.message
// 	return message
// 		? typeof error.response.data.message === 'object'
// 			? message[0]
// 			: message
// 		: error.message
// }

export const errorCatch = (error: any): string => {
	// Handle case when error is null or undefined
	if (!error) return 'Unknown error'

	// Special handling for FETCH_ERROR which indicates network problems
	if (error.status === 'FETCH_ERROR') {
		// Check for detailed message in data
		if (error.data?.message) {
			return error.data.message
		}

		// Check common network error types
		const errorString = String(error.error || '')

		if (errorString.includes('Failed to fetch')) {
			return 'Не удалось подключиться к серверу. Проверьте подключение к интернету.'
		}

		if (errorString.includes('Network request failed')) {
			return 'Ошибка сети. Проверьте подключение к интернету или повторите попытку позже.'
		}

		if (errorString.includes('timeout')) {
			return 'Превышено время ожидания ответа от сервера. Повторите попытку позже.'
		}

		if (errorString.includes('abort')) {
			return 'Запрос был отменен.'
		}

		return `Ошибка сети: ${errorString || 'проверьте подключение к интернету'}`
	}

	// Handle RTK Query errors that may have error.data.error format
	if (error?.data?.error) {
		// If it's a string, return it directly
		if (typeof error.data.error === 'string') {
			try {
				// Try to parse it as JSON first
				const parsedError = JSON.parse(error.data.error)
				return parsedError?.message || error.data.error
			} catch (e) {
				// Not JSON, return as is
				return error.data.error
			}
		}
		// If it's an object with message
		else if (error.data.error?.message) {
			return error.data.error.message
		}
	}

	// Handle standard HTTP errors from Axios or similar
	if (error?.response?.data) {
		const { data } = error.response

		// Check for message
		if (data?.message) {
			return Array.isArray(data.message) ? data.message[0] : data.message
		}

		// Check for error
		if (data?.error) {
			return typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
		}
	}

	// Handle simple message errors
	if (error?.message) {
		return error.message
	}

	// If status is available, include it
	if (error?.status) {
		return `Error ${error.status}: ${error.statusText || 'Unknown error'}`
	}

	// Last resort - stringify the entire error if possible
	try {
		return typeof error === 'object' ? JSON.stringify(error) : String(error)
	} catch (e) {
		return 'Unknown error'
	}
}
