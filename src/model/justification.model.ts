export interface JustificationModel {
  id: number
  comments: string | null
  attachment: string | null
  justificationType: JustificationTypeOption
}
export interface JustificationTypeOption {
  id: number
  name: string
}


export type JustificationRequest = Omit<JustificationModel, 'id' | 'justificationType'>
