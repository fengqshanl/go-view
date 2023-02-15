import image from '@/assets/images/chart/tables/table_scheme.png'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const TableSchemeConfig: ConfigType = {
  key: 'TableScheme',
  chartKey: 'VTableScheme',
  conKey: 'VCTableScheme',
  title: '周计划列表',
  category: ChatCategoryEnum.TABLE,
  categoryName: ChatCategoryEnumName.TABLE,
  package: PackagesCategoryEnum.TABLES,
  chartFrame: ChartFrameEnum.COMMON,
  image
}
