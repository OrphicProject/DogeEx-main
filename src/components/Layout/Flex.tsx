import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    max-width: 31.5%;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
    margin-inline: 10px;

    ${({ theme }) => theme.mediaQueries.sm} {
      min-width: 320px;
    }
  }
`

export default FlexLayout
