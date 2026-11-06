'use client'

import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useState } from 'react'

import CustomBreadcrumbs from '@/components/custom-breadcrumbs'
import { useSnackbar } from '@/components/snackbar'
import {
  TableHeadCustom,
  TableLoading,
  TableNoData,
  TablePaginationCustom,
  useTable
} from '@/components/table'
import { getErrorMessage } from '@/helpers/API'
import { JustificationModel } from '@/model/justification.model'
import { RouterLink } from '@/routes/components'
import { useRouter } from '@/routes/hooks'
import { paths } from '@/routes/paths'
import { allJustifications, deleteJustification } from '@/services/rest/indexJustification'
import { getComparator, includesText, Order } from '@/utils/table-filter'

import { TABLE_HEAD } from '../justification'
import JustificationTableRow from '../justification-table-row'
import JustificationTableToolbar from '../justification-table-toolbar'

export default function JustificationListView() {
  const router = useRouter()
  const table = useTable()
  const { enqueueSnackbar } = useSnackbar()

  const [justificationList, setJustificationList] = useState<JustificationModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const getJustifications = async () => {
      try {
        const response = await allJustifications() 
        setJustificationList(response)
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

    getJustifications()
  }, [enqueueSnackbar])

  const dataFiltered = applyFilter({
    justificationList,
    searchText,
    order: table.order,
    orderBy: table.orderBy as keyof JustificationModel
  })

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  )

  const handleSearch = (value: string) => {
    table.onResetPage()
    setSearchText(value)
  }

  const handleDeleteRow = async (id: number) => {
    try {
      await deleteJustification(id)
      enqueueSnackbar('Justificación eliminada')
      setJustificationList((prev) =>prev.filter((justification) => justification.id !== id))
      if (dataInPage.length === 1 && table.page > 0) {
        table.onChangePage(null, table.page - 1)
      }
    } catch (error) {
      enqueueSnackbar("Primero elimina todos los registros con esta justificación", { variant: 'error' })
    }
  }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Lista de justificaciones"
        links={[{ name: 'Justificaciones', href: paths.justification.root },{ name: 'Lista' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.justification.add}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Nueva justificación
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <JustificationTableToolbar text={searchText} onChangeText={handleSearch} />

        <TableContainer>
          <Table sx={{ minWidth: 900, tableLayout: 'fixed', '& th': { fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase' } }}>
            <TableHeadCustom
              headLabel={TABLE_HEAD}
              order={table.order}
              orderBy={table.orderBy}
              onSort={table.onSort}
            />

            <TableBody>
              {loading && <TableLoading colSpan={TABLE_HEAD.length} />}

              {!loading &&
                dataInPage.map((row) => (
                  <JustificationTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => router.push(paths.justification.edit(row.id))}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                  />
                ))}

              {!loading && !dataFiltered.length && (
                <TableNoData colSpan={TABLE_HEAD.length} message="Tenemos problemas para mostrar las justificaciones" />
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Container>
  )
}

function applyFilter({
  justificationList,
  searchText,
  order,
  orderBy
}: {
  justificationList: JustificationModel[]
  searchText: string
  order: Order
  orderBy: keyof JustificationModel
}) {
  return [...justificationList]
    .filter(
      (justification) =>
        !searchText || 
        includesText(justification.comments, searchText) ||
        includesText(justification.justificationType.name, searchText)
    )
    .sort(getComparator<JustificationModel>(order, orderBy))
}