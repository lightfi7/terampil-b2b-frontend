import { Box, Button, Checkbox, Flex, IconButton, Image, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { AButton } from "../button/AButton";
import { OptionData } from "../form/interface";
import { XTableActionItem, XTableData, XTableFilterType, XTableHeaderItem } from "./interface";
import { XTableFilter } from "./XTableFilter";

export interface XTableSelectMode<T> {
  getSelectedID(t: T): string | number
  selected: any[]
  setSelected(list_selected: any[]): void
}

interface XTableProps<T> {
  data: XTableData<T>
  selectMode?: XTableSelectMode<T>
  loading?: boolean
  noMinH?: boolean
}

export function XTable<T>(props: XTableProps<T>) {
  const actions = props.data.action ?? [];
  const all_selected = props.selectMode?.selected.length === props.data.data.length;

  function selectAll() {
    if (!props.selectMode) {
      return;
    }
    props.selectMode.setSelected(props.data.data.map(props.selectMode.getSelectedID));
  }

  function unSelectAll() {
    if (!props.selectMode) {
      return;
    }
    props.selectMode.setSelected([]);
  }

  function toggleSelectAll() {
    if (all_selected) {
      unSelectAll();
    } else {
      selectAll();
    }
  }

  function toggleSelectItem(row: T) {
    if (!props.selectMode) {
      return;
    }

    const id = props.selectMode.getSelectedID(row);
    const is_selected = props.selectMode.selected.includes(id);
    if (is_selected) {
      props.selectMode.setSelected(props.selectMode.selected.filter((_id: any) => _id !== id));
    } else {
      props.selectMode.setSelected([
        ...props.selectMode.selected,
        id
      ]);
    }
  }

  function getFilterValueString(filter: XTableFilterType) {
    if (filter.type === 'dropdown') {
      return (filter.options ?? []).find((o: OptionData) => o.value == filter.value)?.label;
    }

    return filter.value;
  }

  return (
    <Flex
      borderRadius={4}
      overflow={'hidden'}
      border={'solid 1px #E5E5E5'}>
      <Box 
        outline={'none'}
        w={'100%'}
        overflow={'auto'}
        position={'relative'}>
        <Box tabIndex={1} />
        { props.loading && <Flex 
          w={'100%'}
          h={'100%'}
          align={'center'}
          justify={'center'}
          position={'absolute'}
          bg={'#FFF9'}>
          <Spinner mt={'30px'} color='blue' />
        </Flex> }
        <TableContainer 
          w={'100%'}
          minH={props.noMinH ? undefined : '250px'}
          outline={'none'}>
          <Table 
            size='sm'
            outline={'none'}>
            <Thead
              bg={'#E5E5E5'}>
              <Tr>
                { props.selectMode && <Th 
                  p={'12px 16px'}
                  pr={'32px'}
                  verticalAlign={'top'}>
                  <Checkbox
                    isChecked={all_selected}
                    onChange={toggleSelectAll}
                    borderColor={'#555'} />
                </Th> }
                {
                  props.data.header.filter((header: XTableHeaderItem) => !header.hide).map((header: XTableHeaderItem, i: number) => (
                    <Th 
                      key={i}
                      p={'12px 16px'}
                      pr={'32px'}
                      minW={header.w}
                      verticalAlign={'top'}>
                      <Box>
                        <Flex 
                          position={'relative'}
                          align={'center'}
                          gap={'4px'}>
                          { header.sort === 'asc' && <Image 
                            src={'/icons/icon-arrow-up-2.svg'} 
                            onClick={() => header.onFilterSort && header.onFilterSort(
                              !header.sort ? 'asc' : (
                                header.sort === 'asc' ? 'desc' : undefined
                              ), 
                              {
                                key: header.key,
                                value: header.filter?.value
                              }
                            )}
                            style={{
                              width: '15px',
                              height: '15px',
                              cursor: 'pointer'
                            }} /> }
                          { header.sort === 'desc' && <Image
                            src={'/icons/icon-arrow-down-2.svg'} 
                            onClick={() => header.onFilterSort && header.onFilterSort(
                              !header.sort ? 'asc' : (
                                header.sort === 'asc' ? 'desc' : undefined
                              ), 
                              {
                                key: header.key,
                                value: header.filter?.value
                              }
                            )}
                            style={{
                              width: '15px',
                              height: '15px',
                              cursor: 'pointer'
                            }} /> }
                          <Text 
                            whiteSpace={header.normal ? 'normal' : 'nowrap'}
                            userSelect={'none'}
                            onClick={() => header.onFilterSort && header.onFilterSort(
                              !header.sort ? 'asc' : (
                                header.sort === 'asc' ? 'desc' : undefined
                              ), 
                              {
                                key: header.key,
                                value: header.filter?.value
                              }
                            )}
                            cursor={'pointer'}
                            textTransform={'none'}
                            fontWeight={400}
                            fontSize={'1.1em'}
                            color={'#000'}>
                            { header.label }
                          </Text>
                          { header.filter && <Box>
                            <XTableFilter 
                              label={header.label}
                              filter={header.filter}
                              onFilter={(value: any) => header.onFilterSort && header.onFilterSort(
                                header.sort,
                                {
                                  key: header.key,
                                  value
                                }
                              )} />
                          </Box> }
                        </Flex>
                        { header.filter?.value && <Flex 
                          align={'center'}
                          mt={'4px'}
                          gap={'4px'}>
                          <Text 
                            textTransform={'none'}
                            fontWeight={500}
                            letterSpacing={'0'}>
                            "{ getFilterValueString(header.filter) }"
                          </Text>
                          <Image
                            src={'/icons/icon-close.svg'}  
                            onClick={() => header.onFilterSort && header.onFilterSort(
                              header.sort,
                              {
                                key: header.key,
                                value: undefined
                              }
                            )}
                            style={{
                              cursor: 'pointer'
                            }} />
                        </Flex> }
                      </Box>
                    </Th>
                  ))
                }
                {
                  actions.map((_, i: number) => (
                    <Th key={i} />
                  ))
                }
              </Tr>
            </Thead>
            <Tbody>
              {
                props.data.data.map((row: T, i: number) => (
                  <Tr
                    onClick={() => props.data.onRowClick && props.data.onRowClick(row)}
                    cursor={props.data.onRowClick ? 'pointer' : 'default'}
                    _hover={{
                      background: props.data.onRowClick ? 'rgb(255, 245, 232)' : undefined
                    }}
                    key={i}>
                    { props.selectMode && <Td 
                      p={'12px 16px'}
                      pr={'32px'}
                      verticalAlign={'top'}>
                      <Checkbox
                        onChange={() => toggleSelectItem(row)}
                        isChecked={(props.selectMode ?? []).selected.includes(props.selectMode?.getSelectedID(row))} />
                    </Td> }
                    {
                      props.data.header.filter((header: XTableHeaderItem) => !header.hide).map((header: XTableHeaderItem, j: number) => (
                        <Td 
                          borderColor={'#F5F5F5'}
                          fontSize={'.79em'}
                          minW={header.w}
                          whiteSpace={header.normal ? 'normal' : 'nowrap'}
                          key={j}>
                          { header.renderValue ? header.renderValue(row) : (row as any)[header.key] }
                        </Td>
                      ))
                    }
                    {
                      actions.map((action: XTableActionItem<T>, j: number) => {
                        const disabled = action.disabled && action.disabled(row);
                        return (
                          <Td 
                            key={props.data.header.length + j + 1}>
                            <AButton 
                              p={'6px 24px !important'}
                              disabled={disabled}
                              size={'sm'}
                              bg={(action.type === 'danger' ? 'red' : 'gray') + ' !important'}
                              color={'white'}
                              onClick={e => {
                                if (!action.onClick) {
                                  return;
                                }
                                e.preventDefault();
                                e.stopPropagation();
                                action.onClick(row);
                              }}>
                              { action.label }
                            </AButton>
                          </Td>
                        )
                      })
                    }
                  </Tr>
                ))
              }
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
}
