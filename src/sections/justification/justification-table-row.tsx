import DeleteIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/EditOutlined'
import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { ConfirmDialog } from '@/components/custom-dialog'
import { useBoolean } from '@/hooks/use-boolean'
import { getAttachmentDownload } from '@/utils/attachment-download'
import { JustificationModel } from '@/model/justification.model'

interface Props {
  row: JustificationModel
  onEditRow: VoidFunction
  onDeleteRow: VoidFunction
}

export default function JustificationTableRow({ row, onEditRow, onDeleteRow }: Props) {
  const confirm = useBoolean()

  return (
    <>
      <TableRow hover>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.justificationType.name}</TableCell>
        <TableCell sx={{ overflowWrap: 'anywhere' }}>{row.comments || 'Sin comentarios'}</TableCell>
        <TableCell>
          {row.attachment !== null ? (
            <Button size="small" component="a" {...getAttachmentDownload(row.attachment, `justificacion-${row.id}`)}>
              Descargar
            </Button>
          ) : 'Sin archivo adjunto'}
        </TableCell>
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
            ¿Seguro que quieres eliminar la justificación <strong>#{row.id}</strong>?
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