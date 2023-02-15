import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { TableSchemeConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'

export const option = {
  header: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  dataset: dataJson,
  index: false,
  columnWidth: [12, 12, 12, 12, 12, 12, 12],
  align: ['center', 'center', 'center', 'center', 'center', 'center', 'center'],
  rowNum: 1,
  headerHeight: 28,
  rowHeight: 28,
  rowSpace: 12,
  carousel: 'single',
  headerBGC: '#5f9b70',
  oddRowBGC: '#5f9b70',
  evenRowBGC: '#5f9b70'
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = TableSchemeConfig.key
  public chartConfig = cloneDeep(TableSchemeConfig)
  public option = cloneDeep(option)
}
