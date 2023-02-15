import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { RadarFlockConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'

export const includes = ['legend']

// 雷达形状
export const RadarShapeEnumList = [
  { label: '多边形', value: 'polygon' },
  { label: '圆形', value: 'circle' }
]

export const option = {
  tooltip: {
    show: true
  },
  legend: {
    data: dataJson.seriesData.map(i => i.name)
  },
  dataset: { ...dataJson },
  radar: {
    shape: 'polygon',
    radius: ['0%', '60%'],
    center: ['50%', '55%'],
    splitArea: { show: true },
    splitLine: { show: true },
    axisName: { show: true, color: '#eee', fontSize: 6, overflow: "breakAll" },
    axisLine: { show: true },
    axisTick: { show: true },
    indicator: dataJson.radarIndicator
  },
  series: [
    {
      name: 'radar',
      type: 'radar',
      areaStyle: {
        opacity: 0.1
      },
      data: dataJson.seriesData
    }
  ]
}

export const default_options = {
  tooltip: {
    show: true
  },
  legend: {
    show: false
  },
  dataset: { ...dataJson },
  grid: {
    left: 500,
    right: 500
  },
  radar: {
    shape: 'polygon',
    // radius: ['0%', '60%'],
    center: ['50%', '55%'],
    splitArea: { show: true },
    splitLine: { show: true },
    axisName: { show: true, color: '#eee', fontSize: 10, overflow: "break", width: -10, height: 30, padding: -10 },
    axisLine: { show: true },
    axisTick: { show: true },
    indicator: dataJson.radarIndicator
  },
  series: [
    {
      name: 'radar',
      type: 'radar',
      areaStyle: {
        opacity: 0.1
      },
      data: dataJson.seriesData
    }
  ]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = RadarFlockConfig.key
  public chartConfig = cloneDeep(RadarFlockConfig)
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
}
