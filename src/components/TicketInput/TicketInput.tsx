import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Input, InputProps } from '@pancakeswap/uikit'
import useBrisBalance from 'hooks/useGetBrisBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  availableSymbol: string
  value: string
  onSelectMax?: () => void
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
}

interface TokenNumberInputProps extends InputProps {
  index: number
  initTicketNumber: number
  ticketNumbers: any
  setTicketNumbers: any
}

const TicketInput: React.FC<TokenInputProps> = ({ max, symbol, availableSymbol, onChange, onSelectMax, value }) => {
  const { t } = useTranslation()
  const ttnpBalance = useBrisBalance()

  return (
    <>
      <Flex alignItems="center">
        <Input type="number" inputMode="numeric" min="0" onChange={onChange} placeholder="0" value={value} />
        <StyledTokenAdornmentWrapper>
          <StyledSpacer />
          <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
          <StyledSpacer />
          <Button scale="sm" onClick={onSelectMax}>
            {t('Max')}
          </Button>
        </StyledTokenAdornmentWrapper>
      </Flex>
      <StyledMaxText>
        {t('%num% %symbol% Available', { num: getBalanceNumber(new BigNumber(ttnpBalance)).toLocaleString(), symbol: availableSymbol })}
      </StyledMaxText>
    </>
  )
}

export const TicketNumberInput: React.FC<TokenNumberInputProps> = ({ index, initTicketNumber, ticketNumbers, setTicketNumbers }) => {
  const { t } = useTranslation()

  const [val1, setVal1] = useState((Math.floor(initTicketNumber / 100000)).toString())
  const [val2, setVal2] = useState((Math.floor((initTicketNumber % 100000) / 10000)).toString())
  const [val3, setVal3] = useState((Math.floor((initTicketNumber % 10000) / 1000)).toString())
  const [val4, setVal4] = useState((Math.floor((initTicketNumber % 1000) / 100)).toString())
  const [val5, setVal5] = useState((Math.floor((initTicketNumber % 100) / 10)).toString())
  const [val6, setVal6] = useState((initTicketNumber % 10).toString())

  const handleSetManualTicketNumber = () => {
    const val = parseInt(val1) * 100000 + parseInt(val2) * 10000 + parseInt(val3) * 1000 + parseInt(val4) * 100 + parseInt(val5) * 10 + parseInt(val6);
    handleSetTicketNumber(val)
  }

  const handleSetTicketNumber = (ticketNumber: number) => {
    const _ticketNumbers = [...ticketNumbers];
    _ticketNumbers[index] = ticketNumber
    setTicketNumbers(_ticketNumbers);
  }

  const handleSetRandomTicketNumber = () => {
    const randomTicketNumber = Math.floor(Math.random() * 1000000);
    setVal6((randomTicketNumber % 10).toString())
    setVal5((Math.floor((randomTicketNumber % 100) / 10)).toString())
    setVal4((Math.floor((randomTicketNumber % 1000) / 100)).toString())
    setVal3((Math.floor((randomTicketNumber % 10000) / 1000)).toString())
    setVal2((Math.floor((randomTicketNumber % 100000) / 10000)).toString())
    setVal1((Math.floor(randomTicketNumber / 100000)).toString())
    handleSetTicketNumber(randomTicketNumber)
  }

  const onChange1 = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      let value = parseInt(e.currentTarget.value)
      value = Number.isNaN(value) ? 0 : value % 10
      value = value > 10 ? value % 10 : value
      setVal1(value.toString())
    }
  }

  const onChange2 = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      let value = parseInt(e.currentTarget.value)
      value = Number.isNaN(value) ? 0 : value % 10
      value = value > 10 ? value % 10 : value
      setVal2(value.toString())
    }
  }

  const onChange3 = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      let value = parseInt(e.currentTarget.value)
      value = Number.isNaN(value) ? 0 : value % 10
      value = value > 10 ? value % 10 : value
      setVal3(value.toString())
    }
  }

  const onChange4 = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      let value = parseInt(e.currentTarget.value)
      value = Number.isNaN(value) ? 0 : value
      value = value > 10 ? value % 10 : value
      setVal4(value.toString())
    }
  }

  const onChange5 = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      let value = parseInt(e.currentTarget.value)
      value = Number.isNaN(value) ? 0 : value % 10
      value = value > 10 ? value % 10 : value
      setVal5(value.toString())
    }
  }

  const onChange6 = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      let value = parseInt(e.currentTarget.value)
      value = Number.isNaN(value) ? 0 : value % 10
      value = value > 10 ? value % 10 : value
      setVal6(value.toString())
    }
  }

  useEffect(() => {
    handleSetManualTicketNumber()
  }, [val1, val2, val3, val3, val4, val5, val6])

  return (
    <>
      <Flex alignItems="center" padding="10px">
        <StyledMaxText style={{ width: "40px" }}>
          {`#${index + 1}`}
        </StyledMaxText>
        <StyledSpacer />
        <Input type="number" inputMode="numeric" min="0" max="9" onChange={onChange1} placeholder="0"
          value={val1} style={{ width: "45px" }}
        />
        <StyledSpacer />
        <Input type="number" inputMode="numeric" min="0" max="9" onChange={onChange2} placeholder="0"
          value={val2} style={{ width: "45px" }}
        />
        <StyledSpacer />
        <Input type="number" inputMode="numeric" min="0" max="9" onChange={onChange3} placeholder="0"
          value={val3} style={{ width: "45px" }}
        />
        <StyledSpacer />
        <Input type="number" inputMode="numeric" min="0" max="9" onChange={onChange4} placeholder="0"
          value={val4} style={{ width: "45px" }}
        />
        <StyledSpacer />
        <Input type="number" inputMode="numeric" min="0" max="9" onChange={onChange5} placeholder="0"
          value={val5} style={{ width: "45px" }}
        />
        <StyledSpacer />
        <Input type="number" inputMode="numeric" min="0" max="9" onChange={onChange6} placeholder="0"
          value={val6} style={{ width: "45px" }}
        />
        <StyledTokenAdornmentWrapper>
          <StyledSpacer />
          <Button scale="sm" onClick={handleSetRandomTicketNumber}>
            {t('Randomize')}
          </Button>
        </StyledTokenAdornmentWrapper>
      </Flex>
    </>
  )
}

const StyledSpacer = styled.div`
  width: 5px;
`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`

const StyledMaxText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  justify-content: flex-end;
`

const StyledTokenSymbol = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 700;
`

export default TicketInput
