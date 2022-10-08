import React, { useContext, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Heading, Text, BaseLayout, Button, Image, Card, Flex, Grid } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useAccountTickets, useCurrentLotteryId, useLotteryInfo } from 'hooks/useBuyLottery'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/hooks'
import HistoryButtons from './HistoryButtons'
import RewardBracketDetail from '../RewardBracketDetail'
import RoundSwitcher from '../RoundSwitcher'

// Local states. These values can be updated
// const roundNumValue = 328
// const drawDate = "Feb 21, 2022, 1:31 PM"
// const lotteryPrize = "20,000"
// const TTNPAmt = 99
// const userNumTicket = 0;
// const totalTickets = 658
// const winningNumbers = [1, 2, 3, 4, 5, 6]

const RoundsContainer = styled.div`
    border-radius: 20px;
    background: linear-gradient(245.94deg, rgba(8, 8, 56, 0.2) -63.8%, rgba(17, 17, 139, 0.2) 73.44%);
    padding: 40px;
    margin-bottom: 10px; 
`
const Title = styled(Flex)`
    justify-content: center;
    flex-direction: column;
    text-align: center;
    
    ${({ theme }) => theme.mediaQueries.sm} {
        justify-content: space-between;
        flex-direction: row;
    }
`

const HistoryBtnsContainer = styled.div`

`

const RoundDate = styled(Flex)`

`
const RoundNum = styled.span`
    color: ${({ theme }) => theme.colors.bright};
    background: #15154F;
    border-radius: 50px;
    padding: 1px 6px;
    margin: 0 3px;
`
const PrizeWinningContainer = styled(Flex)`
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    ${({ theme }) => theme.mediaQueries.sm} {
        flex-direction: row;
    }
`
const PrizePot = styled.div`
    background: #15154F;
    border-radius: 30px;
    flex: 0 0 100%;
    width: 100%;
    margin-bottom: 10px;
    padding: 19px;


    ${({ theme }) => theme.mediaQueries.sm} {
        margin-bottom: 0px;
        padding: 40px 20px;
        flex: 0 0 50%;

    }
`
const PotTitle = styled(Flex)`
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;

`
const PotHeading = styled(Text)`
    color: ${({ theme }) => theme.colors.text};
    font-size: 15px;

    ${({ theme }) => theme.mediaQueries.sm} {
        font-size: 20px;

    }
`
const TotalTickets = styled(Text)`
    color: ${({ theme }) => theme.colors.text};
    font-size: 11px;

    ${({ theme }) => theme.mediaQueries.sm} {
        font-size: 14px;
    }

`

const WinningNumber = styled.div`
    padding: 20px;
    background: #15154F;
    border-radius: 30px;
    width: 100%;
    text-align: center;

    ${({ theme }) => theme.mediaQueries.sm} {
        font-size: 14px;
        flex: 0 0 38%;

    }
`
const Prize = styled.div`

`
const UserTicket = styled.span`
    color: ${({ theme }) => theme.colors.primary};
`
const Latest = styled.div`
    background: ${({ theme }) => theme.colors.primary};
    padding: 3px 30px;
    border-radius: 20px;
    text-align: center;
    width: 150px;
    margin-right: auto;
    margin-left: auto;
`
const WinningNumbers = styled(Grid)`
    width: 80%;
    margin: 0 auto;
    grid-template-columns: repeat(3, 60px);
    grid-gap: 12px;
    justify-content: center;
}
`
const DrawNumber = styled.div`
    background: ${({ theme }) => theme.colors.textSubtle};
    border-radius: 50%;
    padding: 20px 0px;
    color: ${({ theme }) => theme.colors.text};

    ${({ theme }) => theme.mediaQueries.sm} {
        padding: 25px 0px;
    }

`

const Wrapper = styled(Flex)`
  width: 100%;
  flex-direction: column;
`

const RewardsInner = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  row-gap: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(4, 1fr);
  }
