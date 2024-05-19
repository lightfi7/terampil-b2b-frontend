import { AButton } from '@/components/button/AButton';
import YearPicker from '@/components/date-picker/YearPicker';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { ModalContentTransferSpecificOKR } from '@/components/modal/ModalContentTransferSpecificOKR';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { ObjectiveKeyResult } from '@/components/objective-key-result/ObjectiveKeyResult';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination } from '@/util';
import { Flex, Text } from '@chakra-ui/react';
import { Competency } from 'data-design/src/entity/Competency.entity';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { EmployeeKeyResultData, EmployeeKeyResultStatus } from 'data-design/src/entity/EmployeeKeyResultData.entity';
import { KeyResult } from 'data-design/src/entity/KeyResult.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { Objective } from 'data-design/src/entity/Objective.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;

  const http_init: useHttpOutput<Objective[]> = useHttp({
    url: `/team-okr`
  });
  const http_get_list_competency: useHttpOutput<Competency[]> = useHttp({
    url: '/skill-gap-rekomendasi'
  });
  const http_library_recommendation_by_tags: useHttpOutput<Library[]> = useHttp({
    url: '/skill-gap-rekomendasi/by-tags'
  });
  const http_team_training_proposal: useHttpOutput<TrainingProposal[]> = useHttp({
    url: '/development-plan/team-proposal'
  });
  const http_propose_training: useHttpOutput<TrainingProposal[]> = useHttp({
    url: 'development-plan/library/:id/propose-to/:id_employee',
    callback: init
  });
  const http_unpropose_training: useHttpOutput<TrainingProposal[]> = useHttp({
    url: 'development-plan/library/:id/unpropose-from/:id_employee',
    callback: init
  });
  const http_delete_okr: useHttpOutput<any> = useHttp({
    url: '/okr/:id',
    callback: init
  });
  const http_transfer_okr: useHttpOutput<any> = useHttp({
    url: '/okr/:id/transfer',
    callback() {
      modal_transfer_okr?.close();
      init();
    }
  });
  const http_get_karyawan: useHttpOutput<IPagination<Employee>> = useHttp({
    url: 'karyawan'
  });
  const http_review_okr: useHttpOutput<any> = useHttp({
    url: '/okr/:id_key_result_data/review'
  });
  const http_submission_history: useHttpOutput<EmployeeKeyResultData[]> = useHttp({
    url: '/okr/:id_key_result/sumission-history'
  });

  const [modal_transfer_okr, setModalTransferOKR] = useState<OnModalReady>();
  const [popup_okr_data, setPopupOKRData] = useState<Objective>();
  const list_pencapaian_global = (http_init.result ?? []).map((o: Objective) => {
    const list_total_kr = o.list_key_result.map((kr: KeyResult) => {
      const list_total_pencapaian = kr.list_key_result_data.map((ekrd: EmployeeKeyResultData) => ekrd.status === EmployeeKeyResultStatus.APPROVE ? +ekrd.value : 0);
      const total_pencapaian = list_total_pencapaian.reduce((acc, cur) => acc + cur, 0);
      return total_pencapaian / kr.target * (kr.weight / 100);
    });

    return list_total_kr.reduce((acc, cur) => acc + cur, 0) * (o.weight / 100);
  });
  const total_weight_global = (http_init.result ?? []).reduce((acc: number, cur: Objective) => acc + cur.weight, 0);
  const total_pencapaian_global = 100 * list_pencapaian_global.reduce((acc, cur) => acc + cur, 0) / (total_weight_global / 100);
  
  async function transferOKR(destination_employee_id: number) {
    http_transfer_okr.post({
      destination_employee_id
    }, {
      params: {
        id: popup_okr_data?.id ?? ''
      }
    });
  }

  function init() {
    http_get_karyawan.get({
      query: {
        limit: Number.MAX_SAFE_INTEGER
      }
    });
    http_team_training_proposal.get({
      query: {
        id
      }
    });
    http_init.get({
      query: {
        limit: Number.MAX_SAFE_INTEGER,
        offset: 0,
        employee_id: id,
        type: 'karyawan'
      }
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Team Members OKRs'}>
      <Flex 
        p={'0 12px'}
        direction={'column'}
        gap={'24px'}>
        <Flex 
          mt={'12px'}
          justify={'space-between'}
          align={'center'}>
          <Flex
            align={'center'}
            gap={'12px'}>
            <YearPicker
              value={new Date()}
              setValue={() => {}} />
            <Flex>
              <AButton
                borderRadius={999}
                pl={'18px'}
                pr={'18px'}
                onClick={() => window.location.href = `/main/okr/add?type=karyawan&is_team=true`}>
                + Tambah Objective
              </AButton>
            </Flex>
          </Flex>
          <Flex
            bg={'brand'}
            color={'#FFF'}
            padding={'8px 40px'}
            borderRadius={'5px'}
            fontWeight={600}
            gap={'48px'}
            align={'center'}>
            <Text>
              Hasil Objectives
            </Text>
            <Text 
              fontSize={'1.5em'}>
              { total_pencapaian_global.toFixed(2) }%
            </Text>
          </Flex>
        </Flex>
        <Flex 
          direction={'column'}
          gap={'12px'}>
          {
            http_init.result?.map((objektif: Objective, i: number) => (
              <ObjectiveKeyResult 
                showEmployeeName
                data={objektif.list_key_result}
                objektif={objektif}
                review={http_review_okr}
                checkHttp={http_propose_training}
                uncheckHttp={http_unpropose_training}
                employee={objektif.employee}
                history={http_submission_history}
                key={i} 
                proposal={http_team_training_proposal.result}
                getRecommendationByTags={http_library_recommendation_by_tags}
                onTransfer={() => {
                  setPopupOKRData(objektif);
                  modal_transfer_okr?.open();
                }}
                onDelete={() => {
                  if (confirm('Hapus data ini?')) {
                    http_delete_okr.del({
                      params: {
                        id: objektif.id
                      }
                    });
                    return true;
                  }
                }}
                getListCompetency={async (kr: KeyResult) => await http_get_list_competency.get({
                  query: {
                    key_result_id: kr.id
                  }
                })} />
            ))
          }
        </Flex>
        <br/>
      </Flex>
      <ModalInfo
        mdWidth={600}
        title={`Transfer OKR to`}
        setOnModalReady={setModalTransferOKR}>
        <ModalContentTransferSpecificOKR 
          loading={http_transfer_okr.loading}
          employees={http_get_karyawan.result?.data ?? []}
          onSubmit={transferOKR} />
      </ModalInfo>
    </TemplateAuth>
  );
}
