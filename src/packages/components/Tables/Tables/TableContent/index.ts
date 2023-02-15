import image from '@/assets/images/chart/tables/tables_content.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const TableContentConfig: ConfigType = {
  key: 'TableContent',
  chartKey: 'VTableContent',
  conKey: 'VCTableContent',
  title: '训练课目列表',
  category: ChatCategoryEnum.TABLE,
  categoryName: ChatCategoryEnumName.TABLE,
  package: PackagesCategoryEnum.TABLES,
  chartFrame: ChartFrameEnum.COMMON,
  image
}