`

interface RewardsState {
    isLoading: boolean
    cakeToBurn: BigNumber
    rewardsLessTreasuryFee: BigNumber
    rewardsBreakdown: string[]
    countWinnersPerBracket: string[]
}

interface RewardMatchesProps {
    isHistoricRound?: boolean
}

export enum LotteryStatus {
    PENDING = 'pending',
    OPEN = 'open',
    CLOSE = 'close',
    CLAIMABLE = 'claimable',
}

const FinishedRounds = () => {
    const { t } = useTranslation()
    const [selectedLotteryinfo, setSelectedLotteryinfo] = useState({})
    const [currentLotteryinfo, setCurrentLotteryinfo] = useState({})
    const [accountTickets, setAccountTickets] = useState([])
    const [selectedRoundId, setSelectedRoundId] = useState('')
    const [latestRoundId, setLatestRoundId] = useState(null)

    const [state, setState] = useState<RewardsState>({
        isLoading: true,
        cakeToBurn: BIG_ZERO,
        rewardsLessTreasuryFee: BIG_ZERO,
        rewardsBreakdown: null,
        countWinnersPerBracket: null,
    })

    const currentLotteryId = useCurrentLotteryId()
    const { onViewLottery } = useLotteryInfo()
    const { onAccountTickets } = useAccountTickets()

    const ttnpPriceUsd = usePriceCakeBusd()

    useEffect(() => {
        (async () => {
            const lottery = await onViewLottery(currentLotteryId.toString())
            setCurrentLotteryinfo(lottery)
        })()
    }, [currentLotteryId, onViewLottery, setCurrentLotteryinfo])

    useEffect(() => {
        if (currentLotteryinfo && Object.keys(currentLotteryinfo).length > 0) {
            if (currentLotteryinfo[0] === LotteryStatus.CLAIMABLE) {
                setLatestRoundId(currentLotteryId)
                setSelectedRoundId(currentLotteryId.toString())
            } else {
                setLatestRoundId(currentLotteryId - 1)
                setSelectedRoundId((currentLotteryId - 1).toString())
            }
        }
    }, [currentLotteryinfo, setLatestRoundId])

    useEffect(() => {
        (async () => {
            const lottery = await onViewLottery(selectedRoundId)
            setSelectedLotteryinfo(lottery)
        })()
    }, [selectedRoundId, onViewLottery, setSelectedLotteryinfo])

    useEffect(() => {
        console.log("[PRINCE](lotteryInfo FinishedRounds): ", selectedLotteryinfo)
        if (selectedLotteryinfo && Object.keys(selectedLotteryinfo).length > 0) {

            const rewardsBreakdown = selectedLotteryinfo[5]
            const amountCollectedInCake = selectedLotteryinfo[11];
            const treasuryFee = selectedLotteryinfo[6];
            const countWinnersPerBracket = selectedLotteryinfo[8];

            const feeAsPercentage = new BigNumber(treasuryFee).div(100)
            const cakeToBurn = feeAsPercentage.div(100).times(new BigNumber(amountCollectedInCake))
            const amountLessTreasuryFee = new BigNumber(amountCollectedInCake).minus(cakeToBurn)

            setState({
                isLoading: false,
                cakeToBurn,
                rewardsLessTreasuryFee: amountLessTreasuryFee,
                rewardsBreakdown,
                countWinnersPerBracket,
            })
        } else {
            setState({
                isLoading: true,
                cakeToBurn: BIG_ZERO,
                rewardsLessTreasuryFee: BIG_ZERO,
                rewardsBreakdown: null,
                countWinnersPerBracket: null,
            })
        }
    }, [selectedLotteryinfo])

    useEffect(() => {
        (async () => {
            const ticketsArr = await onAccountTickets(selectedLotteryinfo.toString())
            setAccountTickets(ticketsArr)
        })()
    }, [selectedLotteryinfo, onAccountTickets])

    const handleInputChange = (event) => {
        const {
            target: { value },
        } = event
        if (value) {
            setSelectedRoundId(value)
            if (parseInt(value, 10) <= 0) {
                setSelectedRoundId('')
            }
            if (parseInt(value, 10) >= latestRoundId) {
                setSelectedRoundId(latestRoundId.toString())
            }
        } else {
            setSelectedRoundId('')
        }
    }

    const handleArrowButtonPress = (targetRound) => {
        if (targetRound) {
            setSelectedRoundId(targetRound.toString())
        } else {
            // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
            setSelectedRoundId('1')
        }
    }

    const getCakeRewards = (bracket: number) => {
        try {
            if (state.rewardsBreakdown) {
                const shareAsPercentage = new BigNumber(state.rewardsBreakdown[bracket]).div(100)
                return state.rewardsLessTreasuryFee.div(100).times(shareAsPercentage)
            }
            return BIG_ZERO
        } catch (error) {
            console.log("getCakeRewards error", error);
            return BIG_ZERO
        }
    }

    const { isLoading, countWinnersPerBracket, cakeToBurn } = state

    const rewardBrackets = [0, 1, 2, 3, 4, 5]

    let finalNumber: string
    if (selectedLotteryinfo[12] === undefined || selectedLotteryinfo[12] === '0') {
        finalNumber = 'xxxxxx'
    } else {
        finalNumber = selectedLotteryinfo[12].toString()
    }

    const date = `${new Date(Number(selectedLotteryinfo[2]) * 1000).toDateString()} ${new Date(Number(selectedLotteryinfo[2]) * 1000).toLocaleTimeString()}`
    const usingSplit = finalNumber.split('')

    return (
        <RoundsContainer>
            <Title>
                <Heading mb='12px' scale='md' color='text'>Finished Rounds</Heading>
                <HistoryBtnsContainer>
                    <HistoryButtons activeIndex={0} />
                </HistoryBtnsContainer>
            </Title>
            <RoundSwitcher
                isLoading={isLoading}
                selectedRoundId={selectedRoundId}
                mostRecentRound={latestRoundId}
                handleInputChange={handleInputChange}
                handleArrowButtonPress={handleArrowButtonPress}
            />
            <RoundDate>
                <Text mb="22px" fontSize='12px' color='text' padding="5px">
                    {t(` Drawn ${date}`)}
                </Text>
            </RoundDate>
            <PrizeWinningContainer>
                <PrizePot>
                    <PotTitle>
                        <PotHeading>
                            {t(`Prize Pot`)}
                        </PotHeading>
                        <TotalTickets>
                            {t(`Total tickets this round: ${new BigNumber(selectedLotteryinfo[10]).minus(selectedLotteryinfo[9])} tickets`)}
                        </TotalTickets>
                    </PotTitle>
                    <Prize>
                        <Heading>
                            {t(`$${getBalanceAmount(selectedLotteryinfo[11]).times(ttnpPriceUsd).toNumber().toLocaleString('en-US', {
                                minimumFractionDigits: 3,
                                maximumFractionDigits: 3,
                            })}`)}
                        </Heading>
                        <Text fontSize='11px' mb="22px" color='textSubtle'>
                            {t(`~${getBalanceAmount(selectedLotteryinfo[11]).toString()} TTNP`)}
                        </Text>
                    </Prize>
                    <Text color='text'>
                        {t("Your Tickets")}
                    </Text>
                    <Text mb="22px" fontSize='12px' color='text'>
                        {t(`You have `)}
                        <UserTicket>{`{${accountTickets.length === undefined ? 0 : accountTickets.length}}`}</UserTicket>
                        {t(` tickets for this round.`)}
                    </Text>
                    <Wrapper>
                        <Text fontSize="14px" mb="24px">
                            {t('Match the winning number in the same order to share prizes.')}{' '}
                        </Text>
                        <RewardsInner>
                            {rewardBrackets.map((bracketIndex) => (
                                <RewardBracketDetail
                                    key={bracketIndex}
                                    rewardBracket={bracketIndex}
                                    cakeAmount={!isLoading && getCakeRewards(bracketIndex)}
                                    numberWinners={!isLoading && countWinnersPerBracket[bracketIndex]}
                                    // isHistoricRound={isHistoricRound}
                                    isHistoricRound={false}
                                    isLoading={isLoading}
                                />
                            ))}
                            <RewardBracketDetail rewardBracket={0} cakeAmount={cakeToBurn} isBurn isLoading={isLoading} />
                        </RewardsInner>
                    </Wrapper>
                </PrizePot>
                <WinningNumber>
                    <Latest>
                        <Text fontSize='13px' color='text'>{t('LATEST')}</Text>
                    </Latest>
                    <Text m='10px 0px' fontSize='20px' color='text'>{t('Winning Number')}</Text>
                    <WinningNumbers>
                        {
                            usingSplit.map((num: string) => <DrawNumber>{num}</DrawNumber>)
                        }
                    </WinningNumbers>
                </WinningNumber>
            </PrizeWinningContainer>
        </RoundsContainer>
    )
}

export default FinishedRounds
