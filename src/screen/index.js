import React from 'react'
import { useState } from 'react'

import ConnectionsList from './ConnectionsList'
import Header from './Header'
import KeyContent from './KeyContent'
import KeyList from './KeyList'
import { Container, Content, CurrentConnection } from './styles'

const screen = () => {
  const [conn, setConn] = useState()
  return (
    <Container>
      <Header />
      <Content>
        <ConnectionsList setConn={setConn} />
        <CurrentConnection>
          <KeyList conn={conn} />
          <KeyContent conn={conn} />
        </CurrentConnection>
      </Content>
    </Container>
  )
}

export default screen
