import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'TTNDEX',
  description:
    'The AMM you can trust on the BSC network. Bringing you the true meaning of DeFi. Trade and farm tokens, passively, on our platform.',
  image: 'https://ttndex.com/images/hero.svg',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('TTNDEX')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('TTNDEX')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('TTNDEX')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('TTNDEX')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('TTNDEX')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('TTNDEX')}`,
      }
    case '/referral':
      return {
        title: `${t('Referral')} | ${t('TTNDEX')}`,
      }
    case '/bank':
      return {
        title: `${t('Bank')} | ${t('TTNDEX')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('TTNDEX')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('TTNDEX')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('TTNDEX')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('TTNDEX')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('TTNDEX')}`,
      }
    default:
      return null
  }
}
