import React, { useState, useCallback, useEffect, memo } from 'react'
import ReactModal from 'react-modal'

import { Container } from './styles'

const Modal = ({
  visible = false,
  onRequestClose,
  children
}) => {
  const [isOpen, setIsOpen] = useState(visible)

  useEffect(() => {
    setIsOpen(visible)
  }, [visible])

  const handleModalClose = useCallback(() => {
    if (onRequestClose) {
      onRequestClose()
    }

    setIsOpen(false)
  }, [onRequestClose])

  return (
    <ReactModal
      appElement={document.getElementById('modal')}
      shouldCloseOnEsc={true}
      onRequestClose={handleModalClose}
      overlayClassName="modal-overlay"
      className="modal-content"
      isOpen={isOpen}
    >
      <Container>{children}</Container>
    </ReactModal>
  )
}

export default memo(Modal)
