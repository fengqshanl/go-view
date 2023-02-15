import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { TableContentConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'

export const option = {
  // 数据
  dataset: dataJson,
  // 表行数
  rowNum: 5,
  // 轮播时间
  waitTime: 2,
  // 数值单位
  unit: '',
  tableRowHeightNumber: 28,
  // 自动排序
  sort: true,
  leftColor: '#5f9b70',
  textColor: '#CDD2F8FF',
  rightColor: '#5f9b70',
  carousel: 'single',
  //序号字体大小
  indexFontSize: 12,
  //左侧数据字体大小
  leftFontSize: 22,
  //右侧数据字体大小
  rightFontSize: 22,
  // 格式化
  valueFormatter(item: { value: any }) { return item.value }
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = TableContentConfig.key
  public chartConfig = cloneDeep(TableContentConfig)
  public option = cloneDeep(option)
}
