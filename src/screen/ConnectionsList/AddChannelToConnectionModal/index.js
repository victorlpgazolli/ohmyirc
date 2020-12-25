import React, { useRef, useCallback, memo } from 'react'
import { FiSave } from 'react-icons/fi'
import { useToggle } from 'react-use'
import { Form } from '@unform/web'
import Button from '../../../components/Button'
import Input from '../../../components/Form/Input'
import Modal from '../../../components/Modal'
import { useToast } from '../../../context/toast'
import { TextContent, ActionsContainer, ButtonGroup } from './styles'

const AddChannelToConnection = ({
    visible,
    onRequestClose,
}) => {
    const formRef = useRef(null)
    const { addToast } = useToast()


    const [addChannelToConnectionLoading, toggleAddChannelToConnectionLoading] = useToggle(
        false
    )

    const handleAddChannel = useCallback(
        async ({ channel }) => {
            try {
                toggleAddChannelToConnectionLoading()

                formRef.current?.setErrors({})

                if (!String(channel)) {
                    formRef.current?.setErrors({
                        channel: "Channel name is required"
                    })

                    return
                }
                const newChannel = {
                    name: String(channel)
                }

                if (newChannel.name.startsWith("#")) newChannel.name.replace("#", "");

                newChannel.name = "#" + newChannel.name;

                onRequestClose(newChannel)
            } catch (error) {
                addToast({
                    type: 'error',
                    title: 'Error creating channel',
                    description: error.message || 'Unexpected error occurred, try again.'
                })
            } finally {
                toggleAddChannelToConnectionLoading()
            }
        },
        [
            toggleAddChannelToConnectionLoading,
            addToast,
        ]
    )

    return (
        <Modal visible={visible} onRequestClose={() => onRequestClose()}>
            <h1>Add Channel</h1>

            <TextContent>
                <p>
                    Please enter the channel name:
                </p>
            </TextContent>

            <Form ref={formRef} onSubmit={handleAddChannel}>
                <Input name="channel" />

                <ActionsContainer>
                    <ButtonGroup>
                        <Button onClick={() => onRequestClose()} type="button" color="opaque">
                            Cancel
                        </Button>

                        <Button loading={addChannelToConnectionLoading} type="submit" color="purple">
                            <FiSave />
                            Save
                        </Button>
                    </ButtonGroup>
                </ActionsContainer>
            </Form>
        </Modal>
    )
}

export default memo(AddChannelToConnection)
