import { convertDuration } from "@/util";
import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { AccordionMateri } from "./AccordionMateri";

interface TrainingContentsProps {
  timeoutID?: any
  setIsTrailer?(b: boolean): void
  countTotalMateri?: any
  dataTraining?: any
  indexChapter?: number
  currentSection?: any
  setCurrentSection?(currentSection: any): void
  setCurrentChapter?(currentChapter: any): void
  setSectionType?(type: string): void
  setLengthQuestion?(lengthQuestion: number): void
  setTitleTest?(title: string): void
  setDataTest?(dataTest: any): void
  setCurrentQuestion?(currentQuestion: number): void
  setIndexChapter?(indexChapter: any): void
  setIndexSection?(indexSection: any): void
  onIkuti?(): void
  loadingEnroll?: boolean
}

export function TrainingContents(props: TrainingContentsProps) {
  return (
    <Box
      w={'100%'}
      gap={'12px'}
      flex={1}>
      { props.onIkuti && <>
        <Button
          onClick={props.onIkuti}
          bgColor={'#005CB9'}
          color={'#FFF'}
          w={'100%'}
          isLoading={props.loadingEnroll}>
          Ikuti Training
        </Button>
        <br />
        <br />
      </> }
      <Flex
        color={'#005CB9'}
        border={'solid 1px #005CB9'}
        p={'3%'}
        borderRadius={'5px'}
        cursor={'pointer'}
        onClick={() => props.setIsTrailer && props.setIsTrailer(true)}>
        <Image src="/icons/icon-trailer.svg" marginRight={'12px'} />
        <Text fontWeight={'bold'}>Trailer</Text>
      </Flex>
      <br />
      <Flex
        borderRadius={'5px'}
        boxShadow={'0px 6px 15px 0px #00000029'}
        direction={'column'}>
        <Flex p={'3% 4%'} direction={'column'}>
          <Heading size={'sm'} color={'#005CB9'} marginBottom={'8px'}>
            Daftar Materi Training
          </Heading>
          <Flex direction={'row'} gap={'12px'}>
            <Text>{ props.dataTraining?.TrainingChapters?.length } BAB</Text>
            &#x2022;
            <Text>
              { props.countTotalMateri(props.dataTraining?.TrainingChapters) } Materi
            </Text>
            &#x2022;
            <Text>{ convertDuration(props.dataTraining?.durations) }</Text>
          </Flex>
        </Flex>
        <AccordionMateri
          dataTraining={props.dataTraining}
          indexChapter={props.indexChapter}
          currentSection={props.currentSection}
          setCurrentSection={props.setCurrentSection}
          setLengthQuestion={props.setLengthQuestion}
          setSectionType={props.setSectionType}
          setTitleTest={props.setTitleTest}
          setDataTest={props.setDataTest}
          setCurrentQuestion={props.setCurrentQuestion}
          setCurrentChapter={props.setCurrentChapter}
          setIsTrailer={props.setIsTrailer}
          setIndexChapter={props.setIndexChapter}
          setIndexSection={props.setIndexSection}
          timeOut={props.timeoutID.current}
        />
      </Flex>
    </Box>
  );
}
