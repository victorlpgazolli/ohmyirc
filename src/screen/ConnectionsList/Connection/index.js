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


import { useDispatch, useSelector } from 'react-redux';

import { useToast } from '../../../context/toast'

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
import { ircActionCreators } from 'react-irc'
import { defaultTheme } from '../../../styles/theme'
import { updateAndGetConnections } from '../../../services/connection/UpdateConnectionService'
import { deleteAndGetConnections } from '../../../services/connection/DeleteConnectionService'


const Connection = ({ connection }) => {
  const {
    connections,
    channels
  } = useSelector(state => state.irc);

  const [connectionLoading, setConnectionLoading] = useState(false)
  const [isConnectionFailed, setIsConnectionFailed] = useState(false)
  const [isEditModalOpen, toggleEditModalOpen] = useToggle(false)
  const [isDeleteModalOpen, toggleDeleteModalOpen] = useToggle(false)
  const [isAddChannelModalOpen, toggleAddChannelModalOpen] = useToggle(false)
  const [connected, setConnected] = useState(connections?.[connection?.host]?.connected);
  const { t } = useTranslation('connection')

  const dispatch = useDispatch()
  const { addToast } = useToast()

  useEffect(() => {

    setConnected(connections?.[connection?.host]?.connected)

  }, [connections?.[connection?.host]?.connected])

  const ircConnection = connections?.[connection?.host];

  const connectionChannels = useMemo(
    () => channels[connection?.host] || [],
    [Object.values(channels).flat().length, connection?.host]
  );

  const handleConnect = useCallback(async () => {
    setConnectionLoading(true)

    try {

      const {
        alreayIsConnectedToServer,
      } = Object.entries(connections || {}).reduce((total, current) => {
        const [host, value] = current;
        const isSameHost = host === connection.host;

        if (!isSameHost) {
          dispatch(ircActionCreators.disconnect({
            host,
          }));
        }

        if (isSameHost && value?.connected) total.alreayIsConnectedToServer = true;

        return total;
      }, {
        alreayIsConnectedToServer: false
      })

      if (alreayIsConnectedToServer) return;

      const ircConnection = await ircActionCreators.connect({
        host: connection.host,
        port: connection.port,
        username: connection.username,
      })(dispatch)

      dispatch(ircConnection);
      setConnected(true);

      updateAndGetConnections(connection, {
        ...connection,
        selected: true
      });

    } catch (error) {
      setIsConnectionFailed(true)
    } finally {
      setConnectionLoading(false)
    }
  }, [
    connection,
    ircConnection,
    setIsConnectionFailed,
    setConnected
  ])

  const handleDisconnect = useCallback(() => {
    if (!connection?.host) return;

    dispatch(ircActionCreators.disconnect({
      host: connection.host
    }))
    setConnected(false)

  }, [ircActionCreators.disconnect, connection?.host, setConnected])

  const postSavingConnection = useCallback(async () => {
    toggleEditModalOpen()
    setIsConnectionFailed(false)
  }, [toggleEditModalOpen,])

  const postSavingChannel = useCallback((channel) => {
    toggleAddChannelModalOpen()
    if (channel) handleConnectToChannel(channel)
  }, [toggleAddChannelModalOpen, handleConnectToChannel])

  const postDeletingConnection = useCallback(() => {
    toggleDeleteModalOpen();
    handleDisconnect()
    deleteAndGetConnections(connection);
  }, [toggleDeleteModalOpen, handleDisconnect])

  const handleLeaveChannel = useCallback((channel) => {
    try {
      dispatch(ircActionCreators.leave({
        channel: channel?.name,
        host: connection?.host
      }));

    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to connect to channel',
        description:
          'A connection to this IRC channel could not be established.'
      })
    }
  }, [addToast, ircActionCreators.leave, dispatch]);

  const handleConnectToChannel = useCallback((channel) => {
    try {

      dispatch(ircActionCreators.join({
        channel: channel?.name,
        host: connection?.host
      }));

    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to connect to channel',
        description:
          'A connection to this IRC channel could not be established.'
      })
    }
  }, [addToast, dispatch, ircActionCreators.join, connection])

  return (
    <>
      <Container
        key={connection.host}
        connected={connected}
        errored={isConnectionFailed}
      >
        <ContextMenuTrigger id={`connection_actions_menu:${connection.host}`}>
          <button type="button" disabled={connected} onClick={handleConnect}>
            {connectionLoading && (
              <Loading>
                <FiLoader />
              </Loading>
            )}
            {connection.host}

          </button>
          {
            connected && connectionChannels?.length === 0 && (
              <a disabled={connected} onClick={toggleAddChannelModalOpen}>
                <FiPlusCircle />
              </a>
            )
          }
        </ContextMenuTrigger>

        <ContextMenu
          id={`connection_actions_menu:${connection.host}`}
          className="connection-actions-menu"
        >
          {connected ? (
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
            connected && connectionChannels?.length === 0 && (
              <MenuItem onClick={toggleAddChannelModalOpen}>
                <FiPlusCircle />
                {t('contextMenu.addChannel')}
              </MenuItem>
            )
          }
        </ContextMenu>

        {connected && !!connectionChannels?.length && (
          <DatabaseList >
            {connectionChannels.map(channel => (
              <Database
                style={{
                  background: channel.name === "#geral"
                    ? defaultTheme.colors.purple
                    : "transparent"
                }}
                key={channel.name}
                className={"channel:name:" + channel.name}
                onClick={() => handleLeaveChannel(channel)}
                type="button"
              >
                <FiTrash />
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
