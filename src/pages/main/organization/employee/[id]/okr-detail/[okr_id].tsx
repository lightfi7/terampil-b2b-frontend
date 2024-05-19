import { AButton } from '@/components/button/AButton';
import YearPicker from '@/components/date-picker/YearPicker';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { ModalContentFeedbackProgressOKR } from '@/components/modal/ModalContentFeedbackProgressOKR';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { ObjectiveKeyResult } from '@/components/objective-key-result/ObjectiveKeyResult';
import { OKRKeyResultProgressMonthly } from '@/components/objective-key-result/OKRKeyResultProgressMonthly';
import { TemplateAuth } from '@/template-auth';
import { getMonthsToNowFrom } from '@/util';
import { Flex, Text } from '@chakra-ui/react';
import axios from 'axios';
import { WithAdminPageProps, getServerSideProps } from 'cookies.util';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { okr_id } = router.query;
  const [okr, setOKR] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loading_submit, setLoadingSubmit] = useState<boolean>(false);
  const list_month = getMonthsToNowFrom(okr?.jadwal_mulai ?? new Date());
  const [modal_approve_control, setModalApproveControl] = useState<OnModalReady>();
  const [modal_reject_control, setModalRejectControl] = useState<OnModalReady>();
  const [focus_pencapaian, setFocusPencapaian] = useState<any>();

  async function init() {
    setLoading(true);
    try {
      setOKR((await axios.get(`/okr/${okr_id}`)).data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  function onApproveReject(p: any, approve: boolean) {
    if (approve) {
      modal_approve_control?.open();
    } else {
      modal_reject_control?.open();
    }
    setFocusPencapaian(p);
  }

  async function onSubmitApproveReject(approve: boolean, feedback?: string) {
    setLoadingSubmit(true);
    try {
      await axios.post(`/okr/${focus_pencapaian?.id}/approve-reject-pencapaian`, {
        approve, feedback
      });
      init();
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoadingSubmit(false);
      modal_approve_control?.close();
      modal_reject_control?.close();
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Dashboard'}
      noSidebar>
      <Flex 
        p={'0 4%'}
        direction={'column'}
        gap={'24px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Review Progress OKRs Karyawan'} />
        <Flex direction={'column'}>
          <Text 
            color={'#626262'}
            fontSize={'.8em'}>
            Objective
          </Text>
          <Text
            fontWeight={600}
            color={'#373737'}>
            { okr?.objective?.judul }
          </Text>
          <Text 
            mt={'12px'}
            color={'#626262'}
            fontSize={'.8em'}>
            Key Result
          </Text>
          <Text
            fontWeight={600}
            color={'#373737'}>
            { okr?.judul }
          </Text>
        </Flex>
        <Flex
          bg={'#E5E5E5'}>
          <Text 
            flex={1}
            p={'12px 16px'}
            fontSize={'.8em'}
            fontWeight={700}>
            Periode Update
          </Text>
          <Text 
            flex={1}
            p={'12px 16px'}
            fontSize={'.8em'}
            fontWeight={700}>
            Jumlah Update
          </Text>
          <Text 
            flex={1}
            p={'12px 16px'}
            fontSize={'.8em'}
            fontWeight={700}>
            Target per Periode
          </Text>
          <Text 
            flex={1}
            p={'12px 16px'}
            fontSize={'.8em'}
            fontWeight={700}>
            Pencapaian
          </Text>
          <Text 
            flex={1}
            p={'12px 16px'}
            fontSize={'.8em'}
            fontWeight={700}>
            Hasil
          </Text>
          <Text 
            flex={1}
            p={'12px 16px'}
            fontSize={'.8em'}
            fontWeight={700}>
            Status
          </Text>
        </Flex>
        {
          list_month.reverse().map((date: Date, i: number) => (
            <OKRKeyResultProgressMonthly
              onApproveReject={onApproveReject}
              date={date}
              okr={okr!}
              key={i} />
          ))
        }
        <br/>
      </Flex>
      <ModalInfo
        mdWidth={600}
        title={`Apakah Anda yakin approve progress?`}
        setOnModalReady={setModalApproveControl}>
        <ModalContentFeedbackProgressOKR
          loading={loading_submit}
          onSubmit={onSubmitApproveReject}
          onCancel={() => {
            modal_reject_control?.close();
            modal_approve_control?.close();
          }} 
          type={'approve'} 
          nama={''} />
      </ModalInfo>
      <ModalInfo
        mdWidth={600}
        title={`Apakah Anda yakin reject?`}
        setOnModalReady={setModalRejectControl}>
        <ModalContentFeedbackProgressOKR
          loading={loading_submit}
          onSubmit={onSubmitApproveReject}
          onCancel={() => {
            modal_reject_control?.close();
            modal_approve_control?.close();
          }} 
          type={'reject'} 
          nama={''} />
      </ModalInfo>
    </TemplateAuth>
  );
}
