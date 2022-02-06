import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text, Button, useMatchBreakpoints } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'

interface FarmCardProps {
  title: string
  percentage: number
  index: number
  token: Token
  quoteToken: Token
}

const StylePoolCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-radius: 30px;
  box-shadow: ${({ theme }) => theme.colors.cardShadow} 0px 0px 12px;
`

const Stretch = styled.div`
  flex: 1 1 0%;
  place-self: stretch;
`

const StyledTitle = styled(Text)`
  font-size: 16px;
  margin-bottom: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 28px;
  }
`

const StyledBalance = styled(Balance)`
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
`

const PoolCard: React.FC<FarmCardProps> = ({ title, percentage, index, token, quoteToken }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <StylePoolCard>
      { !isMobile ?
        (
          token === undefined || quoteToken === undefined ? (
            <Skeleton width={96} height={96} mr="30px"/>
          ) : (
            <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={100} height={100} mr="30px"/>
          )
        ) : (
          <></>
        )
      }
      <Flex flexDirection="column">
        {title ? (
            <StyledTitle bold>
                {title}
            </StyledTitle>
        ) : (
            <Skeleton width={80} height={12} mb="8px" />
        )}
        {percentage ? (
            <StyledBalance lineHeight="1.1" bold unit="%" value={percentage} prefix='APR : '/>
        ) : (
            <Skeleton width={60} height={16} />
        )}
      </Flex>
      <Stretch />
      <Button as="a" href="/pools" padding="0 24px">
        {t('Pools')}
      </Button>
    </StylePoolCard>
  )
}

export default PoolCard
