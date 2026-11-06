import { CountryModel } from './country.model'
export interface RegionModel {
  id: number
  name: string
  country: CountryModel
}

export type RegionRequest = Omit<RegionModel, 'id' | 'country'>