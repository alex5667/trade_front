import { Regime, REGIME_TIPS, SignalType } from './regime-tips'

export function why(
	regime: Regime,
	type: SignalType,
	side?: 'long' | 'short'
): { allowed: boolean; reason: string } {
	const tips = REGIME_TIPS[regime]
	const rule = tips.gateRules.find(r => r.types.includes(type))

	// Нет явного правила — по умолчанию разрешаем.
	if (!rule) return { allowed: true, reason: 'Нет спец-ограничений для этого типа сигнала' }

	// Учитываем направление в тренде.
	if (regime === 'trending_bull' && (type === 'fvg' || type === 'ob' || type === 'breaker')) {
		if (side === 'short') return { allowed: false, reason: 'Контртренд в бычьем тренде запрещён (+DI/ADX против)' }
	}
	if (regime === 'trending_bear' && (type === 'fvg' || type === 'ob' || type === 'breaker')) {
		if (side === 'long') return { allowed: false, reason: 'Контртренд в медвежьем тренде запрещён (−DI/ADX против)' }
	}

	return { allowed: rule.allow, reason: rule.reason }
}
