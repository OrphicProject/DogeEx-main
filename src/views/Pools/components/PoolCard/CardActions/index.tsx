import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Text, Button, useModal } from '@pancakeswap/uikit'
import { useLocation } from 'react-router-dom'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import { useAppDispatch } from 'state'
import { fetchPoolsUserDataAsync } from 'state/pools'
import useToast from 'hooks/useToast'
import { useERC20 } from 'hooks/useContract'
import { BIG_ZERO } from 'utils/bigNumber'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { useApprovePool } from 'views/Pools/hooks/useApprove'
import useHarvestPool from 'views/Pools/hooks/useHarvestPool'
import useStakePool from 'views/Pools/hooks/useStakePool'
import useUnstakePool from 'views/Pools/hooks/useUnstakePool'
import NotEnoughTokensModal from '../Modals/NotEnoughTokensModal'
import StakeModal from '../Modals/StakeModal'

const Action = styled(Flex)`
  padding-top: 16px;
  flex-direction: horizontal;
  justify-content: space-between;
`

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: Pool
  account?: string
  stakedBalance: BigNumber
}

const CardActions: React.FC<CardActionsProps> = ({ pool, account, stakedBalance }) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [pendingTx, setPendingTx] = useState(false)

  const { 
    sousId, 
    stakingToken, 
    stakingTokenPrice, 
    earningToken, 
    earningTokenPrice, 
    harvest, 
    poolCategory, 
    userData } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO

  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData
  const needsApproval = !allowance.gt(0) && !isBnbPool

  const earningTokenBalance = account ? getBalanceNumber(earnings, earningToken.decimals) : 0

  const { onReward } = useHarvestPool(sousId, isBnbPool)
  const { onStake } = useStakePool(sousId, isBnbPool)
  const { onUnstake } = useUnstakePool(sousId, pool.enableEmergencyWithdraw)

  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { handleApprove, requestedApproval } = useApprovePool(stakingTokenContract, sousId, earningToken.symbol)

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  return (
    <Action>
      {!account ? 
        <ConnectWalletButton mt="8px" width="100%" />
      : 
        needsApproval ?
          <Button width="100%" disabled={requestedApproval} onClick={handleApprove}>
            {t('Approve ')} {stakingToken.symbol}
          </Button>
        :
          stakedBalance.eq(0) ?
            <Flex width="100%" justifyContent="space-between">
              <Button
                width="50%"
                marginRight="2%"
                onClick={onPresentStake}
                disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
              >
                {t('Stake')}
              </Button>
              <Button
                width="50%"
                marginLeft="2%"
                disabled={earningTokenBalance === 0 || pendingTx}
                onClick={async () => {
                  setPendingTx(true)
                  try {
                    await onReward()
                    toastSuccess(
                      `${t('Harvested')}!`,
                      t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' }),
                    )
                  } catch (e) {
                    toastError(
                      t('Error'),
                      t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
                    )
                    console.error(e)
                  } finally {
                    setPendingTx(false)
                  }
                  dispatch(fetchPoolsUserDataAsync(account))
                }}
              >
                {t('Harvest')}
              </Button>
            </Flex>
          :
            <Flex flexDirection="column" width="100%" justifyContent="space-between">
              <Button
                width="100%"
                disabled={earningTokenBalance === 0 || pendingTx}
                onClick={async () => {
                  setPendingTx(true)
                  try {
                    await onReward()
                    toastSuccess(
                      `${t('Harvested')}!`,
                      t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' }),
                    )
                  } catch (e) {
                    toastError(
                      t('Error'),
                      t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
                    )
                    console.error(e)
                  } finally {
                    setPendingTx(false)
                  }
                  dispatch(fetchPoolsUserDataAsync(account))
                }}
              >
                {t('Harvest')}
              </Button>
              <Flex width="100%" justifyContent="space-between" mt="20px">
                <Button 
                  width="50%"
                  onClick={onPresentStake}
                  disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
                  marginRight="2%"
                >
                  {t('Deposit')}
                </Button>
                <Button 
                  width="50%"
                  onClick={onPresentUnstake}
                  marginLeft="2%"
                  variant="tertiary"
                >
                  {t('Withdraw')}
                </Button>
              </Flex>
            </Flex>
      }
    </Action>
  )
}

export default CardActions
