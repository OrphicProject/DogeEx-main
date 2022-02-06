import React from 'react'
import styled from 'styled-components'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { useEmissionPerBlock } from 'hooks/useEmissionPerBlock'
import { getMiniDOGEAddress } from 'utils/addressHelpers'
import { getBalanceNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { usePriceMiniDogeBusd } from 'state/farms/hooks'
import { Flex, Text, Heading, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
  padding: 0 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 16px;
  }
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 16px;
  grid-template-columns: repeat(1, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
    grid-template-columns: repeat(2, auto);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
  }
`

const MiniDOGEDataRow = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const emissionsPerBlock = useEmissionPerBlock()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getMiniDOGEAddress()), 9)
  const cakeSupply = totalSupply ? getBalanceNumber(totalSupply, 9) - burnedBalance : 0
  const cakePriceBusd = usePriceMiniDogeBusd()
  const mcap = cakePriceBusd.times(cakeSupply)
  const mcapString = formatLocalisedCompactNumber(mcap.toNumber())

  return (
    <Grid>
      <StyledColumn>
        <Text color="textSubtle">{t('Total supply')}</Text>
        {cakeSupply ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={cakeSupply} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn>
        <Text color="textSubtle">{t('Burned to date')}</Text>
        {burnedBalance ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={burnedBalance} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn noMobileBorder>
        <Text color="textSubtle">{t('Market cap')}</Text>
        {mcap?.gt(0) && mcapString ? (
          <Heading scale="lg">{t('$%marketCap%', { marketCap: mcapString })}</Heading>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn>
        <Text color="textSubtle">{t('Current emissions')}</Text>
        { emissionsPerBlock?.gt(0) ? (
          <Heading scale="lg">{t('%cakeEmissions% / block', { cakeEmissions: getBalanceNumber(emissionsPerBlock, 9) })}</Heading>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
    </Grid>
  )
}

export default MiniDOGEDataRow
