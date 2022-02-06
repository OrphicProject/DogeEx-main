import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Pair } from '@pancakeswap/sdk'
import { Text, Flex, Box, CardBody, CardFooter, Button, AddIcon, CardDivider } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import SubNav from 'components/Menu/SubNav'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import FullPositionCard from '../../components/PositionCard'
import QuestionHelper from '../../components/QuestionHelper'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

// const Body = styled(CardBody)`
//   background-color: ${({ theme }) => theme.colors.dropdownDeep};
// `

const Body = styled(CardBody)`
  background-color: transparent;
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const renderBody = () => {
    if (!account) {
      return (
        <Box padding="24px 0px">
          <Text color="textSubtle" textAlign="center" padding="40px">
            {t('Connect to a wallet to view your liquidity.')}
          </Text>
        </Box>
      )
    }
    if (v2IsLoading) {
      return (
        <Box padding="24px 0px">
          <Text color="textSubtle" textAlign="center" padding="40px">
            <Dots>{t('Loading')}</Dots>
          </Text>
        </Box>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Box padding="24px 0px">
        <Text color="textSubtle" textAlign="center" padding="40px">
          {t('No liquidity found.')}
        </Text>
      </Box>
    )
  }

  return (
    <Page>
      <AppBody>
        <div style={{marginRight: '16px'}}>
          <SubNav />
        </div>
        <CardDivider opacity={0.6} />
        <AppHeader title={t('Liquidity')} subtitle={t('Add liquidity to receive LP tokens.')} />
        <Body>
          <Button id="join-pool-button" as={Link} to="/add" width="100%" startIcon={<AddIcon color="white" />}>
            {t('Add Liquidity')}
          </Button>
        </Body>
        <CardDivider opacity={0.6} />
        <Body>
          <Flex alignItems="center">
            <Text color="primaryBright" mb="8px" fontWeight="600">
              {t("Your Liquidity")}
            </Text>
            <QuestionHelper text={t('When you add liquidity, you are given pool tokens representing your position. There tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time')} 
                            placement="top-start" 
                            ml="4px" 
            />
          </Flex>
          {renderBody()}
          {account && !v2IsLoading && (
            <Flex flexDirection="column" mt="24px">
              <Text color="textSubtle" mb="8px" fontSize="14px">
                {t("Don't see a pool you joined? ")}
              </Text>
              <Button id="import-pool-link" variant="secondary" scale="sm" as={Link} to="/find">
                {t('Find other LP tokens')}
              </Button>
            </Flex>
          )}
        </Body>
      </AppBody>
    </Page>
  )
}
