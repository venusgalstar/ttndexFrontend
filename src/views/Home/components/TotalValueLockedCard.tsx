import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'
import { useFarms } from 'state/hooks'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`

const TotalValueLockedCard = () => {
  const { t } = useTranslation()
  const data = useGetStats()
  // const tvl = data ? data.tvl.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null

  const { data: farmsLP, userDataLoaded } = useFarms();
  const tvl1 = farmsLP.reduce((accum, farm) => {
    const tokenAmount = parseFloat(farm?.tokenAmountTotal);
    const tokenAmountInBusd = tokenAmount * parseFloat(farm?.token?.busdPrice);

    const qTokenAmount = parseFloat(farm?.quoteTokenAmountTotal);
    const qTokenAmountInBusd = qTokenAmount * parseFloat(farm?.quoteToken?.busdPrice);

    const totalDepositedBusd = tokenAmountInBusd + qTokenAmountInBusd;
    if (Number.isNaN(totalDepositedBusd))
      return accum;
    return accum + totalDepositedBusd;
  }, 0);
  const tvl = tvl1.toFixed(3);
  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading color="text" scale="md" mb="24px">
          {t('Total Value Locked (TVL)')}
        </Heading>
        {data ? (
          <>
            <Heading color="text" scale="md">{`$${tvl}`}</Heading>
            <Text color="text">{t('Across all farms and pools')}</Text>
          </>
        ) : (
          <Skeleton height={66} />
        )}
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
