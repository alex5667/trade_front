/**
 * Signal Socket Types
 * ------------------------------
 * Типы, используемые компонентами сокета сигналов
 * Реэкспортирует типы из Redux для поддержания совместимости
 */

// Реэкспорт типов из Redux для обеспечения совместимости
export type {
	FundingCoin, // Монета с данными о финансировании
	PriceChangeSignal, // Сигнал изменения цены
	TimeframeCoin, // Монета в таймфрейме (для гейнеров/лузеров)
	VolatilitySignal, // Сигнал волатильности
	VolumeSignal as VolumeCoin, // Псевдоним для совместимости
	VolumeSignal // Сигнал объема
} from '@/store/signals/signal.types'

