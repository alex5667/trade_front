'use client'

import styles from './NoDataIndicator.module.scss'

interface NoDataIndicatorProps {
	message?: string
	hasAnyData?: boolean
	isError?: boolean
}

/**
 * NoDataIndicator - показывает сообщение при отсутствии данных
 *
 * Компонент отображает информационное сообщение, когда нет
 * доступных данных для показа в таблицах или других компонентах.
 *
 * Можно настроить текст сообщения, также компонент
 * не отображается, если данные уже есть или произошла ошибка.
 */
export const NoDataIndicator = ({
	message = 'Ожидание данных... Новые сигналы появятся, как только будут обнаружены.',
	hasAnyData = false,
	isError = false
}: NoDataIndicatorProps) => {
	// Не показываем индикатор, если есть данные или произошла ошибка
	if (hasAnyData || isError) return null

	return (
		<div className={styles.noDataContainer}>
			<p className={styles.noDataMessage}>{message}</p>
		</div>
	)
}
