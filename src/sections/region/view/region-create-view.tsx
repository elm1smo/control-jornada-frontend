'use client'

import Container from '@mui/material/Container'

import CustomBreadcrumbs from '@/components/custom-breadcrumbs'
import { paths } from '@/routes/paths'

import RegionNewEditForm from '../region-new-edit-form'

export default function RegionCreateView() {
  return (
    <Container maxWidth="md">
      <CustomBreadcrumbs
        heading="Crear región"
        links={[{ name: 'Regiones', href: paths.region.root },{ name: 'Agregar' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RegionNewEditForm />
    </Container>
  )
}