import React, {
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
  useMemo
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'react-use'
import { useVirtual } from 'react-virtual'


import EmptyContent from '../../components/EmptyContent'
import { useWindowSize } from '../../hooks/useWindowSize'

import SearchInput from './SearchInput'
import {
  Container,
  Header,
  HeaderTitle,
  HeaderTextContainer,
  HeaderDatabaseDetails,
  KeyListWrapper,
  KeyListContainer,
  Key,
  KeyTextContainer,
  KeyTitle,
  KeyInfo
} from './styles'
import MessageOfTheDay from '../ConnectionsList/MessageOfTheDay'
import { useSelector } from 'react-redux'


const KeyList = () => {
  const parentRef = useRef(null)
  const {
    channels,
    connections,
    servers,
  } = useSelector(state => state.irc);

  const { width } = useWindowSize({ watch: false })
  const { t } = useTranslation('keyList')

  const [searchInputValue, setSearchInputValue] = useState('')
  const [filter, setFilter] = useState('')

  const [selectedChannel, setSelectedChannel] = useState(false)
  const [users, setUsers] = useState([])

  const activeConnection = useMemo(
    () => Object.values(connections)
      .filter(({ connected }) => connected)
      .shift(),
    [Object.values(connections)]
  )
  const server = useMemo(
    () => servers[activeConnection?.options?.host],
    [channels, connections, activeConnection]
  )

  useEffect(() => {
    const {
      host
    } = activeConnection?.options || {};

    const [channelToShow] = channels?.[host] || [];

    setSelectedChannel(channelToShow?.name)

  }, [channels, connections, activeConnection])

  useDebounce(
    () => {
      setFilter(searchInputValue)
    },
    500,
    [searchInputValue]
  )

  const channel = useMemo(() => {
    const {
      host
    } = activeConnection?.options || {};

    return Array.isArray(channels[host]) && channels[host]
      .filter(channel => channel.name === selectedChannel)
      .shift()
  }, [channels?.length, selectedChannel]);

  const user = useMemo(() => {
    return Array.isArray(channel?.users) && channel.users
      .filter(user => user.nick === channel?.irc_client?.user?.nick)
      .shift();
  }, [channel, selectedChannel])

  const filteredKeys = useMemo(() => {
    if (!Array.isArray(channel?.users)) return []

    if (!filter) return channel?.users

    return channel.users.filter(key => JSON.stringify(key).includes(filter))
  }, [filter, channel?.users])

  const rowVirtualizer = useVirtual({
    size: filteredKeys.length,
    parentRef,
    estimateSize: useCallback(() => 33, [])
  })

  const handleSearchInputChange = useCallback(
    (e) => {
      setSearchInputValue(e.target.value)
    },
    []
  )

  // useEffect(() => {
  //   const conn = Object.assign({}, currentConnection)
  //   if (conn) {

  //     loadConfigInterval.current = setTimeout(() => {
  //       if (!window.ircConnection) return;

  //       const config = loadConfigFromConnection();

  //       setCurrentConnection(c => ({
  //         ...c,
  //         ...config
  //       }))
  //     }, 1000);
  //   }
  // }, [JSON.stringify(currentConnection)])

  useEffect(() => {
    const {
      host
    } = activeConnection?.options || {};

    const [channelToShow] = channels?.[host] || [];

    if (channelToShow?.updateUsers) channelToShow.updateUsers(({ users }) => setUsers(users))

  }, [channels, connections, activeConnection])

  return (
    <Container
      width={(width - 300) / 2}
      height={Infinity}
      minConstraints={[400, Infinity]}
      maxConstraints={[width - 300 - 100, Infinity]}
    >
      {channel ? (
        <>
          <Header>
            <HeaderTextContainer>
              <HeaderTitle>{selectedChannel}</HeaderTitle>
              <HeaderDatabaseDetails>
                {
                  users?.length &&
                  <span>
                    {users?.length} {t('users')}
                  </span>
                }
                {
                  user?.modes &&
                  <span>
                    {user?.modes} {t('mode')}
                  </span>
                }
              </HeaderDatabaseDetails>
            </HeaderTextContainer>
            <SearchInput
              onChange={handleSearchInputChange}
              value={searchInputValue}
            />
          </Header>

          <KeyListWrapper ref={parentRef}>
            <KeyListContainer
              style={{
                height: `${rowVirtualizer.totalSize}px`
              }}
            >
              {rowVirtualizer.virtualItems.map(virtualRow => {
                const key = filteredKeys[virtualRow.index]

                return (
                  <Key
                    key={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                  >
                    <KeyTextContainer
                    >
                      <KeyTitle>{key?.nick}</KeyTitle>
                      {
                        key?.hostname
                          ? <KeyInfo className="show-on-hover">| {key?.hostname}</KeyInfo>
                          : null
                      }
                      {
                        key?.modes?.length
                          ? <KeyInfo className="show-on-hover">| {key?.modes}</KeyInfo>
                          : null
                      }
                    </KeyTextContainer>
                  </Key>
                )
              })}
            </KeyListContainer>
          </KeyListWrapper>
        </>
      ) : (
          server?.motd
            ? <MessageOfTheDay motd={server?.motd} />
            : <EmptyContent message={t('empty')} />
        )}
    </Container>
  )
}

export default memo(KeyList)
