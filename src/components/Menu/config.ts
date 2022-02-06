import { MenuEntry } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Exchange'),
    icon: 'TradeIcon',
    href: '/swap',
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: t('Pools'),
    icon: 'PoolIcon',
    href: '/pools',
  },
  {
    label: t('Info'),
    icon: 'InfoIcon',
    href: '/info',
  },
  {
    label: t('Ecosystem'),
    icon: 'MoreIcon',
    href: 'https://minidoge.finance/',
  },
]

export default config
