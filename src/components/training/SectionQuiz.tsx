import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SectionQuizIntro } from "./SectionQuizIntro";
import { SectionQuizQuestion } from "./SectionQuizQuestion";

interface SectionQuizProps {
  sectionType?: string
  titleTest?: string
  currentQuestion?: number
  lengthQuestion?: number
  dataTest?: any
  secondsText?: string
  dataArr?: any
  dataAnswer?: any
  setCurrentQuestion?(i: number): void
  setTick?(s: number): void
  setSecondsText?(t: string): void
  setDataAnswer?(a: any): void
  nextMateri?(): void
}

export function SectionQuiz(props: SectionQuizProps) {
  return (
    <Flex h={'600px'} flexDirection={'column'}>
      <Flex
        flexDirection={'column'}
        borderRadius={'5px'}
        boxShadow={'0px 6px 15px 0px #00000029'}
        h={'100%'}
        p={'32px'}>
        <Heading
          size={'md'}
          marginBottom={'24px'}
          color={'#005CB9'}
          textAlign={'center'}>
          {
            props.sectionType === 'PostTest'
            ? 'Test Akhir' 
            : props.titleTest
          }
        </Heading>
        {
          props.currentQuestion === 0 
          ? <SectionQuizIntro
            sectionType={props.sectionType}
            lengthQuestion={props.lengthQuestion}
            setCurrentQuestion={props.setCurrentQuestion}
            setTick={props.setTick}
            setSecondsText={props.setSecondsText}
            setDataAnswer={props.setDataAnswer}
            titleTest={props.titleTest} />
          : <SectionQuizQuestion
            currentQuestion={props.currentQuestion}
            dataTest={props.dataTest}
            secondsText={props.secondsText}
            dataArr={props.dataArr}
            dataAnswer={props.dataAnswer}
            sectionType={props.sectionType}
            setDataAnswer={props.setDataAnswer}
            setCurrentQuestion={props.setCurrentQuestion}
            setSecondsText={props.setSecondsText}
            setTick={props.setTick}
            nextMateri={props.nextMateri} />
        }
      </Flex>
    </Flex>
  );
}
