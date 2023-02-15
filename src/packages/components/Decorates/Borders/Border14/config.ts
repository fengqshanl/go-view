import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { Border14Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  colors: ['#2862b7', '#4b77b7'],
  backgroundColor: '#00000000'
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Border14Config.key
  public chartConfig = cloneDeep(Border14Config)
  public option = cloneDeep(option)
}
