import { TemplateAuth } from '@/template-auth';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  ListItem,
  OrderedList,
  Progress,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import {
  getServerSideProps,
} from '../../../cookies.util';
import {
  convertDuration,
  convertDurationSecond,
  formatLocaleDateShort,
  randomizeArray,
} from '@/util';
import { useRouter } from 'next/router';
export { getServerSideProps };

interface AccordionProps {
  dataTraining: any;
  indexChapter: number;
  currentSection: any;
  timeOut: number;
  checkQuizOfChapter: (chapter: any) => any;
  checkLastQuiz: () =>any;
  setIsTrailer: (isTrailer: boolean) => void;
  setCurrentSection: (currentSection: any) => void;
  setCurrentChapter: (currentChapter: any) => void;
  setSectionType: (type: string) => void;
  setLengthQuestion: (lengthQuestion: number) => void;
  setTitleTest: (title: string) => void;
  setDataTest: (dataTest: any) => void;
  setCurrentQuestion: (currentQuestion: number) => void;
  setIndexChapter: (indexChapter: any) => void;
  setIndexSection: (indexSection: any) => void;
}

function AccordionMateri(props: AccordionProps) {
  function countTotalDurationChapter(items: any) {
    if (items && items.length > 0) {
      return items.reduce((i: any, j: any) => i + j.duration, 0);
    }

    return 0;
  }

  return (
    <Accordion
      index={[props.indexChapter]}
      onChange={(idx: number) => props.setIndexChapter(idx)}
      allowToggle
      overflow={'scroll'}
      maxH={'calc(100vh - 250px)'}
    >
      {props.dataTraining?.TrainingChapters?.map((chapters: any, i: number) => (
        <AccordionItem>
          <h2>
            <AccordionButton p={'3% 4%'}>
              <Flex as="span" flex="1" textAlign="left" direction={'column'}>
                <Heading size={'sm'} marginBottom={'8px'}>
                  {chapters.title}
                </Heading>
                <Flex direction={'row'} gap={'12px'}>
                  <Text>{chapters.TrainingSections.length} Materi</Text>
                  &#x2022;
                  <Text>
                    {convertDurationSecond(
                      countTotalDurationChapter(chapters.TrainingSections),
                    )}
                  </Text>
                </Flex>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          {chapters.TrainingSections.map((section: any) => (
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
              onClick={() => {
                if(section.type === "Test") {
                  console.log(props.checkQuizOfChapter(chapters))
                  if(!props.checkQuizOfChapter(chapters))
                  {
                    alert('You must watch all sections');
                    return;
                  }
                } 
                if(section.type === "PostTest") {
                  console.log(props.checkLastQuiz())

                  if(!props.checkLastQuiz())
                  {
                    alert('You must complete all chapters');
                    return;
                  }
                }                  
                clearTimeout(props.timeOut);
                props.setSectionType(section.type);
                props.setCurrentSection(section);
                props.setCurrentChapter(chapters);
                props.setIsTrailer(false);
                props.setLengthQuestion(0);
                props.setTitleTest('');
                props.setCurrentQuestion(0);
                props.setIndexChapter(
                  props.dataTraining?.TrainingChapters?.findIndex(
                    (el: any) => el.id === chapters.id,
                  ),
                );
                props.setIndexSection(
                  chapters?.TrainingSections?.findIndex(
                    (el: any) => el.id === section.id,
                  ),
                );

                if (section.type !== 'Material') {
                  if (section.type === 'PostTest') {
                    props.setDataTest(section.TrainingPostTest);
                    props.setLengthQuestion(section.TrainingPostTest.length);
                  } else {
                    props.setDataTest(section.TrainingQuiz);
                    props.setLengthQuestion(section.TrainingQuiz.length);
                  }

                  props.setTitleTest(section.title);
                }
              }}
            >
              <Flex
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Text flex={'1'}>{section.title}</Text>
                <Text>
                  {section.type === 'Material'
                    ? convertDurationSecond(section.duration)
                    : convertDurationSecond(
                        (section.TrainingPostTest.length || section.TrainingQuiz.length) * 60,
                      )}
                </Text>
              </Flex>
            </AccordionPanel>
          ))}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function (props: any) {
  let timeoutID = useRef<any>(null);
  const router = useRouter();
  const [dataTraining, setDataTraining] = useState<any>({});
  const [vendors, setVendors] = useState<any>([]);
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
  const [dataAnswers, setDataAnswers] = useState<any>([]);
  const [dataAnswer, setDataAnswer] = useState<any>({});
  const [secondsText, setSecondsText] = useState<string>('01:00');
  const [tick, setTick] = useState<any>();
  const [isSafari, setIsSafari] = useState<any>();

  const getTrainingDetail = async (id?: string) => {
    try {
      const training: any = await axios.get(
        `/training/detail?id=${id}`,
        { headers: { access: 'terampil' } },
      );
      setDataTraining(training.data);
    } catch (err) {
      console.log(err);
    }
  };

  const countTotalMateri = (items: any) => {
    if (items && items.length > 0) {
      return items.reduce((i: any, j: any) => i + j.TrainingSections.length, 0);
    }

    return 0;
  };

  const rewind = () => {
    const video: any = document.getElementById('video');
    const currentTime = video.currentTime;

    if (currentTime <= 10) {
      video.currentTime = 0;
      return;
    }

    video.currentTime = currentTime - 10;

    return;
  };

  const forward = () => {
    const video: any = document.getElementById('video');
    const currentTime = video.currentTime;

    video.currentTime = currentTime + 10;

    return;
  };

  /**
   * 
   * 
   */

  const getDurationOfChapter = (items:any) => {
    if (items && items.length > 0) {
      return items.reduce((i: any, j: any) => i + parseInt(j.duration), 0);
    }
  }

  const getDurationOfTraining = (items: any) => {
    if (items && items.length > 0) {
      return items.reduce((i: any, j: any) => i + getDurationOfChapter(j.TrainingSections), 0);
    }
  }

  const getDuration = (items: any) => {
    if (items && items.length > 0) {
      return items.reduce((i: any, j: any) => {let k =j.status=='Success'?parseInt(j.duration):0;return i + k }, 0);
      
    }
  }

  const checkQuizOfChapter = (chapter:any) => {
    if(!chapter){
      chapter = currentChapter
    }
    for(let i=0;i<chapter?.TrainingSections?.length;i++){
      if(chapter?.TrainingSections[i].type==='Material')
      {
        if(getUserTraining(chapter.id, chapter?.TrainingSections[i].id)===null)
        {
          return false;
        }else if(getUserTraining(chapter.id, chapter?.TrainingSections[i].id).status==='Progress')
        {
          return false;
        }
      }
    }
    return true;
  }

  const checkLastQuiz = () => {
    for(let i=0;i<dataTraining?.TrainingChapters?.length;i++){
      if(!checkQuizOfChapter(dataTraining?.TrainingChapters[i])){
        return false;
      }
    }
    return true;
  }

  const getUserTraining = (chapterId: any, sectionId: any) => {
    for(let i=0;i<dataTraining?.UserTraining?.length;i++)
    {
      const userTraining: any = dataTraining.UserTraining[i];
      if(userTraining.last_training_chapter.id===chapterId&& userTraining.last_training_section.id === sectionId){
        return userTraining;
      }
    }
    return null;
  }

  const finishMateri = async() => {
    let sectionId=currentChapter?.TrainingSections[indexSection]?.id;
    let chapterId=currentChapter.id;
    if(getUserTraining(chapterId, sectionId)?.status==='Success')return;

    let sectionDuration=currentChapter?.TrainingSections[indexSection]?.duration;
    let status = 'Success';
    
    let duration = 0
    for(let i=0;i<=indexChapter;i++){
      duration = duration + getDurationOfChapter(dataTraining?.TrainingChapters[i]?.TrainingSections)
    }
    for(let i=0;i<=indexSection;i++){
      duration = duration + parseInt(currentChapter?.TrainingSections[i].duration);
    }

    let progress = 0;
    
    try{
      const data = {
        user_id: props.admin.id,
        training_id: dataTraining?.id,
        chapter_id: chapterId,
        section_id: sectionId,
        status: status,
        duration: sectionDuration,
        section_duration: sectionDuration,
        progress: progress
      }
      const result:any = await axios.post('/training/detail/user_training', data);
      if(result.data.success) {
        console.log('success')
        if (router.query.training) {
          getTrainingDetail(router.query.training as string);
        }
      }
      else {
        console.log('something went wrong!')
      }
    }catch(err: any) {
      console.log(err)
    }

  }

  let handleEnterViewport = function() {
    const video: any = document.getElementById('video');
    if(video && video.currentTime > 0.02){
      video.play()
    }
  }

  let handleExitViewport = async function() {
    const video: any = document.getElementById('video');
    if(video){
      video.pause()
      try{
        
        if(!currentChapter||!currentSection)return;
        let chapterId = currentChapter?.id;
        let sectionId = currentSection?.id;
        const ut = getUserTraining(chapterId, sectionId);
        
        const data = {
          user_id: props.admin.id,
          training_id: dataTraining?.id,
          chapter_id: chapterId,
          section_id: sectionId,
          status: ut?.status?ut?.status:'Progress',
          section_duration: video.currentTime,
          duration: currentSection?.duration,
          progress: 0
        }
        const result:any = await axios.post('/training/detail/user_training', data);
        if(result.data.success) {
          console.log('success')
          if (router.query.training) {
            getTrainingDetail(router.query.training as string);
          }
        }
        else {
          console.log('something went wrong!')
        }
    }catch(err: any) {
      console.log(err.toString)
    }
  }
}

  const checkQuizAnswer = () => {
    let score = 0;
    for(let i=0;i<dataAnswers.length;i++){
    const a = dataAnswers[i];
    if(a.score) score =  score + 1;
    }  
    if(score/dataAnswers.length>0.8){
      return true;
    }
    else return false;
  } 

  /**
   * 
   * 
   */
  const nextMateri = () => {
    const lastSectionOfChapter =
      !currentChapter?.TrainingSections[indexSection + 1];

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
      /**
       * 
       * 
       */
    } else if (lastSectionOfChapter) {

      /**
       * 
       */
      let chapterId = currentChapter?.id;
      let sectionId = currentSection?.id;
      console.log(chapterId, sectionId)
      const ut = getUserTraining(chapterId, sectionId);
      if(ut?.status==='Progress')
      {
      if(checkQuizAnswer()){
        window.confirm('You pass');
        const data = {
          user_id: props.admin.id,
          training_id: dataTraining?.id,
          chapter_id: ut?.last_training_chapter.id,
          section_id: ut?.last_training_section.id,
          status: ut?.status,
          section_duration: ut?.last_training_section_duration,
          progress: ut?.training_progress
        }
        const result:any = axios.post('/training/detail/user_training', data).then(result=>{
          if(result.data.success) {
            console.log('success')
            if (router.query.training) {
              getTrainingDetail(router.query.training as string);
            }
          }
          else {
            console.log('something went wrong!')
          }
        });
      }
      else{
        window.confirm("You didn't pass");
      }
      setDataAnswers([])
      }

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
          setDataTest(nextSection.TrainingPostTest);
          setLengthQuestion(nextSection.TrainingPostTest.length);
          setTick(undefined);
          setCurrentQuestion(0);
          setDataArr([]);
          clearTimeout(timeoutID.current);
        } else {
          setDataTest(nextSection.TrainingQuiz);
          setLengthQuestion(nextSection.TrainingQuiz.length);
        }

        setTitleTest(nextSection.title);
      }
    }
  };

  useEffect(() => {
    if (router.query.training) {
      getTrainingDetail(router.query.training as string);
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
    console.log('dataAnswer', dataAnswer);
  }, [dataAnswer]);

  return (
    <TemplateAuth admin={props.admin} title={'Training Detail'} noSidebar>
      <Flex p={'0 4%'} w={'100%'} direction={'row'} gap={'24px'}>
        <Flex w={'65%'} h={'fit-content'}>
          <Flex w={'100%'} gap={'24px'} direction={'column'}>
            {sectionType === 'Material' ? (
              <>
               <Waypoint 
                  onEnter={handleEnterViewport}
                  onLeave={handleExitViewport}
                ></Waypoint>
                <Box>
                  {/* {isTrailer ? (
                    <Player
                      manifestUrl={
                        isSafari
                          ? dataTraining?.video_apple_url
                          : dataTraining?.video_non_apple_url
                      }
                      licenseServer={
                        'https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=5BC068'
                      }
                      posterUrl={dataTraining?.thumbnail}
                      showControls
                      isSafari={isSafari}
                      isTrailer={isTrailer}
                    />
                  ) : (
                    <Player
                      manifestUrl={
                        isSafari
                          ? currentSection?.video_apple_url
                          : currentSection?.video_non_apple_url
                      }
                      licenseServer={
                        'https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=5BC068'
                      }
                      posterUrl={currentSection?.thumbnail}
                      duration={getUserTraining(currentChapter.id, currentSection.id)?.last_training_section_duration}
                      showControls
                      isOverlay
                      fullControls
                      onFinishFunction={finishMateri}
                      rewindFunction={rewind}
                      skipFunction={nextMateri}
                      forwardFunction={forward}
                      isSafari={isSafari}
                    />
                  )} */}
                </Box>
                <Heading size={'lg'}>{dataTraining?.title}</Heading>
                <Text>{dataTraining?.Trainer?.fullname}</Text>
                <Flex direction={'row'} gap={'24px'} alignItems={'center'}>
                  <Progress flex={'1'} value={Math.floor(100*getDuration(dataTraining?.UserTraining)/getDurationOfTraining(dataTraining?.TrainingChapters))} borderRadius={'30px'} />
                  <Text fontWeight={'bold'} color={'#005CB9'}>
                    {Math.floor(100*getDuration(dataTraining?.UserTraining)/getDurationOfTraining(dataTraining?.TrainingChapters))}%
                  </Text>
                </Flex>
              </>
            ) : (
              <Flex h={'600px'} flexDirection={'column'}>
                <Flex
                  flexDirection={'column'}
                  borderRadius={'5px'}
                  boxShadow={'0px 6px 15px 0px #00000029'}
                  h={'100%'}
                  p={'32px'}
                >
                  <Heading
                    size={'md'}
                    marginBottom={'24px'}
                    color={'#005CB9'}
                    textAlign={'center'}
                  >
                    {sectionType === 'PostTest' ? 'Test Akhir' : titleTest}
                  </Heading>
                  {currentQuestion === 0 ? (
                    <>
                      <Text marginBottom={'24px'}>
                        Berikut beberapa panduan dalam mengikuti{' '}
                        {sectionType === 'PostTest' ? 'test akhir' : 'kuis'} :
                      </Text>
                      <OrderedList spacing={'12px'}>
                        <ListItem>
                          {sectionType === 'PostTest' ? 'Tes akhir' : 'Kuis'}{' '}
                          terdiri dari {lengthQuestion} soal
                        </ListItem>
                        <ListItem>
                          Setiap soal diberikan waktu pengerjaan selama 1 menit
                        </ListItem>
                        <ListItem>
                          Jika waktu kamu habis sebelum memilih jawaban, maka
                          pertanyaan tersebut dianggap salah
                        </ListItem>
                        <ListItem>
                          Kamu harus mendapatkan nilai minimum{' '}
                          {sectionType === 'PostTest'
                            ? '60 untuk bisa download sertifikat'
                            : '80 untuk lanjut ke materi berikutnya'}
                        </ListItem>
                        <ListItem>
                          Jika nilai kamu kurang dari{' '}
                          {sectionType === 'PostTest' ? '60' : '80'}, maka kamu
                          bisa mengikuti{' '}
                          {sectionType === 'PostTest' ? 'tes akhir' : 'kuis'}{' '}
                          lagi sampai kamu memperoleh nilai minimum{' '}
                          {sectionType === 'PostTest' ? '60' : '80'}
                        </ListItem>
                        <ListItem>Jawab pertanyaan dengan hati-hati</ListItem>
                        <ListItem>Good luck!</ListItem>
                      </OrderedList>
                      <Flex
                        justifyContent={'flex-end'}
                        flex={1}
                        alignItems={'flex-end'}
                      >
                        <Button
                          bgColor={'#005CB9'}
                          color={'white'}
                          onClick={() => {
                            setCurrentQuestion(1);
                            setTick(60000);
                            setSecondsText('01:00');
                            setDataAnswer({});
                          }}
                        >
                          Mulai{' '}
                          {sectionType === 'PostTest'
                            ? 'Test Akhir'
                            : titleTest}
                        </Button>
                      </Flex>
                    </>
                  ) : (
                    <Flex flexDir={'column'} gap={'24px'} flex={1}>
                      <Flex justifyContent={'space-between'}>
                        <Text>
                          Pertanyaan <strong>{currentQuestion}</strong> dari{' '}
                          <strong>{dataTest.length}</strong>
                        </Text>
                        <Text>
                          <strong>{secondsText}</strong>
                        </Text>
                      </Flex>
                      <Flex>
                        <Text fontWeight={'bold'} marginRight={'12px'}>
                          {currentQuestion}.
                        </Text>
                        <Text>{dataTest[currentQuestion - 1]?.questions}</Text>
                      </Flex>
                      <Flex flexDir={'column'} gap={'12px'}>
                        {dataArr?.map((data: any, i: number) => (
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
                              dataAnswer?.answer?.toLowerCase() ===
                              data.toLowerCase()
                                ? {
                                    color: 'white',
                                    backgroundColor: '#005CB9',
                                  }
                                : {}
                            }
                            onClick={() =>
                              {setDataAnswer({
                                  section_id:
                                    dataTest[currentQuestion - 1]
                                      ?.training_section_id,
                                  quiz_id:dataTest[currentQuestion - 1]?.id,  
                                  answer: data,                                 
                                  score: data === dataTest[currentQuestion - 1]?.accepted_answer,
                                })
                              }
                            }
                          >
                            <Box
                              border={'1px'}
                              borderRadius={'100%'}
                              w={'20px'}
                              h={'20px'}
                              p={'4px'}
                            >
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
                        ))}
                      </Flex>
                      <Flex
                        justifyContent={'flex-end'}
                        flex={1}
                        alignItems={'flex-end'}
                      >
                        <Button
                          disabled={!dataAnswer.answer}
                          bgColor={'#005CB9'}
                          color={'white'}
                          onClick={() => {
                            if(getUserTraining(
                              currentChapter.id, 
                              dataTest[currentQuestion - 1]?.training_section_id)?.status === 'Success'
                            ) {
                              return;
                            }
                            setDataAnswers([...dataAnswers, dataAnswer]);
                            setCurrentQuestion(currentQuestion + 1);
                            setDataAnswer({});
                            setSecondsText('01:00');
                            setTick(60000);
                            if (currentQuestion === dataTest?.length) {
                              nextMateri();
                            }
                          }}
                        >
                          Selanjutnya
                        </Button>
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            )}
            <br />
            <Heading size={'md'}>Tentang Trainer</Heading>
            <Flex direction={'row'} gap={'24px'}>
              <Image
                borderRadius="full"
                boxSize="150px"
                objectFit={'cover'}
                src={dataTraining?.Trainer?.avatar}
                alt={dataTraining?.Trainer?.fullname}
              />
              <Flex
                padding={'1% 0'}
                direction={'column'}
                justifyContent={'space-between'}
              >
                <Text>{dataTraining?.Trainer?.fullname}</Text>
                <Text>{dataTraining?.Trainer?.profession}</Text>
                <Flex direction={'row'} gap={'12px'} alignItems={'flex-start'}>
                  <Image src={'/icons/icon-star.svg'} />
                  <Text>
                    {dataTraining?.Trainer?.rating} (
                    {dataTraining?.Trainer?.total_score} Penilaian)
                  </Text>
                  &#x2022;
                  <Text>{dataTraining?.Trainer?.total_training} Kelas</Text>
                </Flex>
              </Flex>
            </Flex>
            <Box>
              <Text>{dataTraining?.Trainer?.about}</Text>
            </Box>
            <br />
            <Heading size={'md'}>Deskripsi Training</Heading>
            <Flex direction={'row'} gap={'12px'}>
              <Text>{dataTraining?.Category?.name}</Text>
              &#x2022;
              <Text>{convertDuration(dataTraining?.durations)}</Text>
              &#x2022;
              <Text>
                Tanggal Rilis: {formatLocaleDateShort(dataTraining?.created_at)}
              </Text>
            </Flex>
            <Box>
              <Text>{dataTraining?.description}</Text>
            </Box>
            <br />
            <Heading size={'md'}>Apa yang kamu pelajari:</Heading>
            {dataTraining?.benefits &&
              dataTraining?.benefits.map((e: any) => {
                return (
                  <Flex direction={'row'} gap={'8px'}>
                    &#10003;
                    <Text>{e.title}</Text>
                  </Flex>
                );
              })}
          </Flex>
        </Flex>
        <Flex w={'35%'} direction={'column'}>
          <Box sx={{ position: 'sticky', top: '0' }}>
            <Flex
              bgColor={'#005CB9'}
              color={'white'}
              p={'3%'}
              borderRadius={'5px'}
              cursor={'pointer'}
              onClick={() => setIsTrailer(true)}
            >
              <Image src="/icons/icon-trailer.svg" marginRight={'12px'} />
              <Text fontWeight={'bold'}>Trailer</Text>
            </Flex>
            <br />
            <Flex
              borderRadius={'5px'}
              boxShadow={'0px 6px 15px 0px #00000029'}
              direction={'column'}
            >
              <Flex p={'3% 4%'} direction={'column'}>
                <Heading size={'sm'} color={'#005CB9'} marginBottom={'8px'}>
                  Daftar Materi Training
                </Heading>
                <Flex direction={'row'} gap={'12px'}>
                  <Text>{dataTraining?.TrainingChapters?.length} BAB</Text>
                  &#x2022;
                  <Text>
                    {countTotalMateri(dataTraining?.TrainingChapters)} Materi
                  </Text>
                  &#x2022;
                  <Text>{convertDuration(dataTraining?.durations)}</Text>
                </Flex>
              </Flex>
              <AccordionMateri
                checkQuizOfChapter={checkQuizOfChapter}
                checkLastQuiz={checkLastQuiz}
                dataTraining={dataTraining}
                indexChapter={indexChapter}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                setLengthQuestion={setLengthQuestion}
                setSectionType={setSectionType}
                setTitleTest={setTitleTest}
                setDataTest={setDataTest}
                setCurrentQuestion={setCurrentQuestion}
                setCurrentChapter={setCurrentChapter}
                setIsTrailer={setIsTrailer}
                setIndexChapter={setIndexChapter}
                setIndexSection={setIndexSection}
                timeOut={timeoutID.current}
              />
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}