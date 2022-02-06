import React from 'react'
import { Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import useTokenBalance from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getMiniDOGEAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceMiniDogeBusd } from 'state/farms/hooks'
import { BigNumber } from 'bignumber.js'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'


const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.input};
  align-items: start;
  min-width: 100%;
  justify-content: space-between;
  border-radius: 24px;
  padding: 16px;
  margin: 0px 0px 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 48%;
    margin: 0px 0px 0px 16px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    min-width: 320px;
    margin: 0px 0px 0px 16px;
  }
`

const CakeWalletBalance = () => {
  const { t } = useTranslation()
  const { balance: miniDogeBalance } = useTokenBalance(getMiniDOGEAddress())
  const miniDogePriceBusd = usePriceMiniDogeBusd()
  const busdBalance = new BigNumber(getBalanceNumber(miniDogeBalance, 9)).multipliedBy(miniDogePriceBusd).toNumber()
  const { account } = useWeb3React()

  return (
    <StyledContainer>
      <Text color='textSubtle' fontSize='18px'>
        {t('MiniDOGE Balance')}
      </Text>
      {
        miniDogeBalance.gt(0) ?
          <CardValue value={getBalanceNumber(miniDogeBalance, 9)} fontSize="20px" decimals={0} lineHeight="1.5" suffix=' MiniDOGE' />
        :
          <Text fontSize="20px" lineHeight="1.4">--</Text>
      }
      {
        miniDogePriceBusd.gt(0) ? 
          <CardBusdValue value={busdBalance} />
        :
          <Text fontSize="14px" lineHeight="20px" color='textPrice'>--</Text>
      }
      {/* <CardValue value={getBalanceNumber(miniDogeBalance, 9)} decimals={4} fontSize="24px" lineHeight="36px" />
      {miniDogePriceBusd.gt(0) ? <CardBusdValue value={busdBalance} /> : <br />} */}
    </StyledContainer>
  )
}

export default CakeWalletBalance
