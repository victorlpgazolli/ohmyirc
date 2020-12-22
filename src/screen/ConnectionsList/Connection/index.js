import React, { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu'
import { useTranslation } from 'react-i18next'
import {
  FiDatabase,
  FiChevronRight,
  FiLoader,
  FiActivity,
  FiMinusCircle,
  FiEdit2,
  FiRefreshCcw,
  FiTrash,
  FiPlusCircle
} from 'react-icons/fi'
import { useToggle } from 'react-use'

import { useRecoilState, useSetRecoilState } from 'recoil'

import {
  currentConnectionState,
  currentChannelState,
  channelsState,
} from '../../../atoms/connections'
import { useToast } from '../../../context/toast'
import { loadConnection } from '../../../services/connection/LoadConnection'

import ConnectionFormModal from '../ConnectionFormModal'
import DeleteConnectionModal from '../DeleteConnectionModal'
import AddChannelToConnectionModal from '../AddChannelToConnectionModal'
import {
  Container,
  DatabaseList,
  ConnectionError,
  Database,
  Loading,
  ConnectButton,
  DisconnectButton,
  ConnectionButton
} from './styles'


const Connection = ({ connection, setConn }) => {
  const [currentConnection, setCurrentConnection] = useRecoilState(
    currentConnectionState
  )
  const [currentChannel, setCurrentChannel] = useRecoilState(
    currentChannelState
  )
  const [channels, setChannels] = useRecoilState(
    channelsState
  )

  const [connectionLoading, setConnectionLoading] = useState(false)
  const [isConnectionFailed, setIsConnectionFailed] = useState(false)
  const [isEditModalOpen, toggleEditModalOpen] = useToggle(false)
  const [isDeleteModalOpen, toggleDeleteModalOpen] = useToggle(false)
  const [isAddChannelModalOpen, toggleAddChannelModalOpen] = useToggle(false)
  const { t } = useTranslation('connection')

  const { addToast } = useToast()

  useEffect(() => {
    if (currentConnection) {
      setIsConnectionFailed(false)
    }
  }, [currentConnection])

  const isConnected = useMemo(() => {
    return currentConnection?.name === connection.name
  }, [currentConnection?.name, connection.name])

  const handleConnect = useCallback(async () => {
    if (!isConnected) {
      setConnectionLoading(true)
      setCurrentConnection(undefined)
      setCurrentChannel(undefined)

      try {

        await loadConnection(connection);

        setCurrentConnection(connection)
      } catch (error) {
        alert(JSON.stringify(error))
        setIsConnectionFailed(true)
      } finally {
        setConnectionLoading(false)
      }
    }
  }, [
    connection,
    isConnected,
    setCurrentConnection,
      setCurrentChannel
  ])

  const handleDisconnect = useCallback(async () => {
    setCurrentConnection(undefined)
    setCurrentChannel(undefined)
    window.ircConnection.disconnect();
  }, [setCurrentConnection, setCurrentChannel])

  const postSavingConnection = useCallback(async () => {
    toggleEditModalOpen()
    setCurrentConnection(undefined)
    setCurrentChannel(undefined)
    setIsConnectionFailed(false)
  }, [toggleEditModalOpen, setCurrentConnection, setCurrentChannel])

  const postSavingChannel = useCallback((channel) => {
    toggleAddChannelModalOpen()
    if (channel) handleSelectChannel(channel)
  }, [toggleAddChannelModalOpen, handleSelectChannel, currentConnection?.name])


  const postDeletingConnection = useCallback(async () => {
    toggleDeleteModalOpen()
    setCurrentConnection(undefined)
    setCurrentChannel(undefined)
    window.ircConnection.disconnect();
  }, [toggleDeleteModalOpen, setCurrentConnection, setCurrentChannel])

  const handleSelectChannel = useCallback(
    (channel) => {

      try {
        window.ircConnection.join(channel?.name)

        setCurrentChannel(channel)
        setChannels((channels = []) => {
          try {
            const newChannels = channels.filter(c => c?.name !== channel?.name);
            newChannels.push(channel);
            return newChannels
          } catch (error) {
            return [channel]
          }
        });

      } catch (error) {
        alert(JSON.stringify(error))
        addToast({
          type: 'error',
          title: 'Failed to connect to channel',
          description:
            'A connection to this Redis channel could not be established.'
        })
      }
    },
    [currentConnection?.name, addToast, setCurrentChannel, setChannels]
  )

  return (
    <>
    <Container
        key={connection.name}
      connected={isConnected}
      errored={isConnectionFailed}
    >
        <ContextMenuTrigger id={`connection_actions_menu:${connection.name}`}>
        <button type="button" disabled={isConnected} onClick={handleConnect}>
            {connectionLoading && (
            <Loading>
              <FiLoader />
              </Loading>
          )}
            {connection.name}

          </button>
        {
            isConnected && (
              <a disabled={isConnected} onClick={toggleAddChannelModalOpen}>
                <FiPlusCircle />
              </a>
            )
          }
      </ContextMenuTrigger>

      <ContextMenu
          id={`connection_actions_menu:${connection.name}`}
        className="connection-actions-menu"
      >
        {isConnected ? (
          <MenuItem onClick={handleDisconnect}>
            <DisconnectButton>
              <FiMinusCircle />
              {t('contextMenu.disconnect')}
            </DisconnectButton>
          </MenuItem>
        ) : (
            <MenuItem onClick={handleConnect}>
              <ConnectButton>
                <FiActivity />
                {t('contextMenu.connect')}
              </ConnectButton>
            </MenuItem>
          )}

        <MenuItem onClick={toggleEditModalOpen}>
          <FiEdit2 />
          {t('contextMenu.editSettings')}
        </MenuItem>

        <MenuItem onClick={toggleDeleteModalOpen}>
          <FiTrash />
          {t('contextMenu.deleteConnection')}
        </MenuItem>
        {
          isConnected && (
            <MenuItem onClick={toggleAddChannelModalOpen}>
              <FiPlusCircle />
              {t('contextMenu.addChannel')}
            </MenuItem>
          )
        }
      </ContextMenu>

      {isConnected && !!channels?.length && (
        <DatabaseList>
          {channels.map(channel => (
            <Database
              connected={channels?.name === channel.name}
              key={channel.name}
              onClick={() => handleSelectChannel(channel)}
              type="button"
            >
              <strong>{channel.name}</strong>
              <span>
                {channel.keys} {t('channel')}
              </span>
            </Database>
          ))}
        </DatabaseList>
      )}

      {isConnectionFailed && (
        <ConnectionError>
          {t('connectionFailed')}{' '}
          <button type="button" onClick={handleConnect}>
            {t('retry')}
          </button>
        </ConnectionError>
      )}
    </Container>

    <ConnectionFormModal
      visible={isEditModalOpen}
      onRequestClose={postSavingConnection}
        connectionToEdit={connection}
    />

    <DeleteConnectionModal
      visible={isDeleteModalOpen}
      onRequestClose={postDeletingConnection}
        connectionToDelete={connection}
    />

    <AddChannelToConnectionModal
      visible={isAddChannelModalOpen}
      onRequestClose={postSavingChannel}
    />
  </>
  )
}

export default memo(Connection)
