import { Flex, Link, Text } from "@chakra-ui/react";
import { Notification } from "data-design/src/entity/Notification.entity";
import moment from "moment";

interface NotificationItemProps {
  data: Notification
  onClick?(data: Notification): void
}

export function NotificationItem(props: NotificationItemProps) {
  return (
    <Link
      href={props.data.click_url}>
      <Flex
        bg={props.data.is_read ? '#FFF' : '#F5F5F5'}
        gap={'8px'}
        cursor={'pointer'}
        onClick={() => props.onClick && props.onClick(props.data)}
        borderBottom={'solid 1px #EEE'}
        direction={'column'}>
        { props.data.title && <Text
          flex={1}
          p={'8px 16px'}
          pb={0}
          mb={'-12px'}
          fontSize={'.9em'}
          fontWeight={700}>
          { props.data.title }
        </Text> }
        <Flex>
          <Text
            flex={1}
            p={'8px 16px'}
            fontSize={'.9em'}>
            { props.data.data }
          </Text>
          <Text
            p={'8px 12px'}
            fontSize={'.7em'}
            whiteSpace={'nowrap'}>
            { moment(props.data.created_at).format('DD MMM') }
          </Text>
        </Flex>
      </Flex>
    </Link>      
  );
}
