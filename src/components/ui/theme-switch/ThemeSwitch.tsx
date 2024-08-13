'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import Loader from '../Loader'

export default function ThemeSwitch() {
	const [mounted, setMounted] = useState(false)
	const { setTheme, resolvedTheme } = useTheme()

	useEffect(() => setMounted(true), [])

	if (!mounted) return <Loader />

	return (
		<div className='flex items-center justify-start mb-3'>
			<span className='mr-2'>Theme: </span>
			{resolvedTheme === 'dark' ? (
				<button onClick={() => setTheme('light')}>
					<Sun />
				</button>
			) : (
				<button onClick={() => setTheme('dark')}>
					<Moon />
				</button>
			)}
		</div>
	)
}
