import { useCallback, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useNewLottery, useLottery, useLotteryTicket } from 'hooks/useContract'

import { multiClaim, getMax, getLotteryInfo, getLotteryId, multiBuy, buyTickets, getAccountTickets } from '../utils/lotteryUtils'

export const useMultiClaimLottery = () => {
  const { account } = useWeb3React()
  const lotteryContract = useLottery()
  const lotteryTicketContract = useLotteryTicket()

  const handleClaim = useCallback(async () => {
    try {
      const txHash = await multiClaim(lotteryContract, lotteryTicketContract, account)
      return txHash
    } catch (e) {
      return false
    }
  }, [account, lotteryContract, lotteryTicketContract])

  return { onMultiClaim: handleClaim }
}

export const useMultiBuyLottery = () => {
  const { account } = useWeb3React()
  const lotteryContract = useLottery()

  const handleBuy = useCallback(
    async (amount: string, numbers: Array<any>) => {
      try {
        const txHash = await multiBuy(lotteryContract, amount, numbers, account)
        return txHash
      } catch (e) {
        return false
      }
    },
    [account, lotteryContract],
  )

  return { onMultiBuy: handleBuy }
}

export const useBuyTicketsLottery = () => {
  const { account } = useWeb3React()
  const lotteryContract = useNewLottery()

  const handleBuy = useCallback(
    async (lotteryid: string, numbers: Array<any>) => {
      try {
        const txHash = await buyTickets(lotteryContract, lotteryid, numbers, account)
        return txHash
      } catch (e) {
        return false
      }
    },
    [account, lotteryContract],
  )

  return { onBuyTickets: handleBuy }
}

export const useCurrentLotteryId = () => {
  const lotteryContract = useNewLottery()
  const [lotteryId, setLotteryId] = useState(0)

  const fetchLottery = useCallback(async () => {
    const lotteryid = await getLotteryId(lotteryContract)
    setLotteryId(lotteryid)
  }, [lotteryContract])

  useEffect(() => {
    if (lotteryContract) {
      fetchLottery()
    }
  }, [lotteryContract, fetchLottery])

  return lotteryId
}

export const useLotteryInfo = () => {
  const lotteryContract = useNewLottery()

  const fetchLotteryInfo = useCallback(async (lotteryid: string) => {
    try {
      const lottery = await getLotteryInfo(lotteryContract, lotteryid)
      return lottery
    } catch (e) {
      return false
    }
  }, [lotteryContract])

  return { onViewLottery: fetchLotteryInfo }
}

export const useAccountTickets = () => {
  const lotteryContract = useNewLottery()
  const { account } = useWeb3React()

  const fetchAccountTickets = useCallback(async (lotteryid: string) => {
    try {
      const accountTickets = await getAccountTickets(lotteryContract, account, lotteryid)
      return accountTickets
    } catch (e) {
      return false
    }
  }, [lotteryContract, account])

  return { onAccountTickets: fetchAccountTickets }
}


export const useMaxNumber = () => {
  const [max, setMax] = useState(5)
  const lotteryContract = useLottery()

  const fetchMax = useCallback(async () => {
    const maxNumber = await getMax(lotteryContract)
    setMax(maxNumber)
  }, [lotteryContract])

  useEffect(() => {
    if (lotteryContract) {
      fetchMax()
    }
  }, [lotteryContract, fetchMax])

  return max
}
