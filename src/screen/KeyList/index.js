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

import { useRecoilState } from 'recoil'

import {
  currentChannelState,
  currentConnectionState,
} from '../../atoms/connections'
import EmptyContent from '../../components/EmptyContent'
import { useWindowSize } from '../../hooks/useWindowSize'
import { loadUsersFromChannel } from '../../services/database/loadUsersFromChannel'
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
  KeyTitle
} from './styles'

const KeyList = () => {
  const parentRef = useRef(null)

  const { width } = useWindowSize({ watch: false })
  const { t } = useTranslation('keyList')

  const [searchInputValue, setSearchInputValue] = useState('')
  const [filter, setFilter] = useState('')
  const [keys, setKeys] = useState([])

  const [currentConnection] = useRecoilState(currentConnectionState)
  const [currentChannel] = useRecoilState(currentChannelState)
  const [selectedChannel, setSelectedChannel] = useState(false)
  const loadUsersInterval = useRef(null)

  useDebounce(
    () => {
      setFilter(searchInputValue)
    },
    500,
    [searchInputValue]
  )

  const filteredKeys = useMemo(() => {
    if (!filter) {
      return keys
    }

    return keys.filter(key => key.includes(filter))
  }, [filter, keys])

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


  useEffect(() => {
    const channel = Object.assign({}, currentChannel)
    if (channel) {
      setSelectedChannel(channel?.name)

      loadUsersInterval.current = setTimeout(() => {
        const users = loadUsersFromChannel({
          channel
        });

        setKeys(users)
      }, 1000);
    }
  }, [JSON.stringify(currentChannel)])

  return (
    <Container
      width={(width - 300) / 2}
      height={Infinity}
      minConstraints={[400, Infinity]}
      maxConstraints={[width - 300 - 100, Infinity]}
    >
      {selectedChannel ? (
        <>
          <Header>
            <HeaderTextContainer>
              <HeaderTitle>{currentConnection?.name}</HeaderTitle>
              <HeaderDatabaseDetails>
                <span>{selectedChannel}</span>
                <span>
                  {currentChannel?.users} {t('users')}
                </span>
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
                      <KeyTitle>{key}</KeyTitle>
                    </KeyTextContainer>
                  </Key>
                )
              })}
            </KeyListContainer>
          </KeyListWrapper>
        </>
      ) : (
        <EmptyContent message={t('empty')} />
      )}
    </Container>
  )
}

export default memo(KeyList)
