import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import FormProvider, { RHFTextField } from '@/components/hook-form'
import { useSnackbar } from '@/components/snackbar'
import { getErrorMessage } from '@/helpers/API'
import { RouterLink } from '@/routes/components'
import { useRouter } from '@/routes/hooks'
import { paths } from '@/routes/paths'
import {
  createCommune,
  communeById,
  updateCommune,
  allCities
} from '@/services/rest'

import {
  COMMUNE_DEFAULT_VALUES,
  CommuneFormValues,
  CommuneSchema
} from './commune'
import { CityModel, CommuneRequestCreate, CommuneRequestUpdate } from '@/model'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

interface Props {
  communeId?: string
}

export default function CommuneNewEditForm({ communeId }: Props) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [cities, setCities] = useState<CityModel[]>([]);
  const [loading, setLoading] = useState(!!communeId)
  const [citiesLoading, setCitiesLoading] = useState(true);

  const methods = useForm<CommuneFormValues>({
    resolver: yupResolver(CommuneSchema),
    defaultValues: COMMUNE_DEFAULT_VALUES
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  useEffect(() => {
    if (!communeId) return

    const getCommune = async () => {
      try {
        const commune = await communeById(communeId)

        reset({
          name: commune.name,
          siiCode: commune.siiCode ?? "",
          tgrCode: commune.tgrCode ?? "",
          cityId: commune.cityId
        })
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
        router.push(paths.commune.list)
      } finally {
        setLoading(false)
      }
    }

    getCommune()
  }, [communeId, reset, enqueueSnackbar, router])

  useEffect(() => {
    const getCities = async () => {
      try {
        const citiesData = await allCities()
        setCities(citiesData)
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
        router.push(paths.commune.list)
      } finally {
        setCitiesLoading(false)
      }
    }

    getCities()
  }, [])

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (communeId) {
        const communeToUpdate: CommuneRequestUpdate = {
          ...data,
          id: parseInt(communeId)
        }
        await updateCommune(communeToUpdate)
        enqueueSnackbar('Comuna actualizada')
      }
      else {
        const communeToCreate: CommuneRequestCreate = {
          ...data
        }
        
        await createCommune(communeToCreate)
        enqueueSnackbar('Comuna creada')
      }
      router.push(paths.commune.list)
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
    }
  })

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <RHFTextField name="name" label="Nombre" required />
          <RHFTextField name="siiCode" label="Código SII" />
          <RHFTextField name="tgrCode" label="Código TGR" />
          <Controller
            name="cityId"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                options={cities}
                value={cities.find((city) => city.id === field.value) ?? null}
                getOptionLabel={(city) => city.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, city) => field.onChange(city?.id ?? -1)}
                noOptionsText={"Sin coincidencias"}
                onBlur={field.onBlur}
                disabled={citiesLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ciudad *"
                    placeholder="Selecciona una ciudad"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}
            />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              component={RouterLink}
              href={paths.commune.list}
              variant="outlined"
              color="inherit"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {communeId ? 'Guardar cambios' : 'Crear tipo'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  )
}
