import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, IconButton, ArrowBackIcon, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { RowBetween } from '../Layout/Row'

interface Props {
  backTo?: string
}

const StyledNav = styled.nav`
  margin-bottom: 10px;
  text-align: right;
  padding: 10px 0px;
`

const getActiveIndex = (pathname: string): number => {
  if (
    pathname.includes('/pool') ||
    pathname.includes('/create') ||
    pathname.includes('/add') ||
    pathname.includes('/remove') ||
    pathname.includes('/find') ||
    pathname.includes('/liquidity')
  ) {
    return 1
  }
  return 0
}

const Nav: React.FC<Props> = ({ backTo }) => {
  const location = useLocation()
  const { t } = useTranslation()

  return (

    <StyledNav>
      <RowBetween>
        <Flex alignItems="center">
          {backTo && (
            <IconButton as={Link} to={backTo} scale="sm">
              <ArrowBackIcon width="20px" />
            </IconButton>
          )}
        </Flex>
        <ButtonMenu activeIndex={getActiveIndex(location.pathname)} scale="sm" variant="subtle">
          <ButtonMenuItem id="swap-nav-link" to="/swap" as={Link}>
            {t('Swap')}
          </ButtonMenuItem>
          <ButtonMenuItem id="pool-nav-link" to="/pool" as={Link}>
            {t('Liquidity')}
          </ButtonMenuItem>
        </ButtonMenu>
      </RowBetween>
    </StyledNav>
  )
}

export default Nav
