import { useCallback, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useNewLottery, useLottery, useLotteryTicket, useBRIS } from 'hooks/useContract'

import { getNewLotteryAddress } from 'utils/addressHelpers'
import {
  multiClaim,
  claimTickets,
  getMax,
  getLotteryInfo,
  getLotteryId,
  multiBuy,
  buyTickets,
  approveTokens,
  getAccountTickets,
  getMaxNumberTickets,
  viewNumbersAndStatusesForTicketIds,
  getTotalPriceForBulkTickets,
  getViewRewardsForTicketId
} from '../utils/lotteryUtils'

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

export const useGetPrizeLottery = () => {
  const { account } = useWeb3React()
  const lotteryContract = useNewLottery()

  const handleClaim = useCallback(async (lotteryId: string, ticketId: string, brackets: number) => {
    try {
      const txHash = await claimTickets(lotteryContract, lotteryId, ticketId, brackets, account)
      return txHash
    } catch (e) {
      return false
    }
  }, [account, lotteryContract])

  return { onGetPrize: handleClaim }
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

export const useApproveTokenLottery = () => {
  const { account } = useWeb3React()
  const tokenContract = useBRIS()

  const handleApproveToken = useCallback(
    async () => {
      try {
        const txHash = await approveTokens(tokenContract, getNewLotteryAddress(), account)
        return txHash
      } catch (e) {
        return false
      }
    },
    [account, tokenContract],
  )

  return { onApproveToken: handleApproveToken }
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

export const useViewRewardsForTicketId = (lotteryId: string, ticketId: string, brackets: number) => {
  const lotteryContract = useNewLottery()
  const [viewRewardsForTicketId, setViewRewardsForTicketId] = useState()

  const fetchLottery = useCallback(async () => {
    if (brackets < 0 || new BigNumber(lotteryId).lte(0) || new BigNumber(lotteryId).lte(0)) {
      setViewRewardsForTicketId(undefined)
      return
    }

    const viewRewardsForTicketIdNum = await getViewRewardsForTicketId(lotteryContract, lotteryId, ticketId, brackets)
    setViewRewardsForTicketId(viewRewardsForTicketIdNum)
  }, [lotteryContract])

  useEffect(() => {
    if (lotteryContract) {
      fetchLottery()
    }
  }, [lotteryContract, fetchLottery])

  return viewRewardsForTicketId
}

export const useCalculateTotalPriceForBulkTickets = (discountDivisor, priceTicket, numberTickets: number) => {
  const lotteryContract = useNewLottery()
  const [totalPrice, setTotalPrice] = useState(new BigNumber(0))

  const fetchLottery = useCallback(async () => {
    const _totalPrice = await getTotalPriceForBulkTickets(lotteryContract, discountDivisor, priceTicket, numberTickets)
    setTotalPrice(_totalPrice)
  }, [lotteryContract, priceTicket, discountDivisor, numberTickets])

  useEffect(() => {
    if (lotteryContract) {
      fetchLottery()
    }
  }, [lotteryContract, fetchLottery])

  return numberTickets <= 1 ? new BigNumber(priceTicket).times(numberTickets) : totalPrice
}

export const useNewLotteryMaxNumberTickets = () => {
  const lotteryContract = useNewLottery()
  const [maxNumberTickets, setMaxNumberTickets] = useState(0)

  const fetchLottery = useCallback(async () => {
    const maxNumber = await getMaxNumberTickets(lotteryContract)
    setMaxNumberTickets(maxNumber)
  }, [lotteryContract])

  useEffect(() => {
    if (lotteryContract) {
      fetchLottery()
    }
  }, [lotteryContract, fetchLottery])

  return maxNumberTickets
}

export const useViewNumbersAndStatusesForTicketIds = (ticketIds: string[]) => {
  const lotteryContract = useNewLottery()
  const [numbersAndStatusesForTicketIds, setNumbersAndStatusesForTicketIds] = useState([])

  const fetchLottery = useCallback(async () => {
    const numbersAndStatusesForTicketIdsVal = await viewNumbersAndStatusesForTicketIds(lotteryContract, ticketIds)
    setNumbersAndStatusesForTicketIds(numbersAndStatusesForTicketIdsVal)
  }, [lotteryContract])

  useEffect(() => {
    if (lotteryContract) {
      fetchLottery()
    }
  }, [lotteryContract, fetchLottery])

  return numbersAndStatusesForTicketIds
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
