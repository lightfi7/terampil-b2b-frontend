import { useOutsideClick } from "@/hooks/useOutsideAlerter";
import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";

interface HelpDeskContactProps {}

export function HelpDeskContact(props: HelpDeskContactProps) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <Flex
      position={'fixed'}
      bottom={'24px'}
      right={'24px'}
      fontSize={'.9em'}
      zIndex={999}
      borderRadius={8}
      direction={'column'}>
      <Link
        href={'https://wa.me/628176060490'}
        target={'_blank'}>
        <Flex
          align={'center'}
          justify={'center'}
          direction={'column'}
          borderRadius={999}
          bg={'#FFF'}
          w={'80px'}
          h={'80px'}
          p={'3px 8px'}>
          <Image
            src={'https://www.pngitem.com/pimgs/m/148-1489584_chat-png-icon-free-download-searchpng-blue-chat.png'}
            w={'36px'}
            objectFit={'cover'}
            h={'36px'} />
          <Text
            fontSize={'.8em'}
            fontWeight={600}>
            Help Desk
          </Text>
        </Flex>
      </Link>
      {/* <Flex
        opacity={open ? 1 : 0}
        top={open ? '100%' : '0%'}
        right={open ? '-35px' : 9999}
        height={open ? 'auto' : 0}
        zIndex={open ? 1 : -999}
        bg={'#FAFAFA'}
        border={'solid 1px #EEE'}
        direction={'column'}>
        <Text
          p={'12px'}
          color={'blue.500'}>
          Help Desk
        </Text>
        <Box w={'100%'} h={'1px'} bg={'#CCC'} />
        <Text
          p={'12px'}
          color={'blue.500'}>
          Give us feedback
        </Text>
      </Flex>
      <Text
        ref={ref}
        cursor={'pointer'}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        fontWeight={600}
        p={'12px 18px'}
        boxShadow={'0 9px 12px rgba(0, 0, 0, .1)'}>
        Give Feedback
      </Text> */}
    </Flex>
  );
}
