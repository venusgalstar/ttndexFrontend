export const getReferralsCount = async (referralContract, account) => {
    try {

        const referralsCount = await referralContract.methods.referralsCount(account).call()
        return referralsCount
    } catch (error) {
        console.error(error)
        return 0
        // throw new Error(error?.message)

    }
}

export const getReferralCommissions = async (referralContract, account) => {
    try {
        const referralCommissions = await referralContract.methods.totalReferralCommissions(account).call()
        return referralCommissions
    } catch (error) {
        console.error(error)
        return 0
        // throw new Error(error?.message)
    }
}

export const getPendingCommissions = async (referralContract, account) => {
    try {
        const pendingReferralCommissions = await referralContract.methods.pendingReferralCommissions(account).call()
        return pendingReferralCommissions
    } catch (error) {
        console.error(error)
        return 0
        // throw new Error(error?.message)
    }
}

export const withdrawReferralReward = async (referralContract, account) => {
    try {
        return referralContract.methods
            .withdrawReferralReward()
            .send({ from: account })
            .on('transactionHash', (tx) => {
                return tx.transactionHash
            })
    } catch (err) {
        return console.error(err)
    }
}

export const getMinWithdraw = async (referralContract) => {
    try {
        const minWithdraw = await referralContract.methods.minWithdraw().call()
        return minWithdraw
    } catch (error) {
        console.error(error)
        return 0
        // throw new Error(error?.message)
    }
}
