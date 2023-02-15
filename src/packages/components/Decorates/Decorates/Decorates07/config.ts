import { PublicConfigClass } from '@/packages/public'
import { chartInitConfig } from '@/settings/designSetting'
import { CreateComponentType } from '@/packages/index.d'
import { Decorates07Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  colors: ['#F5222DFF', '#257159FF'],
  name: '我是标题',
  dataset: '',
  textColor: '#fff',
  lineHeight: 16,
  textSize: 14,
  textSize2: 8,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Decorates07Config.key
  public attr = { ...chartInitConfig, w: 875, h: 39, zIndex: 1 }
  public chartConfig = cloneDeep(Decorates07Config)
  public option = cloneDeep(option)
}
