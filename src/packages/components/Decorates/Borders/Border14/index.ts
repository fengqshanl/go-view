import image from '@/assets/images/chart/decorates/border14.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border14Config: ConfigType = {
  key: 'Border14',
  chartKey: 'VBorder14',
  conKey: 'VCBorder14',
  title: '边框-14',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
