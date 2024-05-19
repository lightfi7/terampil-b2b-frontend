import { useOutsideClick } from "@/hooks/useOutsideAlerter";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { ThreeDotsImage } from "../three-dots-image/ThreeDotsImage";

export interface ContextMenuItem {
  label: string
  onClick?(): void
  hide?: boolean
}

interface ContextMenuProps {
  trigger?: any
  listMenu: ContextMenuItem[]
}

export function ContextMenu(props: ContextMenuProps) {
  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Flex 
      position={'relative'}
      ref={ref}>
      <Flex onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}>
        { props.trigger ?? <ThreeDotsImage /> }
      </Flex>
      { open && <Flex 
        top={'100%'}
        right={'0%'}
        bg={'#FFF'}
        zIndex={999}
        mt={'4px'}
        overflow={'hidden'}
        borderRadius={8}
        boxShadow={'0px 1px 12px rgba(0, 0, 0, .15)'}
        position={'absolute'}
        direction={'column'}>
        {
          props.listMenu.filter((item: ContextMenuItem) => !item.hide).map((item: ContextMenuItem, i: number) => (
            <Flex
              key={i}
              cursor={'pointer'}
              className={'context-menu'}
              color={'#000'}
              transition={'200ms'}
              fontSize={'1em'}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                if (item.onClick) {
                  item.onClick();
                  setOpen(false);
                }
              }}
              _hover={{
                bg: '#F0F0F0'
              }}
              p={'8px 16px'}>
              { item.label }
            </Flex>
          ))
        }
      </Flex> }
    </Flex>
  );
}
