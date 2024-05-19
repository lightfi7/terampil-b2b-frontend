import YearPicker from '@/components/date-picker/YearPicker';
import { ObjectiveKeyResult } from '@/components/objective-key-result/ObjectiveKeyResult';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { calculateOKR, IPagination } from '@/util';
import { Flex, Text } from '@chakra-ui/react';
import { Competency } from 'data-design/src/entity/Competency.entity';
import { EmployeeKeyResultData, EmployeeKeyResultStatus } from 'data-design/src/entity/EmployeeKeyResultData.entity';
import { KeyResult } from 'data-design/src/entity/KeyResult.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { Objective } from 'data-design/src/entity/Objective.entity';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const http_init: useHttpOutput<IPagination<Objective>> = useHttp({
    url: `/okr`
  });
  const http_get_list_competency: useHttpOutput<Competency[]> = useHttp({
    url: '/skill-gap-rekomendasi'
  });
  const http_library_recommendation_by_tags: useHttpOutput<Library[]> = useHttp({
    url: '/skill-gap-rekomendasi/by-tags'
  });
  const http_my_training_proposal: useHttpOutput<TrainingProposal[]> = useHttp({
    url: '/development-plan/proposal'
  });
  const http_submit_okr: useHttpOutput<void> = useHttp({
    url: '/okr/:id_key_result/submit'
  });
  const http_submission_history: useHttpOutput<EmployeeKeyResultData[]> = useHttp({
    url: '/okr/:id_key_result/sumission-history'
  });

  const pencapaian_global = calculateOKR(http_init.result?.data);
  const [year_date, setYearDate] = useState<Date>(new Date());

  function init() {
    http_my_training_proposal.get({
      query: {
        id: props.admin.id
      }
    });
  }

  useEffect(() => {
    http_init.get({
      query: {
        limit: Number.MAX_SAFE_INTEGER,
        offset: 0,
        employee_id: props.admin.id,
        type: 'karyawan',
        year: year_date.getFullYear()
      }
    });
  }, [year_date]);

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Dashboard'}>
      <Flex 
        p={'0 12px'}
        direction={'column'}
        gap={'24px'}>
        <Flex 
          justify={'space-between'}
          align={'center'}>
          <Flex
            align={'center'}
            gap={'12px'}>
            <YearPicker
              value={year_date}
              setValue={setYearDate} />
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
              { pencapaian_global.toFixed(2) }%
            </Text>
          </Flex>
        </Flex>
        <Flex 
          direction={'column'}
          gap={'12px'}>
          {
            http_init.result?.data.map((objektif: Objective, i: number) => (
              <ObjectiveKeyResult 
                data={objektif.list_key_result}
                objektif={objektif}
                history={http_submission_history}
                // no review
                // no checkHttp
                // no uncheckHttp
                employee={props.admin}
                key={i} 
                proposal={http_my_training_proposal.result}
                getRecommendationByTags={http_library_recommendation_by_tags}
                getListCompetency={async (kr: KeyResult) => await http_get_list_competency.get({
                  query: {
                    key_result_id: kr.id
                  }
                })}
                submit={http_submit_okr} />
            ))
          }
        </Flex>
        <br/>
      </Flex>
    </TemplateAuth>
  );
}
