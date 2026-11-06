'use client'

import Container from '@mui/material/Container'

import CustomBreadcrumbs from '@/components/custom-breadcrumbs'
import { paths } from '@/routes/paths'

import JustificationNewEditForm from '../justification-new-edit-form'

interface Props {
  id: string
}

export default function JustificationEditView({ id }: Props) {
  return (
    <Container maxWidth="md">
      <CustomBreadcrumbs
        heading="Editar justificación"
        links={[
          { name: 'Justificaciones', href: paths.justification.root },
          { name: `Justificación #${id}` }
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <JustificationNewEditForm justificationId={id} />
    </Container>
  )
}