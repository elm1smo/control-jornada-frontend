import { JustificationEditView } from '@/sections/justification/view'

export const metadata = {
  title: 'Editar justificación'
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  return <JustificationEditView id={id} />
}
