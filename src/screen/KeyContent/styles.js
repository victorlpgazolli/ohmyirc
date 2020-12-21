import styled from 'styled-components'

export const Container = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.backgrounds.lighter};
`

export const MessageFrom = styled.span(props => ({
  opacity: +props.show,
  color: props.theme.backgrounds.lighter,
  flexDirection: "row",
  padding: "5px 8px",
  background: props.color,
  borderRadius: "10px",
  marginRight: "8px",
  flex: "1"
}))
export const MessageContainer = styled.div(props => ({
  marginTop: "12px",
  marginLeft: "0px",
  flexDirection: "row",
  // flex: "1"
}))
export const Messages = styled.div(props => ({
  display: "flex",
  flexDirection: "column",
  flex: "1"
}))