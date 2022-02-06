import React from 'react'
import styled from 'styled-components'
import { Button, useWalletModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const StyledButton = styled(Button)`
  display: flex
  height: "42px",
  padding: "0 16px",

  ${({ theme }) => theme.mediaQueries.xs} {
    display: flex;
    padding: "0 32px",
    min-width: "200px",
  }

  .right-eye {
    animation-delay: 20ms;
  }
`;

const SubNavConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)
//   const label = ({ theme }) => theme.mediaQueries.xs ? "Connect Wallet" : "Connect";

  return (
    <StyledButton onClick={onPresentConnectModal} {...props}>
      {t('Connect Wallet')}
    </StyledButton>
  )
}

export default SubNavConnectWalletButton
