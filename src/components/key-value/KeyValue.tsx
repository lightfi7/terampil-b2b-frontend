import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

interface KeyValueProps {
  label: string
  value: any
  href?: string
}

export function KeyValue(props: KeyValueProps) {
  return (
    <Flex 
      direction={'column'}
      gap={'0px'}>
      <Text 
        fontWeight={700}
        fontSize={'14px'}>
        { props.label }
      </Text>
      { !props.href && <Text>
        { props.value }
      </Text> }
      { props.href && <Link target={'_blank'} href={props.href}>
        { props.value }
      </Link> }
    </Flex>
  );
}
