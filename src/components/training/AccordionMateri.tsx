import {
  convertDurationSecond,
} from '@/util';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, Heading, Text } from "@chakra-ui/react";

interface AccordionProps {
  dataTraining?: any
  indexChapter?: number
  currentSection?: any
  timeOut?: number
  setIsTrailer?(b: boolean): void
  setCurrentSection?(currentSection: any): void
  setCurrentChapter?(currentChapter: any): void
  setSectionType?(type: string): void
  setLengthQuestion?(lengthQuestion: number): void
  setTitleTest?(title: string): void
  setDataTest?(dataTest: any): void
  setCurrentQuestion?(currentQuestion: number): void
  setIndexChapter?(indexChapter: any): void
  setIndexSection?(indexSection: any): void
}

export function AccordionMateri(props: AccordionProps) {
  function countTotalDurationChapter(items: any) {
    if (items && items.length > 0) {
      return items.reduce((i: any, j: any) => i + j.duration, 0);
    }

    return 0;
  }

  function onClick(chapters: any, section: any) {
    clearTimeout(props.timeOut);
    props.setSectionType && props.setSectionType(section.type);
    props.setCurrentSection && props.setCurrentSection(section);
    props.setCurrentChapter && props.setCurrentChapter(chapters);
    props.setIsTrailer && props.setIsTrailer(false);
    props.setLengthQuestion && props.setLengthQuestion(0);
    props.setTitleTest && props.setTitleTest('');
    props.setCurrentQuestion && props.setCurrentQuestion(0);
    props.setIndexChapter && props.setIndexChapter(
      props.dataTraining?.TrainingChapters?.findIndex(
        (el: any) => el.id === chapters.id,
      ),
    );
    props.setIndexSection && props.setIndexSection(
      chapters?.TrainingSections?.findIndex(
        (el: any) => el.id === section.id,
      ),
    );

    if (section.type !== 'Material') {
      if (section.type === 'PostTest') {
        props.setDataTest && props.setDataTest(section.PostTest);
        props.setLengthQuestion && props.setLengthQuestion(section.PostTest.length);
      } else {
        props.setDataTest && props.setDataTest(section.Quiz);
        props.setLengthQuestion && props.setLengthQuestion(section.Quiz.length);
      }

      props.setTitleTest && props.setTitleTest(section.title);
    }
  }

  return (
    <Accordion
      index={[props.indexChapter!]}
      onChange={(idx: number) => props.setIndexChapter && props.setIndexChapter(idx)}
      allowToggle
      overflow={'scroll'}
      maxH={'calc(100vh - 250px)'}>
      {props.dataTraining?.TrainingChapters?.map((chapters: any, i: number) => (
        <AccordionItem 
          key={i}>
          <h2>
            <AccordionButton p={'3% 4%'}>
              <Flex as="span" flex="1" textAlign="left" direction={'column'}>
                <Heading size={'sm'} marginBottom={'8px'}>
                  { chapters.title }
                </Heading>
                <Flex direction={'row'} gap={'12px'}>
                  <Text>{ chapters.TrainingSections.length } Materi</Text>
                  &#x2022;
                  <Text>
                    {
                      convertDurationSecond(countTotalDurationChapter(chapters.TrainingSections))
                    }
                  </Text>
                </Flex>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          {
            chapters.TrainingSections.map((section: any) => (
              <AccordionPanel
                key={section.id}
                p={'3% 4%'}
                as={'button'}
                w={'100%'}
                textAlign={'left'}
                _hover={{
                  color: '#005CB9',
                }}
                style={
                  props.currentSection?.id === section.id
                  ? {
                    backgroundColor: '#005CB9',
                    color: 'white',
                  }
                  : {}
                }
                onClick={() => onClick(chapters, section)}>
                <Flex
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}>
                  <Text flex={'1'}>
                    { section.title }
                  </Text>
                  <Text>
                    {
                      section.type === 'Material'
                      ? convertDurationSecond(section.duration)
                      : convertDurationSecond((section.PostTest.length || section.Quiz.length) * 60)
                    }
                  </Text>
                </Flex>
              </AccordionPanel>
            ))
          }
        </AccordionItem>
      ))}
    </Accordion>
  );
}
