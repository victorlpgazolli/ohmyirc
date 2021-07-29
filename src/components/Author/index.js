import React, { memo } from 'react'
import {
  shell
} from "electron"
import { Container } from './styles'


const Author = () => {
  const openAuthorGithub = () => {
    shell.openExternal("https://github.com/victorlpgazolli/")
  }
  return (
    <Container>
      <button onClick={openAuthorGithub}>my github</button>
    </Container>
  )
}

export default memo(Author)
