import { useCallback, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useReferralContract } from 'hooks/useContract'
import { getReferralsCount, getReferralCommissions, getPendingCommissions, withdrawReferralReward, getMinWithdraw } from 'utils/referralUtils'


export const useTotalReferrals = () => {
  const referralContract = useReferralContract()
  const { account } = useWeb3React()
  const [referrals, setReferrals] = useState(0)

  const fetchReferrals = useCallback(async () => {
    const referralsNum = await getReferralsCount(referralContract, account)
    setReferrals(referralsNum)
  }, [account, referralContract])

  useEffect(() => {
    if (referralContract) {
      fetchReferrals()
    }
  }, [referralContract, fetchReferrals])

  return referrals
}

export const useTotalCommissions = () => {
  const referralContract = useReferralContract()
  const { account } = useWeb3React()
  const [commissions, setCommissions] = useState(0)

  const fetchCommissions = useCallback(async () => {
    const commissionsNum = await getReferralCommissions(referralContract, account)
    setCommissions(commissionsNum)
  }, [account, referralContract])

  useEffect(() => {
    if (referralContract) {
      fetchCommissions()
    }
  }, [referralContract, fetchCommissions])

  return commissions
}

export const usePendingCommissions = () => {
  const referralContract = useReferralContract()
  const { account } = useWeb3React()
  const [pendingCommissions, setPendingCommissions] = useState(0)

  const fetchPendingCommissions = useCallback(async () => {
    const pendingCommissionsNum = await getPendingCommissions(referralContract, account)
    setPendingCommissions(pendingCommissionsNum)
  }, [account, referralContract])

  useEffect(() => {
    if (referralContract) {
      fetchPendingCommissions()
    }
  }, [referralContract, fetchPendingCommissions])

  return pendingCommissions
}

export const useMinWithdraw = () => {
  const referralContract = useReferralContract()
  const [minWithdraw, setMinWithdraw] = useState(0)

  const fetchMinWithdraw = useCallback(async () => {
    const minWithdrawNum = await getMinWithdraw(referralContract)
    setMinWithdraw(minWithdrawNum)
  }, [referralContract])

  useEffect(() => {
    if (referralContract) {
      fetchMinWithdraw()
    }
  }, [referralContract, fetchMinWithdraw])

  return minWithdraw
}

export const useWithdrawReferralReward = () => {
  const referralContract = useReferralContract()
  const { account } = useWeb3React()

  const handleWithdrawReferralReward = useCallback(
    async () => {
      try {
        const txHash = await withdrawReferralReward(referralContract, account)
        return txHash
      } catch (e) {
        return false
      }
    },
    [account, referralContract],
  )

  return { onWithdrawReferralReward: handleWithdrawReferralReward }
}
