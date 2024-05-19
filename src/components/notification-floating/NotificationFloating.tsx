import { Flex, Spinner, Text } from "@chakra-ui/react";
import { Notification } from "data-design/src/entity/Notification.entity";
import { NotificationItem } from "./NotificationItem";

interface NotificationFloatingProps {
  loading?: boolean
  data?: Notification[]
  onClick?(data: Notification): void
}

export function NotificationFloating(props: NotificationFloatingProps) {
  return (
    <Flex
      mt={'8px'}>
      <Flex
        bg={'#FFF'}
        border={'solid 1px #DDD'}
        boxShadow={'0px 12px 30px rgba(0, 0, 0, .2)'}
        borderRadius={6}
        w={'400px'}
        h={'300px'}
        direction={'column'}
        overflow={'auto'}>
        {
          (props.data ?? []).map((notif: Notification) => (
            <NotificationItem 
              key={notif.id}
              onClick={props.onClick}
              data={notif} />
          ))
        }
        {
          (props.data ?? []).length === 0 && <Flex 
            w={'100%'}
            h={'100%'}
            align={'center'}
            justify={'center'}>
            <Text
              color={'#999'}
              fontSize={'.9em'}>
              Notification Empty
            </Text>
          </Flex>
        }
        { props.loading && <Flex
          zIndex={999}
          position={'absolute'}
          align={'center'}
          justify={'center'}
          bg={'#00000005'}
          transition={'250ms'}
          w={'100%'}
          h={'100%'}>
          <Spinner />
        </Flex> }
      </Flex>
    </Flex>
  );
}
