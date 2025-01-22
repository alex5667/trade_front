import { useCreateInstitutionMutation, useUpdateInstitutionMutation } from '@/services/institution.service'
import { debounce } from '@/utils/debounce'
import { MutableRefObject, SetStateAction, useCallback, useEffect, useState } from 'react'

type UseCardInputProps<T> = {
  inputRef: MutableRefObject<HTMLInputElement | null>
  data: T
  setItem?: (value: SetStateAction<T>) => void
  keyName?: keyof T
  defaultValue?: string | number
}

export function useCardInput<T, K extends keyof T>({
  inputRef,
  data,
  setItem,
  keyName,
  defaultValue,
}: UseCardInputProps<T>) {
  const [inputValue, setInputValue] = useState(
    keyName ? (data[keyName] as T[K]) : defaultValue
  )
  const [updateItem] = useUpdateInstitutionMutation()
  const [createItem] = useCreateInstitutionMutation()

  useEffect(() => {
    if (keyName) {
      setInputValue(data[keyName] as T[K])
    }
    if (defaultValue) {
      setInputValue(defaultValue)
    }
  }, [data, keyName, defaultValue])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedInputChange = useCallback(
    debounce(async (value: any) => {
      try {
        let updatedData = { ...data }
        if (keyName) {
          updatedData = { ...data, [keyName]: value }
        }

        if ((data as any)?.id) {
          const item = await updateItem({
            id: (data as any).id,
            data: updatedData,
          }).unwrap()
          if (JSON.stringify(item) !== JSON.stringify(updatedData)) {
            setItem && setItem((prevItem) => ({ ...prevItem, ...item }))
          }
        } else {
          const item = await createItem(updatedData).unwrap()
          setItem && setItem(() => item)
        }
      } catch (error) {
        console.error('Ошибка при обновлении/создании:', error)
      }
    }, 700),
    [data, keyName, updateItem, createItem, inputRef]
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value as T[K]
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
