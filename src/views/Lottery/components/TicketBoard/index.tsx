import React, { useContext, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Heading, Text, BaseLayout, Button, Image, Card, Flex, Grid, useModal, ArrowForwardIcon, IconButton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { useAccountTickets, useCurrentLotteryId, useLotteryInfo } from 'hooks/useBuyLottery'
import useBrisBalance from 'hooks/useGetBrisBalance'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { usePriceCakeBusd } from 'state/hooks'
import BuyTicketModal from '../TicketCard/BuyTicketModal'
import ViewTicketsModal from '../TicketCard/ViewTicketsModal'
import CountDownDate from './CountDownDate'
import RewardBracketDetail from '../RewardBracketDetail'

// Local states. These values can be updated
// const drawNumber = 329
// const drawTime = "Feb 20, 2022, 1:27 AM"
// const lotteryPrize = "300, 000"
// const brisAmt = 579
// const userNumTicket = 0
// const timeHours = 16
// const timeMinutes = 45
// const timeSeconds = 27


const Board = styled.div`
    border-radius: 20px;
    width: 95%;
    margin: 0 auto;
    margin-bottom: 10px;
    padding: 20px;
    background-color: #0F0F71;
    background-image: url(/images/decorations/lottery-prize-bg.svg);
    background-position: center;
    ${({ theme }) => theme.mediaQueries.sm} {
        padding: 50px;
        margin-bottom: 15px;
    }
`

const FlexFragment = styled.div`
    display: flex;
`

const DrawTimeDisplay = styled(Flex)`
    justify-content: space-between;

`
const Draw = styled.div`
    display: flex;
    justify-content: space-between;

`
const PrizeDisplay = styled(Flex)`
    flex-direction: column;
    justify-content: center;
    margin: 30px auto;
    text-align: center;
    width: 100%;


    ${({ theme }) => theme.mediaQueries.sm} {
        text-align: left;
        width: 70%;
    }

`
const PrizePot = styled(Flex)`
    justify-content: center;
    flex-direction: column;
    
    ${({ theme }) => theme.mediaQueries.sm} {
        margin-bottom: 0px;
        flex-direction: row;
        justify-content: space-between;

    }
`

const PrizePotDetails = styled.div`
    margin-bottom: 20px;
    margin-right: 0px;
    min-width: 150px;
    ${({ theme }) => theme.mediaQueries.sm} {
        margin-bottom: 0px;
        margin-right: 20px;
    }

`
const CountDownTimer = styled.div`
    text-align: center;
`

const UserTicket = styled.span`
    color: ${({ theme }) => theme.colors.primary};
`
const CountDown = styled(Flex)`
    align-items: flex-start;
    justify-content: center;
`
const Time = styled.div`
    text-align: center;
`
const Value = styled(Flex)`
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.bright};
    background-color: ${({ theme }) => theme.colors.primary};

    ${({ theme }) => theme.mediaQueries.sm} {
        width: 60px;
        height: 60px;
    }
`

const Img = styled.img`
    width: 7px;
    height: 32px;
    margin-top: 7px;
    
    ${({ theme }) => theme.mediaQueries.sm} {
        margin-top: 15px;

    }
`

const TimeLabel = styled(Text)`
    color: ${({ theme }) => theme.colors.text};
    font-size: 10px;
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

const StyledIconButton = styled(IconButton)`
  width: 32px;

  :disabled {
    background: none;

    svg {
      fill: ${({ theme }) => theme.colors.textDisabled};

      path {
        fill: ${({ theme }) => theme.colors.textDisabled};
      }
    }
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

const TicketBoard: React.FC<React.PropsWithChildren<RewardMatchesProps>> = ({
    isHistoricRound,
}) => {
    const { t } = useTranslation()

    const maxBalance = useBrisBalance()

    const [lotteryinfo, setLotteryinfo] = useState({})
    const [accountTickets, setAccountTickets] = useState([])
    const [currentTime, setCurrentTime] = useState(new Date().getTime());

    const [state, setState] = useState<RewardsState>({
        isLoading: true,
        cakeToBurn: BIG_ZERO,
        rewardsLessTreasuryFee: BIG_ZERO,
        rewardsBreakdown: null,
        countWinnersPerBracket: null,
    })

    const lotteryid = useCurrentLotteryId()
    const { onViewLottery } = useLotteryInfo()
    const { onAccountTickets } = useAccountTickets()

    const ttnpPriceUsd = usePriceCakeBusd()

    useEffect(() => {
        (async () => {
            const lottery = await onViewLottery(lotteryid.toString())
            setLotteryinfo(lottery)
        })()
    }, [lotteryid, onViewLottery])

    useEffect(() => {
        (async () => {
            const ticketsArr = await onAccountTickets(lotteryid.toString())
            setAccountTickets(ticketsArr)
        })()
    }, [lotteryid, onAccountTickets])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().getTime())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const timeStamp = new BigNumber(lotteryinfo[2]).times(1000).toNumber();
    const date = `${new Date(timeStamp).toDateString()} ${new Date(timeStamp).toLocaleTimeString()}`
    const [onPresentBuyTicketsModal] = useModal(<BuyTicketModal max={new BigNumber(maxBalance)} lotteryinfo={lotteryinfo} />)
    const [onViewTicketsModal] = useModal(<ViewTicketsModal ticketIds={accountTickets} />)

    useEffect(() => {
        console.log("[PRINCE](lotteryInfo): ", lotteryinfo)
        if (lotteryinfo && Object.keys(lotteryinfo).length > 0) {
            console.log("[PRINCE](lotteryInfo): 1", lotteryinfo)

            const rewardsBreakdown = lotteryinfo[5]
            const amountCollectedInCake = lotteryinfo[11];
            const treasuryFee = lotteryinfo[6];
            const countWinnersPerBracket = lotteryinfo[8];

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
            console.log("[PRINCE](lotteryInfo): 2", lotteryinfo)
            setState({
                isLoading: true,
                cakeToBurn: BIG_ZERO,
                rewardsLessTreasuryFee: BIG_ZERO,
                rewardsBreakdown: null,
                countWinnersPerBracket: null,
            })
        }
    }, [lotteryinfo])

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

    return (
        <Board>
            <DrawTimeDisplay>
                <Text fontSize="20px" color='text'>
                    {t("Next Draw")}
                </Text>
                <Draw>
                    <Text fontSize="20px" color='text'>{`#${lotteryid}`}</Text >
                    <Text m="0px 4px" fontSize="20px" color='text'>|</Text>
                    <Text fontSize="20px" color='text'>{`Draw: ${date}`}</Text>
                </Draw>

            </DrawTimeDisplay>
            <PrizeDisplay>
                <Text color='text' fontSize='22px'>
                    {t("Prize Pot")}
                </Text>
                <PrizePot>
                    <PrizePotDetails>
                        <Heading>
                            {t(`$${getBalanceAmount(lotteryinfo[11]).times(ttnpPriceUsd).toNumber().toLocaleString('en-US', {
                                minimumFractionDigits: 3,
                                maximumFractionDigits: 3,
                            })}`)}
                        </Heading>
                        <Text fontSize='11px' mb="22px" color='textSubtle'>
                            {t(`~${getBalanceAmount(lotteryinfo[11]).toString()} TTNP`)}
                        </Text>
                        <Text color='text' fontSize='22px'>
                            {t("Your Tickets")}
                        </Text>
                        <FlexFragment>
                            <Text mb="22px" fontSize='18px' color='grey'>
                                {t(`You have `)}
                                <UserTicket>{`{${accountTickets.length === undefined ? 0 : accountTickets.length}}`}</UserTicket>
                                {t(` tickets for this round.`)}
                            </Text>
                            <StyledIconButton
                                disabled={accountTickets.length === undefined}
                                onClick={onViewTicketsModal}
                                variant="text"
                                scale="sm"
                                mr="4px"
                            >
                                <ArrowForwardIcon />
                            </StyledIconButton>
                        </FlexFragment>
                        <Button scale="sm" variant="primary" onClick={onPresentBuyTicketsModal}>Buy Tickets</Button>
                    </PrizePotDetails>

                    <CountDownTimer>
                        <Text mb="12px" color='text'>
                            {t("Get Your Tickets Now")}
                        </Text>
                        <CountDown>
                            <CountDownDate seconds={lotteryinfo[2] - (currentTime / 1000)} />

                            {/* <Time>
                                <Value>{timeHours}</Value>
                                <TimeLabel>HOURS</TimeLabel>
                            </Time>
                            <Img src="/images/time-divider.svg" alt="time-divider" />
                            <Time>
                                <Value>{timeMinutes}</Value>
                                <TimeLabel>MINUTES</TimeLabel>
                            </Time>
                            <Img src="/images/time-divider.svg" alt="time-divider" />
                            <Time>
                                <Value>{timeSeconds}</Value>
                                <TimeLabel>SECONDS</TimeLabel>
                            </Time> */}
                        </CountDown>
                    </CountDownTimer>
                </PrizePot>

            </PrizeDisplay>

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
        </Board>
    )
}

export default TicketBoard
