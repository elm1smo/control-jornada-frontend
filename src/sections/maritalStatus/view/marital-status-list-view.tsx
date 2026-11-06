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
import { RouterLink } from '@/routes/components'
import { useRouter } from '@/routes/hooks'
import { paths } from '@/routes/paths'
import { getComparator, includesText, Order } from '@/utils/table-filter'

import { TABLE_HEAD } from '../marital-status'
import MaritalStatusTableRow from '../marital-status-table-row'
import MaritalStatusTableToolbar from '../marital-status-table-toolbar'

import { MaritalStatusModel } from '@/model/marital-status.model';
import { allMaritalStatus, deleteMaritalStatus } from '@/services/rest/maritalStatus/maritalStatus';


export default function MaritalStatusListView() {
  const router = useRouter()
  const table = useTable()
  const { enqueueSnackbar } = useSnackbar()

  const [maritalStatusList, setMaritalStatusList] = useState<MaritalStatusModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const getMaritalStatusList = async () => {
      try {
        const response = await allMaritalStatus()
        setMaritalStatusList(response)
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

    getMaritalStatusList()
  }, [enqueueSnackbar])

  const dataFiltered = applyFilter({
    maritalStatusList,
    searchText,
    order: table.order,
    orderBy: table.orderBy as keyof MaritalStatusModel
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
      await deleteMaritalStatus(id)
      enqueueSnackbar('Estado civil eliminado')
      setMaritalStatusList((prev) => prev.filter((m) => m.id !== id))
      if (dataInPage.length === 1 && table.page > 0) {
        table.onChangePage(null, table.page - 1)
      }
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
    }
  }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Lista de estados civiles"
        links={[
          { name: 'Estados civiles', href: paths.maritalStatus.root },
          { name: 'Lista' }
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.maritalStatus.add}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Agregar
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <MaritalStatusTableToolbar text={searchText} onChangeText={handleSearch} />

        <TableContainer>
          <Table sx={{ minWidth: 720 }}>
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
                  <MaritalStatusTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => router.push(paths.maritalStatus.edit(row.id))}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                  />
                ))}

              {!loading && !dataFiltered.length && (
                <TableNoData colSpan={TABLE_HEAD.length} />
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
  maritalStatusList,
  searchText,
  order,
  orderBy
}: {
  maritalStatusList: MaritalStatusModel[]
  searchText: string
  order: Order
  orderBy: keyof MaritalStatusModel
}) {
  return [...maritalStatusList]
    .filter((m) => !searchText || includesText(m.name, searchText))
    .sort(getComparator<MaritalStatusModel>(order, orderBy))
}