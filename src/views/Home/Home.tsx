import React, { useCallback, useMemo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link as ReactLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import {
  Heading,
  Text,
  BaseLayout,
  Button,
  Image,
  Card,
  Flex,
  Grid,
  Link,
  useModal,
  Skeleton,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import LotteryCard from 'views/Home/components/LotteryCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPRCard from 'views/Home/components/EarnAPRCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import WinCard from 'views/Home/components/WinCard'
import partners from 'config/constants/partners'
import useBrisBalance from 'hooks/useGetBrisBalance'
import { useCurrentLotteryId, useLotteryInfo } from 'hooks/useBuyLottery'
import BuyTicketModal from 'views/Lottery/components/TicketCard/BuyTicketModal'
import { useFarms, usePools, usePriceCakeBusd } from 'state/hooks'
import { useWeb3React } from '@web3-react/core'
import { getFarmApr } from 'utils/apr'
import { Farm } from 'state/types'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/CardActionsContainer'
import useFarmsWithApr from 'hooks/useFarmsWithApr'
import Apr from '../Farms/components/FarmTable/Apr'
import ComingSoon from './components/ComingSoon'

const Hero = styled.div`
  align-items: center;
  border-radius: 20px;
  background-image: linear-gradient(245.94deg, rgba(8, 8, 56, 0.2) -63.8%, rgba(17, 17, 139, 0.2) 73.44%);
  backdrop-filter: blur(20px);
  background-repeat: no-repeat;
  background-position: top center;
  max-width: 98%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding: 0px 30px;
  padding-top: 16px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-position: left center, right center;
    max-width: 90%;
    padding: 0px 120px;
    padding-top: 116px;
    height: 265px;
    padding-top: 0;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 24px;
  grid-gap: 24px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 6;
    }
  }
`

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 24px;
  grid-gap: 24px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 4;
    }
  }
`
const AdsCards = styled(BaseLayout)`
  align-items: stretch;
  margin-bottom: 24px;
  grid-gap: 24px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-left: 50px;
    margin-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 4;
    }
  }
`

const BridgeBoard = styled.div`
  align-items: center;
  box-shadow: 3px 7px 5px 7px #121254;
  border-radius: 20px;
  background: #09092b;
  max-width: 98%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding: 10px 30px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 90%;
    padding: 20px 40px;
  }
`
const FeatBtn = styled(Button)`
  color: ${({ theme }) => theme.colors.bright};
  border-color: ${({ theme }) => theme.colors.bright};
  margin: 20px 0px;
`

const FeatsGrid = styled(BaseLayout)`
  width: 100%;
  align-items: start;
  & > div {
    grid-column: span 6;
  }
`

const PerformersFlex = styled(Flex)`
  width: 100%;
  padding: 12px;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    justify-content: flex-start;
  }
`

const Performer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
`
const TopSymbol = styled(Flex)`
  align-items: center;
  justify-content: flex-start;
`
const TopAPR = styled(Flex)`
  margin-top: 12px;
`

const StatsValue = styled(Flex)`
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
`

const BridgeLottery = styled(Flex)`
  background-image: url(/images/decorations/bg-design.svg);
  background-repeat: no-repeat;
  background-position: top center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  border-radius: 12px;
  text-align: center;
  padding: 30px 0px;
  margin: 12px;
`

const StatsFigures = styled.div`
  width: 100%;
`
const Performers = styled(Grid)`
  width: 100%;
  grid-column-gap: 16px;
  grid-row-gap: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: column;
  }
`
const Partners = styled(Grid)`
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 15px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 18px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 21px;
  }
`
const Partner = styled.div`
  background: #18186b;
  height: auto;
  width: 75px;
  border-radius: 5px;
  ${({ theme }) => theme.mediaQueries.sm} {
    height: 25px;
    width: 82px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    height: 30px;
    width: 95px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    height: 38px;
    width: 100px;
  }
`

const LearnMoreBtn = styled.a`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bright};
  padding: 12px 10px;
  border-radius: 9px;
  margin-top: 12px;
  margin-bottom: 12px;
`

const LoadingTopPerformers = styled.div`
  width: 90%;
  height: 80px;
`

const Title = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaQueries.xs} {
    flex-flow: column-reverse;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-flow: wrap;
  }
