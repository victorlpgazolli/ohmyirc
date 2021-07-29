import styled from 'styled-components'

export const Container = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  width: 100px;
  flex-direction: column;
  background: ${props => props.theme.backgrounds.lighter};
`

export const MessageTimestamp = styled.div(props => ({
  opacity: 0.4,
  color: props.theme.backgrounds.white,
  fontSize: "10px",
  letterSpacing: "1px",
  width: "100%",
}))
export const MessageFrom = styled.div(props => ({
  opacity: +props.show,
  color: props.theme.backgrounds.white,
  flexDirection: "row",
  padding: "5px 8px",
  borderRadius: "10px",
  marginRight: "8px",
  flex: 0,
  wordBreak: "break-word",
  justifyContent: props.isSender ? "flex-end" : "flex-start",
  display: "flex",
  width: "100%",
}))
export const MessagePayload = styled.div(props => ({
  opacity: +props.show,
  color: props.theme.backgrounds.white,
  flexDirection: "row",
  padding: "5px 8px",
  borderRadius: "10px",
  marginRight: "8px",
  flex: 1,
  wordBreak: "break-word",
  justifyContent: props.isSender ? "flex-end" : "flex-start",
  display: "flex"
}))
export const MessageContainer = styled.div(props => ({
  marginTop: "12px",
  marginLeft: "0px",
  flexDirection: !props.isSender ? "row" : "row-reverse",
  wordBreak: "break-word",
  display: "flex",
  alignItems: "center",
  padding: "5px 0px",
  "&:hover": {
    background: "#00000010",
  },
}))
export const Messages = styled.div(props => ({
  display: "flex",
  flexDirection: "column",
  flex: "1"
}))