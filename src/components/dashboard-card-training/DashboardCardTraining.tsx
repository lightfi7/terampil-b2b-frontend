import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';

// Import Swiper React components
import SwiperCore, { Navigation, Pagination, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { convertDuration } from '@/util';

SwiperCore.use([Navigation, Pagination, EffectFade]);

interface DashboardCardTrainingProps {
  dataListTraining: any;
}

export function DashboardCardTraining(props: DashboardCardTrainingProps) {
  return (
    <Flex p={'3% 0'} position={'relative'}>
      <Swiper
        navigation={{ nextEl: '.next-nav', prevEl: '.prev-nav' }}
        pagination={{
          clickable: true,
        }}
        slidesPerView={4}
        slidesPerGroup={4}
        speed={700}
        style={{ height: '450px' }}
      >
        {props.dataListTraining?.data?.map((training: any, i: number) => (
          <SwiperSlide>
            <Flex
              as={'a'}
              key={i}
              direction={'column'}
              h={'400px'}
              w={'300px'}
              borderRadius={'5px'}
              boxShadow={'0px 4px 10px 0px #62626226'}
              bgColor={'#FFF'}
              cursor={'pointer'}
              href={`/main/training-detail?training=${training.slug}`}
            >
              <Image
                src={training.thumbnail}
                h={'200px'}
                minH={'200px'}
                objectFit={'cover'}
                borderTopRadius={'5px'}
              />
              <Flex direction={'column'} p={'12px 16px'} flex={1} gap={'12px'}>
                <Flex direction={'row'} gap={'12px'}>
                  <Text color={'#707070'} fontSize={'.8em'}>
                    {training.viewers} penonton
                  </Text>
                  <Text color={'#707070'} fontSize={'.8em'}>
                    &#x2022;
                  </Text>
                  <Text color={'#707070'} fontSize={'.8em'}>
                    {convertDuration(training.durations)}
                  </Text>
                </Flex>
                <Heading
                  lineHeight={'inherit'}
                  size={'sm'}
                  noOfLines={2}
                  flex={1}
                  color={'#202020'}
                >
                  {training.title}
                </Heading>
                <Text noOfLines={2} flex={1} color={'#707070'}>
                  {training.Trainer.fullname}
                </Text>
                <Flex direction={'row'} justifySelf={'flex-end'}>
                  <Image src={'/icons/icon-star.svg'} marginRight={'8px'} />
                  <Text color={'#707070'} fontSize={'.8em'}>
                    {training.rating.toFixed(1)} ({training.total_rating}{' '}
                    penilaian)
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </SwiperSlide>
        ))}
      </Swiper>
      <Flex
        position={'absolute'}
        bottom={25}
        right={0}
        gap={'24px'}
        zIndex={10}
      >
        <Button
          borderRadius={'100%'}
          bgColor={'#FFF'}
          boxShadow={'0px 4px 6px 0px #97979733'}
          w={'40px'}
          h={'40px'}
          p={0}
          _hover={{}}
          _active={{}}
          className={'prev-nav'}
        >
          <Image
            src={'/icons/icon-arrow-prev.svg'}
            w={'24px'}
            h={'24px'}
            alt={'icon-prev'}
          />
        </Button>
        <Button
          borderRadius={'100%'}
          bgColor={'#FFF'}
          boxShadow={'0px 4px 6px 0px #97979733'}
          w={'40px'}
          h={'40px'}
          p={0}
          _hover={{}}
          _active={{}}
          className={'next-nav'}
        >
          <Image
            src={'/icons/icon-arrow-next.svg'}
            w={'24px'}
            h={'24px'}
            alt={'icon-next'}
          />
        </Button>
      </Flex>
    </Flex>
  );
}