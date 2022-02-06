import React, { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { useLpTokenPrice } from 'state/farms/hooks'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenName?: string
  lpLabel?: string
}

const StakeInfo: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenName,
  lpLabel,
}) => {
  const { t } = useTranslation()
  const lpPrice = useLpTokenPrice(tokenName)

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.00001)) {
      return '<0.00001'
    }
    if (stakedBalanceBigNumber.gt(0)) {
      return stakedBalanceBigNumber.toFixed(5, BigNumber.ROUND_DOWN)
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  return (
    <Flex justifyContent="space-between" alignItems="center">
        <Text textTransform="uppercase" color="textSubtle">{lpLabel.split(' ')[0]} {t('LP Staked')}:</Text>
        <Flex flexDirection="column" alignItems="flex-end">
            <Text color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance()}</Text>
            <Text>
                <Balance
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    value={getBalanceNumber(lpPrice.times(stakedBalance))}
                    unit=")"
                    prefix="(~"
                />
            </Text>
        </Flex>
    </Flex>
  )
}

export default StakeInfo
