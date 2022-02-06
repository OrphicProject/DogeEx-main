import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, useModal } from '@pancakeswap/uikit'
import { useLocation } from 'react-router-dom'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import useToast from 'hooks/useToast'
import { useLpTokenPrice } from 'state/farms/hooks'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useApproveFarm from '../../hooks/useApproveFarm'
import useHarvestFarm from '../../hooks/useHarvestFarm'
import useStakeFarms from '../../hooks/useStakeFarms'
import useUnstakeFarms from '../../hooks/useUnstakeFarms'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

const Action = styled(Flex)`
  padding-top: 16px;
  flex-direction: horizontal;
  justify-content: space-between;
`

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 25px;
  }
`

export interface FarmWithStakedValue extends Farm {
  apr?: number
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
  miniDogePrice?: BigNumber
  lpLabel?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl, miniDogePrice, lpLabel }) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = farm
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  const earnings = new BigNumber(earningsAsString)
  const lpAddress = getAddress(lpAddresses)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const location = useLocation()
  const dispatch = useAppDispatch()

  const { onReward } = useHarvestFarm(pid)
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)

  const [pendingTx, setPendingTx] = useState(false)
  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO

  const lpContract = useERC20(lpAddress)
  const lpPrice = useLpTokenPrice(farm.lpSymbol)

  const { onApprove } = useApproveFarm(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])

  const handleStake = async (amount: string) => {
    await onStake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={farm.lpSymbol}
      multiplier={farm.multiplier}
      lpPrice={lpPrice}
      lpLabel={lpLabel}
      apr={farm.apr}
      addLiquidityUrl={addLiquidityUrl}
      miniDogePrice={miniDogePrice}
    />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={farm.lpSymbol} />,
  )

  return (
    <Action>
      {!account ? 
        <ConnectWalletButton mt="8px" width="100%" />
      : 
        !isApproved ?
          <Button width="100%" disabled={requestedApproval} onClick={handleApprove}>
            {t('Approve ')} {lpLabel}
          </Button>
        :
          stakedBalance.eq(0) ?
            <Flex width="100%" justifyContent="space-between">
              <Button
                width="50%"
                marginRight="2%"
                onClick={onPresentDeposit}
                disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
              >
                {t('Stake LP')}
              </Button>
              <Button
                width="50%"
                marginLeft="2%"
                disabled={rawEarningsBalance.eq(0) || pendingTx}
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
                  dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
                }}
              >
                {t('Harvest')}
              </Button>
            </Flex>
          :
            <Flex flexDirection="column" width="100%" justifyContent="space-between">
              <Button
                width="100%"
                disabled={rawEarningsBalance.eq(0) || pendingTx}
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
                  dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
                }}
              >
                {t('Harvest')}
              </Button>
              <Flex width="100%" justifyContent="space-between" mt="20px">
                <Button 
                  width="50%"
                  onClick={onPresentDeposit}
                  disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
                  marginRight="2%"
                >
                  {t('Deposit')}
                </Button>
                <Button 
                  width="50%"
                  onClick={onPresentWithdraw}
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
