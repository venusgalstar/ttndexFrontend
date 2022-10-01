import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal } from '@pancakeswap/uikit'
import { getBalanceNumber, getBalanceAmount } from 'utils/formatBalance'
import { BIG_TEN } from 'utils/bigNumber'
import TicketInput, { TicketNumberInput } from 'components/TicketInput'
import ModalActions from 'components/ModalActions'
import {
  useMultiBuyLottery,
  useMaxNumber,
  useCurrentLotteryId,
  useCalculateTotalPriceForBulkTickets,
  useBuyTicketsLottery,
  useApproveTokenLottery,
  useNewLotteryMaxNumberTickets,
} from 'hooks/useBuyLottery'
import { useNewLotteryAllowance } from 'hooks/useAllowance'
import useBrisBalance from 'hooks/useGetBrisBalance'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'

interface BuyTicketModalProps {
  max: BigNumber,
  lotteryinfo?: any,
  onDismiss?: () => void
}

const BuyTicketModal: React.FC<BuyTicketModalProps> = ({ max, lotteryinfo, onDismiss }) => {
  const [ticketAmount, setTicketAmount] = useState(1)
  const [pendingTx, setPendingTx] = useState(false)
  const [, setRequestedBuy] = useState(false)
  const [, setRequestedApproveToken] = useState(false)

  const [ticketNumbers, setTicketNumbers] = useState([Math.floor(Math.random() * 1000000)])

  const { t } = useTranslation()

  const allowance = useNewLotteryAllowance()

  const maxNumberTickets = useNewLotteryMaxNumberTickets()
  const lotteryid = useCurrentLotteryId()

  const ttnpBalance = useBrisBalance()

  const maxTickets = useMemo(() => {
    return parseInt(new BigNumber(ttnpBalance).div(lotteryinfo[3]).toString(), 10)
  }, [ttnpBalance, lotteryinfo])

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      const value = !Number.isNaN(parseInt(e.currentTarget.value)) && parseInt(e.currentTarget.value) > maxNumberTickets ?
        maxNumberTickets : parseInt(e.currentTarget.value);
      setTicketAmount(value)
    }
  }

  // const { onMultiBuy } = useMultiBuyLottery()
  // const maxNumber = useMaxNumber()
  const { onBuyTickets } = useBuyTicketsLottery()
  const { onApproveToken } = useApproveTokenLottery()
  const { toastSuccess, toastError } = useToast()

  const handleBuy = useCallback(async () => {
    try {
      setRequestedBuy(true)
      // @ts-ignore
      // eslint-disable-next-line prefer-spread
      const numbers = Array.apply(null, { ticketAmount }).map((v, idx) => `${1000000 + ticketNumbers[idx]}`)

      const txHash = await onBuyTickets(lotteryid.toString(), numbers)

      // user rejected tx or didn't go thru
      if (txHash) {
        toastSuccess("Buy Tickets Success!", `Successfully purchased ${ticketAmount} tickets!`)
        setRequestedBuy(false)
      } else {
        toastError("Buy Tickets Error!", `Failed purchased tickets!`)
      }
    } catch (e) {
      toastError("Buy Tickets Error!", `Failed purchased tickets!`)
      console.error(e)
    }
  }, [onBuyTickets, setRequestedBuy, toastSuccess, toastError, ticketAmount, lotteryid])
  // [onMultiBuy, setRequestedBuy, maxNumber, ticketAmount]

  const handleApproveToken = useCallback(async () => {
    try {
      setRequestedApproveToken(true)

      const txHash = await onApproveToken()

      // user rejected tx or didn't go thru
      if (txHash) {
        toastSuccess("Approve TTNP Success!", `Successfully approved TTNP token!`)
        setRequestedApproveToken(false)
      } else {
        toastError("Approve TTNP Error!", `Approve Fail!`)
      }
    } catch (e) {
      toastError("Approve TTNP Error!", `Approve Fail!`)
      console.error(e)
    }
  }, [onApproveToken, setRequestedApproveToken, toastSuccess, toastError])

  const handleSelectMax = useCallback(() => {
    if (maxTickets > maxNumberTickets) {
      setTicketAmount(maxNumberTickets)
    } else {
      setTicketAmount(maxTickets)
    }
  }, [maxTickets, maxNumberTickets])

  const handleBuyTickets = async () => {
    setPendingTx(true)
    await handleBuy()
    setPendingTx(false)
    onDismiss()
  }

  const handleApprove = async () => {
    setPendingTx(true)
    await handleApproveToken()
    setPendingTx(false)
  }

  useEffect(() => {
    const ticketNumbersLength = Number.isNaN(ticketAmount) ? 0 : ticketAmount;
    const fillArray: number[] = [];
    for (let index = 0; index < ticketNumbersLength; index++) {
      fillArray.push(Math.floor(Math.random() * 1000000))
    }
    setTicketNumbers(fillArray)
  }, [ticketAmount])

  const tokenAmountForTickets = useCalculateTotalPriceForBulkTickets(
    lotteryinfo[4],
    lotteryinfo[3],
    Number.isNaN(ticketAmount) ? 0 : ticketAmount
  )

  return (
    <Modal title={t('Enter amount of tickets to buy')} onDismiss={onDismiss}>
      <TicketInput
        value={ticketAmount}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={maxNumberTickets}
        symbol={t('Tickets').toUpperCase()}
        availableSymbol="TTNP"
      />
      <div className='input-box' style={{
        justifyContent: "center",
        display: "flex",
        maxHeight: "185px",
        overflowY: "auto"
      }}>
        <div>
          {ticketNumbers.length > 0 && ticketNumbers.map((v, idx) =>
            <TicketNumberInput
              index={idx}
              ticketNumbers={ticketNumbers}
              setTicketNumbers={setTicketNumbers}
            />)}
        </div>
      </div>
      <div>
        <Tips>{t('1 Ticket = %lotteryPrice% TTNP', { lotteryPrice: getBalanceAmount(lotteryinfo[3]).toString() })}</Tips>
      </div>
      <div>
        <Announce>
          {t('Ticket purchases are final. Your TTNP cannot be returned to you after buying tickets.')}
        </Announce>
        <Final>
          {t('You will spend: %num% TTNP', { num: getBalanceAmount(tokenAmountForTickets).toString() })}
        </Final>
      </div>
      <ModalActions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        {allowance.lt(tokenAmountForTickets) ? (
          <Button
            id="lottery-approve-complete"
            width="100%"
            disabled={pendingTx}
            onClick={handleApprove}
          >
            {pendingTx ? t('Approving') : t('Approve')}
          </Button>
        ) : (
          <Button
            id="lottery-buy-complete"
            width="100%"
            disabled={
              pendingTx ||
              !Number.isInteger(ticketAmount) ||
              tokenAmountForTickets.gt(ttnpBalance) ||
              ticketAmount > maxNumberTickets ||
              ticketAmount < 1
            }
            onClick={handleBuyTickets}
          >
            {pendingTx ? t('Pending Confirmation') : t('Confirm')}
          </Button>
        )}
      </ModalActions>
    </Modal >
  )
}

export default BuyTicketModal

const Tips = styled.div`
  margin-left: 0.4em;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`
const Announce = styled.div`
  margin-top: 1em;
  margin-left: 0.4em;
  color: #ed4b9e;
`
