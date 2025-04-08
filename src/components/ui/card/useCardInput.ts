import { useCreateDishAliasMutation, useUpdateDishAliasMutation } from '@/services/dish-alias.service'
import { useCreateDishCategoryMutation, useUpdateDishCategoryMutation } from '@/services/dish-category.service'
import { useCreateDishMutation, useUpdateDishMutation } from '@/services/dish.service'
import { useCreateIngredientMutation, useUpdateIngredientMutation } from '@/services/ingredient.service'
import { useCreateInstitutionMutation, useUpdateInstitutionMutation } from '@/services/institution.service'
import { useCreateMealMutation, useUpdateMealMutation } from '@/services/meal.service'
import { useCreateWarehouseMutation, useUpdateWarehouseMutation } from '@/services/warehouse.service'
import { DishAliasFormState } from '@/types/dish-alias.type'
import { DishFormState } from '@/types/dish.type'
import { DishCategoryFormState } from '@/types/dishCategory.type'
import { IngredientFormState } from '@/types/ingredient.type'
import { InstitutionFormState } from '@/types/institution.type'
import { MealFormState } from '@/types/meal.type'
import { WarehouseFormState } from '@/types/warehouse.type'
import { debounce } from '@/utils/debounce'
import { MutableRefObject, SetStateAction, useCallback, useEffect, useState } from 'react'

const fetchQueries = {
  institution: [useUpdateInstitutionMutation, useCreateInstitutionMutation] as const,
  meal: [useUpdateMealMutation, useCreateMealMutation] as const,
  dishCategory: [useUpdateDishCategoryMutation, useCreateDishCategoryMutation] as const,
  dish: [useUpdateDishMutation, useCreateDishMutation] as const,
  ingredient: [useUpdateIngredientMutation, useCreateIngredientMutation] as const,
  warehouse: [useUpdateWarehouseMutation, useCreateWarehouseMutation] as const,
  dishAlias: [useUpdateDishAliasMutation, useCreateDishAliasMutation] as const,
}

// Определяем возможные ключи для fetchQueries
export type FetchQueryKey = keyof typeof fetchQueries

// Тип данных для каждой сущности
export type FetchQueryData =
  | InstitutionFormState
  | MealFormState
  | DishCategoryFormState
  | IngredientFormState
  | DishFormState
  | WarehouseFormState
  | DishAliasFormState

// Маппинг типов для конкретных мутаций
export type FetchQueryDataMap = {
  institution: InstitutionFormState
  meal: MealFormState
  dishCategory: DishCategoryFormState
  dish: DishFormState
  ingredient: IngredientFormState
  warehouse: WarehouseFormState
  dishAlias: DishAliasFormState
}

// Ограничиваем T типами из FetchQueryData и добавляем необязательное поле id
type UseCardInputProps<T extends FetchQueryData, K extends keyof T> = {
  inputRef: MutableRefObject<HTMLInputElement | null>
  data: T
  fetchFunction: FetchQueryKey
  setItem?: (value: SetStateAction<T>) => void
  keyName?: K
  defaultValue?: string | number
}

export function useCardInput<T extends FetchQueryData, K extends keyof T>({
  inputRef,
  data,
  setItem,
  keyName,
  defaultValue,
  fetchFunction,
}: UseCardInputProps<T, K>) {
  const [inputValue, setInputValue] = useState<T[K] | string | number | undefined>(
    keyName ? (data[keyName] as T[K]) : defaultValue
  )

  // Create mock functions that simulate the RTK Query API
  const mockResponse = { unwrap: () => Promise.resolve({}) }
  const defaultUpdateItem = () => mockResponse
  const defaultCreateItem = () => mockResponse

  // Check if the fetch function exists
  const isValidFetchFunction = !!fetchQueries[fetchFunction]

  // Get hooks safely
  const updateHook = isValidFetchFunction ? fetchQueries[fetchFunction][0] : () => [defaultUpdateItem]
  const createHook = isValidFetchFunction ? fetchQueries[fetchFunction][1] : () => [defaultCreateItem]

  // Use hooks
  const [updateItem] = updateHook()
  const [createItem] = createHook()

  // Log an error if the fetch function doesn't exist
  useEffect(() => {
    if (!isValidFetchFunction) {
      console.error(`Error: No fetch queries defined for "${fetchFunction}"`)
    }
  }, [fetchFunction, isValidFetchFunction])

  useEffect(() => {
    if (keyName && data[keyName] !== undefined && data[keyName] !== null) {
      setInputValue(data[keyName] as T[K])
    } else if (defaultValue !== undefined) {
      setInputValue(defaultValue)
    }
  }, [data, keyName, defaultValue])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedInputChange = useCallback(
    debounce(async (value: T[K] | string | number) => {
      if (!isValidFetchFunction) return

      try {
        let updatedData = { ...data }
        if (keyName && value !== undefined && value !== null) {
          updatedData = { ...data, [keyName]: value }
        }

        if (data.id) {
          const item = await updateItem({
            id: data.id,
            data: updatedData as any,
          }).unwrap()
          if (JSON.stringify(item) !== JSON.stringify(updatedData)) {
            setItem?.((prevItem) => ({ ...prevItem, ...item }))
          }
        } else {
          const item = await createItem(updatedData as any).unwrap()
          setItem?.(() => item as T)
        }
      } catch (error) {
        console.error('Ошибка при обновлении/создании:', error)
      }
    }, 500),
    [data, keyName, updateItem, createItem, setItem, fetchFunction, isValidFetchFunction]
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = (event.target.value || '') as T[K] | string
      setInputValue(newValue)
      debouncedInputChange(newValue)
    },
    [debouncedInputChange]
  )

  return {
    inputValue,
    handleChange,
    setInputValue,
  }
}