import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'DogeEx',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('DogeEX')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('DogeEX')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('DogeEX')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('DogeEX')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('DogeEX')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('DogeEX')}`,
      }      
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('DogeEX')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('DogeEX')}`,
      }
    default:
      return null
  }
}
