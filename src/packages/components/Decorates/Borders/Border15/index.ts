import image from '@/assets/images/chart/decorates/border15.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const Border15Config: ConfigType = {
  key: 'Border15',
  chartKey: 'VBorder15',
  conKey: 'VCBorder15',
  title: '边框-15',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image
}
