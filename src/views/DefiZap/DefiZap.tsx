import React from 'react'
import { Heading, Skeleton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'


const ComingSoon = styled.div`
    width: 80%;
    margin: 0 auto;
`


const DefiZap: React.FC = () => {
  const { t } = useTranslation()

    return (
        <ComingSoon>
            <Heading as="h1" scale="xl" color="secondary" mb="24px">
                {t('Coming Soon')}
            </Heading>
            <Skeleton />
        </ComingSoon>
    )
}

export default DefiZap