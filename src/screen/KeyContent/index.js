import React, { memo, useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { connections as storedConnections } from '../../store/connections'
import EmptyContent from '../../components/EmptyContent'
import { Container, MessageFrom, MessageContainer, Messages } from './styles'
import { defaultTheme } from '../../styles/theme'

import SendMessageForm from '../ConnectionsList/SendMessageForm'
import { useSelector } from 'react-redux'
import { useVirtual } from 'react-virtual'
import { useWindowSize } from '../../hooks/useWindowSize'
import { saveMessageToConnection } from '../../services/connection/SaveMessageToConnection'

const KeyContent = () => {
  const {
    channels,
    connections
  } = useSelector(state => state.irc);

  const { t } = useTranslation('keyContent')
  const parentRef = useRef(null)

  const [selectedChannel, setSelectedChannel] = useState(false)
  const [isListening, setListening] = useState(false)


  const activeConnection = useMemo(
    () => Object.values(connections)
      .filter(({ connected }) => connected)
      .shift(),
    [Object.values(connections)]
  )

  const [keyContent, setKeyContent] = useState([]);


  const rowVirtualizer = useVirtual({
    size: keyContent?.length,
    parentRef,
    estimateSize: useCallback(() => 33, [])
  })
  useEffect(() => {
    const {
      host
    } = activeConnection?.options || {};

    const [channelToShow] = channels?.[host] || [];

    setSelectedChannel(channelToShow)

  }, [channels, connections, activeConnection])

  const onReceiveMessage = useCallback((from, message, metadata) => {
    const {
      nick: username,
      hostname,
      host
    } = from
    const {
      time,
    } = metadata

    const userMessage = {
      message,
      from: username,
      channel: selectedChannel?.name,
      hostname,
      time,
    }

    const allMessages = saveMessageToConnection(host, userMessage);

    setKeyContent(allMessages);
  }, [setKeyContent, selectedChannel?.name])

  useEffect(() => {
    if (selectedChannel?.name && !isListening) {
      setListening(true);
      activeConnection.on('message', function (event) {
        handleAddMessage(event)
      });
    }
  }, [selectedChannel?.name, Object.keys(channels), isListening]);
  const { height } = useWindowSize({ watch: true })

  useEffect(() => {

    if (isListening && selectedChannel?.name && activeConnection?.options) {
      const {
        host
      } = activeConnection?.options || {};

      const messages = storedConnections
        .get("connections")
        ?.find(conn => conn.host === host)
        ?.messages
        ?.filter(message => message?.channel === selectedChannel?.name) || [];

      setKeyContent(messages);
    }
  }, [selectedChannel?.name, isListening, channels, connections, activeConnection]);

  useEffect(() => {

    rowVirtualizer.scrollToIndex(keyContent?.length - 1)
  }, [keyContent?.length]);

  const handleAddMessage = useCallback(({
    message,
    nick,
    hostname,
    time,
  }) => {

    const {
      host
    } = activeConnection?.options || {};

    const from = {
      nick,
      hostname,
      host,
    }
    const metadata = {
      time,
    }

    onReceiveMessage(from, message, metadata);

  }, [onReceiveMessage, selectedChannel?.name,])

  return (
    <Container ref={parentRef}>
      {!selectedChannel?.name ? (
        <EmptyContent message={t('empty')} />
      ) : (
          <>
            <Messages style={{
              height: height - 150,
              paddingBottom: "10px"
            }}>
              <Messages style={{
                height: `${rowVirtualizer.totalSize}px`,
                overflowY: "scroll"
              }}>
                {rowVirtualizer.virtualItems.map((virtualRow) => {
                  const key = keyContent[virtualRow.index]
                  return (
                    <MessageContainer>
                      <MessageFrom
                        show={1}
                      >
                        {key.from}
                      </MessageFrom>
                      {key.message}
                    </MessageContainer>
                  )
                })}
              </Messages>
            </Messages>
            <SendMessageForm
              handleAddMessage={handleAddMessage}
              channel={selectedChannel}
            />
          </>
        )}
    </Container>
  )
}

export default memo(KeyContent)
