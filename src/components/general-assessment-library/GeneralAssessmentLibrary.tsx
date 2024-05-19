import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import { ModalInfo, OnModalReady } from "../modal/ModalInfo";
import { ModalContentTrainingDevelopmentProgress } from "../modal/ModalContentTrainingDevelopmentProgress";
import { useEffect, useState } from "react";

interface GeneralAssessmentLibraryProps {
  pageTitle: string
  thumbnail?: string
  title: string
  description?: string
  onCheckIn?(): void
  onCheckOut?(): void
  fileURL?: string
  evidenceURL?: string
  submissionValue?: number
  onSubmitAssignment?(value: number, evidence_file: any): void
  hideButtons?: boolean
  loadingCheckIn?: boolean
  loadingCheckOut?: boolean
  loadingSubmit?: boolean
  progress?: number
}

export function GeneralAssessmentLibrary(props: GeneralAssessmentLibraryProps) {
  const disable_check_in = Boolean(props.progress) && ((props.progress ?? 0) >= .5);
  const disable_check_out = !props.progress || props.progress < .5 || props.progress == 1 || !props.submissionValue;
  const [modal_evidence, setModalEvidence] = useState<OnModalReady>();

  useEffect(() => {
    if (!props.loadingSubmit) {
      modal_evidence?.close();
    }
  }, [props.loadingSubmit]);

  return (
    <Flex
      gap={'24px'}
      p={'0 8%'}
      align={'flex-start'}>
      <Flex
        border={'solid 1px #EEE'}
        overflow={'hidden'}
        bg={'#FFF'}
        borderRadius={24}
        boxShadow={'0px 5px 15px rgba(0, 0, 0, .1)'}
        w={'30%'}
        align={'flex-start'}
        direction={'column'}
        gap={'12px'}>
        <Image
          src={props.thumbnail}
          w={'100%'}
          h={'250px'}
          border={'solid 1px #F5F5F5'}
          bg={'#FAFAFA'}
          objectFit={'cover'} />
        <Flex
          direction={'column'}
          p={'0px 24px'}
          pb={'24px'}
          w={'100%'}
          align={'center'}>
          <Text
            fontWeight={700}
            fontSize={'1.8em'}>
            { props.pageTitle }
          </Text>
          <Text
            fontWeight={600}>
            { props.title }
          </Text>
          <Flex
            mt={'24px'}
            direction={'column'}
            alignSelf={'flex-start'}>
            <Text>
              Description:
            </Text>
            <Text>
              { props.description ?? '-' }
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        border={'solid 1px #EEE'}
        overflow={'hidden'}
        bg={'#FFF'}
        py={'36px'}
        borderRadius={24}
        boxShadow={'0px 5px 15px rgba(0, 0, 0, .1)'}
        flex={1}
        align={'center'}
        direction={'column'}
        gap={'24px'}>
        <Text
          fontSize={'1.5em'}
          fontWeight={700}>
          { props.pageTitle }
        </Text>
        <Flex
          direction={'column'}
          gap={'12px'}>
          <Flex
            direction={'column'}
            gap={'8px'}
            align={'center'}>
            <Image
              w={'24px'}
              h={'24px'}
              objectFit={'contain'}
              src={'/icons/lib-calendar.svg'} />
            <Text>
              Tanggal pelaksanaan: Senin, 12 Januari 2022
            </Text>
          </Flex>
          <Flex
            direction={'column'}
            gap={'8px'}
            align={'center'}>
            <Image
              w={'24px'}
              h={'24px'}
              objectFit={'contain'}
              src={'/icons/lib-clock.svg'} />
            <Text>
              Waktu pelaksanaan: 10:00 am - 11:30 pm
            </Text>
          </Flex>
          <Flex
            direction={'column'}
            gap={'8px'}
            align={'center'}>
            <Image
              w={'24px'}
              h={'24px'}
              objectFit={'contain'}
              src={'/icons/lib-pin.svg'} />
            <Text>
              Lokasi pelaksanaan: Menara XZY, lantai 21, Jakarta Pusat, 10204
            </Text>
          </Flex>
        </Flex>
        { !props.hideButtons && <Flex
          align={'center'}
          justify={'space-between'}
          px={'20%'}
          gap={'12px'}
          w={'100%'}>
          <Flex
            direction={'column'}
            gap={'36px'}
            align={'center'}>
            <Flex
              direction={'column'}
              align={'center'}
              gap={'8px'}>
              <Text
                fontSize={'.9em'}>
                Download Attachment
              </Text>
              <Link
                href={props.fileURL}>
                <Button
                  borderRadius={999}
                  bg={'#ECAB06'}
                  _hover={{
                    bg: '#ECAB06CC'
                  }}
                  color={'#FFF'}>
                  Download
                </Button>
              </Link>
              { props.evidenceURL && <Text>
                &nbsp;
              </Text> }
            </Flex>
            <Button
              borderRadius={999}
              bg={'#01A2BC'}
              _hover={{
                bg: '#01A2BCCC'
              }}
              color={'#FFF'}
              isLoading={props.loadingCheckIn}
              onClick={props.onCheckIn}
              disabled={disable_check_in}>
              Check In
            </Button>
          </Flex>
          <Flex
            direction={'column'}
            gap={'36px'}
            align={'center'}>
            <Flex
              direction={'column'}
              align={'center'}
              gap={'8px'}>
              <Text
                fontSize={'.9em'}>
                Submit Evidence
              </Text>
              <ModalInfo
                mdWidth={600}
                title={`Submit Evidence`}
                setOnModalReady={setModalEvidence}
                trigger={
                  <Button
                    borderRadius={999}
                    bg={'#ECAB06'}
                    _hover={{
                      bg: '#ECAB06CC'
                    }}
                    color={'#FFF'}>
                    Submit
                  </Button>
                }>
                <ModalContentTrainingDevelopmentProgress
                  loading={props.loadingSubmit}
                  onSubmit={props.onSubmitAssignment}
                  onCancel={modal_evidence?.close} />
              </ModalInfo>
              { props.evidenceURL && <Link
                href={props.evidenceURL}>
                Download File
              </Link> }
            </Flex>
            <Button
              borderRadius={999}
              bg={'#005CB9'}
              _hover={{
                bg: '#005CB9CC'
              }}
              color={'#FFF'}
              isLoading={props.loadingCheckOut}
              onClick={props.onCheckOut}
              disabled={disable_check_out}>
              Check Out
            </Button>
          </Flex>
        </Flex> }
      </Flex>
    </Flex>
  );
}
