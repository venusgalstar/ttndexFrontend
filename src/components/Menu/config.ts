import { MenuEntry, menuStatus } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    items: [
      {
        label: t('Exchange'),
        href: 'https://dex.ttndex.com/#/swap',
      },
      {
        label: t('Liquidity'),
        href: 'https://dex.ttndex.com/#/pool',
      },
      
    ],
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
  // {
  //   label: "Defi 2.0 Zap",
  //   icon: "DefiIcon",
  //   href: "/defi",
  // },
  // {
  //   label: t('Prediction (BETA)'),
  //   icon: 'PredictionsIcon',
  //   href: '/prediction',
  // },
  {
    label: t('Lottery'),
    icon: 'TicketIcon',
    href: '/lottery',
  },
  {
    label: t('Referral Program'),
    icon: 'ReferralIcon',
    href: '/referral',
    // status: menuStatus.LIVE
  },
  // {
  //   label: t('Collectibles'),
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  // {
  //   label: t('Team Battle'),
  //   icon: 'TeamBattleIcon',
  //   href: '/competition',
  // },
  // {
  //   label: t('Teams & Profile'),
  //   icon: 'GroupsIcon',
  //   items: [
  //     {
  //       label: t('Leaderboard'),
  //       href: '/teams',
  //     },
  //     {
  //       label: t('Task Center'),
  //       href: '/profile/tasks',
  //     },
  //     {
  //       label: t('Your Profile'),
  //       href: '/profile',
  //     },
  //   ],
  // },
  // {
  //   label: t('Info'),
  //   icon: 'InfoIcon',
  //   items: [
  //     {
  //       label: t('Overview'),
  //       href: 'https://ttndex.info',
  //     },
  //     {
  //       label: t('Tokens'),
  //       href: 'https://ttndex.info/tokens',
  //     },
  //     {
  //       label: t('Pairs'),
  //       href: 'https://ttndex.info/pairs',
  //     },
  //     {
  //       label: t('Accounts'),
  //       href: 'https://ttndex.info/accounts',
  //     },
  //   ],
  // },
  // {
  //   label: t('IFO'),
  //   icon: 'IfoIcon',
  //   href: '/ifo',
  // },
  // {
  //   label: t('More'),
  //   icon: 'MoreIcon',
  //   items: [
  //     // {
  //     //   label: t('Team'),
  //     //   href: 'https://doc.ttndex.com/ttndex/our-team',
  //     // },
  //     // {
  //     //   label: t('Voting'),
  //     //   href: 'https://voting.ttndex.com',
  //     // },
  //     // {
  //     //   label: t('Github'),
  //     //   href: 'https://github.com/Bridgeswap-Dex',
  //     // },
  //     // {
  //     //   label: t('Docs'),
  //     //   href: 'https://docs.ttndex.com',
  //     // },
  //     // {
  //     //   label: t('Blog'),
  //     //   href: 'https://ttndex.medium.com/',
  //     // },
  //     // {
  //     //   label: t('Merch'),
  //     //   href: 'https://ttndex.creator-spring.com/',
  //     // },
  //   ],
  // },
]

export default config
