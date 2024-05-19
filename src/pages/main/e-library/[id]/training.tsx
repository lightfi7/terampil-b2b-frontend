import { SectionMaterial } from '@/components/training/SectionMaterial';
import { SectionQuiz } from '@/components/training/SectionQuiz';
import { TrainingContents } from '@/components/training/TrainingContents';
import { TrainingInformation } from '@/components/training/TrainingInformation';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { randomizeArray } from '@/util';
import { Flex } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import { Training } from 'data-design/src/entity/Training.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from 'cookies.util';
import { Library } from 'data-design/src/entity/Library.entity';
export { getServerSideProps };

interface TrainingWData {
  b2c_training: Training
  training: any
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;
  let timeoutID = useRef<any>(null);

  const http_enroll = useHttp<any>({
    url: `/development-plan/library/${id}/enroll-me`
  });

  const http_check_enrollment = useHttp<any>({
    url: `/development-plan/library/${id}/check-enrollment`
  });

  const [dataTraining, setDataTraining] = useState<any>({});
  const [sectionType, setSectionType] = useState<string>('Material');
  const [lengthQuestion, setLengthQuestion] = useState<number>(0);
  const [titleTest, setTitleTest] = useState<string>('');
  const [currentChapter, setCurrentChapter] = useState<any>();
  const [currentSection, setCurrentSection] = useState<any>();
  const [indexChapter, setIndexChapter] = useState<number>(0);
  const [indexSection, setIndexSection] = useState<number>(0);
  const [isTrailer, setIsTrailer] = useState<boolean>(true);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [dataTest, setDataTest] = useState<any>({});
  const [dataArr, setDataArr] = useState<string[]>([]);
  const [dataAnswer, setDataAnswer] = useState<any>({});
  const [secondsText, setSecondsText] = useState<string>('01:00');
  const [tick, setTick] = useState<any>();
  const [isSafari, setIsSafari] = useState<any>();

  async function init() {
    try {
      const existing_proposal: TrainingProposal | undefined | null = await http_check_enrollment.get();
      if (existing_proposal) {
        window.location.href = `/main/me/training?id=${existing_proposal.id}`;
        return;
      }
      const library: AxiosResponse<Library> = await axios.get(`/library/${id}`);
      const t: AxiosResponse<TrainingWData> = await axios.get(`/b2c-training/${library.data.ref_id}`);
      setDataTraining(t.data.training);
    } catch (err) {
      console.log(err);
    }
  }

  function countTotalMateri(items: any) {
    if (items && items.length > 0) {
      return items.reduce((i: any, j: any) => i + j.TrainingSections.length, 0);
    }
    return 0;
  }

  function rewind() {
    const video: any = document.getElementById('video');
    const currentTime = video.currentTime;

    if (currentTime <= 10) {
      video.currentTime = 0;
      return;
    }

    video.currentTime = currentTime - 10;
    return;
  };

  function forward() {
    const video: any = document.getElementById('video');
    const currentTime = video.currentTime;
    video.currentTime = currentTime + 10;
    return;
  };

  async function nextMateri() {
    const lastSectionOfChapter = !currentChapter?.TrainingSections[indexSection + 1];
    const lastChapter = !dataTraining?.TrainingChapters[indexChapter + 1];
    if (lastSectionOfChapter && lastChapter) {
      clearTimeout(timeoutID.current);
      setSectionType('Material');
      setLengthQuestion(0);
      setTitleTest('');
      setCurrentChapter(undefined);
      setCurrentSection(undefined);
      setIndexChapter(0);
      setIndexSection(0);
      setIsTrailer(true);
      setCurrentQuestion(0);
      setDataTest({});
      setDataArr([]);
      setDataAnswer({});
      setSecondsText('01:00');
      setTick(undefined);
    } else if (lastSectionOfChapter) {
      setCurrentChapter(dataTraining?.TrainingChapters[indexChapter + 1]);
      setCurrentSection(
        dataTraining?.TrainingChapters[indexChapter + 1]?.TrainingSections[0],
      );
      setIndexChapter(indexChapter + 1);
      setIndexSection(0);
      setSectionType(
        dataTraining?.TrainingChapters[indexChapter + 1]?.TrainingSections[0]
          ?.type,
      );
      setTick(undefined);
      setCurrentQuestion(0);
      setDataArr([]);
      clearTimeout(timeoutID.current);
      setDataTest({});
      setLengthQuestion(0);
    } else {
      setCurrentSection(currentChapter?.TrainingSections[indexSection + 1]);
      setSectionType(currentChapter?.TrainingSections[indexSection + 1].type);
      setIndexSection(indexSection + 1);

      if (
        currentChapter?.TrainingSections[indexSection + 1].type !== 'Material'
      ) {
        const nextSection = currentChapter?.TrainingSections[indexSection + 1];
        if (nextSection.type === 'PostTest') {
          setSectionType(nextSection.type);
          setDataTest(nextSection.PostTest);
          setLengthQuestion(nextSection.PostTest.length);
          setTick(undefined);
          setCurrentQuestion(0);
          setDataArr([]);
          clearTimeout(timeoutID.current);
        } else {
          setDataTest(nextSection.Quiz);
          setLengthQuestion(nextSection.Quiz.length);
        }

        setTitleTest(nextSection.title);
      }
    }
  }