`

const AuditCard: React.FC = () => {
  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "end" }}>
      <div
        style={{
          padding: '16px',
          display: 'flex',
          backgroundColor: '#333376',
          borderRadius: '8px',
          color: 'white',
          height: 'fit-content',
          width: 'fit-content',
        }}
      >
        <img src="images/symbols/certik.png" alt="certik-brand" style={{ width: '32px', height: 'fit-content' }} />
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '8px' }}>
          <div style={{ textAlign: 'left', fontSize: '12px', marginBottom: '4px' }}>
            AUDITED BY
            <img src="images/symbols/check-shield.png" alt="audit-check" width="16px" style={{ paddingLeft: '4px' }} />
          </div>
          <a href="http://audits.finance/" style={{ fontSize: '14px' }}>
            AUDITS.FINANCE
          </a>
        </div>
      </div>
    </div>
  )
}

const Home: React.FC = () => {
  const { t } = useTranslation()
  const { data: farms } = useFarms();
  const cakePrice = usePriceCakeBusd();
  const farmsWitApr = useFarmsWithApr();

  const [lotteryinfo, setLotteryinfo] = useState({})
  const lotteryid = useCurrentLotteryId()
  const { onViewLottery } = useLotteryInfo()

  useEffect(() => {
    (async () => {
      const lottery = await onViewLottery(lotteryid.toString())
      setLotteryinfo(lottery)
    })()
  }, [lotteryid, onViewLottery])

  const maxBalance = useBrisBalance()
  const [onPresentBuyTicketsModal] = useModal(<BuyTicketModal max={new BigNumber(maxBalance)} lotteryinfo={lotteryinfo} />)
  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)
        const apr = getFarmApr(new BigNumber(farm.poolWeight), cakePrice, totalLiquidity);

        return { ...farm, apr, liquidity: totalLiquidity }
      })

      return farmsToDisplayWithAPR
    },
    [cakePrice],
  );

  const farmsMemoized = useMemo(() => {
    let farmsStaked = [];
    farmsStaked = farmsList(farms);
    return farmsStaked;
  }, [farmsList, farms])

  return (
    <Page>
      <Hero>
        <AuditCard />
        <Heading as="h1" scale="xl" mb="24px" color="blue">
          {t('Bridging Defi on Web 3.0')}
        </Heading>
        <Text color="white">
          {t(
            'TTNDEX is bridging Defi on Web 3.0 from traditional finance in a decentralized manner to create a fair global economy that is sustainable, accessible, and community-driven DAO.',
          )}
        </Text>
        {/* <Button variant="primary" style={{margin: "20px 0px"}}>Learn more</Button> */}
        <LearnMoreBtn
          href="https://doc.ttndex.com/ttndex/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Learn more
        </LearnMoreBtn>
      </Hero>
      <div>
        <ComingSoon />
        <BridgeBoard>
          <Heading as="h3" mb="24px" color="primary">
            {t('A suite of Features Powering TTNDEX')}
          </Heading>
          <FeatsGrid>
            <Card p="15px">
              <Heading as="h5" mb="10px" color="text">
                {t('Trade')}
              </Heading>
              <Text small fontSize="12px" color="text">
                {t('Instantly swap crypto tokens: NO registration or account needed.')}
              </Text>
              <FeatBtn variant="secondary" scale="sm">
                <Link external href="https://dex.ttndex.com/#/swap" color="text">
                  Enter exchange
                </Link>
              </FeatBtn>
            </Card>

            <Card p="15px">
              <Heading as="h5" mb="10px" color="text">
                {t('Liquidity')}
              </Heading>
              <Text small fontSize="12px" color="text">
                {t('Add liquidity to receive LP tokens: NO registration or account needed.')}
              </Text>
              <FeatBtn variant="secondary" scale="sm">
                <Link external href="https://dex.ttndex.com/#/pool" color="text">
                  Add liquidity
                </Link>
              </FeatBtn>
            </Card>

            <Card p="15px">
              <Heading as="h5" mb="10px" color="text">
                {t('Farms')}
              </Heading>
              <Text fontSize="12px" color="text">
                {t('Provide liqudity to earn yield.')}
              </Text>
              <FeatBtn variant="secondary" scale="sm">
                <Link href="/farms" color="text">
                  Enter farms
                </Link>
              </FeatBtn>
            </Card>

            <Card p="15px">
              <Heading as="h3" mb="12px" color="text">
                {t('Pools')}
              </Heading>
              <Text small fontSize="12px" color="text">
                {t('Stake tokens, earn passive inome with crypto.')}
              </Text>
              <FeatBtn variant="secondary" scale="sm">
                <ReactLink to="/pools" color="text">
                  Enter pools
                </ReactLink>
              </FeatBtn>
            </Card>

            {/* <Card p="15px">
              <Heading as="h5" mb="10px" color="text">
                {t('Defi 2.0 Zap')}
              </Heading>
              <Text small fontSize="12px" color="text">
                {t('Swap LPs to receive discounted TTNP tokens.')}
              </Text>
              <FeatBtn variant="secondary" scale="sm">
                <ReactLink to="/defi" color="text">
                  Swap now
                </ReactLink>
              </FeatBtn>
            </Card> */}

            <Card p="15px">
              <Heading as="h5" mb="10px" color="text">
                {t('Lottery')}
              </Heading>
              <Text small fontSize="12px" color="text">
                {t('Provably fair, on-chain game. WIN BIG!!!')}
              </Text>
              <FeatBtn variant="secondary" scale="sm">
                <ReactLink to="/lottery">Play now</ReactLink>
              </FeatBtn>
            </Card>

            <Card p="15px" style={{ background: 'linear-gradient(155.08deg, #FA00FF -35.34%, #17D2FB 134.08%)' }}>
              <Heading as="h5" mb="10px" color="text">
                {t('Referral Program')}
              </Heading>
              <Text small fontSize="12px" color="text">
                {t('Share your referral link, invite your fiend and earn 10% of their yields FOREVER!')}
              </Text>
              <Button as={ReactLink} to="/referral" variant="primary" scale="sm" style={{ margin: '20px 0px' }}>
                Invite friends
              </Button>
            </Card>
          </FeatsGrid>
        </BridgeBoard>

        {/* <BridgeBoard> */}
          {/* <Heading as="h5" mb="10px" color="text">
            {t('Top performers')}
          </Heading> */}
          {/* <Performers>
            {
              farmsWitApr.map((f, i) => (
                <Card p="4px" style={{borderRadius:"8px"}}>
                  <Text small textAlign="left">
                    {f.lpSymbol}
                  </Text>
                  {
                    f?.apr ? <Text small textAlign="left">{f.apr}</Text>
                    : <Skeleton variant="rect" />
                  }
                  <Text small textAlign="left">
                    APR
                  </Text>
                </Card>
              ))
            }
          </Performers>           */}
          {/* <LoadingTopPerformers>
            <Skeleton variant="rect" />
          </LoadingTopPerformers> */}
          {/* <FeatsGrid>
            <Card style={{width: "100%", border: "20x solid white"}}>
              <Heading as="h5" pt="12px" mb="10px" color="text">
                {t('Pools')}
              </Heading>
              <PerformersFlex>
                <Performer>
                  <TopSymbol>
                    <img width="40px" height="40px" src="/images/farms/ada-bnb.svg" alt="Pools coming soon" />
                    <Text ml="5px" small fontSize='12px' color="text">
                      {t('BNB')}
                    </Text>
                  </TopSymbol>
                  <TopAPR>
                    <Text mr="5px">
                      APR:
                    </Text>
                    <Text color="text">
                      171.7%
                    </Text>
                  </TopAPR>
                </Performer>
              </PerformersFlex>
            </Card>
            <Card style={{width: "100%", border: "20x solid white"}}>
              <Heading as="h5" pt="12px" mb="10px" color="text">
                {t('Farms')}
              </Heading>
              <PerformersFlex>
                <Performer>
                  <TopSymbol>
                    <img width="40px" height="40px" src="/images/farms/alice-bnb.svg" alt="Pools coming soon"/>
                    <Text ml="5px" small fontSize='12px' color="text">
                      {t('ADA-BNB')}
                    </Text>
                  </TopSymbol>
                  <TopAPR>
                    <Text mr="5px">
                      APR:
                    </Text>
                    <Text color="text">
                      171.7%
                    </Text>
                  </TopAPR>
                </Performer>
              </PerformersFlex>
            
            </Card> 
          </FeatsGrid> */}
          {/* <FarmStakingCard /> */}
          {/* <LotteryCard /> */}
        {/* </BridgeBoard> */}
        {/* <CTACards>
          <EarnAPRCard />
          <EarnAssetCard />
          <WinCard />
        </CTACards> */}
        {/* <Cards>
          <CakeStats />
          <TotalValueLockedCard />
        </Cards> */}

        <StatsValue>
          <BridgeLottery>
            <Text fontSize="12px" mb="15px" color="text">
              {t('The TTNDEX Lottery')}
            </Text>
            <Text fontWeight="700" mb="15px" fontSize="42px">
              {t('Win $0')}
            </Text>
            <Text fontSize="12px" mb="22px" color="text">
              {t('in prizes')}
            </Text>
            <Button
              variant="primary"
              scale="sm"
              style={{ margin: '10px auto', width: '200px' }}
              onClick={onPresentBuyTicketsModal}
            >
              Buy tickets
            </Button>
          </BridgeLottery>
          <StatsFigures>
            <CakeStats />
            <TotalValueLockedCard />
          </StatsFigures>
        </StatsValue>

        {/* <BridgeBoard style={{ marginTop: '20px' }}>
          <Heading as="h5" pt="12px" mb="30px" color="blue">
            {t('TTNDEX Partners')}
          </Heading>
          <Partners>
            {partners.map((partner) => (
              <Skeleton />
            ))}
          </Partners>
        </BridgeBoard> */}
      </div>
    </Page>
  )
}

export default Home
