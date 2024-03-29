import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, Image, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCakeVault } from 'state/hooks'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import displayRemainTime from 'utils/utils'
import BaseCell, { CellContent } from './BaseCell'

interface NameCellProps {
  pool: Pool
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<NameCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { sousId, stakingToken, earningToken, userData, isFinished, isAutoVault, isLockPool } = pool
  const {
    userData: { userShares },
  } = useCakeVault()
  const hasVaultShares = userShares && userShares.gt(0)

  const stakingTokenSymbol = stakingToken.symbol
  const earningTokenSymbol = earningToken.symbol
  const iconFile = `${earningTokenSymbol}-${stakingTokenSymbol}.svg`.toLocaleLowerCase()

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const leftTime = userData?.leftTime ?? '0'
  const isStaked = stakedBalance.gt(0)
  const isManualCakePool = sousId === 0

  const showStakedTag = isAutoVault ? hasVaultShares : isStaked

  let title = `${t('Earn')} ${earningTokenSymbol}`
  let subtitle = `${t('Stake')} ${stakingTokenSymbol}`
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isXs && !isSm)

  // if (isAutoVault) {
  //   title = t('Lock TTNP')
  //   subtitle = t('Automatic restaking')
  // } else if (isManualCakePool) {
  //   title = t('Flexible TTNP')
  //   subtitle = `${t('Earn')} TTNP ${t('Stake').toLocaleLowerCase()} TTNP`
  // }
  if (isLockPool) {
    title = t('Lock TTNP')
    subtitle = `Earn TTNP stake TTNP with`
  } else {
    title = t('Flexible TTNP')
    subtitle = `Earn TTNP stake TTNP with`
  }

  const getDetails = () => {
    if (isLockPool) {
      return `LeftTime: ${displayRemainTime(leftTime)}`
    }
    return 'Flexible'
  }

  return (
    <StyledCell role="cell">
      <Image src={`/images/pools/${iconFile}`} alt="icon" width={40} height={40} mr="8px" />
      <CellContent>
        {showStakedTag && (
          <Text fontSize="12px" bold color={isFinished ? 'failure' : 'textSubtle'} textTransform="uppercase">
            {t('Staked')}
          </Text>
        )}
        <Text bold={!isXs && !isSm} small={isXs || isSm} color="#efb126">
          {title}
        </Text>
        {showSubtitle && (
          <div>
            <Text fontSize="12px" color="textSubtle">
              {subtitle}
            </Text>
            <Text fontSize="12px" color="#efb126">
              {getDetails()}
            </Text>
          </div>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
