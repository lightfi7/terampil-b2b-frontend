import { Box, Button, Flex, Image, Input, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const LIMIT_VALUES = [10, 25, 50, 100, 200, 500];

interface PaginationProps {
  page: number
  numberOfPages: number
  limit: number
  onPageChange?(page: number): void
  onLimitChange?(limit: number): void
  limitValues?: number[]
}

export function Pagination(props: PaginationProps) {
  const [page, setPage] = useState<number>(props.page + 1);

  return (
    <Flex 
      gap={'8px'}
      justifyContent={'space-between'}
      alignItems={'center'}>
      <Flex 
        gap={'8px'}
        alignItems={'center'}>
        <Image
          cursor={'pointer'}
          w={'30px'}
          h={'30px'}
          onClick={() => {
            if (props.page <= 0) {
              return;
            }
            (props.onPageChange && page > 1) && props.onPageChange(page - 1 - 1);
            (page > 1) && setPage(page - 1);
          }}
          src={'/icons/light/icon-arrow-left-circle.png'} />
        <Button 
          fontSize={'.8em'}
          onClick={() => {
            props.onPageChange && props.onPageChange(0);
            setPage(1);
          }}>
          1
        </Button>
        <Input 
          w={'6em'}
          placeholder={'Page No.'}
          textAlign={'center'}
          fontSize={'.8em'}
          type={'number'}
          value={page}
          onChange={e => setPage(parseInt(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && props.onPageChange) {
              props.onPageChange(page - 1);
            }
          }} />
        <Button 
          fontSize={'.8em'}
          onClick={() => {
            props.onPageChange && props.onPageChange(props.numberOfPages - 1);
            setPage(props.numberOfPages);
          }}>
          { props.numberOfPages }
        </Button>
        <Image
          cursor={'pointer'}
          w={'30px'}
          h={'30px'}
          onClick={() => {
            if (props.page + 1 >= props.numberOfPages) {
              return;
            }
            props.onPageChange && props.onPageChange(page);
            setPage(page + 1);
          }}
          src={'/icons/light/icon-arrow-right-circle.png'} />
      </Flex>
      <Flex 
        gap={'8px'}
        alignItems={'center'}>
        <Text 
          fontSize={'.8em'}>
          Per Page: 
        </Text>
        <Box flex={1}>
          <Select 
            style={{
              fontSize: '.8em'
            }}
            value={props.limit}
            onChange={e => props.onLimitChange && props.onLimitChange(parseInt(e.target.value))}>
            {
              (props.limitValues ?? LIMIT_VALUES).map((n: number, i: number) => (
                <option key={i} value={n}>{n}</option>
              ))
            }
          </Select>
        </Box>
      </Flex>
    </Flex>
  );
}
