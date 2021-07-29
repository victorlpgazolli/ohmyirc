import React, { memo, useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { connections as storedConnections } from '../../store/connections'
import EmptyContent from '../../components/EmptyContent'
import { Container, MessageFrom, MessageContainer, Messages, MessagePayload, MessageTimestamp } from './styles'

import SendMessageForm from '../ConnectionsList/SendMessageForm'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { useWindowSize } from '../../hooks/useWindowSize'
import { saveMessageToConnection } from '../../services/connection/SaveMessageToConnection'

const KeyContent = () => {
  const {
    channels,
    connections,
    users: ircUsers,
  } = useSelector(state => state.irc);

  const parentRef = useRef(null)

  const [selectedChannel, setSelectedChannel] = useState(false)
  const [isListening, setListening] = useState(false);

  const user = useMemo(() => {
    return selectedChannel?.irc_client?.user
  }, [selectedChannel])


  const activeConnection = useMemo(
    () => Object.values(connections)
      .filter(({ connected }) => connected)
      .shift(),
    [Object.values(connections)]
  )

  const [keyContent, setKeyContent] = useState([]);



  useEffect(() => {
    try {
      Array.from(document.getElementById("messages_list")?.children || []).slice().pop()?.scrollIntoViewIfNeeded?.();
    } catch (error) { }
  }, [keyContent.length]);

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

    const messagesFromThisChannel = allMessages
      ?.filter(message => message?.channel === selectedChannel?.name) || [];

    setKeyContent(messagesFromThisChannel);
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

      if (JSON.stringify(keyContent) !== JSON.stringify(messages)) setKeyContent(messages);
    }
  }, [selectedChannel?.name, isListening, channels, connections, activeConnection]);

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
        <EmptyContent message={"No channel selected"} />
      ) : (
          <>
            <Messages style={{
              height: height - 150,
              paddingBottom: "10px"
            }}>
              <Messages id="messages_list" style={{
                overflowY: "scroll"
              }}>
                {keyContent.map((key) => {
                  const isSender = key.from === user.nick;

                  return (
                    <MessageContainer isSender={isSender}>
                      <div style={{
                        width: "120px"
                      }}>
                      <MessageFrom
                        show={1}
                          isSender={isSender}
                      >
                        {key.from}
                      </MessageFrom>
                        <MessageTimestamp

                        >
                          {format(new Date(key.time), "dd/MM/yyyyy HH:mm:ss")}
                        </MessageTimestamp>
                      </div>
                      <MessagePayload
                        show={1}
                        isSender={isSender}
                      >
                        {key.message}
                      </MessagePayload>

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
