import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import {
  Modal,
  Text,
  Button,
  Flex,
  ButtonMenu,
  Checkbox,
  BalanceInput,
  HelpIcon,
  ButtonMenuItem,
  useTooltip,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import RoiCalculatorFooter from './RoiCalculatorFooter'
import RoiCard from './RoiCard'
import useRoiCalculatorReducer, { CalculatorMode, EditingCurrency } from './useRoiCalculatorReducer'
import AnimatedArrow from './AnimatedArrow'

interface RoiCalculatorModalProps {
  onDismiss?: () => void
  onBack?: () => void
  earningTokenPrice: number
  apr: number
  displayApr?: string
  linkLabel: string
  linkHref: string
  stakingTokenBalance: BigNumber
  stakingTokenSymbol: string
  stakingTokenPrice: number
  earningTokenSymbol?: string
  multiplier?: string
  autoCompoundFrequency?: number
  performanceFee?: number
  isFarm?: boolean
  initialValue?: string
}

const StyledModal = styled(Modal)`
  width: 445px;
  & > :nth-child(2) {
    padding: 0;
  }
`

const ScrollableContainer = styled.div`
  max-height: 800px;
  overflow-y: auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`

const FullWidthButtonMenu = styled(ButtonMenu)<{ disabled?: boolean }>`
  width: 100%;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 24px;
  & > button {
    width: 100%;
  }

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

const FullWidthButtonMenuItem = styled(ButtonMenuItem)`
  color: white;
  margin-bottom: 0px;
  padding-top: 0px;

  &:after {
    content: none;
  }
`

const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  onDismiss,
  onBack,
  earningTokenPrice,
  apr,
  displayApr,
  linkLabel,
  linkHref,
  stakingTokenBalance,
  stakingTokenSymbol,
  stakingTokenPrice,
  multiplier,
  initialValue,
  earningTokenSymbol,
  autoCompoundFrequency = 0,
  performanceFee = 0,
  isFarm = false,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const balanceInputRef = useRef<HTMLInputElement | null>(null)

  const {
    state,
    setPrincipalFromUSDValue,
    setPrincipalFromTokenValue,
    setStakingDuration,
    toggleCompounding,
    toggleEditingCurrency,
    setCompoundingFrequency,
    setCalculatorMode,
    setTargetRoi,
  } = useRoiCalculatorReducer(stakingTokenPrice, earningTokenPrice, apr, autoCompoundFrequency, performanceFee)

  const { compounding, activeCompoundingIndex, stakingDuration, editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data

  // Auto-focus input on opening modal
  useEffect(() => {
    if (balanceInputRef.current) {
      balanceInputRef.current.focus()
    }
  }, [])

  // If user comes to calculator from staking modal - initialize with whatever they put in there
  useEffect(() => {
    if (initialValue) {
      setPrincipalFromTokenValue(initialValue)
    }
  }, [initialValue, setPrincipalFromTokenValue])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    isFarm
      ? t('“My Balance” here includes both LP Tokens in your wallet, and LP Tokens already staked in this farm.')
      : t(
          '“My Balance” here includes both %assetSymbol% in your wallet, and %assetSymbol% already staked in this pool.',
          { assetSymbol: stakingTokenSymbol },
        ),
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  return (
    <StyledModal
      title={t('ROI Calculator')}
      onDismiss={onBack || onDismiss}
      onBack={onBack ?? null}
      headerBackground="cardHeader"
    >
      <ScrollableContainer>
        <Flex flexDirection="column" mb="10px">
          <Text color="textSubtle" bold textTransform="uppercase" mb="5px" paddingLeft="4px">
            {t('%asset% staked', { asset: stakingTokenSymbol })}
          </Text>
          <BalanceInput
            currencyValue={`${conversionValue} ${conversionUnit}`}
            innerRef={balanceInputRef}
            placeholder="0.00"
            value={editingValue}
            unit={editingUnit}
            onUserInput={onUserInput}
            switchEditingUnits={toggleEditingCurrency}
            onFocus={onBalanceFocus}
          />
          <Flex justifyContent="space-between" mt="10px" paddingLeft="4px">
            <Button
              scale="xs"
              width="100px"
              variant="secondary"
              onClick={() => setPrincipalFromUSDValue('100')}
            >
              $100
            </Button>
            <Button
              scale="xs"
              width="100px"
              variant="secondary"
              onClick={() => setPrincipalFromUSDValue('1000')}
            >
              $1000
            </Button>
            <Button
              disabled={stakingTokenBalance.lte(0) || !account}
              scale="xs"
              width="140px"
              variant="secondary"
              onClick={() =>
                setPrincipalFromUSDValue(getBalanceNumber(stakingTokenBalance.times(stakingTokenPrice)).toString())
              }
            >
              {t('My Balance').toLocaleUpperCase()}
            </Button>
          </Flex>
          <Text mt="24px" mb="8px" color="textSubtle" bold fontSize="12px" textTransform="uppercase" paddingLeft="4px">
            {t('Staked for')}
          </Text>
          <FullWidthButtonMenu activeIndex={stakingDuration} onItemClick={setStakingDuration} scale="sm">
            <FullWidthButtonMenuItem variant="tertiary">{t('1D')}</FullWidthButtonMenuItem>
            <FullWidthButtonMenuItem variant="tertiary">{t('7D')}</FullWidthButtonMenuItem>
            <FullWidthButtonMenuItem variant="tertiary">{t('30D')}</FullWidthButtonMenuItem>
            <FullWidthButtonMenuItem variant="tertiary">{t('1Y')}</FullWidthButtonMenuItem>
            <FullWidthButtonMenuItem variant="tertiary">{t('5Y')}</FullWidthButtonMenuItem>
          </FullWidthButtonMenu>
        </Flex>
        <AnimatedArrow calculatorState={state} />
        <Flex>
          <RoiCard
            earningTokenSymbol={earningTokenSymbol}
            calculatorState={state}
            setTargetRoi={setTargetRoi}
            setCalculatorMode={setCalculatorMode}
          />
        </Flex>
      </ScrollableContainer>
      {/* <RoiCalculatorFooter
        isFarm={isFarm}
        apr={apr}
        displayApr={displayApr}
        autoCompoundFrequency={autoCompoundFrequency}
        multiplier={multiplier}
        linkLabel={linkLabel}
        linkHref={linkHref}
        performanceFee={performanceFee}
      /> */}
    </StyledModal>
  )
}

export default RoiCalculatorModal
