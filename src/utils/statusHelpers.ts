/**
 * Converts raw socket connection status to UI-friendly status object
 */
export const getUIConnectionStatus = (
	socketConnectionStatus: string
): {
	status: 'connecting' | 'connected' | 'error' | 'reconnecting'
	message: string
} => {
	if (socketConnectionStatus === 'connected') {
		return { status: 'connected', message: '' }
	}

	if (socketConnectionStatus.startsWith('reconnecting')) {
		return {
			status: 'reconnecting',
			message: 'Попытка переподключения к серверу сигналов...'
		}
	}

	if (
		socketConnectionStatus.startsWith('error') ||
		socketConnectionStatus === 'max_retries_reached' ||
		socketConnectionStatus === 'reconnect_failed'
	) {
		return {
			status: 'error',
			message:
				'Ошибка подключения к серверу сигналов. Пожалуйста, проверьте соединение или обновите страницу.'
		}
	}

	return {
		status: 'connecting',
		message: 'Подключение к серверу сигналов...'
	}
}

/**
 * Determines if the current connection error is persistent
 */
export const isPersistentError = (socketConnectionStatus: string): boolean => {
	return (
		socketConnectionStatus === 'max_retries_reached' ||
		socketConnectionStatus === 'reconnect_failed' ||
		socketConnectionStatus.includes('websocket error')
	)
}

/**
 * Checks if any signal data is available
 */
export const checkHasAnyData = (signalData: any): boolean => {
	return (
		signalData?.volatilitySpikes?.length > 0 ||
		signalData?.topGainers?.length > 0 ||
		signalData?.topLosers?.length > 0 ||
		signalData?.volumeSpikes?.length > 0 ||
		signalData?.priceChanges?.length > 0 ||
		signalData?.volatilityRanges?.length > 0 ||
		signalData?.triggerGainers1h?.length > 0 ||
		signalData?.triggerLosers1h?.length > 0 ||
		signalData?.triggerGainers4h?.length > 0 ||
		signalData?.triggerLosers4h?.length > 0 ||
		signalData?.triggerGainers24h?.length > 0 ||
		signalData?.triggerLosers24h?.length > 0 ||
		signalData?.topGainers1h?.length > 0 ||
		signalData?.topLosers1h?.length > 0 ||
		signalData?.topGainers4h?.length > 0 ||
		signalData?.topLosers4h?.length > 0 ||
		signalData?.topGainers24h?.length > 0 ||
		signalData?.topLosers24h?.length > 0
	)
} 