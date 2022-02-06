import React, { useMemo } from 'react'
import { Trade, TradeType } from '@pancakeswap/sdk'
import { Button, Text, ErrorIcon, ArrowDownIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Field } from 'state/swap/actions'
import { isAddress, shortenAddress } from 'utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'

const Container = styled.div`
  background: #2d3748;
  padding: 5px;
  margin: 5px 0px;
  height: 75px;
  padding: 15px 30px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.input};
`

const LabelRow = styled.div`
  display: flex;
  height: 24px;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  padding: 2px 0px;
`


export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  )
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  return (
    <AutoColumn gap="md">
      <Container>
        <LabelRow>
          <RowBetween>
            <Text fontSize="14px" color="textSubtle">From</Text>
          </RowBetween>
        </LabelRow>
        <RowBetween align="flex-end">
          <RowFixed gap="0px">
            <TruncatedText
              fontSize="16px"
              color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'primary' : 'text'}
            >
              {trade.inputAmount.toSignificant(6)}
            </TruncatedText>
          </RowFixed>
          <RowFixed gap="0px">
            <CurrencyLogo currency={trade.inputAmount.currency} size="24px" />
            <Text fontSize="16px" ml="5px">
              {trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
      </Container>
      <Container margin-top="10px">
        <LabelRow>
          <RowBetween>
            <Text fontSize="14px" color="textSubtle">To</Text>
          </RowBetween>
        </LabelRow>
        <RowBetween align="flex-end">
          <RowFixed gap="0px">
            <TruncatedText
              fontSize="16px"
              color={
                priceImpactSeverity > 2
                  ? 'failure'
                  : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                  ? 'primaryBright'
                  : 'text'
              }
            >
              {trade.outputAmount.toSignificant(6)}
            </TruncatedText>
          </RowFixed>
          <RowFixed gap="0px">
            <CurrencyLogo currency={trade.outputAmount.currency} size="24px" />
            <Text fontSize="16px" ml="5px">
              {trade.outputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
      </Container>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <ErrorIcon mr="8px" />
              <Text bold> Price Updated</Text>
            </RowFixed>
            <Button onClick={onAcceptChanges} scale="sm">Accept</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 4px' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <Text small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
            {`Output is estimated. You will receive at least `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </Text>
        ) : (
          <Text small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </Text>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text color="textSubtle">
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
