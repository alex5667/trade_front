/**
 * Mobile Regime Tips Example - Пример использования мобильных компонентов
 * ------------------------------
 * Демонстрирует использование MobileRegimeTipsCard и WhyGateBadgeMini
 */
'use client'

import { useRegimeSocket } from '@/hooks/useRegimeSocket'

import { MobileRegimeTipsCard } from './MobileRegimeTipsCard'
import { WhyGateBadgeMini } from './WhyGateBadgeMini'
import { Regime } from '@/lib/regime-tips'

/**
 * Mobile Regime Tips Example - Пример использования мобильных компонентов
 * ------------------------------
 * Демонстрирует использование MobileRegimeTipsCard и WhyGateBadgeMini
 */

export default function MobilePanel() {
	const { regime: live } = useRegimeSocket()
	const regime = (live?.regime ?? 'range') as Regime

	// пример сигнала
	const signal = { type: 'fvg' as const, side: 'long' as const }

	return (
		<div style={{ padding: 12, display: 'grid', gap: 12 }}>
			<MobileRegimeTipsCard regime={regime} />
			<div>
				<div style={{ marginBottom: 6, fontSize: 12, opacity: 0.7 }}>
					Текущий сигнал:
				</div>
				<WhyGateBadgeMini
					regime={regime}
					type={signal.type}
					side={signal.side}
				/>
			</div>
		</div>
	)
}
