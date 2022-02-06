import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text, Image } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);
  justify-content: center;
`

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledNotFound>
        <Image src="/logo.svg" width={96} height={80} mb="8px" />
        <Heading scale="xxl">404</Heading>
        <Text mb="16px">{t('Oops, page not found.')}</Text>
        <Button as="a" href="/" scale="sm">
          {t('Back Home')}
        </Button>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
