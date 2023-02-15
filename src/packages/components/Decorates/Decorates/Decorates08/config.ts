import { PublicConfigClass } from '@/packages/public'
import { chartInitConfig } from '@/settings/designSetting'
import { CreateComponentType } from '@/packages/index.d'
import { Decorates08Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  colors: ['#41a887FF', '#25715900', '#BBBBBBFF'],
  dataset: '我是标题',
  lineWidth: 8,
  textColor: '#fff',
  textSize: 14
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Decorates08Config.key
  public attr = { ...chartInitConfig, w: 875, h: 39, zIndex: 1 }
  public chartConfig = cloneDeep(Decorates08Config)
  public option = cloneDeep(option)
}
