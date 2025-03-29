import { useCreateDishCategoryMutation, useUpdateDishCategoryMutation } from '@/services/dish-category.service'
import { useCreateDishMutation, useUpdateDishMutation } from '@/services/dish.service'
import { useCreateIngredientMutation, useUpdateIngredientMutation } from '@/services/ingredient.service'
import { useCreateInstitutionMutation, useUpdateInstitutionMutation } from '@/services/institution.service'
import { useCreateMealMutation, useUpdateMealMutation } from '@/services/meal.service'
import { useCreateWarehouseMutation, useUpdateWarehouseMutation } from '@/services/warehouse.service'
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

// Маппинг типов для конкретных мутаций
export type FetchQueryDataMap = {
  institution: InstitutionFormState
  meal: MealFormState
  dishCategory: DishCategoryFormState
  dish: DishFormState
  ingredient: IngredientFormState
  warehouse: WarehouseFormState
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

  const updateHook = fetchQueries[fetchFunction][0]
  const createHook = fetchQueries[fetchFunction][1]

  const [updateItem] = updateHook()
  const [createItem] = createHook()

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
      try {
        let updatedData = { ...data }
        if (keyName && value !== undefined && value !== null) {
          updatedData = { ...data, [keyName]: value }
        }

        if (data.id) {
          const item = await updateItem({
            id: data.id,
            data: updatedData as FetchQueryDataMap[typeof fetchFunction],
          }).unwrap()
          if (JSON.stringify(item) !== JSON.stringify(updatedData)) {
            setItem?.((prevItem) => ({ ...prevItem, ...item }))
          }
        } else {
          const item = await createItem(updatedData as FetchQueryDataMap[typeof fetchFunction]).unwrap()
          setItem?.(() => item as T)
        }
      } catch (error) {
        console.error('Ошибка при обновлении/создании:', error)
      }
    }, 500),
    [data, keyName, updateItem, createItem, setItem, fetchFunction]
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