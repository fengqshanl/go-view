import image from '@/assets/images/chart/charts/pie.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const PieFlockConfig: ConfigType = {
  key: 'PieFlock',
  chartKey: 'VPieFlock',
  conKey: 'VCPieFlock',
  title: '下级各单位参训率饼图',
  category: ChatCategoryEnum.PIE,
  categoryName: ChatCategoryEnumName.PIE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image
}
