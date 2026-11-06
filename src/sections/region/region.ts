import * as Yup from 'yup'

import { TableHeadItem } from '@/components/table'

export const TABLE_HEAD: TableHeadItem[] = [
  { id: 'id', label: '#', width: 80 },
  { id: 'country', label: 'País', sortable: false },
  { id: 'name', label: 'Región' },
  { id: '', width: 240, align: 'right' }
]

export const RegionSchema = Yup.object({
  country: Yup.object({
    id: Yup.number()
      .notOneOf([0], 'Debes seleccionar un país')
      .required('Debes seleccionar un país')
  }).required(),
  name: Yup.string()
    .trim()
    .required('El nombre es obligatorio')
    .max(100, 'Máximo 100 caracteres')
})

export type RegionFormValues = Yup.InferType<typeof RegionSchema>

export const REGION_DEFAULT_VALUES: RegionFormValues = {
  country: { id: 0 },
  name: ''
}