import * as Yup from 'yup'

import { TableHeadItem } from '@/components/table'

export const TABLE_HEAD: TableHeadItem[] = [
  { id: 'id', label: '#', width: 80 },
  { id: 'justificationType', label: 'Tipo', sortable: false },
  { id: 'comments', label: 'Comentarios' },
  { id: 'attachment', label: 'Adjunto', width: 140, sortable: false },
  { id: '', width: 240, align: 'right' }
]

export const JustificationSchema = Yup.object({
  justificationType: Yup.object({
    id: Yup.number()
      .notOneOf([0],'Debes seleccionar un tipo de justificación')
      .required('Debes seleccionar un tipo de justificación')
  }).required(),
  comments: Yup.string().trim().max(200, 'Máximo 200 caracteres').defined(),
  attachment: Yup.string().nullable().defined()
})

export type JustificationFormValues = Yup.InferType<typeof JustificationSchema>

export const JUSTIFICATION_DEFAULT_VALUES: JustificationFormValues = {
  justificationType: { id: 0 },
  comments: '',
  attachment: null
}
