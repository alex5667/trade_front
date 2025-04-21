'use client'

import { memo } from 'react'

import styles from './connection-status.module.scss'

type ConnectionStatusProps = {
	status: 'connecting' | 'connected' | 'error' | 'reconnecting'
	message: string
	isPersistentError: boolean
}

/**
 * ConnectionStatus - Shows the current WebSocket connection status
 * and provides options for reconnecting if errors occur
 */
const ConnectionStatus = memo(function ConnectionStatus({
	status,
	message,
	isPersistentError
}: ConnectionStatusProps) {
	if (status === 'connected') return null

	return (
		<>
			{status === 'connecting' && (
				<p className={`${styles.statusMessage} ${styles.connecting}`}>
					<span className={`${styles.statusDot} ${styles.connecting}`}></span>
					{message}
				</p>
			)}

			{status === 'reconnecting' && (
				<p className={`${styles.statusMessage} ${styles.reconnecting}`}>
					<span className={`${styles.statusDot} ${styles.reconnecting}`}></span>
					{message}
				</p>
			)}

			{status === 'error' && (
				<div className='mb-4'>
					<p className={`${styles.statusMessage} ${styles.error}`}>
						<span className={`${styles.statusDot} ${styles.error}`}></span>
						{message}
						<button
							onClick={() => window.location.reload()}
							className='ml-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700'
						>
							Обновить
						</button>
					</p>

					{isPersistentError && (
						<div className={styles.errorContainer}>
							<h3 className={styles.errorTitle}>Возможные причины ошибки:</h3>
							<ul className={styles.errorList}>
								<li>Блокировка WebSocket соединений на вашей сети</li>
								<li>Прокси-сервер или брандмауэр блокирует соединение</li>
								<li>Временные проблемы с сервером</li>
							</ul>
							<div className='mt-2'>
								<p className={styles.errorHelpText}>
									Попробуйте следующие решения:
								</p>
								<div className={styles.errorButtonContainer}>
									<button
										onClick={() => {
											// Try connecting with HTTP polling only
											window.location.search = '?transport=polling'
											window.location.reload()
										}}
										className={styles.pollingButton}
									>
										Использовать HTTP-соединение
									</button>
									<button
										onClick={() => window.location.reload()}
										className={styles.reconnectButton}
									>
										Переподключиться
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	)
})

export default ConnectionStatus
