import React, { useRef, useCallback, memo } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { FiSave } from 'react-icons/fi'
import { useToggle } from 'react-use'

import { Form } from '@unform/web'
import { useSetRecoilState } from 'recoil'

import { connectionsState } from '../../../atoms/connections'
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
    const { t } = useTranslation('addChannelToConnection')
    const { addToast } = useToast()
    const setConnections = useSetRecoilState(connectionsState)

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
                        channel: t('form.missingChannelName')
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
            t,
            addToast,
            setConnections,
        ]
    )

    return (
        <Modal visible={visible} onRequestClose={() => onRequestClose()}>
            <h1>{t('title')}</h1>

            <TextContent>
                <p>
                    <Trans t={t} i18nKey="AddChannelMessage" />
                </p>
            </TextContent>

            <Form ref={formRef} onSubmit={handleAddChannel}>
                <Input name="channel" />

                <ActionsContainer>
                    <ButtonGroup>
                        <Button onClick={() => onRequestClose()} type="button" color="opaque">
                            {t('form.cancel')}
                        </Button>

                        <Button loading={addChannelToConnectionLoading} type="submit" color="purple">
                            <FiSave />
                            {t('form.save')}
                        </Button>
                    </ButtonGroup>
                </ActionsContainer>
            </Form>
        </Modal>
    )
}

export default memo(AddChannelToConnection)
