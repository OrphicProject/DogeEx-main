import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { Farm } from 'state/types'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'
import StakeInfo from './StakeInfo'

export interface FarmWithStakedValue extends Farm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
}

const StyledCard = styled(Card)`
  align-self: baseline;
`

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

interface FarmCardProps {
  farm: FarmWithStakedValue
  displayApr: string
  removed: boolean
  miniDogePrice?: BigNumber
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, displayApr, removed, miniDogePrice, account }) => {
  const { t } = useTranslation()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const totalValueFormatted =
    farm.liquidity && farm.liquidity.gt(0)
      ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const lpAddress = getAddress(farm.lpAddresses)
  // const isPromotedFarm = farm.token.symbol === 'MiniDOGE'
  const isPromotedFarm = true

  const {
    stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
  } = farm.userData || {}

  const earnings = new BigNumber(earningsAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)

  return (
    <StyledCard isActive={isPromotedFarm}>
      <FarmCardInnerContainer>
        <CardHeading
          earnings={earnings}
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
        />
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center" padding="8px 0px">
            <Text color="textSubtle">{t('APR')}:</Text>
            <Text bold style={{ display: 'flex', alignItems: 'center' }}>
              {farm.apr ? (
                <ApyButton
                  variant="text-and-button"
                  pid={farm.pid}
                  lpSymbol={farm.lpSymbol}
                  earningTokenSymbol={farm.token.symbol}
                  multiplier={farm.multiplier}
                  lpLabel={lpLabel}
                  addLiquidityUrl={addLiquidityUrl}
                  miniDogePrice={miniDogePrice}
                  apr={farm.apr}
                  displayApr={displayApr}
                />
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}
        <StakeInfo
          stakedBalance={stakedBalance}
          tokenName={farm.lpSymbol}
          lpLabel={lpLabel}
        />
        <Flex justifyContent="space-between" padding="12px 0px">
          <Text textTransform="uppercase" color="textSubtle">{t('Lock Period')}:</Text>
          {farm.lockTime ? (
            <Text>{farm.lockTime} {t('(s)')}</Text>
          ) : (
            <Skeleton ml="4px" width={60} height={24} />
          )}
        </Flex>
        <Flex justifyContent="space-between" padding="12px 0px">
          <Text textTransform="uppercase" color="textSubtle">{t('Deposit Fee')}:</Text>
          {farm.depositFee ? (
            <Text>{farm.depositFee}%</Text>
          ) : (
            <Skeleton ml="4px" width={60} height={24} />
          )}
        </Flex>
        <CardActionsContainer
          farm={farm}
          lpLabel={lpLabel}
          account={account}
          miniDogePrice={miniDogePrice}
          addLiquidityUrl={addLiquidityUrl}
        />
      </FarmCardInnerContainer>

      <ExpandingWrapper>
        <ExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
        {showExpandableSection && (
          <DetailsSection
            removed={removed}
            bscScanAddress={getBscScanLink(lpAddress, 'address')}
            infoAddress={`https://pancakeswap.info/pool/${lpAddress}`}
            totalValueFormatted={totalValueFormatted}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
          />
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}

export default FarmCard
