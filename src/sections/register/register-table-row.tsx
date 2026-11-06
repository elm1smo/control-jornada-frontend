import DeleteIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/EditOutlined'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'

import { ConfirmDialog } from '@/components/custom-dialog'
import { useBoolean } from '@/hooks/use-boolean'
import { RegisterModel } from '@/model'


//para probar con la data en duro de un empleado
import { mockEmployees } from '@/mocks/employees'

interface Props {
  row: RegisterModel
  onEditRow: VoidFunction
  onDeleteRow: VoidFunction
}

export default function RegisterTableRow({
  row,
  onEditRow,
  onDeleteRow
}: Props) {
  const confirm = useBoolean()


//para probar con la data en duro de un empleado
const employee = mockEmployees.find(
(employee) => employee.id === row.employeeId
)

const employeeName = employee
? [employee.name, employee.lastName, employee.motherLastName]
    .filter(Boolean)
    .join(' ')
: `Empleado #${row.employeeId}`

  return (
    <>
      <TableRow hover>
        <TableCell>{employeeName}</TableCell>
        <TableCell>{row.day}</TableCell>
        <TableCell align="center">{row.startOfTheDay?.slice(0, 5) || '-'}</TableCell>
        <TableCell align="center">{row.entry?.slice(0, 5) || '-'}</TableCell>
        <TableCell align="center">{row.exit?.slice(0, 5) || '-'}</TableCell>
        <TableCell align="center">{row.breakTime?.slice(0, 5) || '-'}</TableCell>
        <TableCell align="center">{row.backToWork?.slice(0, 5) || '-'}</TableCell>
        <TableCell align="center">{row.justificationId ?? '-'}</TableCell>

        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title="Editar">
            <IconButton onClick={onEditRow}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar">
            <IconButton color="error" onClick={confirm.onTrue}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Eliminar"
        content={
          <>
            ¿Seguro que quieres eliminar el registro <strong>{row.id}</strong>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse()
              onDeleteRow()
            }}
          >
            Eliminar
          </Button>
        }
      />
    </>
  )
}