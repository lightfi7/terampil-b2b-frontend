import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Checkbox, Flex, Radio, Text } from "@chakra-ui/react";
import { useState } from "react";
import AnimateHeight from "react-animate-height";

interface SelectTreeChildrenProps<T> {
  level?: number
  data?: T
  getID(t: T): any
  getLabel(t: T): string
  onSelected(selected: number[]): void
  getChildren(t: T): T[]
  selected: number[]
  onSelected(id: any): void
  single?: boolean
}

export function SelectTreeChildren<T>(props: SelectTreeChildrenProps<T>) {
  const [expanded, setExpanded] = useState<boolean>(true);
  const level = props.level ?? 0;
  
  return (
    <Flex
      direction={'column'}
      w={'100%'}>
      <Flex 
        p={'3px 10px'}
        justify={'space-between'}
        flex={1}
        align={'center'}>
        { !props.single && <Checkbox
          onChange={(e) => props.onSelected && props.onSelected(props.getID(props.data!))}
          isChecked={props.selected.includes(props.getID(props.data!))}>
          <Text
            pl={'4px'}
            fontSize={'.9em'}
            whiteSpace={'nowrap'}>
            { props.getLabel(props.data!) }
          </Text>
        </Checkbox> }
        { props.single && <Radio
          onChange={(e) => props.onSelected && props.onSelected(props.getID(props.data!))}
          isChecked={props.selected.includes(props.getID(props.data!))}>
          <Text
            pl={'4px'}
            fontSize={'.9em'}
            whiteSpace={'nowrap'}>
            { props.getLabel(props.data!) }
          </Text>
        </Radio> }
        { props.getChildren(props.data!).length > 0 && <Flex
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded);}}
          flex={1}
          height={'100%'}
          justify={'flex-end'}
          align={'center'}
          ml={'24px'}>
          <Flex
            cursor={'pointer'}
            border={'solid 1px #005CB9'}
            p={'3px'}>
            { expanded ? (
              <MinusIcon 
                fontSize={'8px'}
                color={'#005CB9'} />
            ) : (
              <AddIcon 
                fontSize={'8px'}
                color={'#005CB9'} />
            )}
          </Flex>
        </Flex> }
      </Flex>
      <AnimateHeight
        duration={250}
        style={{
          marginLeft: 28
        }}
        height={expanded ? 'auto' : 0}>
        {
          props.getChildren(props.data!).map((child_data: T, i: number) => (
            <SelectTreeChildren<T>
              key={`st-${level}-${i}`}
              selected={props.selected}
              level={level + 1}
              data={child_data}
              getID={props.getID}
              getLabel={props.getLabel}
              onSelected={props.onSelected}
              getChildren={props.getChildren}
              single={props.single} />
          ))
        }
      </AnimateHeight>
    </Flex>
  );
}
