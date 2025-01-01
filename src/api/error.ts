// export const errorCatch = (error: any): string => {
// 	const message = error?.response?.data?.message
// 	return message
// 		? typeof error.response.data.message === 'object'
// 			? message[0]
// 			: message
// 		: error.message
// }

export const errorCatch = (error: any): string => {
	if (error?.data?.error) {
		return error.data.error
	}

	const message = error?.response?.data?.message
	return message
		? typeof message === 'object'
			? message[0]
			: message
		: error.message || 'Unknown error'
}