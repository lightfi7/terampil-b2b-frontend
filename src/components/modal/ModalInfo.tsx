import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useEffect } from "react"

export interface OnModalReady {
  close(): void
  open(): void
}

interface ModalInfoProps {
  trigger?: any
  title: string
  children: any
  setOnModalReady?(cb: OnModalReady): void
  mdWidth?: number | string
}

export function ModalInfo(props: ModalInfoProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (props.setOnModalReady) {
      props.setOnModalReady({
        close: onClose,
        open: onOpen
      });
    }
  }, [onClose, onOpen, isOpen]);

  return (
    <>
      { props.trigger && <Box onClick={onOpen}>
        { props.trigger }
      </Box> }
      <Modal isCentered blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent 
          w={{ base: '100vw', md: props.mdWidth ?? '90vw' }}
          maxW={{ base: '100vw', md: props.mdWidth ?? '90vw' }}>
          <ModalHeader>
            <Flex 
              justify={'center'}>
              { props.title }
            </Flex>
          </ModalHeader>
          <ModalCloseButton color={'#005CB9'} />
          <ModalBody w={'100%'} pb={'24px'}>
            { props.children }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
