import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { PieFlockConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import dataJson from './data.json'

export const includes = ['legend']

export enum PieTypeEnum {
  NORMAL = '常规图',
  RING = '环形图',
  ROSE = '玫瑰图'
}

export const PieTypeObject = {
  [PieTypeEnum.NORMAL]: 'nomal',
  [PieTypeEnum.RING]: 'ring',
  [PieTypeEnum.ROSE]: 'rose'
}

const option = {
  type: 'ring',
  tooltip: {
    show: true,
    trigger: 'item',
    textStyle: {
      fontSize: 8
    }
  },
  legend: {
    show: true,
    top: 'bottom',
    itemWidth: 20,
    itemHeight: 5,
    textStyle: {
      fontSize: 12
    }
  },
  dataset: { ...dataJson },
  textStyle: {
    fontSize: 12
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '100%'],
      center: ['50%', '50%'],
      roseType: false,
      avoidLabelOverlap: false,
      itemStyle: {
        show: true,
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      }
    }
  ]
}

export const default_options = ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    show: true,
    top: 'bottom',
    bottom: '-2',
    itemWidth: 10,
    itemHeight: 5,
  },
  series: [
    {
      type: 'pie',
      // radius: ['50%', '100%'],
      center: ['50%', '50%'],
      roseType: false,
      avoidLabelOverlap: false,
      itemStyle: {
        show: true,
        borderRadius: 0,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
      ],
      emphasis: {
        label: {
          show: true,
          fontSize: '12',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      }
    }
  ],
})

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = PieFlockConfig.key

  public chartConfig = PieFlockConfig

  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
}
