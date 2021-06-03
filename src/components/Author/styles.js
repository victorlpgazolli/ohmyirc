import styled from 'styled-components'

export const Container = styled.div(props => ({
    position: "absolute",
    bottom: 0,
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    padding: 20,
    flexDirections: "row",
    "& button": {
        border: "none",
        background: "none",
        color: props.theme.colors.grey,
        cursor: "pointer",
    }
}))