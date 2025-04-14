'use client'

import cn from 'clsx'
import { m } from 'framer-motion'
import { Infinity, PanelLeftCloseIcon, PanelLeftOpen } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ADMINBOARD_PAGES } from '@/config/pages-url.config'

import { useActions } from '@/hooks/useActions'
import { useAuth } from '@/hooks/useAuth'
import { useTypedSelector } from '@/hooks/useTypedSelector'

import { LogoutButton } from './LogoutButton'
import { MenuItem } from './MenuItem'
import styles from './Sidebar.module.scss'
import { ADMINMENU, USERMENU } from './menu.data'

const Sidebar = () => {
	const isCollapsed = useTypedSelector(state => state.collapsed.isCollapsed)
	const { setIsCollapsed } = useActions()
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768)
			if (window.innerWidth <= 768) {
				setIsCollapsed(true)
			}
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [setIsCollapsed])

	const toggleSidebar = () => {
		if (!isMobile) {
			setIsCollapsed(!isCollapsed)
		}
	}

	const { user } = useAuth()
	const isAdmin = user?.roles.includes('admin')

	return (
		<m.aside
			className={cn(styles.aside, isMobile ? 'h-[60px]' : 'min-h-full')}
			animate={isMobile ? { width: '100%' } : { width: isCollapsed ? 50 : 230 }}
			style={isMobile ? { height: '60px' } : {}}
			transition={{ type: 'spring', stiffness: 300, damping: 22 }}
		>
			<div
				className={cn(styles.notebook, {
					visible: !isCollapsed || isMobile
				})}
			>
				<Link
					href={ADMINBOARD_PAGES.CUSTOMER}
					className={cn(styles.linkHome, {
						'px-2, py-layout': isCollapsed && !isMobile,
						'p-layout': !isCollapsed && !isMobile
					})}
				>
					<Infinity
						// color={'#1D7AFC'}
						size={isCollapsed && !isMobile ? 20 : 28}
					/>
					{(!isCollapsed || isMobile) && (
						<span className={styles.spanTitle}>
							Trade
							<span>management</span>
						</span>
					)}
				</Link>
			</div>

			<div className={cn(styles.menuContainer, 'flex-grow')}>
				{!isMobile && (
					<button
						className={cn(styles.toggle, {
							'justify-end': !isCollapsed,
							'justify-center': isCollapsed
						})}
						onClick={toggleSidebar}
					>
						{isCollapsed ? <PanelLeftOpen /> : <PanelLeftCloseIcon />}
					</button>
				)}
				{(isAdmin ? ADMINMENU : USERMENU).map(item => (
					<MenuItem
						item={item}
						key={item.link}
					/>
				))}
			</div>
			<LogoutButton />
			{!isCollapsed && !isMobile && (
				<footer className={styles.footer}>
					2024&copy
					<a
						href=''
						target='_blank'
						rel='noreferrer'
					>
						Alex Group
					</a>
					.<br /> All rights reserved.
				</footer>
			)}
		</m.aside>
	)
}
export default Sidebar
