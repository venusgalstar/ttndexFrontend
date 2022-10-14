import React from 'react'
import { Modal } from '@pancakeswap/uikit'
import { ViewTicketNumberAndGetPrize, ViewWinningNumber } from 'components/TicketInput'
import {
  useViewNumbersAndStatusesForTicketIds
} from 'hooks/useBuyLottery'
import { useTranslation } from 'contexts/Localization'

interface GetPrizesModalProps {
  winningNumber: number,
  ticketIds?: string[],
  lotteryId?: string,
  onDismiss?: () => void
}

const GetPrizesModal: React.FC<GetPrizesModalProps> = ({ winningNumber, ticketIds, lotteryId, onDismiss }) => {
  const { t } = useTranslation()

  const ticketNumbers = useViewNumbersAndStatusesForTicketIds(ticketIds)

  console.log("[PRINCE](ticketNumbers): ", ticketNumbers, ticketIds.length)

  return (
    <Modal title={t('Get Your Prizes!')} onDismiss={onDismiss}>
      <ViewWinningNumber winningNumber={winningNumber} />
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
                index={ticketIds[idx]}
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
