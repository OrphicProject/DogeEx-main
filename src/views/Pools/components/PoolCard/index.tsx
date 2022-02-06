import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, CardRibbon, Skeleton, ExpandableLabel } from '@pancakeswap/uikit'
import { PoolCategory } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'
import StakeInfo from "./StakeInfo"
import DetailsSection from "./DetailsSection"

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

const ExpandingWrapper = styled.div`
  padding: 24px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
`

const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData, earningTokenPrice } = pool
  const { t } = useTranslation()
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const isPromotedPool = pool.earningToken.symbol === 'BNB' || pool.earningToken.symbol === 'BUSD'

  return (
    <StyledCard
      isActive={isPromotedPool}
      isFinished={isFinished}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <FarmCardInnerContainer>
        {/* <StyledCardHeader
          earnings={earnings}
          isStaking={accountHasStakedBalance}
          earningToken={earningToken}
          stakingToken={stakingToken}
          earningTokenPrice={earningTokenPrice}
          isFinished={isFinished && sousId !== 0}
        /> */}
        <StyledCardHeader
          earnings={earnings}
          isStaking={accountHasStakedBalance}
          earningToken={earningToken}
          stakingToken={stakingToken}
          earningTokenPrice={earningTokenPrice}
          isFinished={isFinished}
        />
        <AprRow pool={pool} stakedBalance={stakedBalance} />
        <StakeInfo
          pool={pool}
          stakedBalance={stakedBalance}
        />
        <Flex justifyContent="space-between" padding="12px 0px">
          <Text textTransform="uppercase" color="textSubtle">{t('Lock Period')}:</Text>
          {pool.lockTime ? (
            <Text>{pool.lockTime} {t('(s)')}</Text>
          ) : (
            <Skeleton ml="4px" width={60} height={24} />
          )}
        </Flex>
        <Flex justifyContent="space-between" padding="12px 0px">
          <Text textTransform="uppercase" color="textSubtle">{t('Deposit Fee')}:</Text>
          {pool.depositFee ? (
            <Text>{pool.depositFee}%</Text>
          ) : (
            <Skeleton ml="4px" width={60} height={24} />
          )}
        </Flex>
        <CardActions
          pool={pool}
          account={account}
          stakedBalance={stakedBalance}
        />
        {/* <CardFooter pool={pool} account={account} /> */}
      </FarmCardInnerContainer>
      <ExpandingWrapper>
        <ExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
        {showExpandableSection && (
          <DetailsSection
            pool={pool}
            account={account}
          />
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}

export default PoolCard
