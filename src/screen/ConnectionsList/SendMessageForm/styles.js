import styled from 'styled-components'

import Button from '../../../components/Button'

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;

  button {
    padding: 10px 16px;
  }
`

export const Container = styled.div`
  display: flex;
  padding: 0px;
`

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  button {
    &:first-child {
      margin-right: 8px;
    }
  }
`

export const TestConnectionButton = styled(Button)`
  width: 155px;
`
