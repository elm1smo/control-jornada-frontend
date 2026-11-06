import DeleteIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/EditOutlined'
import PublicIcon from '@mui/icons-material/PublicOutlined'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { ConfirmDialog } from '@/components/custom-dialog'
import { useBoolean } from '@/hooks/use-boolean'
import { RegionModel } from '@/model/region.model'

const COUNTRY_FLAGS: Record<string, string> = {
  Chile: 'cl',
  Perú: 'pe',
  Brasil: 'br',
}

interface Props {
  row: RegionModel
  countryName: string
  onEditRow: VoidFunction
  onDeleteRow: VoidFunction
}

export default function RegionTableRow({ row, countryName, onEditRow, onDeleteRow }: Props) {
  const confirm = useBoolean()
  const countryCode = COUNTRY_FLAGS[countryName]

  return (
    <>
      <TableRow hover>
        <TableCell>{row.id}</TableCell>
        <TableCell>
          <Chip
            label={countryName}
            icon={
              countryCode ? (
                <Box
                  component="img"
                  src={`https://flagcdn.com/${countryCode}.svg`}// tener cuidado con llamar las APIS
                  alt=""
                  sx={{ width: 20, height: 14, objectFit: 'contain' }}
                />
              ) : (
                <PublicIcon />
              )
            }
            size="small"
            sx={{ bgcolor: '#EFF7F4', color: '#377264', borderRadius: 1,
              '& .MuiChip-icon': { color: '#519082', fontSize: 16 } }}
          />
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={onEditRow}
            sx={{ borderColor: '#DCE5F2', color: '#45638B' }}
          >
            Editar
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={confirm.onTrue}
            sx={{ ml: 1, color: '#C43C46' }}
          >
            Eliminar
          </Button>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Eliminar"
        content={
          <>
            ¿Seguro que quieres eliminar la región <strong>{row.name}</strong>?
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