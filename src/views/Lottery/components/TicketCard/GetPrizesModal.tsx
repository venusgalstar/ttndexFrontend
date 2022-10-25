import React from 'react'
import { Modal } from '@pancakeswap/uikit'
import { ViewTicketNumberAndGetPrize, ViewWinningNumber } from 'components/TicketInput'
import { useViewNumbersAndStatusesForTicketIds } from 'hooks/useBuyLottery'
import { useTranslation } from 'contexts/Localization'

const getRewardBracketByNumber = (ticketNumber: string, finalNumber: string): number => {
  // console.log("[PRINCE](getRewardBracketByNumber): ", ticketNumber, finalNumber)
  // Winning numbers are evaluated right-to-left in the smart contract, so we reverse their order for validation here:
  // i.e. '1123456' should be evaluated as '6543211'
  const ticketNumAsArray = ticketNumber.split('').reverse()
  const winningNumsAsArray = finalNumber.split('').reverse()
  const matchingNumbers = []

  // The number at index 6 in all tickets is 1 and will always match, so finish at index 5
  for (let index = 0; index < winningNumsAsArray.length - 1; index++) {
    if (ticketNumAsArray[index] !== winningNumsAsArray[index]) {
      break
    }
    matchingNumbers.push(ticketNumAsArray[index])
  }

  // Reward brackets refer to indexes, 0 = 1 match, 5 = 6 matches. Deduct 1 from matchingNumbers' length to get the reward bracket
  const rewardBracket = matchingNumbers.length - 1
  return rewardBracket
}


interface GetPrizesModalProps {
  winningNumber: string,
  ticketIds?: string[],
  lotteryId?: string,
  onDismiss?: () => void
}

const GetPrizesModal: React.FC<GetPrizesModalProps> = ({ winningNumber, ticketIds, lotteryId, onDismiss }) => {
  const { t } = useTranslation()

  const ticketNumbers = useViewNumbersAndStatusesForTicketIds(ticketIds)

  // console.log("[PRINCE](GetPrizesModal): ", winningNumber, ticketIds, lotteryId, ticketNumbers, ticketIds.length)

  return (
    <Modal title={t('Get Your Prizes!')} onDismiss={onDismiss}>
      <ViewWinningNumber winningNumber={winningNumber ? parseInt(winningNumber) % 1000000 : 0} />
      <div className='input-box' style={{
        justifyContent: "center",
        display: "flex",
        maxHeight: "320px",
        overflowY: "auto"
      }}>
        <div>
          {
            ticketNumbers && Object.keys(ticketNumbers).length > 0 && ticketIds.map((v, idx) =>
              <ViewTicketNumberAndGetPrize
                lotteryId={lotteryId}
                ticketId={ticketIds[idx]}
                ticketOwner={ticketNumbers ? !ticketNumbers[1][idx] : false}
                brackets={getRewardBracketByNumber(ticketNumbers[0][idx], winningNumber)}
                ticketNumber={ticketNumbers ? parseInt(ticketNumbers[0][idx]) % 1000000 : 0}
              />
            )
          }
        </div>
      </div>
    </Modal >
  )
}

export default GetPrizesModal
