import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { currentChannelState, currentConnectionState, messagesPerChannelState } from '../../atoms/connections'

import EmptyContent from '../../components/EmptyContent'
import { Container, MessageFrom, MessageContainer, Messages } from './styles'
import { defaultTheme } from '../../styles/theme'
import { useRecoilState } from 'recoil'
import SendMessageForm from '../ConnectionsList/SendMessageForm'
import { useCallback } from 'react'

const KeyContent = () => {
  const currentChannel = useRecoilValue(currentChannelState)
  const currentConnection = useRecoilValue(currentConnectionState)
  const [messagesPerChannel, setMessagesPerChannel] = useRecoilState(messagesPerChannelState)
  const [keyContent, setKeyContent] = useState([])
  const [colorPerUser, setColorPerUser] = useState({})
  const { t } = useTranslation('keyContent')

  const onReceiveMessage = useCallback((from, message) => {
    const colors = Object.keys(defaultTheme.colors)
    const randomColorIndex = (Math.random() * colors.length).toFixed(0)
    const colorSelected = colors[randomColorIndex]
    const userMessage = {
      message,
      from,
      color: defaultTheme.colors[colorSelected],
    }
    setColorPerUser(users => ({
      [userMessage.from]: userMessage.color,
      ...users,
    }))
    setMessagesPerChannel((channelsObj = {}) => {
      const channelMessages = channelsObj?.[currentChannel?.name] || []
      const hasMessagesForChannel = Array.isArray(channelMessages) && channelMessages.length;

      if (!hasMessagesForChannel) return {
        [currentChannel?.name]: [userMessage]
      }

      return {
        ...channelsObj,
        [currentChannel?.name]: [
          ...channelMessages,
          userMessage,
        ]
      }
    })

    setKeyContent(last => [
      ...last,
      {
        from,
        message
      },
    ]);
  }, [setMessagesPerChannel, setColorPerUser, setKeyContent])

  useEffect(() => {
    if (currentChannel) {
      try {
        if (window.ircConnection?.addListener && currentChannel?.name) {

          window.ircConnection.addListener('message' + currentChannel?.name, function (from, message) {
            onReceiveMessage(from, message)
          });
        }
      } catch (error) {

      }
    }
  }, [currentChannel]);

  useEffect(() => {
    const channel = Object.assign({}, currentChannel);
    const messages = messagesPerChannel?.[channel?.name] || [];
    setKeyContent(messages)
  }, [JSON.stringify(currentChannel)]);

  const handleAddMessage = useCallback((message) => {
    const from = currentConnection?.username;
    onReceiveMessage(from, message)
  }, [currentConnection?.username, onReceiveMessage])

  return (
    <Container>
      {!currentChannel?.name ? (
        <EmptyContent message={t('empty')} />
      ) : (
          <>
            <Messages>
              {keyContent.map((key) => {
                return (
                  <MessageContainer>
                    <MessageFrom
                      color={colorPerUser[key.from]}
                      show={1}
                    >
                      {key.from}
                    </MessageFrom>
                    {key.message}
                  </MessageContainer>
                )
              })}
            </Messages>
            <SendMessageForm
              channel={currentChannel}
              handleAddMessage={handleAddMessage}

            />
          </>
        )}
    </Container>
  )
}

export default memo(KeyContent)
