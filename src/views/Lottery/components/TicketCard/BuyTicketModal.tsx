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
  const [val, setVal] = useState('1')
  const [pendingTx, setPendingTx] = useState(false)
  const [, setRequestedBuy] = useState(false)
  const [, setRequestedApproveToken] = useState(false)

  const [ticketNumbers, setTicketNumbers] = useState([Math.floor(Math.random() * 1000000)])

  const { t } = useTranslation()

  const allowance = useNewLotteryAllowance()

  const maxNumberTickets = useNewLotteryMaxNumberTickets()
  const lotteryid = useCurrentLotteryId()

  const ttnpBalance = useBrisBalance()

  const fullBalance = useMemo(() => {
    return getBalanceNumber(max)
  }, [max])

  const maxTickets = useMemo(() => {
    return parseInt(new BigNumber(ttnpBalance).div(lotteryinfo[3]).toString(), 10)
  }, [ttnpBalance, lotteryinfo])

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      const value = !Number.isNaN(parseInt(e.currentTarget.value)) && parseInt(e.currentTarget.value) > maxNumberTickets ?
        maxNumberTickets.toString() : e.currentTarget.value;
      setVal(value)
    }
  }

  // const { onMultiBuy } = useMultiBuyLottery()
  // const maxNumber = useMaxNumber()
  const { onBuyTickets } = useBuyTicketsLottery()
  const { onApproveToken } = useApproveTokenLottery()
  const { toastSuccess, toastError } = useToast()

  const handleBuy = useCallback(async (ticketList: number[]) => {
    try {
      setRequestedBuy(true)
      const length = parseInt(val)
      console.log("handleBuy: ticketList", ticketList)
      // @ts-ignore
      // eslint-disable-next-line prefer-spread
      const numbers = Array.apply(null, { length }).map((v, idx) => `1${ticketList[idx].toString()}`)

      console.log("handleBuy: ", numbers)

      const txHash = await onBuyTickets(lotteryid.toString(), numbers)

      // user rejected tx or didn't go thru
      if (txHash) {
        toastSuccess("Buy Tickets Success!", `Successfully purchased ${length} tickets!`)
        setRequestedBuy(false)
      } else {
        toastError("Buy Tickets Error!", `Failed purchased tickets!`)
      }
    } catch (e) {
      toastError("Buy Tickets Error!", `Failed purchased tickets!`)
      console.error(e)
    }
  }, [onBuyTickets, setRequestedBuy, toastSuccess, toastError, val, lotteryid])
  // [onMultiBuy, setRequestedBuy, maxNumber, val]

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
    if (Number(maxTickets) > maxNumberTickets) {
      setVal(maxNumberTickets.toString())
    } else {
      setVal(maxTickets.toString())
    }
  }, [maxTickets, maxNumberTickets])

  const handleBuyTickets = async () => {
    console.log("handleBuyTickets");
    setPendingTx(true)
    await handleBuy(ticketNumbers)
    setPendingTx(false)
    onDismiss()
  }

  const handleApprove = async () => {
    console.log("handleApprove");
    setPendingTx(true)
    await handleApproveToken()
    setPendingTx(false)
  }

  useEffect(() => {
    const valLength = Number.isNaN(parseInt(val)) ? 0 : parseInt(val);
    const fillArray: number[] = [];
    console.log("vvalLength", valLength)
    for (let index = 0; index < Math.max(valLength - ticketNumbers.length, 0); index++) {
      fillArray.push(Math.floor(Math.random() * 1000000))
    }
    const _ticketNumbers = [...ticketNumbers, ...fillArray] // TODO
    setTicketNumbers(_ticketNumbers)
  }, [val])

  const tokenAmountForTickets = useCalculateTotalPriceForBulkTickets(
    lotteryinfo[4],
    lotteryinfo[3],
    Number.isNaN(parseInt(val)) ? 0 : parseInt(val)
  )

  useEffect(() => {
    console.log("ticketNumbers: ", ticketNumbers)
  }, [ticketNumbers])

  return (
    <Modal title={t('Enter amount of tickets to buy')} onDismiss={onDismiss}>
      <TicketInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
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
          {ticketNumbers.length > 0 && Array(Number.isNaN(parseInt(val)) ? 0 : parseInt(val)).fill(0).map((v, idx) =>
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
        {allowance.lt(new BigNumber(parseInt(val)).times(lotteryinfo[3])) ? (
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
              !Number.isInteger(parseInt(val)) ||
              parseInt(val) > Number(maxTickets) ||
              parseInt(val) > maxNumberTickets ||
              parseInt(val) < 1
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
