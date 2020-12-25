import React, { useRef, useCallback, memo } from 'react'
import { FiSave } from 'react-icons/fi'
import { useToggle } from 'react-use'
import { ircActionCreators } from 'react-irc'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import Button from '../../../components/Button'
import Input from '../../../components/Form/Input'
import Modal from '../../../components/Modal'
import { useToast } from '../../../context/toast'
import getValidationErrors from '../../../utils/getValidationErrors'
import {
  ActionsContainer,
  ButtonGroup,
  InputGroup,
} from './styles'
import { useDispatch } from 'react-redux'
import { createAndGetConnections } from '../../../services/connection/CreateConnectionService'
import { updateAndGetConnections } from '../../../services/connection/UpdateConnectionService'

const ConnectionFormModal = ({
  visible,
  onRequestClose,
  connectionToEdit
}) => {
  const formRef = useRef(null)
  const { addToast } = useToast()
  const dispatch = useDispatch();

  const [createConnectionLoading, toggleCreateConnectionLoading] = useToggle(
    false
  )

  const handleCloseModal = useCallback(() => {
    if (onRequestClose) {
      onRequestClose()
    }
  }, [onRequestClose])

  const handleCreateOrUpdateConnection = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required(),
          host: Yup.string().required(),
          port: Yup.number().required(),
        })

        toggleCreateConnectionLoading()

        await schema.validate(data, {
          abortEarly: false
        })

        const { name, host, port, username } = data

        try {
          const connectionData = {
            name,
            host,
            port: Number(port),
            username,
            channels: [],
            selected: false,
          }

          const connections = connectionToEdit
            ? updateAndGetConnections(connectionToEdit, connectionData)
            : createAndGetConnections(connectionData);

          const ircConnection = await ircActionCreators.connect({
            host: connectionData.host,
            port: connectionData.port,
            username: connectionData.username,
            suppressMiddlewareErrors: false,
          })(dispatch)

          dispatch(ircConnection);

          addToast({
            type: 'success',
            title: 'Connection saved',
            description: 'You can now connect to your database!'
          })

          handleCloseModal()
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Error saving connection',
            description: err.message || 'Unexpected error occurred, try again.'
          })
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
        }
      } finally {
        toggleCreateConnectionLoading()
      }
    },
    [
      addToast,
      toggleCreateConnectionLoading,
      connectionToEdit,
      handleCloseModal
    ]
  )

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <h1>
        {connectionToEdit ? "Edit connection" : "New connection"}
      </h1>

      <Form
        initialData={{
          name: connectionToEdit?.name,
          host: connectionToEdit?.host || 'localhost',
          port: connectionToEdit?.port || '6667',
          username: connectionToEdit?.username
        }}
        ref={formRef}
        onSubmit={handleCreateOrUpdateConnection}
      >
        <Input name="name" label={"Connection name"} />
        <Input name="username" label={"Your name"} />

        <InputGroup>
          <Input name="host" label={"Host"} />
          <Input name="port" label={"Port"} />
        </InputGroup>

        <ActionsContainer>

          <ButtonGroup>
            <Button onClick={handleCloseModal} type="button" color="opaque">
              Cancel
            </Button>
            <Button
              loading={createConnectionLoading}
              type="submit"
              color="purple"
            >
              <FiSave />
              Save
            </Button>
          </ButtonGroup>
        </ActionsContainer>
      </Form>
    </Modal>
  )
}

export default memo(ConnectionFormModal)
