import React from 'react'
import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  margin-top: 3%;
  max-width: 500px;
  padding: 16px;
  width: 100%;
  z-index: 1;
  box-shadow: ${({ theme }) => theme.colors.cardShadow} 0px 0px 12px;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
