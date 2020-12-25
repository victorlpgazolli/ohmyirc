import React, { useRef, useCallback, memo } from 'react'
import { FiTrash } from 'react-icons/fi'
import { useToggle } from 'react-use'

import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'



import Button from '../../../components/Button'
import Input from '../../../components/Form/Input'
import Modal from '../../../components/Modal'
import { useToast } from '../../../context/toast'

import { TextContent, ActionsContainer, ButtonGroup } from './styles'
import { deleteAndGetConnections } from '../../../services/connection/DeleteConnectionService'





const DeleteConnectionModal = ({
  visible,
  onRequestClose,
  connectionToDelete
}) => {
  const formRef = useRef(null)
  const { addToast } = useToast()


  const [deleteConnectionLoading, toggleDeleteConnectionLoading] = useToggle(
    false
  )

  const handleCloseModal = useCallback(() => {
    if (onRequestClose) {
      onRequestClose()
    }
  }, [onRequestClose])

  const handleDeleteConnection = useCallback(
    async ({ confirmation: deleteConfirmation }) => {
      try {
        toggleDeleteConnectionLoading()

        formRef.current?.setErrors({})

        if (deleteConfirmation !== 'DELETE') {
          formRef.current?.setErrors({
            confirmation: "Could not confirm deletion."
          })

          return
        }

        // const connections = deleteAndGetConnections(connectionToDelete);

        addToast({
          type: 'success',
          title: 'Connection deleted',
          description: 'This connection will not be available anymore.'
        })

        handleCloseModal()
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Error deleting connection',
          description: error.message || 'Unexpected error occurred, try again.'
        })
      } finally {
        toggleDeleteConnectionLoading()
      }
    },
    [
      toggleDeleteConnectionLoading,
      addToast,
      connectionToDelete,
      handleCloseModal
    ]
  )

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <h1>Delete connection</h1>

      <TextContent>
        <p>
          The connection <strong>{connectionToDelete.name}</strong> will be permanently deleted.
        </p>

        <p>
          Please confirm your action by typing <strong>DELETE</strong> below:
        </p>
      </TextContent>

      <Form ref={formRef} onSubmit={handleDeleteConnection}>
        <Input name="confirmation" />

        <ActionsContainer>
          <ButtonGroup>
            <Button onClick={handleCloseModal} type="button" color="opaque">
              Cancel
            </Button>

            <Button loading={deleteConnectionLoading} type="submit" color="red">
              <FiTrash />
              Confirm deletion
            </Button>
          </ButtonGroup>
        </ActionsContainer>
      </Form>
    </Modal>
  )
}

export default memo(DeleteConnectionModal)
