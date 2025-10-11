import { REGIME_TIPS, Regime, RegimeTips } from './regime-tips'

function clip<T>(arr: T[], n = 3): T[] {
	return Array.isArray(arr) ? arr.slice(0, n) : []
}

/** Ужать один набор подсказок до n элементов в каждом списке */
export function compactTips(t: RegimeTips, n = 3): RegimeTips {
	return {
		...t,
		do: clip(t.do, n),
		avoid: clip(t.avoid, n),
		entries: clip(t.entries, n),
		confirmations: clip(t.confirmations, n),
		exits: clip(t.exits, n),
		risk: clip(t.risk, n),
		invalidation: clip(t.invalidation, n),
		transitions: clip(t.transitions, n),
		checklist: clip(t.checklist, n),
		gateRules: t.gateRules.slice(0, n),
	}
}

/** Готовый компактный словарь (по 3 пункта) */
export const REGIME_TIPS_COMPACT: Record<Regime, RegimeTips> =
	(Object.keys(REGIME_TIPS) as Regime[]).reduce((acc, k) => {
		acc[k] = compactTips(REGIME_TIPS[k], 3)
		return acc
	}, {} as Record<Regime, RegimeTips>)

