import React, { useRef, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiSend } from 'react-icons/fi'

import { Form } from '@unform/web'
import { useSetRecoilState } from 'recoil'
import * as Yup from 'yup'

import { connectionsState } from '../../../atoms/connections'
import Button from '../../../components/Button'
import Input from '../../../components/Form/Input'
import { useToast } from '../../../context/toast'

import getValidationErrors from '../../../utils/getValidationErrors'
import {
    ActionsContainer,

    Container
} from './styles'
import { sendMessageToChannel } from '../../../services/RedisConnection'

const SendMesssageForm = ({
    channel,
    connection,
    handleAddMessage
}) => {
    const formRef = useRef(null)
    const { addToast } = useToast()
    const setConnections = useSetRecoilState(connectionsState)
    const { t } = useTranslation('sendMessageForm')

    const handleSendMessage = useCallback(
        async (data) => {
            try {
                formRef.current?.setErrors({})

                const schema = Yup.object().shape({
                    message: Yup.string().required(),
                })

                await schema.validate(data, {
                    abortEarly: false
                })

                const { message } = data

                try {

                    sendMessageToChannel({
                        connection,
                        message,
                        channel: channel?.name
                    })
                    handleAddMessage(message)
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
            }
        },
        [
            addToast,
            setConnections,

        ]
    )

    return (
        <Container >
            <Form
                initialData={{
                    message: "",
                }}
                ref={formRef}
                onSubmit={handleSendMessage}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center"
                }}
            >
                <Input name="message" label={t('form.message')} />

                <ActionsContainer>
                    <Button
                        type="submit"
                        color="purple"
                    >
                        <FiSend />
                        {t('form.send')}
                    </Button>
                </ActionsContainer>
            </Form>
        </Container>
    )
}

export default memo(SendMesssageForm)
