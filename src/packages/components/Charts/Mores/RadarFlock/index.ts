import image from '@/assets/images/chart/charts/radar.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const RadarFlockConfig: ConfigType = {
  key: 'RadarFlock',
  chartKey: 'VRadarFlock',
  conKey: 'VCRadarFlock',
  title: '雷达图组合',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image
}
