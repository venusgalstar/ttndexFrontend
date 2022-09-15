import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'TTNEX',
  description:
    'The AMM you can trust on the BSC network. Bringing you the true meaning of DeFi. Trade and farm tokens, passively, on our platform.',
  image: 'https://bridgeswap.app/images/hero.svg',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('TTNEX')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('TTNEX')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('TTNEX')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('TTNEX')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('TTNEX')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('TTNEX')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('TTNEX')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('TTNEX')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('TTNEX')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('TTNEX')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('TTNEX')}`,
      }
    default:
      return null
  }
}
