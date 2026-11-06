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

import { EmployeeModel } from '@/model/employee.model'
import { allEmployees, deleteEmployee } from '@/services/rest/employee/employee'

import { TABLE_HEAD } from '../employee'
import EmployeeTableRow from '../employee-table-row'
import EmployeeTableToolbar from '../employee-table-toolbar'

export default function EmployeeListView() {
  const router = useRouter()
  const table = useTable()
  const { enqueueSnackbar } = useSnackbar()

  const [employeeList, setEmployeeList] = useState<EmployeeModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const getEmployeeList = async () => {
      try {
        const response = await allEmployees()
        setEmployeeList(response)
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

    getEmployeeList()
  }, [enqueueSnackbar])

  const dataFiltered = applyFilter({
    employeeList,
    searchText,
    order: table.order,
    orderBy: table.orderBy as keyof EmployeeModel
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
      await deleteEmployee(id)
      enqueueSnackbar('Empleado eliminado')
      setEmployeeList((prev) => prev.filter((e) => e.id !== id))
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
        heading="Lista de empleados"
        links={[
          { name: 'Empleados', href: paths.employee.root },
          { name: 'Lista' }
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.employee.add}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Agregar
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <EmployeeTableToolbar text={searchText} onChangeText={handleSearch} />

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
                  <EmployeeTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => router.push(paths.employee.edit(row.id))}
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
  employeeList,
  searchText,
  order,
  orderBy
}: {
  employeeList: EmployeeModel[]
  searchText: string
  order: Order
  orderBy: keyof EmployeeModel
}) {
  return [...employeeList]
    .filter(
      (e) =>
        !searchText ||
        includesText(e.name, searchText) ||
        includesText(e.lastName, searchText) ||
        includesText(e.code, searchText)
    )
    .sort(getComparator<EmployeeModel>(order, orderBy))
}
