import { Button, Flex, ListItem, OrderedList, Text } from "@chakra-ui/react";

interface SectionQuizIntroProps {
  sectionType?: string
  lengthQuestion?: number
  setCurrentQuestion?(i: number): void
  setTick?(s: number): void
  setSecondsText?(t: string): void
  setDataAnswer?(x: any): void
  titleTest?: string
}

export function SectionQuizIntro(props: SectionQuizIntroProps) {
  return (
    <Flex
      direction={'column'}>
      <Text marginBottom={'24px'}>
        Berikut beberapa panduan dalam mengikuti{' '}
        {
          props.sectionType === 'PostTest' 
          ? 'test akhir' 
          : 'kuis'
        } :
      </Text>
      <OrderedList spacing={'12px'}>
        <ListItem>
          {
            props.sectionType === 'PostTest' 
            ? 'Tes akhir' 
            : 'Kuis'
          }{' '}
          terdiri dari { props.lengthQuestion } soal
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
          {
            props.sectionType === 'PostTest'
            ? '60 untuk bisa download sertifikat'
            : '80 untuk lanjut ke materi berikutnya'
          }
        </ListItem>
        <ListItem>
          Jika nilai kamu kurang dari{' '}
          {
            props.sectionType === 'PostTest' 
            ? '60' 
            : '80'
          }, maka kamu
          bisa mengikuti{' '}
          {
            props.sectionType === 'PostTest' 
            ? 'tes akhir' 
            : 'kuis'
          }{' '}
          lagi sampai kamu memperoleh nilai minimum{' '}
          {
            props.sectionType === 'PostTest' 
            ? '60' 
            : '80'
          }
        </ListItem>
        <ListItem>Jawab pertanyaan dengan hati-hati</ListItem>
        <ListItem>Good luck!</ListItem>
      </OrderedList>
      <Flex
        justifyContent={'flex-end'}
        flex={1}
        alignItems={'flex-end'}>
        <Button
          bgColor={'#005CB9'}
          color={'white'}
          onClick={() => {
            props.setCurrentQuestion && props.setCurrentQuestion(1);
            props.setTick && props.setTick(60000);
            props.setSecondsText && props.setSecondsText('01:00');
            props.setDataAnswer && props.setDataAnswer({});
          }}
        >
          Mulai{' '}
          {
            props.sectionType === 'PostTest'
            ? 'Test Akhir'
            : props.titleTest
          }
        </Button>
      </Flex>
    </Flex>
  );
}
