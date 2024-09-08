'use client'

import cn from 'clsx'
import { Notebook } from 'lucide-react'
import Link from 'next/link'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { LogoutButton } from './LogoutButton'
import { MenuItem } from './MenuItem'
import styles from './Sidebar.module.scss'
import { MENU } from './menu.data'

export function Sidebar() {
	return (
		<aside className={cn(styles.aside, 'dark:bg-sidebar')}>
			<div className='flex h-full flex-col justify-between '>
				<Link
					href={DASHBOARD_PAGES.HOME}
					className={styles.linkHome}
				>
					<Notebook
						color={'#1D7AFC'}
						size={38}
					/>
					<span className={styles.spanTitle}>
						BOIKO
						<span>management</span>
					</span>
				</Link>
				<div className={cn(styles.logout, 'flex-grow')}>
					<LogoutButton />
					{MENU.map(item => (
						<MenuItem
							item={item}
							key={item.link}
						/>
					))}
				</div>
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
			</div>
		</aside>
	)
}
