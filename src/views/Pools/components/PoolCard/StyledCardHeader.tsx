import React from 'react'
import { CardHeader, Heading, Text, Flex, Image } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import displayRemainTime from 'utils/utils'

const Wrapper = styled(CardHeader) <{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader: React.FC<{
  earningTokenSymbol: string
  stakingTokenSymbol: string
  isAutoVault?: boolean
  isFinished?: boolean
  isStaking?: boolean
  isLockPool?: boolean
  leftTime?: string
}> = ({ earningTokenSymbol, stakingTokenSymbol, isFinished = false, isAutoVault = false, isStaking = false, isLockPool, leftTime = '0' }) => {
  const { t } = useTranslation()
  const poolImageSrc = isAutoVault
    ? `bris-brisvault.svg`
    : `${earningTokenSymbol}-${stakingTokenSymbol}.svg`.toLocaleLowerCase()
  const isCakePool = earningTokenSymbol === 'TTNP' && stakingTokenSymbol === 'TTNP'
  const background = isStaking ? 'bubblegum' : 'cardHeader'
  // const getHeadingPrefix = () => {
  //   if (isAutoVault) {
  //     // vault
  //     return t('Auto')
  //   }
  //   if (isCakePool) {
  //     // manual cake
  //     return t('Manual')
  //   }
  //   // all other pools
  //   return t('Earn')
  // }

  const getHeadingPrefix = () => {
    if (isLockPool) {
      return t('Lock')
    }
    return t('Flexible')
  }

  const getDetails = () => {
    if (isLockPool) {
      return `LeftTime: ${displayRemainTime(leftTime)}`
    }
    return 'Flexible'
  }

  // const getSubHeading = () => {
  //   if (isAutoVault) {
  //     return t('Automatic restaking')
  //   }
  //   if (isCakePool) {
  //     return t('Earn TTNP, stake TTNP')
  //   }
  //   return t('Stake %symbol%', { symbol: stakingTokenSymbol })
  // }

  const getSubHeading = () => {
    if (isLockPool) {
      return t('Earn TTNP stake TTNP with')
    }
    return t('Earn TTNP stake TTNP with')
  }

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={isFinished ? 'textDisabled' : '#efb126'} scale="lg">
            {`${getHeadingPrefix()} ${earningTokenSymbol}`}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>{getSubHeading()}</Text>
          <Text fontSize="14px" color="#efb126">
            {getDetails()}
          </Text>
        </Flex>
        <Image src={`/images/pools/${poolImageSrc}`} alt={earningTokenSymbol} width={64} height={64} />
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
