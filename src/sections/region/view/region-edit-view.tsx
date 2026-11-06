'use client'

import Container from '@mui/material/Container'

import CustomBreadcrumbs from '@/components/custom-breadcrumbs'
import { paths } from '@/routes/paths'

import RegionNewEditForm from '../region-new-edit-form'

interface Props {
  id: string
}

export default function RegionEditView({ id }: Props) {
  return (
    <Container maxWidth="md">
      <CustomBreadcrumbs
        heading="Editar región"
        links={[
          { name: 'Regiones', href: paths.region.root },
          { name: `Región #${id}` }
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RegionNewEditForm regionId={id} />
    </Container>
  )
}