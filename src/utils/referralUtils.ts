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
