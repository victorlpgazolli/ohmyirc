import React, { useRef, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiSend } from 'react-icons/fi'

import { Form } from '@unform/web'

import * as Yup from 'yup'


import Button from '../../../components/Button'
import Input from '../../../components/Form/Input'
import { useToast } from '../../../context/toast'

import getValidationErrors from '../../../utils/getValidationErrors'
import {
    ActionsContainer,

    Container
} from './styles'

const SendMesssageForm = ({
    handleAddMessage,
    channel,
}) => {
    const formRef = useRef(null)
    const { addToast } = useToast()

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
                    const user = Array.isArray(channel?.users) && channel.users
                        .filter(user => user.nick === channel?.irc_client?.user?.nick)
                        .shift();

                    const payload = {
                        message,
                        nick: user?.nick,
                        hostname: user?.hostname,
                        time: new Date().getTime(),
                    }

                    channel.say(payload.message)

                    handleAddMessage(payload)

                } catch (err) {
                    addToast({
                        type: 'error',
                        title: 'Error saving connection',
                        description: err.message || 'Unexpected error occurred, try again.'
                    })
                }
                finally {
                    formRef.current.clearField("message")
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
