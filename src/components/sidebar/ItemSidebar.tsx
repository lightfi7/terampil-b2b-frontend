import { Flex, Image, Link, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { ChildItemSidebar } from "./child-item-sidebar/ChildItemSidebar";

export interface ItemSidebarProps {
  label: string
  href?: string
  logo?: string
  logoActive?: string
  code?: string
  items?: ItemSidebarProps[]
  listPermission?: string[]
}

export function ItemSidebar(props: ItemSidebarProps) {
  const router = useRouter();
  const query_string = new URLSearchParams(router.query as any).toString();
  const fullpath_with_q = router.pathname + (
    query_string
    ? '?' + query_string
    : ''
  );
  const items = props.items ?? [];
  const match_item = items.reduce((acc: boolean, item: ItemSidebarProps) => acc || (fullpath_with_q === item.href), false);
  const match_router_path = fullpath_with_q === props.href || match_item;
  const [is_open, setIsOpen] = useState<boolean>(true || match_router_path);
  
  return (
    <Flex 
      p={'12px 28px'}
      gap={'12px'}
      minW={'280px'}>
      { (props.logo && props.logoActive) && <Image 
        w={'1.2em'}
        h={'1.2em'}
        mt={'1.5px'}
        objectFit={'contain'}
        src={match_router_path ? props.logoActive : props.logo} /> }
      <Flex 
        flex={1}
        cursor={'pointer'}
        direction={'column'}>
        <Flex
          justify={'space-between'}
          align={'center'}
          marginBottom={'7px'}
          gap={'18px'}
          onClick={() => setIsOpen(!is_open)}>
          <Text 
            color={match_router_path ? 'brand' : '#000'}
            fontSize={'.85em'}
            fontWeight={600}>
            { props.label }
          </Text>
          <Image 
            w={'.85em'}
            h={'.85em'}
            transition={'250ms'}
            objectFit={'contain'}
            transform={`rotate(${is_open ? '0deg' : '180deg'})`}
            src={'/icons/light/icon-arrow-up.png'} />
        </Flex>
        <AnimateHeight
          duration={300}
          height={is_open ? 'auto' : 0}>
          {
            items.map((item: ItemSidebarProps, i: number) => (
              <ChildItemSidebar 
                key={i}
                data={item} />
            ))
          }
        </AnimateHeight>
      </Flex>
    </Flex>
  );
}
