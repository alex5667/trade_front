'use client'

import cn from 'clsx'
import { m } from 'framer-motion'
import { Notebook, PanelLeftCloseIcon, PanelLeftOpen } from 'lucide-react'
import Link from 'next/link'

import { ADMINBOARD_PAGES } from '@/config/pages-url.config'

import { useActions } from '@/hooks/useActions'
import { useTypedSelector } from '@/hooks/useTypedSelector'

import { LogoutButton } from './LogoutButton'
import { MenuItem } from './MenuItem'
import styles from './Sidebar.module.scss'
import { MENU } from './menu.data'

export function Sidebar() {
	const isCollapsed = useTypedSelector(state => state.collapsed.isCollapsed)
	const { setIsCollapsed } = useActions()
	const toggleSidebar = () => {
		setIsCollapsed(!isCollapsed)
	}
	return (
		<m.aside
			className={cn(styles.aside)}
			animate={{ width: isCollapsed ? 60 : 210 }}
			transition={{ type: 'spring', stiffness: 300, damping: 22 }}
		>
			<div
				className={cn(styles.notebook, {
					visible: !isCollapsed
				})}
			>
				<Link
					href={ADMINBOARD_PAGES.HOME}
					className={cn(styles.linkHome, {
						'px-2, py-layout': isCollapsed,
						'p-layout': !isCollapsed
					})}
				>
					<Notebook
						color={'#1D7AFC'}
						size={isCollapsed ? 20 : 38}
					/>
					{!isCollapsed && (
						<span className={styles.spanTitle}>
							BOIKO
							<span>management</span>
						</span>
					)}
				</Link>
			</div>

			<div className={cn(styles.menuContainer, 'flex-grow')}>
				<button
					className={cn(styles.toggle, {
						'justify-end': !isCollapsed,
						'justify-center': isCollapsed
					})}
					onClick={toggleSidebar}
				>
					{isCollapsed ? <PanelLeftOpen /> : <PanelLeftCloseIcon />}
				</button>
				{MENU.map(item => (
					<MenuItem
						item={item}
						key={item.link}
					/>
				))}
			</div>
			<LogoutButton />
			{!isCollapsed && (
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
