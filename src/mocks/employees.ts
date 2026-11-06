export interface EmployeeOption {
  id: number
  uuid: string
  code: string
  name: string
  lastName: string
  motherLastName?: string
}

export const mockEmployees: EmployeeOption[] = [
  {
    id: 1,
    uuid: '74125896',
    code: 'EMP001',
    name: 'Pedro',
    lastName: 'Pérez',
    motherLastName: 'García'
  },
  {
    id: 2,
    uuid: '85236941',
    code: 'EMP002',
    name: 'Juan',
    lastName: 'Gutierrez',
    motherLastName: 'Lopez'
  },
  {
    id: 3,
    uuid: '84627931',
    code: 'EMP003',
    name: 'Max',
    lastName: 'Ruiz',
    motherLastName: 'Limaco'
  },
  {
    id: 4,
    uuid: '15936920',
    code: 'EMP004',
    name: 'Sully',
    lastName: 'Arbeloa',
    motherLastName: 'Flores'
  }
]