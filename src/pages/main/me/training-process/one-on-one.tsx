import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { GeneralAssessmentLibrary } from '@/components/general-assessment-library/GeneralAssessmentLibrary';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { uploadFile } from '@/util';
import { Flex } from '@chakra-ui/react';
import { WithAdminPageProps, getServerSideProps } from 'cookies.util';
import { TrainingProposal } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { training_proposal_id } = router.query;
  const [loading_upload_evidence, setLoadingUploadEvidence] = useState<boolean>(false);

  const http_development_plan = useHttp<TrainingProposal>({
    url: `/development-plan/proposal/${training_proposal_id}`,
    initialLoading: true
  });
  const http_update_progress_check_in = useHttp<any>({
    url: '/development-plan/proposal/:id/update-progress',
    callback: http_development_plan.get
  });
  const http_update_progress_check_out = useHttp<any>({
    url: '/development-plan/proposal/:id/update-progress',
    callback: http_development_plan.get
  });
  const http_submit_evidence = useHttp<any>({
    url: '/development-plan/proposal/:id/submit-evidence',
    callback: http_development_plan.get
  });

  async function init() {
    http_development_plan.get();
  }

  function checkIn() {
    http_update_progress_check_in.put({
      progress: .5
    }, {
      params: {
        id: training_proposal_id as string
      }
    });
  }

  function checkOut() {
    http_update_progress_check_out.put({
      progress: 1
    }, {
      params: {
        id: training_proposal_id as string
      }
    });
  }

  async function submitEvidence(value: number, evidence_file: any) {
    const evidence = await uploadFile(evidence_file, setLoadingUploadEvidence);
    http_submit_evidence.put({
      value,
      evidence
    }, {
      params: {
        id: training_proposal_id as string
      }
    });
  }

  useEffect(() => {
    if (!training_proposal_id) { return };
    init();
  }, [training_proposal_id]);

  return (
    <TemplateAuth
      noSidebar
      admin={props.admin}
      title={`One on One Session: ${http_development_plan.result?.library.title}`}>
      <Flex 
        mb={'12px'}
        p={'0 36px'}
        direction={'column'}
        gap={'48px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Kembali'} />
        <GeneralAssessmentLibrary
          pageTitle={'One on One Session'}
          title={http_development_plan.result?.library?.title ?? ''}
          thumbnail={http_development_plan.result?.library?.thumbnail}
          description={http_development_plan.result?.library?.description}
          fileURL={http_development_plan.result?.library.file}
          evidenceURL={http_development_plan.result?.submission_evidence}
          loadingCheckIn={http_update_progress_check_in.loading}
          submissionValue={http_development_plan.result?.submission_value}
          loadingCheckOut={http_update_progress_check_out.loading}
          loadingSubmit={loading_upload_evidence || http_submit_evidence.loading}
          onCheckIn={checkIn}
          onCheckOut={checkOut}
          onSubmitAssignment={submitEvidence}
          progress={http_development_plan.result?.progress} />
      </Flex>
    </TemplateAuth>
  );
}
