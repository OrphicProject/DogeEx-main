import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Heading, Flex, Card, CardBody, Button } from '@pancakeswap/uikit'
import { harvestFarm } from 'utils/calls'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useMasterchef } from 'hooks/useContract'
import { useTotalValue } from 'state/farms/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import MiniDOGEDataRow from './MiniDOGEDataRow'
import useFarmsWithBalance from '../hooks/useFarmsWithBalance'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'
import CardValue from './CardValue'

const StyledStatsCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  margin: 20px 0px;
  margin-inline: 10px;
  padding: 42px 24px;
  box-shadow: ${({ theme }) => theme.colors.cardShadow} 0px 0px 12px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    margin: 55px 0px;
    margin-inline: 0px;
  }
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 18px;
  line-height: 27px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
`

const DetailsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`

const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  // width: 100%;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const Divider = styled.hr`
  display: block;
  height: 1px;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.textSubtle}!important`};
  opacity: 0.6;
  border-width: 0px 0px 1px;
  border-image: initial;
  border-color: inherit;
  border-style: solid;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 24px;
`

const Stretch = styled.div`
  flex: 1 1 0%;
  place-self: stretch;
`

const StatsCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const { farmsWithStakedBalance, earningsSum: farmEarningsSum } = useFarmsWithBalance()
  const numFarmsToCollect = farmsWithStakedBalance.length
  const masterChefContract = useMasterchef()
  const tvl = useTotalValue()
  const tvlText = tvl.toFixed(2, BigNumber.ROUND_DOWN)

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    // eslint-disable-next-line no-restricted-syntax
    for (const farmWithBalance of farmsWithStakedBalance) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await harvestFarm(masterChefContract, farmWithBalance.pid)
        toastSuccess(
          `${t('Harvested')}!`,
          t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' }),
        )
      } catch (error) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    }
    setPendingTx(false)
  }, [farmsWithStakedBalance, masterChefContract, toastSuccess, toastError, t])

  return (
    <StyledStatsCard>
      <InfoContainer>
        <div>
            <Label>{t('Total value locked')}:</Label>
            <CardValue value={tvl.toNumber()} prefix="$" fontSize="52px" decimals={2} lineHeight="78px"/>
        </div>
        <Stretch />
        <BalanceContainer>
          <CakeHarvestBalance />
          <CakeWalletBalance />
        </BalanceContainer>
      </InfoContainer>
      <Divider />
      <MiniDOGEDataRow />
    </StyledStatsCard>
  )
}

export default StatsCard
