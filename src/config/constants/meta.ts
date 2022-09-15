import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'TTNEXSwap',
  description:
    'The AMM you can trust on the BSC network. Bringing you the true meaning of DeFi. Trade and farm tokens, passively, on our platform.',
  image: 'https://bridgeswap.app/images/hero.svg',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('TTNEXSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('TTNEXSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('TTNEXSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('TTNEXSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('TTNEXSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('TTNEXSwap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('TTNEXSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('TTNEXSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('TTNEXSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('TTNEXSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('TTNEXSwap')}`,
      }
    default:
      return null
  }
}
