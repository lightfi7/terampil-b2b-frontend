import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { ModalContentPreMadeOKRAssign } from '@/components/modal/ModalContentPreMadeOKRAssign';
import { ModalInfo, OnModalReady } from '@/components/modal/ModalInfo';
import { ObjectiveKeyResult } from '@/components/objective-key-result/ObjectiveKeyResult';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { IPagination, uploadFile } from '@/util';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Flex, Image, Link, Text, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { Competency, CompetencyType } from 'data-design/src/entity/Competency.entity';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { JobProfile } from 'data-design/src/entity/JobProfile.entity';
import { KeyBehavior } from 'data-design/src/entity/KeyBehavior.entity';
import { KeyResult } from 'data-design/src/entity/KeyResult.entity';
import { Library } from 'data-design/src/entity/Library.entity';
import { PreMadeOKR } from 'data-design/src/entity/PreMadeOKR.entity';
import { PreMadeOKRObjective } from 'data-design/src/entity/PreMadeOKRObjective.entity';
import { ProficiencyLevel } from 'data-design/src/entity/ProficiencyLevel.entity';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../../cookies.util';
export { getServerSideProps };

export namespace CDDTO {
  export interface ProficiencyLevel {
    label: string
    list_key_behavior: string[]
  }

  export interface Competency {
    competency: string
    job_profile_id: number
    minimum_score: number
    weight: number
    type: CompetencyType
    list_proficiency_level: ProficiencyLevel[]
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const dialog_delete = useDisclosure();
  const cancelRef = useRef(null);

  const http_init: useHttpOutput<PreMadeOKR> = useHttp({
    url: `/pre-made-okrs/:id`
  });
  const http_delete_pre_made_okr: useHttpOutput<any> = useHttp({
    url: `/pre-made-okrs/:id`,
    callback() {
      dialog_delete.onClose();
      // window.location.href = '/main/library/pre-made-okrs';
    }
  });
  const http_library_recommendation_by_tags: useHttpOutput<Library[]> = useHttp({
    url: '/skill-gap-rekomendasi/by-tags'
  });
  const http_assign_okr: useHttpOutput<any> = useHttp({
    url: '/pre-made-okrs/:id/assign-to/:employee_id'
  });
  const http_get_karyawan: useHttpOutput<IPagination<Employee>> = useHttp({
    url: 'karyawan'
  });

  const [modal, setModal] = useState<OnModalReady>();

  async function init() {
    http_init.get({
      params: {
        id: id as string
      }
    });
    http_get_karyawan.get({
      query: {
        limit: Number.MAX_SAFE_INTEGER
      }
    })
  }
  
  async function getListCompetency(data: KeyResult): Promise<Competency[]> {
    const res = await axios.get('skill-gap-rekomendasi', {
      params: {
        key_result_id: data.id
      }
    });
    return res.data;
  }

  async function submitOKR(employee_id: number, pre_made_okr_id: number) {
    await http_assign_okr.post({}, {
      params: {
        id: pre_made_okr_id,
        employee_id
      }
    });
    modal?.close();
  }

  async function deletePMOKR() {
    http_delete_pre_made_okr.del({
      params: {
        id: id as string
      }
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      title={`Pre Made OKR ${http_init?.result?.position}`}
      admin={props.admin}>
      <Flex 
        direction={'column'}
        gap={'12px'}
        padding={'0 12px'}>
        <DetailNavigation
          onBack={() => window.history.back()}
          title={'Back'} />
        <Flex
          justify={'space-between'}>
          <Button
            fontSize={'.9em'}
            onClick={() => window.location.href = `${id}/objective/add`}>
            + Tambah Objektif
          </Button>
          <Flex
            gap={'12px'}>
            <ModalInfo
              mdWidth={600}
              title={`Apakah Anda yakin reject progress dari ZZZ?`}
              setOnModalReady={setModal}
              trigger={
                <Button
                  fontSize={'.9em'}>
                  Assign to OKR
                </Button>
              }>
              <ModalContentPreMadeOKRAssign
                loading={http_assign_okr.loading}
                onSubmit={submitOKR}
                onCancel={() => modal?.close()} 
                data={http_init?.result}
                employees={http_get_karyawan.result?.data} />
            </ModalInfo>
            <Button
              fontSize={'.9em'}
              onClick={dialog_delete.onOpen}
              colorScheme={'red'}>
              Delete Pre Made OKR
            </Button>
            <AlertDialog
              isOpen={dialog_delete.isOpen}
              leastDestructiveRef={cancelRef}
              onClose={dialog_delete.onClose}
              isCentered>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete Customer
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={dialog_delete.onClose}>
                      Cancel
                    </Button>
                    <Button 
                      colorScheme='red' 
                      onClick={deletePMOKR} 
                      ml={3}
                      isLoading={http_delete_pre_made_okr.loading}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>
        </Flex>
        {
          (http_init.result?.list_pm_objective ?? []).map((pm_obj: PreMadeOKRObjective) => (
            <ObjectiveKeyResult 
              key={pm_obj.id}
              proposal={[]}
              getRecommendationByTags={http_library_recommendation_by_tags}
              getListCompetency={getListCompetency}
              objektif={pm_obj.objective}
              data={pm_obj.objective.list_key_result}
              onDetail={() => window.location.href = `${id}/objective/${pm_obj.objective.id}`} />
          ))
        }
      </Flex>
    </TemplateAuth>
  );
}
