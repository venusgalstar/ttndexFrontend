import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import Web3 from "web3";
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import { useBankContract, useBankTokenContract } from 'hooks/useContract'
import {
  REFERRAL_PERCENT,
  WITHDRAW_FEE,
  DENOMINATOR,
  DENOMINATOR_PERCENT,
  DECIMALS,
  EPOCH_LENGTH,
  TTNBANK,
  START_TIME,
  RPC_URL,
  MAINNET,
  ADMIN_ACCOUNT,
  REF_PREFIX,
  TREASURY,
  WITHDRAW_TIME
} from "config";

const Tooltip = styled.div`
  bottom: -22px;
  right: 0;
  left: 0;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
  padding-top: 6px;
`;

const httpProvider = new Web3.providers.HttpProvider(RPC_URL)
const web3NoAccount = new Web3(httpProvider)
const isAddress = web3NoAccount.utils.isAddress

const displayRemainTime = (seconds) => {
  if (seconds > 0) {
    // Calculating the days, hours, minutes and seconds left
    const timeDays = Math.floor(seconds / (60 * 60 * 24))
    const timeHours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
    const timeMinutes = Math.floor((seconds % (60 * 60)) / 60)

    if (timeDays > 0) {
      return `${timeDays}D : ${timeHours}H`
    }
    return `${timeHours}H : ${timeMinutes}M`
  }

  return `0H : 0M`
}

