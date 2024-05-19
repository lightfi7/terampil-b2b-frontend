import { Flex, Link, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ItemSidebarProps } from "../ItemSidebar";

export interface ChildItemSidebarProps {
  data: ItemSidebarProps
}

export function ChildItemSidebar(props: ChildItemSidebarProps) {
  const router = useRouter();
  const query_string = new URLSearchParams(router.query as any).toString();
  const fullpath_with_q = router.pathname + (
    query_string
    ? '?' + query_string
    : ''
  );
  const match_router_path = fullpath_with_q === props.data.href;

  return (
    <Link 
      href={props.data.href}>
      <Text 
        paddingTop={'7px'}
        paddingBottom={'7px'}
        color={match_router_path ? 'brand' : 'black'}
        fontWeight={match_router_path ? 700 : 400}
        fontSize={'.9em'}>
        { props.data.label }
      </Text>
    </Link>
  );
}
