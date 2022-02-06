import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)`
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  width: 100%;
  margin-bottom: 10px;
  // border-bottom: 1px solid ${({ theme }) => theme.colors.cardDivider};
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  const [expertMode] = useExpertModeManager()

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
        {backTo && (
          <IconButton as={Link} to={backTo}>
            <ArrowBackIcon width="32px" />
          </IconButton>
        )}
        <Flex flexDirection="column">
          <Heading scale="lg" mb="8px">
            {title}
          </Heading>
          <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" />}
            <Text color="textSubtle" fontSize="16px">
              {subtitle}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {!noConfig && (
        <Flex alignItems="center">
          <NotificationDot show={expertMode}>
            <GlobalSettings />
          </NotificationDot>
          {/* <Transactions /> */}
        </Flex>
      )}
    </AppHeaderContainer>
  )
}

export default AppHeader
