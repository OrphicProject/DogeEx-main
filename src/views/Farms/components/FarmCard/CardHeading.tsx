import React from 'react'
import styled from 'styled-components'
import { Tag, Text, Flex, Heading, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { CommunityTag, CoreTag } from 'components/Tags'
import { useTranslation } from 'contexts/Localization'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'
import { usePriceMiniDogeBusd } from 'state/farms/hooks'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'
import { Farm } from 'state/types'
import Balance from 'components/Balance'

export interface FarmWithStakedValue extends Farm {
  apr?: number
}

export interface ExpandableSectionProps {
  earnings?: BigNumber
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  padding: 0px 16px;
`

const FarmCardHeadContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ earnings, lpLabel, multiplier, isCommunityFarm, token, quoteToken }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const miniDogePrice = usePriceMiniDogeBusd()
  const rawEarningsBalance = account ? getBalanceAmount(earnings, token.decimals) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(miniDogePrice).toNumber() : 0

  return (
    <FarmCardHeadContainer>
      <Flex justifyContent="space-between" alignItems="center" marginBottom="12px">
        <Heading mb="4px" scale="lg">{lpLabel.split(' ')[0]}</Heading>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
          {multiplier ? (
            <MultiplierTag variant="secondary" outline>{multiplier}</MultiplierTag>
          ) : (
            <Skeleton ml="4px" width={60} height={28} />
          )}
        </Flex>
      </Flex>
      <Wrapper justifyContent="left" alignItems="center" mb="12px">
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={100} height={100} />
        <Flex flexDirection="column" justifyContent="center" marginLeft="20px">
          <Text bold textTransform="uppercase" color="primaryBright" fontSize="18px" pr="4px">
            {token.symbol} {t('EARNED')}
          </Text>
          <Flex flexDirection="column" alignItems="flex-start">
            <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
            <Balance fontSize="14px" color="textPrice" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          </Flex>
        </Flex>
      </Wrapper>
    </FarmCardHeadContainer>
  )
}

export default CardHeading
