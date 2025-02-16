import { errorCatch } from '@/api/error'
import { useDownloadFromExcelMenuItemMutation } from '@/services/menu-item.service'
import { MenuItemExcelDto } from '@/types/menuItem.type'
import { toast } from 'sonner'

export const downloadMenuFromExcelService = async (
	data: string[][],
	datesOfWeek: { [key: string]: string },
	institutionName: string,
	downloadMenu: ReturnType<typeof useDownloadFromExcelMenuItemMutation>[0]
) => {
	if (data.length === 0) return

	const dto: MenuItemExcelDto = {
		data,
		dates: datesOfWeek,
		institutionName
	}

	try {
		const result = await downloadMenu(dto)
		// Если есть ошибка в ответе, обрабатываем её
		if (result.error) {
			console.error('Ошибка в result.error:', result.error)
			toast.error(errorCatch(result.error))
			return
		}

		toast.success('Меню успешно загружено!')
	} catch (error) {
		console.error('Ошибка в catch:', error)
		toast.error(errorCatch(error))
	}
}
