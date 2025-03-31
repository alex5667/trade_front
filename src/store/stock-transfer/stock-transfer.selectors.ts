import { TypeRootState } from '@/store/store'
import { StockTransferResponse } from '@/types/stockTransfer.type'
import { createSelector } from '@reduxjs/toolkit'

export const selectAllStockTransfers = (state: TypeRootState) => state.stockTransferSlice.items

// Фильтрация перемещений по дате
export const selectFilteredStockTransfersByDate = (dateForDay: string) =>
	createSelector([selectAllStockTransfers], (items) =>
		items.filter((item: StockTransferResponse) =>
			item.date === dateForDay
		)
	)

// Фильтрация перемещений по блюду
export const selectFilteredStockTransfersByDish = (dishId: number) =>
	createSelector([selectAllStockTransfers], (items) =>
		items.filter((item: StockTransferResponse) =>
			item.dishId === dishId
		)
	)

// Фильтрация перемещений по складу отправления
export const selectFilteredStockTransfersByFromWarehouse = (warehouseId: number) =>
	createSelector([selectAllStockTransfers], (items) =>
		items.filter((item: StockTransferResponse) =>
			item.fromWarehouseId === warehouseId
		)
	)

// Фильтрация перемещений по складу назначения
export const selectFilteredStockTransfersByToWarehouse = (warehouseId: number) =>
	createSelector([selectAllStockTransfers], (items) =>
		items.filter((item: StockTransferResponse) =>
			item.toWarehouseId === warehouseId
		)
	)

// Получение общего количества перемещений
export const selectTotalTransfers = createSelector(
	[selectAllStockTransfers],
	(items) => items.length
)

// Получение суммарного количества перемещаемых товаров
export const selectTotalQuantity = createSelector(
	[selectAllStockTransfers],
	(items) => items.reduce((sum, item) => sum + item.quantity, 0)
) 