  async function onEnroll() {
    try {
      const proposal: TrainingProposal = await http_enroll.post();
      window.location.href = `/main/me/training?id=${proposal.id}`;
    } catch (err: any) {
      alert(err.toString());
    }
  }

  useEffect(() => {
    init();
    if (router.query.training) {
      init();
    }
    window.scrollTo(0, 0);
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (currentQuestion !== 0) {
      setDataArr(randomizeArray(dataTest[currentQuestion - 1]?.answers));
      if (timeoutID.current) clearTimeout(timeoutID.current);

      setTick(60000);
    }
  }, [currentQuestion]);

  useEffect(() => {
    timeoutID.current = setTimeout(() => {
      let minute = Math.floor((tick % (1000 * 60 * 60)) / (1000 * 60));
      let second = Math.floor((tick % (1000 * 60)) / 1000);

      if (tick) {
        setSecondsText(tick);
      }

      if (tick <= 0) {
        setSecondsText('Waktu Telah Habis');
        setCurrentQuestion(currentQuestion + 1);
        setDataAnswer({});
        if (currentQuestion === dataTest?.length) {
          setCurrentQuestion(0);
          setDataArr([]);
          clearTimeout(timeoutID.current);
        }
      } else {
        if (tick) {
          setSecondsText(
            `${minute < 10 ? '0' + minute.toString() : minute.toString()}:${
              second < 10 ? '0' + second.toString() : second.toString()
            }`,
          );
          setTick(tick - 1000);
        }
      }
    }, 1000);
  }, [tick]);

  useEffect(() => {
    console.log(dataAnswer);
  }, [dataAnswer]);

  return (
    <TemplateAuth
      noSidebar
      admin={props.admin}
      title={'Training'}>
      <Flex 
        p={'0 24px'}
        gap={'24px'}>
        <Flex
          flex={2}
          gap={'12px'}
          direction={'column'}>
          {
            sectionType === 'Material' 
            ? <SectionMaterial
              isTrailer={isTrailer}
              isSafari={isSafari}
              dataTraining={dataTraining}
              currentSection={currentSection}
              rewind={rewind}
              nextMateri={nextMateri}
              forward={forward} />
            : <SectionQuiz
              sectionType={sectionType}
              titleTest={titleTest}
              currentQuestion={currentQuestion}
              lengthQuestion={lengthQuestion}
              dataTest={dataTest}
              secondsText={secondsText}
              dataArr={dataArr}
              dataAnswer={dataAnswer}
              setCurrentQuestion={setCurrentQuestion}
              setTick={setTick}
              setSecondsText={setSecondsText}
              setDataAnswer={setDataAnswer}
              nextMateri={nextMateri} />
          }
          <TrainingInformation
            dataTraining={dataTraining} />
          <br/>
        </Flex>
        <Flex
          flex={1}
          position={'sticky'}
          top={0}>
          <TrainingContents
            onIkuti={onEnroll}
            loadingEnroll={http_enroll.loading}
            dataTraining={dataTraining}
            indexChapter={indexChapter}
            // currentSection={currentSection}
            countTotalMateri={countTotalMateri}
            // setCurrentSection={setCurrentSection}
            // setLengthQuestion={setLengthQuestion}
            // setSectionType={setSectionType}
            // setTitleTest={setTitleTest}
            // setDataTest={setDataTest}
            // setCurrentQuestion={setCurrentQuestion}
            // setCurrentChapter={setCurrentChapter}
            // setIsTrailer={setIsTrailer}
            setIndexChapter={setIndexChapter}
            // setIndexSection={setIndexSection}
            timeoutID={timeoutID} />
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
