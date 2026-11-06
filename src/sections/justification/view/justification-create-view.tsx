'use client'

import Container from '@mui/material/Container'

import CustomBreadcrumbs from '@/components/custom-breadcrumbs'
import { paths } from '@/routes/paths'

import JustificationNewEditForm from '../justification-new-edit-form'

export default function JustificationCreateView() {
  return (
    <Container maxWidth="md">
      <CustomBreadcrumbs
        heading="Crear justificación"
        links={[{ name: 'Justificaciones', href: paths.justification.root },{ name: 'Agregar' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <JustificationNewEditForm />
    </Container>
  )
}