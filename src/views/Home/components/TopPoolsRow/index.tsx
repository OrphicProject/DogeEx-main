import React, { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Flex, Box, SwapVertIcon, IconButton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import useGetTopFarmsByApr from 'views/Home/hooks/useGetTopFarmsByApr'
import useGetTopPoolsByApr from 'views/Home/hooks/useGetTopPoolsByApr'
import PoolCard from './PoolCard'

const Grid = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: repeat(1, 100%);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, minmax(0px, 1fr));
    grid-gap: 32px;
  }
`

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  margin-inline: 10px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    margin-inline: 0px;
  }
`

const TopPoolsRow = () => {
  const { t } = useTranslation()
  const { topPools } = useGetTopPoolsByApr(true)

  const getPoolText = (pool: Pool) => {
    return t('Earning %earningSymbol%', {
      earningSymbol: pool.earningToken.symbol,
    })
  }

  return (
    <StyledContainer>
        <Heading as="h1" scale="lg" mb="24px">
          {t('Top Pools')}
        </Heading>
        <Grid>
            {topPools.map((topPool, index) => (
                <PoolCard
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    title={topPool && getPoolText(topPool)}
                    percentage={topPool?.apr}
                    index={index}
                    token={topPool?.stakingToken}
                    quoteToken={topPool?.earningToken}
                />
            ))}
        </Grid>
    </StyledContainer>
  )
}

export default TopPoolsRow
