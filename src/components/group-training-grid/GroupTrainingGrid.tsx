import { Box, Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react";

export interface ItemGroupTrainingGrid {
  image?: string
  count?: number
  label?: string
}

interface GroupTrainingGridProps {
  data?: ItemGroupTrainingGrid[]
}

export function GroupTrainingGrid(props: GroupTrainingGridProps) {
  return (
    <Grid
      templateColumns={'repeat(4, 1fr)'}
      columnGap={'12px'}
      rowGap={'12px'}>
      {
        (props.data ?? []).map((item: ItemGroupTrainingGrid, i: number) => (
          <GridItem
            key={i} 
            w={'100%'}>
            <Flex 
              bg={'#FFF'}
              align={'center'}
              gap={'15px'}
              borderRadius={8}
              boxShadow={'0px 1px 8px rgba(0, 0, 0, .1)'}>
              <Flex 
                position={'relative'}
                w={'65px'}
                h={'60px'}
                align={'center'}
                justify={'center'}>
                <Image 
                  w={'100%'}
                  h={'100%'}
                  position={'absolute'}
                  src={item.image}
                  objectFit={'cover'}
                  borderRadius={8} />
                <Box
                  w={'100%'}
                  h={'100%'}
                  position={'absolute'}
                  bg={'#0009'}
                  borderRadius={8} />
                <Text
                  color={'#FFF'}
                  fontSize={'1.1em'}
                  fontWeight={700}
                  zIndex={999}>
                  { item.count }
                </Text>
              </Flex>
              <Text 
                fontSize={'.9em'}
                fontWeight={600}>
                { item.label }
              </Text>
            </Flex>
          </GridItem>
        ))
      }
    </Grid>
  );
}
