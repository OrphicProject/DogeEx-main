import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { BigNumber } from 'bignumber.js'
import { Input as NumericalInput } from '../CurrencyInputPanel/NumericalInput'

interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
  decimals?: number
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 24px;
  color: ${({ theme }) => theme.colors.text};
  padding: 15px 25px;
  width: 100%;
`

const StyledInput = styled.input<{ error?: boolean; fontSize?: string; align?: string }>`
  color: ${({theme }) => (theme.colors.text)};
  width: 60px;
  position: relative;
  font-weight: 600;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  font-size: 18px;
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.text};
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`

// const StyledInput = styled(Input)`
//   maring-left: -16px;
//   box-shadow: none;
//   width: 60px;
//   border: none;

//   ${({ theme }) => theme.mediaQueries.xs} {
//     width: 80px;
//   }

//   ${({ theme }) => theme.mediaQueries.sm} {
//     width: auto;
//   }
// `

const StyledErrorMessage = styled(Text)`
  position: absolute;
  // bottom: -22px;
  a {
    display: inline;
  }
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
  decimals = 18,
}) => {
  const { t } = useTranslation()
  const isBalanceZero = max === '0' || !max

  const displayBalance = (balance: string) => {
    if (isBalanceZero) {
      return '0'
    }
    const balanceBigNumber = new BigNumber(balance)
    if (balanceBigNumber.gt(0) && balanceBigNumber.lt(0.0001)) {
      return balanceBigNumber.toLocaleString()
    }
    return balanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }

  return (
    <div style={{ position: 'relative' }}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex justifyContent="space-between" padding="6px 0px">
          <Text fontSize="14px" color='textSubtle'>{inputTitle}</Text>
          <Text fontSize="14px" color='textSubtle'>{t('Balance: %balance%', { balance: displayBalance(max) })}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-around">
          <StyledInput
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder="0.0"
            value={value}
          />
          <Button onClick={onSelectMax} scale="sm" variant="text">
            MAX
          </Button>
          <Text fontSize="14px" style={{minWidth:'fit-content'}}>{symbol}</Text>
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="failure" padding="4px 4px">
          {t('No tokens to stake')}
        </StyledErrorMessage>
      )}
    </div>
  )
}

export default ModalInput
