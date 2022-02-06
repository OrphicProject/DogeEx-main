import React, { useCallback } from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import Balance from 'components/Balance'

interface StakeInfoProps {
  pool: Pool
  stakedBalance: BigNumber
}

const StakeInfo: React.FC<StakeInfoProps> = ({
  pool,
  stakedBalance,
}) => {
  const { stakingToken, stakingTokenPrice } = pool
  const { t } = useTranslation()
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance, stakingToken.decimals)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.00001)) {
      return '<0.00001'
    }
    if (stakedBalanceBigNumber.gt(0)) {
      return stakedBalanceBigNumber.toFixed(5, BigNumber.ROUND_DOWN)
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance, stakingToken])

  return (
    <Flex justifyContent="space-between" alignItems="center">
        <Text textTransform="uppercase" color="textSubtle">{stakingToken.symbol} {t(' Staked')}:</Text>
        <Flex flexDirection="column" alignItems="flex-end">
            <Text color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance()}</Text>
            <Text>
                <Balance
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    value={stakedTokenDollarBalance}
                    unit=")"
                    prefix="(~"
                />
            </Text>
        </Flex>
    </Flex>
  )

}

export default StakeInfo
