import React, { memo, useEffect } from 'react'
import { FiPlusCircle } from 'react-icons/fi'
import { useToggle } from 'react-use'
import { ipcRenderer } from 'electron'
import Connection from './Connection'
import ConnectionFormModal from './ConnectionFormModal'
import { Container, Connections } from './styles'
import { connections } from '../../store/connections'

const ConnectionsList = () => {
  const [isCreateModalOpen, toggleCreateModalOpen] = useToggle(false);

  useEffect(() => {
    ipcRenderer.addListener('newConnection', toggleCreateModalOpen)

    return () => {
      ipcRenderer.removeListener('newConnection', toggleCreateModalOpen)
    }
  }, [toggleCreateModalOpen]);


  return (
    <>
      <Container
        width={300}
        height={Infinity}
        minConstraints={[150, Infinity]}
        maxConstraints={[300, Infinity]}
        className="app-sidebar"
      >
        <Connections>
          <header>
            <strong>CONNECTIONS</strong>
            <button type="button" onClick={toggleCreateModalOpen}>
              <FiPlusCircle />
            </button>
          </header>

          <ul>
            {connections.get('connections')?.map(connection => (
              <Connection key={connection.name} connection={connection} />
            ))}
          </ul>
        </Connections>
      </Container>

      <ConnectionFormModal
        visible={isCreateModalOpen}
        onRequestClose={toggleCreateModalOpen}
      />
    </>
  )
}

export default memo(ConnectionsList)
