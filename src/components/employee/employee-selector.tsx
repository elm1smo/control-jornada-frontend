
'use client'

import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import {
  mockEmployees,
  EmployeeOption
} from '@/mocks/employees'

interface EmployeeSelectorProps {
  value: number | null
  onChange: (id: number) => void
  error?: boolean
  helperText?: string
}

export default function EmployeeSelector({
  value,
  onChange,
  error,
  helperText
}: EmployeeSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedEmployee = mockEmployees.find(
    employee => employee.id === value
  )

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase()

    return mockEmployees.filter(employee => {
      const fullName = [
        employee.name,
        employee.lastName,
        employee.motherLastName
      ].filter(Boolean).join(' ')

      return [
        fullName,
        employee.uuid,
        employee.code,
        String(employee.id)
      ].some(field => field.toLowerCase().includes(term))
    })
  }, [search])

  const getFullName = (employee: EmployeeOption) =>
    [
      employee.name,
      employee.lastName,
      employee.motherLastName
    ].filter(Boolean).join(' ')

  const handleSelect = (employee: EmployeeOption) => {
    onChange(employee.id)
    setOpen(false)
    setSearch('')
  }

  const handleClose = () => {
    setOpen(false)
    setSearch('')
  }

  return (
    <>
      <Stack spacing={1}>
        <Typography variant="subtitle2">
          Empleado *
        </Typography>

        <Box
          sx={{
            border: '1px solid',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 1,
            p: 2
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            {selectedEmployee ? (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar>
                  <PersonIcon />
                </Avatar>

                <Box>
                  <Typography fontWeight={600}>
                    {getFullName(selectedEmployee)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    UUID: {selectedEmployee.uuid}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography color="text.secondary">
                Ningún empleado seleccionado
              </Typography>
            )}

            <Button
              variant="outlined"
              onClick={() => setOpen(true)}
            >
              {selectedEmployee ? 'Cambiar' : 'Buscar'}
            </Button>
          </Stack>
        </Box>

        {helperText && (
          <Typography
            variant="caption"
            color={error ? 'error.main' : 'text.secondary'}
          >
            {helperText}
          </Typography>
        )}
      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Seleccionar empleado</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              placeholder="Buscar por nombre, UUID o código"
              value={search}
              onChange={event => setSearch(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }
              }}
            />

            <Typography variant="body2" color="text.secondary">
              {filteredEmployees.length} empleado(s) encontrado(s)
            </Typography>

            {filteredEmployees.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No se encontraron empleados.
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredEmployees.map(employee => (
                  <ListItemButton
                    key={employee.id}
                    selected={value === employee.id}
                    onClick={() => handleSelect(employee)}
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={getFullName(employee)}
                      secondary={`UUID: ${employee.uuid} | ${employee.code}`}
                    />

                    {value === employee.id ? (
                      <CheckCircleIcon color="primary" />
                    ) : (
                      <Chip label="Seleccionar" size="small" />
                    )}
                  </ListItemButton>
                ))}
              </List>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
