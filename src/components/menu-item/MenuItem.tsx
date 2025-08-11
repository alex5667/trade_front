import Link from 'next/link'

import { MenuItem as MenuItemType } from '@/types/menu.interface'

import styles from './MenuItem.module.scss'

interface MenuItemProps {
	item: MenuItemType
}

const MenuItem = ({ item }: MenuItemProps) => {
	return (
		<Link
			href={item.link}
			className={styles.menuItem}
		>
			<h2 className={styles.menuItemText}>{item.name}</h2>
		</Link>
	)
}

export default MenuItem
