import { convertDuration, formatLocaleDateShort } from "@/util";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

interface TrainingInformationProps {
  dataTraining?: any
}

export function TrainingInformation(props: TrainingInformationProps) {
  return (
    <Flex
      gap={'24px'}
      direction={'column'}>
      <Heading size={'md'}>Tentang Trainer</Heading>
      <Flex 
        direction={'row'} 
        gap={'24px'}>
        <Image
          mt={'12px'}
          borderRadius="full"
          minW={'100px'}
          minH={'100px'}
          maxW={'100px'}
          maxH={'100px'}
          objectFit={'cover'}
          src={props.dataTraining?.Trainer?.avatar}
          alt={props.dataTraining?.Trainer?.fullname}
        />
        <Flex
          padding={'1% 0'}
          direction={'column'}
          justifyContent={'space-between'}
          gap={'12px'}>
          <Text
            fontWeight={600}>
            { props.dataTraining?.Trainer?.fullname }
          </Text>
          <Text>{ props.dataTraining?.Trainer?.profession }</Text>
          <Flex 
            direction={'row'} 
            gap={'12px'} 
            align={'center'}>
            <Image src={'/icons/icon-star.svg'} />
            <Text>
              { props.dataTraining?.Trainer?.rating.toFixed(1) } ({ props.dataTraining?.Trainer?.total_score } Penilaian)
            </Text>
            &#x2022;
            <Text>{ props.dataTraining?.Trainer?.total_training } Kelas</Text>
          </Flex>
        </Flex>
      </Flex>
      <Box>
        <Text>{ props.dataTraining?.Trainer?.about }</Text>
      </Box>
      <br />
      <Heading size={'md'}>
        Deskripsi Training
      </Heading>
      <Flex
        direction={'column'}
        gap={'8px'}>
        <Flex 
          fontWeight={500}
          direction={'row'}
          gap={'8px'}>
          <Text>{ props.dataTraining?.Category?.name }</Text>
          &#x2022;
          <Text>{ convertDuration(props.dataTraining?.durations) }</Text>
          &#x2022;
          <Text>
            Tanggal Rilis: { formatLocaleDateShort(props.dataTraining?.created_at) }
          </Text>
        </Flex>
        <Box>
          <Text>{ props.dataTraining?.description }</Text>
        </Box>
      </Flex>
      <br />
      <Heading size={'md'}>Apa yang kamu pelajari:</Heading>
      <Flex
        direction={'column'}
        gap={'8px'}>
      {
        props.dataTraining?.benefits && props.dataTraining?.benefits.map((e: any, i: number) => {
          return (
            <Flex 
              key={i}
              direction={'row'} 
              gap={'8px'}>
              &#10003;
              <Text>{ e.title }</Text>
            </Flex>
          );
        })
      }
      </Flex>
    </Flex>
  );
}
