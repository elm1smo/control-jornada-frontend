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
import { RegisterModel } from '@/model'
import { RouterLink } from '@/routes/components'
import { useRouter } from '@/routes/hooks'
import { paths } from '@/routes/paths'
import { allRegisters, deleteRegister } from '@/services/rest/register/registerService'
import { getComparator, includesText, Order } from '@/utils/table-filter'

import { TABLE_HEAD } from '../register'
import RegisterTableRow from '../register-table-row'
import RegisterTableToolbar from '../register-table-toolbar'

export default function RegisterListView() {
  const router = useRouter()
  const table = useTable()
  const { enqueueSnackbar } = useSnackbar()

  const [registerList, setRegisterList] = useState<RegisterModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const getRegisters = async () => {
      try {
        const response = await allRegisters()
        setRegisterList(response)
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

    getRegisters()
  }, [enqueueSnackbar])

  const dataFiltered = applyFilter({
    registerList,
    searchText,
    order: table.order,
    orderBy: table.orderBy as keyof RegisterModel
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
      await deleteRegister(id)
      enqueueSnackbar('Registro eliminado')
      setRegisterList((prev) => prev.filter((register) => register.id !== id))

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
        heading="Lista de registros"
        links={[
          { name: 'Registros', href: paths.register.root },
          { name: 'Lista' }
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.register.add}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Agregar
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <RegisterTableToolbar
          text={searchText}
          onChangeText={handleSearch}
        />

        <TableContainer>
          <Table sx={{ minWidth: 1400 }}>
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
                  <RegisterTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => router.push(paths.register.edit(row.id))}
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
  registerList,
  searchText,
  order,
  orderBy
}: {
  registerList: RegisterModel[]
  searchText: string
  order: Order
  orderBy: keyof RegisterModel
}) {
  return [...registerList]
    .filter(
      (register) =>
        !searchText ||
        includesText(String(register.employeeId), searchText) ||
        includesText(register.day, searchText)
    )
    .sort(getComparator<RegisterModel>(order, orderBy))
}