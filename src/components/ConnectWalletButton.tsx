import React from 'react'
import styled from "styled-components";
import { Button, useMatchBreakpoints, useWalletModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'

const StyledButton = styled(Button)`
  min-width: 100px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 200px;
  }
`

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)
  const { isMobile } = useMatchBreakpoints()

  const label = isMobile ? 'Connect' : 'Connect  Wallet'

  return (
    <StyledButton onClick={onPresentConnectModal} {...props}>
      {t(label)}
    </StyledButton>
  )
}

export default ConnectWalletButton
