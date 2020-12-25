import styled, { css, keyframes } from 'styled-components'


export const Container = styled.li`
  > div  {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }
  > div > a {
    cursor: pointer;
    padding: 16px;
    padding-right: 18px;
  }
  > div > button {
    padding: 16px;
    flex: 1;
    display: flex;
    align-items: center;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: 0;
    color: ${props => props.theme.colors.white};

    :disabled {
      pointer-events: none;
    }

    svg:first-child {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }

    > svg:last-child {
      visibility: hidden;
      opacity: 0;
      width: 14px;
      height: 14px;
      margin-left: auto;
      color: ${props => props.theme.colors.grey};

      transition: opacity 0.2s, visibility 0.2s;
    }

    ${props =>
    !props.connected &&
    !props.errored &&
    css`
        background: ${props => props.theme.backgrounds.darker};

        &:hover {
          background: ${props => props.theme.backgrounds.dark};

          svg {
            visibility: visible;
            opacity: 1;
          }
        }
      `}
  }

  .connection-actions-menu {
    width: 220px;
    z-index: 1;
    padding: 8px 0;
    background: ${props => props.theme.backgrounds.darker};
    border: 1px solid ${props => props.theme.backgrounds.lightest};
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    > div {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      cursor: pointer;

      :hover {
        background: ${props => props.theme.backgrounds.dark};
      }

      > svg {
        margin-right: 8px;
        color: #9696a7;
      }
    }
  }

  ${props =>
    props.connected &&
    css`
      background: ${props => props.theme.colors.purple};
      svg {
        visibility: visible;
        opacity: 1;
      }
    `}

  ${props =>
    props.errored &&
    css`
      background: ${props => props.theme.colors.red};
    `}
`

export const ConnectButton = styled.div`
  color: ${props => props.theme.colors.green};

  svg {
    margin-right: 8px;
    color: ${props => props.theme.colors.green};
  }
`

export const DisconnectButton = styled.div`
  color: ${props => props.theme.colors.red};

  svg {
    margin-right: 8px;
    color: ${props => props.theme.colors.red};
  }
`

export const DatabaseList = styled.div`
  display: flex;
  flex-direction: column;
`

export const Database = styled.button`
  width: 100%;
  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: 0;
  color: ${props => props.theme.colors.white};
  transition: background-color 0.2s;

  cursor: pointer;

  strong {
    font-size: 13px;
    padding-left: 36px;
    font-weight: 500;
  }
  position: relative;
  svg {
    position: absolute;
    left: 20px;
  }
  span {
    font-size: 12px;
    opacity: 0.6;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  ${props => props.style}
`

export const ConnectionError = styled.p`
  padding: 0 16px 16px;
  font-size: 14px;

  button {
    background: transparent;
    border: 0;
    color: inherit;
    text-decoration: underline;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
`

const spinningAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export const Loading = styled.div`
  svg {
    animation: 2s ${spinningAnimation} linear infinite;
  }
`
