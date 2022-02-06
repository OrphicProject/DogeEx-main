import React from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { Text, Flex, Link, LinkExternal, Skeleton, TimerIcon, Button, MetamaskIcon } from '@pancakeswap/uikit'
import { Pool } from 'state/types'
import { BASE_BSC_SCAN_URL } from 'config'
import { useBlock } from 'state/block/hooks'
import { useCakeVault } from 'state/pools/hooks'
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { getBscScanLink } from 'utils'
import Balance from 'components/Balance'
import { getPoolBlockInfo } from 'views/Pools/helpers'

export interface ExpandableSectionProps {
    pool: Pool
    account: string
  }

const Wrapper = styled(Flex)`
  margin-top: 24px;
  flex-direction: column;
  justify-content: space-around;
`
  
const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({ pool, account }) => {
    const { t } = useTranslation()
    const { currentBlock } = useBlock()
    const {
      totalCakeInVault,
      fees: { performanceFee },
    } = useCakeVault()
  
    const {
      stakingToken,
      earningToken,
      totalStaked,
      startBlock,
      endBlock,
      stakingLimit,
      contractAddress,
      sousId,
    } = pool
  
    const tokenAddress = earningToken.address ? getAddress(earningToken.address) : ''
    const poolContractAddress = getAddress(contractAddress)
    const isMetaMaskInScope = !!window.ethereum?.isMetaMask
    // const isManualCakePool = sousId === 0
    const isManualCakePool = false
  
    const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
      getPoolBlockInfo(pool, currentBlock)
    
    const getTotalStakedBalance = () => {
      if (isManualCakePool) {
        const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(totalCakeInVault)
        return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals)
      }
      return getBalanceNumber(totalStaked, stakingToken.decimals)
    }
  
    return (
      <Wrapper>
        <Flex mb="2px" justifyContent="space-between">
          <Text small color="textSubtle">{t('Total staked')}:</Text>
          <Flex>
            {totalStaked && totalStaked.gte(0) ? (
                <Balance small value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
            ) : (
                <Skeleton width="90px" height="21px" />
            )}
          </Flex>
        </Flex>
        {/* {stakingLimit && stakingLimit.gt(0) && (
          <Flex mb="2px" justifyContent="space-between">
            <Text small>{t('Max. stake per user')}:</Text>
            <Text small>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${stakingToken.symbol}`}</Text>
          </Flex>
        )} */}
        {shouldShowBlockCountdown && (
          <Flex mb="2px" justifyContent="space-between" alignItems="center">
            <Text small color="textSubtle">{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
            {blocksRemaining || blocksUntilStart ? (
              <Flex alignItems="center">
                <Link external href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}>
                  <Balance small value={blocksToDisplay} decimals={0} color="primary" />
                  <Text small ml="4px" color="primary" textTransform="lowercase">
                    {t('Blocks')}
                  </Text>
                  <TimerIcon ml="4px" color="primary" />
                </Link>
              </Flex>
            ) : (
              <Skeleton width="54px" height="21px" />
            )}
          </Flex>
        )}
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal href={`https://pancakeswap.info/token/${getAddress(earningToken.address)}`} bold={false} small>
            {t('See Token Info')}
          </LinkExternal>
        </Flex>
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal href={earningToken.projectLink} bold={false} small>
            {t('View Project Site')}
          </LinkExternal>
        </Flex>
        {poolContractAddress && (
          <Flex mb="2px" justifyContent="flex-end">
            <LinkExternal
              href={`${BASE_BSC_SCAN_URL}/address/${poolContractAddress}`}
              bold={false}
              small
            >
              {t('View Contract')}
            </LinkExternal>
          </Flex>
        )}
        {account && isMetaMaskInScope && tokenAddress && (
          <Flex justifyContent="flex-end">
            <Button
              variant="text"
              p="0"
              height="auto"
              onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals)}
            >
              <Text color="primary" fontSize="14px">
                {t('Add to Metamask')}
              </Text>
              <MetamaskIcon ml="4px" />
            </Button>
          </Flex>
        )}
      </Wrapper>
    )
  }
  
  export default React.memo(DetailsSection)
