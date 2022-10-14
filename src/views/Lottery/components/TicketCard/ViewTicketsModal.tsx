import React from 'react'
import { Modal } from '@pancakeswap/uikit'
import { ViewTicketNumber } from 'components/TicketInput'
import {
  useViewNumbersAndStatusesForTicketIds
} from 'hooks/useBuyLottery'
import { useTranslation } from 'contexts/Localization'

interface ViewTicketsModalProps {
  ticketIds?: string[],
  onDismiss?: () => void
}

const ViewTicketsModal: React.FC<ViewTicketsModalProps> = ({ ticketIds, onDismiss }) => {
  const { t } = useTranslation()

  const ticketNumbers = useViewNumbersAndStatusesForTicketIds(ticketIds)

  console.log("[PRINCE](ticketNumbers): ", ticketNumbers, ticketIds.length)

  return (
    <Modal title={t('Your Ticket Numbers')} onDismiss={onDismiss}>
      <div className='input-box' style={{
        justifyContent: "center",
        display: "flex",
        maxHeight: "185px",
        overflowY: "auto"
      }}>
        <div>
          {
            ticketNumbers && Object.keys(ticketNumbers).length > 0 && ticketIds.map((v, idx) =>
              <ViewTicketNumber
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

export default ViewTicketsModal
