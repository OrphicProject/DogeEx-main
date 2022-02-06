import React from 'react'
import { CardHeader, Heading, Text, Flex } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Token } from 'config/constants/types'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import { TokenPairImage } from 'components/TokenImage'
import { CommunityTag, CoreTag } from 'components/Tags'
import Balance from 'components/Balance'

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const PoolCardHeadContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
`

const StyledCardHeader: React.FC<{
  earnings: BigNumber
  earningToken: Token
  stakingToken: Token
  earningTokenPrice: number
  isFinished?: boolean
  isStaking?: boolean
}> = ({ earnings, earningToken, stakingToken, earningTokenPrice, isFinished = false, isStaking = false }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const earningTokenBalance = account ? getBalanceNumber(earnings, earningToken.decimals) : 0
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)

  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)

  return (
    <PoolCardHeadContainer>
      <Flex justifyContent="space-between" alignItems="center" marginBottom="12px">
        <Flex justifyContent="space-between" flexDirection="column" alignItems="left">
          <Heading mb="4px" scale="lg">{`${earningToken.symbol}`}{t(' Pool')}</Heading>
          <Text color="textSubtle">{t('stake ')}{`${stakingToken.symbol}`}</Text>
        </Flex>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <CoreTag />
        </Flex>
      </Flex>
      <Wrapper justifyContent="left" alignItems="center" mb="12px">
        <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={100} height={100} />
        <Flex flexDirection="column" justifyContent="center" marginLeft="20px">
          <Text bold textTransform="uppercase" color="primaryBright" fontSize="18px" pr="4px">
            {earningToken.symbol} {t('EARNED')}
          </Text>
          <Flex flexDirection="column" alignItems="flex-start">
            <Balance bold fontSize="20px" decimals={5} value={earningTokenBalance} />
            <Balance fontSize="14px" color="textPrice" decimals={2} value={earningTokenDollarBalance} unit=" USD" prefix="~" />
          </Flex>
        </Flex>
      </Wrapper>
    </PoolCardHeadContainer>
  )
}

export default StyledCardHeader
