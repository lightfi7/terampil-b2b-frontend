import { Box, Button, Flex, Text } from "@chakra-ui/react";

interface SectionQuizQuestionProps {
  currentQuestion?: number
  dataTest?: any
  secondsText?: string
  dataArr?: any
  dataAnswer?: any
  sectionType?: any
  setCurrentQuestion?(n: number): void
  setDataAnswer?(a: any): void
  setSecondsText?(s: string): void
  setTick?(t: number): void
  nextMateri?(): void
}

export function SectionQuizQuestion(props: SectionQuizQuestionProps) {
  function onClick(data: any) {
    if (!props.setDataAnswer) {
      return;
    }
    props.setDataAnswer({
      section_id: props.dataTest[(props.currentQuestion ?? 0) - 1]?.training_section_id,
      quiz_id: props.sectionType !== 'PostTest' ? props.dataTest[(props.currentQuestion ?? 0) - 1]?.id : null,
      posttest_id: props.sectionType === 'PostTest' ? props.dataTest[(props.currentQuestion ?? 0) - 1]?.id : null,
      answer: data,
    })
  }

  function onSelanjutnya() {
    props.setCurrentQuestion && props.setCurrentQuestion((props.currentQuestion ?? 0) + 1);
    props.setDataAnswer && props.setDataAnswer({});
    props.setSecondsText && props.setSecondsText('01:00');
    props.setTick && props.setTick(60000);
    if ((props.currentQuestion ?? 0) === props.dataTest?.length) {
      props.nextMateri && props.nextMateri();
    }
  }

  return (
    <Flex flexDir={'column'} gap={'24px'} flex={1}>
      <Flex justifyContent={'space-between'}>
        <Text>
          Pertanyaan <strong>{ props.currentQuestion }</strong> dari{' '}
          <strong>{ props.dataTest.length }</strong>
        </Text>
        <Text>
          <strong>{ props.secondsText }</strong>
        </Text>
      </Flex>
      <Flex>
        <Text fontWeight={'bold'} marginRight={'12px'}>
          { props.currentQuestion }.
        </Text>
        <Text>{ props.dataTest[(props.currentQuestion ?? 0) - 1]?.questions }</Text>
      </Flex>
      <Flex flexDir={'column'} gap={'12px'}>
        {
          props.dataArr?.map((data: any, i: number) => (
            <Flex
              key={i}
              as={'button'}
              gap={'12px'}
              border={'1px'}
              borderRadius={'5px'}
              p={'1% 2%'}
              alignItems={'center'}
              cursor={'pointer'}
              textAlign={'left'}
              _hover={{
                color: 'white',
                bgColor: '#005CB9',
              }}
              style={
                props.dataAnswer?.answer?.toLowerCase() === data.toLowerCase()
                ? {
                  color: 'white',
                  backgroundColor: '#005CB9',
                }
                : {}
              }
              onClick={() => onClick(data)}>
              <Box
                border={'1px'}
                borderRadius={'100%'}
                w={'20px'}
                h={'20px'}
                p={'4px'}>
                <Box
                  bgColor={'white'}
                  borderRadius={'100%'}
                  h={'100%'}
                  textAlign={'center'}
                  m={0}
                  p={0}
                />
              </Box>
              <Text flex={1}>{data}</Text>
            </Flex>
          )
        )}
      </Flex>
      <Flex
        justifyContent={'flex-end'}
        flex={1}
        alignItems={'flex-end'}>
        <Button
          disabled={!props.dataAnswer.answer}
          bgColor={'#005CB9'}
          color={'white'}
          onClick={onSelanjutnya}>
          Selanjutnya
        </Button>
      </Flex>
    </Flex>
  );
}
