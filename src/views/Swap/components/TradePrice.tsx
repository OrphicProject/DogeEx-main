import React from 'react'
import { Price } from '@pancakeswap/sdk'
import { Text, AutoRenewIcon, SwitchIcon } from '@pancakeswap/uikit'
import { ArrowWrapper, SwapCallbackError, Wrapper, StyledBalanceMaxMini } from './styleds'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`

  return (
    <Text style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', fontSize: '14px' }}>
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <ArrowWrapper clickable style={{ marginLeft: '10px' }}>
            <SwitchIcon
              width="24px"
              onClick={() => {
                setShowInverted(!showInverted)
              }}
            />
          </ArrowWrapper>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
