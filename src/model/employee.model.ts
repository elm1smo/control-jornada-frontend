import { BranchModel } from './branch.model'
import { CommuneModel } from './commune.model'
import { ContractTypeModel } from './contract-type.model'
import { CountryModel } from './country.model'
import { GenderModel } from './gender.model'
import { JobSchedulerModel } from './job-scheduler.model'
import { JobTypeModel } from './job-type.model'
import { MaritalStatusModel } from './marital-status.model'

export interface EmployeeModel {
  id: number
  uuid?: string
  code: string
  name: string
  lastName: string
  motherLastName?: string
  address?: string
  email?: string
  phone?: string
  birthDate?: string
  contractDate?: string
  contractEndDate?: string | null
  active?: boolean
  inUse?: boolean

  branch?: BranchModel
  jobScheduler?: JobSchedulerModel
  commune?: Pick<CommuneModel, 'id' | 'name'> // llega recortada dentro del empleado
  country?: CountryModel
  gender?: GenderModel
  maritalStatus?: MaritalStatusModel
  contractType?: ContractTypeModel
  jobType?: JobTypeModel
}

// Lo que se ENVÍA (POST/PUT): cada relación va solo como { id }
export interface EmployeeRequest {
  code: string
  name: string
  lastName: string
  motherLastName?: string
  birthDate?: string
  email?: string
  phone?: string
  address?: string
  contractDate?: string
  contractEndDate?: string | null
  branch?: { id: number }
  jobScheduler?: { id: number }
  commune?: { id: number }
  country?: { id: number }
  gender?: { id: number }
  maritalStatus?: { id: number }
  contractType?: { id: number }
  jobType?: { id: number }
  active?: boolean
}