const Interface = () => {
  const { account } = useWeb3React()
  const { toastSuccess, toastError, toastWarning } = useToast()
  const isMobile = window.matchMedia("only screen and (max-width: 1000px)").matches;

  const bankContract = useBankContract()
  const bankTokenContract = useBankTokenContract()

  const [refetch, setRefetch] = useState(true);
  const [refLink, setRefLink] = useState(`${REF_PREFIX}0x0000000000000000000000000000000000000000`);

  const [calculate, setCalculator] = useState('1000');
  const [pendingTx, setPendingTx] = useState(false);
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const [depositValue, setDepositValue] = useState('');
  const [withdrawValue, setWithdrawValue] = useState('');
  const [withdrawRequestValue, setWithdrawRequestValue] = useState('');

  const [treasuryAmount, setTreasuryAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [curAPY, setCurAPY] = useState('0')
  const [userBalance, setUserBalance] = useState(0);
  const [userApprovedAmount, setUserApprovedAmount] = useState(0);
  const [userDepositedAmount, setUserDepositedAmount] = useState(0);
  const [referralReward, setReferralReward] = useState(0);
  const [refTotalWithdraw, setRefTotalWithdraw] = useState(0);
  const [nextWithdraw, setNextWithdraw] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [enabledAmount, setEnabledAmount] = useState(0);
  const [curEpoch, setCurEpoch] = useState(0)

  const [remainTime, setRemainTime] = useState(0)
  const [withdrawState, setWithdrawState] = useState(false)

  useEffect(() => {
    setInterval(() => {
      setRefetch((prevRefetch) => {
        return !prevRefetch;
      });
    }, 10000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blockTimestamp = (await web3NoAccount.eth.getBlock('latest')).timestamp;
        const curEpochVal = START_TIME > blockTimestamp ? 0 : Math.floor((blockTimestamp - START_TIME) / EPOCH_LENGTH + 1)
        setCurEpoch(curEpochVal)

        const epoch = curEpochVal > 0 ? curEpochVal : 1
        const closeTime = (START_TIME + (epoch - 1) * EPOCH_LENGTH + WITHDRAW_TIME)

        if (blockTimestamp < closeTime && curEpochVal > 1) {
          setRemainTime(closeTime - blockTimestamp)
          setWithdrawState(true)
        } else {
          setWithdrawState(false)
          const openTime = (START_TIME + epoch * EPOCH_LENGTH)
          setRemainTime(openTime - blockTimestamp)
        }

        const _totalAmount = await bankContract.methods.totalAmount().call();
        setTotalAmount(web3NoAccount.utils.fromWei(_totalAmount, DECIMALS));

        const _treasuryAmount = await bankTokenContract.methods.balanceOf(TREASURY).call();
        setTreasuryAmount(web3NoAccount.utils.fromWei(_treasuryAmount, DECIMALS));

        const epochNumberVal = await bankContract.methods.epochNumber().call();
        const curAPYVal = await bankContract.methods.apy(epochNumberVal).call();
        setCurAPY(curAPYVal)

        if (account) {
          const _refLink = `${REF_PREFIX}${account}`;
          setRefLink(_refLink);
        } else {
          setRefLink(`${REF_PREFIX}0x0000000000000000000000000000000000000000`);
        }

        if (bankContract && account) {

          const _userBalance = await bankTokenContract.methods.balanceOf(account).call();
          setUserBalance(web3NoAccount.utils.fromWei(_userBalance, DECIMALS));

          const _approvedAmount = await bankTokenContract.methods.allowance(account, TTNBANK).call();
          setUserApprovedAmount(web3NoAccount.utils.fromWei(_approvedAmount, DECIMALS));


          const _nextWithdraw = await bankContract.methods.getPendingReward(account).call();
          setNextWithdraw(web3NoAccount.utils.fromWei(_nextWithdraw, DECIMALS))

          const _refEarnedWithdraw = await bankContract.methods.referralRewards(account).call();
          setReferralReward(web3NoAccount.utils.fromWei(_refEarnedWithdraw, DECIMALS));

          const _refTotalWithdraw = await bankContract.methods.referralTotalRewards(account).call();
          setRefTotalWithdraw(web3NoAccount.utils.fromWei(_refTotalWithdraw, DECIMALS));

          const _userInfo = await bankContract.methods.userInfo(account).call();
          // console.log("[PRINCE](userInfo): ", _userInfo)
          setUserInfo(_userInfo)

          const _userDepositedAmount = await bankContract.methods.amount(account, parseInt(_userInfo[3])).call();
          setUserDepositedAmount(web3NoAccount.utils.fromWei(_userDepositedAmount, DECIMALS));

          const _enabledAmount = parseInt(_userInfo[1]) > 0 ? (await bankContract.methods.amount(account, parseInt(_userInfo[1]) - 1).call()) : "0"
          setEnabledAmount(web3NoAccount.utils.fromWei(_enabledAmount, DECIMALS))
        }

        // const owner = await bankContract.methods.owner().call();

        // console.log('Owner: ', owner);
      } catch (error) {
        console.log('fetchData error: ', error);
      }
    };

    fetchData();
  }, [bankContract, bankTokenContract, refetch, account]);

  // buttons

  const ClaimNow = async (e) => {
    try {
      e.preventDefault();
      if (pendingTx) {
        toastWarning("Claim", "Pending...")
        return
      }

      if (nextWithdraw <= 0) {
        toastWarning("Claim", "No Next Rewards!")
        return
      }

      setPendingTx(true)
      if (bankContract && account) {
        //  console.log("success")
        toastWarning("Claim", "Claiming...")
        bankContract.methods.withdraw("0").send({
          from: account,
        }).then((txHash) => {
          // console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = `${txHashString.substring(0, 8)}...${txHashString.substring(txHashString.length - 6)}`
          toastSuccess("Claim Success!", `Claimed Successfully! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          toastError("Claim Error!", `Claim Failed because ${err.message}`);
        });

      } else {
        // console.log("connect wallet");
      }
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  };

  const refWithdraw = async (e) => {
    try {
      e.preventDefault();
      if (pendingTx) {
        toastWarning("Withdraw Referral", "Pending...")
        return
      }

      if (referralReward <= 0) {
        toastWarning("Withdraw Referral", "No Next Referral Rewards!")
        return
      }

      setPendingTx(true)
      if (bankContract && account) {
        //  console.log("success")
        toastWarning("Withdraw Referral", "Referral Rewards withdrawing...")
        await bankContract.methods.withdrawReferral().send({
          from: account,
        }).then((txHash) => {
          // console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = `${txHashString.substring(0, 8)}...${txHashString.substring(txHashString.length - 6)}`
          toastSuccess("Withdraw Referral Success!", `Withdraw Successfully! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          toastError("Withdraw Referral Error!", `Withdraw Failed because ${err.message}`);
        });

      } else {
        // console.log("connect wallet");
      }
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  };

  const deposit = async (e) => {
    try {
      e.preventDefault();
      if (pendingTx) {
        toastWarning("Deposit", "Pending...")
        return
      }

      if (Number.isNaN(parseFloat(depositValue))) {
        toastWarning("Deposit", "Input Deposit Amount!")
        return
      }

      if (parseFloat(depositValue) > userBalance) {
        toastWarning("Deposit", "Deposit amount must be equal or less than your wallet balance!")
        return
      }

      if (parseFloat(depositValue) < 0) {
        toastWarning("Deposit", "Deposit amount must be equal or greater than 0 BUSD!")
        return
      }

      setPendingTx(true)
      if (bankContract && account) {
        // console.log("success")

        toastWarning("Deposit", "Depositing...")
        const _value = web3NoAccount.utils.toWei(depositValue, DECIMALS);
        // console.log("[PRINCE](deposit): ", _value)

        let referrer = window.localStorage.getItem("REFERRAL");
        referrer = isAddress(referrer, MAINNET) ? referrer : ADMIN_ACCOUNT

        await bankContract.methods.deposit(_value, referrer).send({
          from: account
        }).then((txHash) => {
          // console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = `${txHashString.substring(0, 8)}...${txHashString.substring(txHashString.length - 6)}`
          toastSuccess("Deposit Success!", `Deposited Successfully! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          toastError("Deposit Error!", `Deposited Failed because ${err.message}`);
        });
      }
      else {
        // console.log("connect wallet");
      }
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  };

  const unStake = async (e) => {
    try {
      e.preventDefault();
      if (pendingTx) {
        toastWarning("UnStake", "Pending...")
        return
      }

      if (Number.isNaN(parseFloat(withdrawValue))) {
        toastWarning("UnStake", "Input Withdraw Amount!")
        return
      }

      if (parseFloat(withdrawValue) > userDepositedAmount) {
        toastWarning("UnStake", "Withdraw amount must be less than your deposited amount!")
        return
      }

      setPendingTx(true)
      if (bankContract && account) {
        toastWarning("UnStake", "Unstaking...");
        const _withdrawValue = web3NoAccount.utils.toWei(withdrawValue, DECIMALS);
        // console.log("[PRINCE](withdraw): ", _withdrawValue)
        await bankContract.methods.withdraw(_withdrawValue).send({
          from: account,
        }).then((txHash) => {
          // console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = `${txHashString.substring(0, 8)}...${txHashString.substring(txHashString.length - 6)}`
          toastSuccess("UnStake Success!", `UnStaked Successfully! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          toastError("UnStake Error!", `UnStaked Failed because ${err.message}`);
        });
      }
      else {
        // console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  };

  const withdrawRequest = async (e) => {
    try {
      e.preventDefault();
      if (pendingTx) {
        toastWarning("WithdrawRequest", "Pending...")
        return
      }

      if (Number.isNaN(parseFloat(withdrawRequestValue))) {
        toastWarning("WithdrawRequest", "Input Request Amount!")
        return
      }

      setPendingTx(true)
      if (bankContract && account) {
        toastWarning("WithdrawRequest", "Requesting...");
        const _withdrawRequestValue = web3NoAccount.utils.toWei(withdrawRequestValue, DECIMALS);
        // console.log("[PRINCE](withdrawRequest): ", _withdrawRequestValue)
        await bankContract.methods.withdrawRequest(_withdrawRequestValue).send({
          from: account,
        }).then((txHash) => {
          // console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = `${txHashString.substring(0, 8)}...${txHashString.substring(txHashString.length - 6)}`
          toastSuccess("WithdrawRequest Success!", `Requested Successfully! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          toastError("WithdrawRequest Error!", `Requested Failed because ${err.message}`);
        });
      }
      else {
        // console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  };

  const approve = async (e) => {
    try {
      // console.log("[PRINCE](approve): ")
      e.preventDefault();
      if (pendingTx) {
        toastWarning("Approve", "Pending...")
        return
      }

      setPendingTx(true)
      if (bankTokenContract && account) {
        toastWarning("Approve", "Approving...");

        await bankTokenContract.methods.approve(TTNBANK, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").send({
          from: account
        }).then((txHash) => {
          // console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = `${txHashString.substring(0, 8)}...${txHashString.substring(txHashString.length - 6)}`
          toastSuccess("Approve Success!", `Approved Successfully! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          toastError("Approve Error!", `Approved Failed because ${err.message}`);
        });
      } else {
        console.error("connect Wallet");
      }
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  };


  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark">
        <div className="container"
          style={{
            justifyContent: isMobile ? 'space-around' : 'space-between',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
          <div style={{ width: "200px" }} />
        </div>
      </nav>
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <center>
                  <h4 className="subtitle">TREASURY</h4>
                  <h4 className="value-text">{Number(treasuryAmount).toFixed(2)} BUSD</h4>
                </center>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <center>
                  <h4 className="subtitle">CURRENT APY</h4>
                  <h4 className="value-text">{curAPY / DENOMINATOR_PERCENT * 12}%</h4>
                </center>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <center>
                  <h4 className="subtitle">CURRENT EPOCH</h4>
                  <h4 className="value-text">{curEpoch}</h4>
                </center>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <center>
                  <h4 className="subtitle">CLAIM YIELD FEE</h4>
                  <h4 className="value-text">{WITHDRAW_FEE / DENOMINATOR_PERCENT}%</h4>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <div className="card cardDino">
              <div className="card-body">
                <h4 className="subtitle-normal" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <b>BANK</b>
                  <b style={{ color: "rgb(254 222 91)" }}>{Number(totalAmount).toFixed(2)} BUSD</b>
                </h4>
                <hr />
                <table className="table">
                  <tbody>
                    <tr>
                      <td><h5 className="content-text"><b>WALLET</b></h5></td>
                      <td style={{ textAlign: "right", width: "160px" }}><h5 className="value-text">{Number(userBalance).toFixed(2)} BUSD</h5></td>
                    </tr>
                    <tr>
                      <td><h5 className="content-text"><b>DEPOSITED</b></h5></td>
                      <td style={{ textAlign: "right" }}><h5 className="value-text">{Number(userDepositedAmount).toFixed(2)} BUSD</h5></td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          placeholder="100 BUSD"
                          min={0}
                          className="form-control input-box"
                          value={depositValue}
                          step={10}
                          onChange={(e) => setDepositValue(e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button type="button" className="btn btn-primary btn-lg btn-custom" style={{ width: "123px" }}
                          onClick={Number.isNaN(parseFloat(depositValue)) || userApprovedAmount > parseFloat(depositValue) ? deposit : approve}
                          disabled={pendingTx}
                        >
                          {Number.isNaN(parseFloat(depositValue)) || userApprovedAmount > parseFloat(depositValue) ? 'DEPOSIT' : 'APPROVE'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <br />
            <div className="card">
              <div className="card-body">
                <h4 className="subtitle-normal"><b>REFERRAL REWARDS  {REFERRAL_PERCENT / DENOMINATOR_PERCENT}%</b></h4>
                <hr />
                <table className="table">
                  <tbody>
                    <tr>
                      <td><h5 className="content-text">BUSD REWARDS</h5></td>
                      <td style={{ textAlign: "right" }}><h5 className="value-text">{Number(referralReward).toFixed(2)} BUSD</h5></td>
                    </tr>
                    <tr>
                      <td><h5 className="content-text">TOTAL</h5></td>
                      <td style={{ textAlign: "right" }}><h5 className="value-text">{Number(refTotalWithdraw).toFixed(2)} BUSD</h5></td>
                    </tr>
                  </tbody>
                </table>
                <center> <button type="button" className="btn btn-primary btn-lg btn-custom" onClick={refWithdraw} disabled={referralReward <= 0 || pendingTx}>WITHDRAW REWARDS</button> </center>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card cardDino">
              <div className="card-body">
                <h4 className="subtitle-normal"><b>CLAIM REWARDS</b></h4>
                <hr />
                <table className="table">
                  <tbody>
                    <tr>
                      <td><h5 className="content-text">TOTAL</h5></td>
                      <td style={{ textAlign: "right" }}>
                        <h5 className="value-text">
                          {Number(web3NoAccount.utils.fromWei(userInfo && Object.keys(userInfo).length > 0 ? userInfo[5] : "0", DECIMALS)).toFixed(3)} BUSD
                        </h5>
                      </td>
                    </tr>
                    <tr>
                      <td><h5 className="content-text">LAST CLAIM</h5></td>
                      <td style={{ textAlign: "right" }}>
                        <h5 className="value-text">{Number(web3NoAccount.utils.fromWei(userInfo && Object.keys(userInfo).length > 0 ? userInfo[4] : "0", DECIMALS)).toFixed(3)} BUSD</h5>
                      </td>
                    </tr>
                    <tr>
                      <td><h5 className="content-text">ESTIMATED NEXT CLAIM</h5></td>
                      <td style={{ textAlign: "right" }}><h5 className="value-text">{Number(nextWithdraw).toFixed(3)} BUSD</h5></td>
                    </tr>
                  </tbody>
                </table>
                <center>
                  <button type="button" className="btn btn-primary btn-lg btn-custom" onClick={ClaimNow} disabled={pendingTx || nextWithdraw <= 0}>CLAIM</button>
                </center>
              </div>
            </div>
            <br />
            <div className="card">
              <div className="card-body">
                <h4 className="subtitle-normal"><b>REFERRAL LINK</b></h4>
                <hr />
                <form>
                  <div style={{ justifyContent: 'space-between', flexDirection: 'row', display: 'flex' }}>
                    <span className="content-text13">Share your referral link to earn {REFERRAL_PERCENT / DENOMINATOR_PERCENT}%</span>
                    <Tooltip style={{ width: "80px", left: "-15px", marginTop: "-8px", visibility: isTooltipDisplayed ? "visible" : "hidden" }}>Copied!</Tooltip>
                  </div>
                  <input type="text"
                    className="form-control input-box" readOnly
                    style={{ marginTop: "10px", fontSize: "15px" }}
                    value={refLink}
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(refLink)
                        setIsTooltipDisplayed(true);
                        setTimeout(() => {
                          setIsTooltipDisplayed(false);
                        }, 5000);
                      }
                    }} />
                </form>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h4 className="subtitle-normal">
                  <b>WITHDRAW</b>
                </h4>
                <hr />
                <table className="table">
                  <tbody>
                    <tr>
                      <td><h5 className="content-text">{withdrawState ? "Opening..." : "Remain Time:"}</h5></td>
                      <td style={{ textAlign: "right" }}>
                        <h5 className="value-text">
                          {displayRemainTime(remainTime)}
                        </h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h6 className="content-text" style={{ lineHeight: "20px" }}>
                          <b>ENABLE</b><br /><span className="value-text">{Number(enabledAmount).toFixed(2)} BUSD</span>
                        </h6>
                      </td>
                      <td style={{ textAlign: "right", width: "160px" }} >
                        <h6 className="content-text" style={{ lineHeight: "20px" }}>
                          <b>REQUESTED</b><br />
                          <span className="value-text">
                            {Number(web3NoAccount.utils.fromWei(userInfo && Object.keys(userInfo).length > 0 ? userInfo[0] : "0", DECIMALS)).toFixed(2)} BUSD
                          </span>
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          placeholder="100 BUSD"
                          min={0}
                          className="form-control input-box"
                          value={withdrawRequestValue}
                          step={10}
                          onChange={(e) => setWithdrawRequestValue(e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button type="button" className="btn btn-primary btn-lg btn-custom" style={{ width: "123px" }}
                          onClick={withdrawRequest}
                          disabled={pendingTx}
                        >
                          REQUEST
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          placeholder="100 BUSD"
                          min={0}
                          className="form-control input-box"
                          value={withdrawValue}
                          step={10}
                          onChange={(e) => setWithdrawValue(e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button type="button" className="btn btn-primary btn-lg btn-custom" style={{ width: "123px" }}
                          onClick={unStake}
                          disabled={
                            pendingTx ||
                            !withdrawState ||
                            Number.isNaN(withdrawValue) ||
                            parseFloat(withdrawValue) > enabledAmount ||
                            parseFloat(web3NoAccount.utils.fromWei(userInfo && Object.keys(userInfo).length > 0 ? userInfo[0] : "0", DECIMALS))
                          }
                        >
                          WITHDRAW
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header" style={{ border: "none" }}>
                <h3 className="subtitle-normal">RETURN CALCULATOR</h3>
              </div>
              <div className="card-body" style={{ paddingTop: "0.6rem" }}>
                <div className="row">
                  <div className="col-sm-6">
                    <input
                      type="number"
                      placeholder="100 BUSD"
                      className="form-control input-box"
                      value={calculate}
                      step={10}
                      onChange={(e) => setCalculator(e.target.value)}
                    />
                    <br />
                    <p className="content-text18">Amount of returns calculated on the basis of deposit amount.</p>
                  </div>
                  <div className="col-sm-6" style={{ textAlign: "right" }}>
                    <h3 className="subtitle-normal" style={{ fontSize: "16px" }}>ROI</h3>
                    <p className="content-text">
                      DAILY RETURN: <span className="value-text">{Number(calculate * curAPY / DENOMINATOR / 30).toFixed(3)} BUSD</span> <br />
                      WEEKLY RETURN: <span className="value-text">{Number(calculate * curAPY / DENOMINATOR / 4.286).toFixed(3)} BUSD</span>  <br />
                      MONTHLY RETURN: <span className="value-text">{Number(calculate * curAPY / DENOMINATOR).toFixed(3)} BUSD</span>  <br />
                      Anual RETURN: <span className="value-text">{Number(calculate * curAPY / DENOMINATOR * 12).toFixed(3)} BUSD</span> </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>);
}

export default Interface;
