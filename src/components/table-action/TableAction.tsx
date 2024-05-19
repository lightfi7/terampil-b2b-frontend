import { Box, Flex, Image } from "@chakra-ui/react";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XInputSelect } from "../form/input/XInputSelect";
import { XInputText } from "../form/input/XInputText";
import { OptionData } from "../form/interface";

export interface TableFilterItemText {
  type: 'text'
  name: string
}

export interface TableFilterItemDropdown {
  type: 'dropdown'
  name: string
  options: OptionData[]
}

export type TableFilterItem = TableFilterItemText | TableFilterItemDropdown;

interface TableActionProps {
  button?: {
    label: string
    onClick?(): void
  }
  noSort?: boolean
  filterOptions?: TableFilterItem[]
  onFilter?(key: string, value: any): void
}

export function TableAction(props: TableActionProps) {
  const list_options_type = props.filterOptions ?? [];
  const [selected_type, setSelectedType] = useState<TableFilterItem>();
  const [value, setValue] = useState<any>('');

  return (
    <Flex 
      justify={'space-between'}
      align={'center'}>
      <Flex h={'38px'}>
        <Flex 
          border={'solid 1px #C4C4C4'}
          borderTopLeftRadius={999}
          borderBottomLeftRadius={999}>
          <XInputSelect 
            unstyled
            containerStyle={{
              padding: 0,
              paddingLeft: '15px',
              width: '250px'
            }}
            key={''} 
            placeholder={'Choose'}
            options={list_options_type.map((value: TableFilterItem) => ({
              label: value.name,
              value: value.name
            }))}
            onChange={(value_name: string) => {
              const type: TableFilterItem | undefined = list_options_type.find((t: TableFilterItem) => t.name === value_name);
              setSelectedType(type);
            }}
            value={selected_type?.name}
            type={"dropdown"} />
          <Flex w={'1px'} h={'100%'} bg={'#C4C4C4'} />
          { (!selected_type || selected_type?.type === 'text') && <XInputText 
            key={""}
            containerStyle={{
              padding: 0,
              width: 250,
              outline: 'none'
            }}
            value={value}
            onChange={setValue}
            onKeyDown={(e: any) => {
              if (e.key === 'Enter' && selected_type) {
                props.onFilter && props.onFilter(selected_type.name ?? '', value);
              }
            }}
            placeholder={'Enter text here...'}
            style={{
              padding: '0 12px',
              border: 'none',
              height: 35,
              outline: 'none',
              borderRadius: 0,
              fontSize: '.85em',
              width: '250px'
            }} /> }
          { selected_type?.type === 'dropdown' && <XInputSelect 
            unstyled
            containerStyle={{
              padding: 0,
              paddingLeft: '0',
              width: '250px'
            }}
            key={''} 
            placeholder={'Choose'}
            options={selected_type.options}
            onChange={setValue}
            value={value}
            type={"dropdown"} /> }
          <Flex w={'1px'} h={'100%'} bg={'#C4C4C4'} />
        </Flex>
        <Flex 
          cursor={'pointer'}
          h={'100%'}
          w={'40px'}
          align={'center'}
          justify={'center'}
          onClick={() => (props.onFilter && selected_type) && props.onFilter(selected_type.name, value)}
          bg={'brand'}>
          <Image
            w={'20px'}
            h={'20px'}
            src={'/icons/light/icon-search-white.png'} />
        </Flex>
        { !props.noSort && <XInputSelect 
          containerStyle={{
            padding: 0,
            width: 150,
            paddingLeft: '15px',
            paddingTop: 0,
            paddingBottom: 0
          }}
          key={''} 
          placeholder={'Sort'}
          type={"dropdown"} /> }
      </Flex>
      { props.button && <AButton 
        onClick={props.button?.onClick}
        style={{
          padding: '20px 12px',
          fontSize: '.85em'
        }}>
        { props.button?.label }
      </AButton> }
    </Flex>
  );
}
