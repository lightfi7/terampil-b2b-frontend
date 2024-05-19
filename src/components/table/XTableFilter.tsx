import { Box, Flex, IconButton, Image, Input, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Select, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { OptionData } from "../form/interface";
import { XTableFilterType } from "./interface";

interface XTableFilterProps {
  label: string
  filter: XTableFilterType
  onFilter(value: any): void
}

export function XTableFilter(props: XTableFilterProps) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [value, setValue] = useState<any>(props.filter.value);
  const filter_style = {
    width: '15px',
    height: '15px',
    minWidth: '15px',
    minHeight: '15px',
    cursor: 'pointer'
  };
  const FilterIcon = props.filter.value 
    ? <Image 
      src={'/icons/icon-filter-filled.svg'}
      style={filter_style} /> 
    : <Image 
      src={'/icons/icon-filter.svg'}
      style={filter_style}/>;

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}>
      <PopoverTrigger>
        { FilterIcon }
      </PopoverTrigger>
      <PopoverContent 
        marginTop={'24px'}
        marginLeft={'-2px'}
        width={'auto'}
        outline={'none !important'}>
        <PopoverCloseButton />
        <PopoverHeader>
          Filter
        </PopoverHeader>
        <PopoverBody
          outline={'none !important'}>
          <Flex gap={'8px'} w={'100%'}>
            { props.filter.type === 'input' && <Input 
              value={value}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  onClose();
                  props.onFilter(value);
                }
              }}
              onChange={e => setValue(e.target.value)}
              placeholder={props.label} /> }
            { props.filter.type === 'number' && <Input 
              value={value}
              type={'number'}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  onClose();
                  props.onFilter(value);
                }
              }}
              onChange={e => setValue(e.target.value)}
              placeholder={props.label} /> }
            { props.filter.type === 'date' && <Input 
              value={value}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  onClose();
                  props.onFilter(value);
                }
              }}
              onChange={e => setValue(e.target.value)}
              type={'date'} placeholder={props.label} /> }
            { props.filter.type === 'dropdown' && (
              <Box flex={1}>
                <Select 
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  w={'100%'}
                  placeholder={props.label}>
                  {
                    (props.filter.options ?? []).map((opsi: OptionData, i: number) => (
                      <option key={i} value={opsi.value}>
                        { opsi.label }
                      </option>
                    ))
                  }
                </Select>
              </Box>
            ) }
            <IconButton
              onClick={() => {
                onClose();
                props.onFilter(value);
              }}
              aria-label='Search'
              icon={<Image src={'/icons/icon-search.png'} />}
            />
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
