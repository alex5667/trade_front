import { useDownloadFromExcelMenuItemMutation } from '@/services/menu-item.service'
import { MenuItemExcelDto } from '@/types/menuItem.type'

export const downloadMenuFromExcelService = async (
	data: string[][],
	datesOfWeek: { [key: string]: string }
	,
	institutionName: string,
	downloadMenu: ReturnType<typeof useDownloadFromExcelMenuItemMutation>[0]
) => {
	if (data.length === 0) return

	const dto: MenuItemExcelDto = {
		data,
		dates: datesOfWeek,
		institutionName,
	}

	await downloadMenu(dto)
}