import { AButton } from '@/components/button/AButton';
import YearPicker from '@/components/date-picker/YearPicker';
import { XInputSelect } from '@/components/form/input/XInputSelect';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { currencyFormatter } from '@/components/input-number';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import { useHttp, useHttpOutput } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogHeader, AlertDialogOverlay, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { TrainingProposal, TrainingProposalStatus } from 'data-design/src/entity/TrainingProposal.entity';
import _ from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PlanBudgetFinal } from '..';
import { getServerSideProps, WithAdminPageProps } from '../../../../../../cookies.util';
import { TrainingBudgetInGroupLibrary, groupTrainingProposalIntoLibraryGroup } from '@/util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const http_training_budget_organization_node: useHttpOutput<PlanBudgetFinal.OrganizationTrainingBudget> = useHttp({
    url: '/training-budget/organization-node/:id'
  });
  const http_training_proposal_status = useHttp({
    url: '/training-proposal',
    callback: init
  });

  const modal_training_participant = useDisclosure();
  const [year, setYear] = useState<number>(parseInt(moment().format('YYYY')));
  const total_budget = (http_training_budget_organization_node?.result?.data ?? []).reduce((acc: number, curr: TrainingProposal) => acc + +curr.proposal_budget, 0);
  const [selected_ids, setSelectedIDs] = useState<string[]>([]);
  const [selected_status, setSelecteStatus] = useState<TrainingProposalStatus>('' as any);
  const [selected_training_group, setSelectedTrainingGroup] = useState<TrainingBudgetInGroupLibrary>();
  const grouped_data: TrainingBudgetInGroupLibrary[] = groupTrainingProposalIntoLibraryGroup((http_training_budget_organization_node.result?.data ?? []).sort((a, b) => moment(a.training_date).unix() - moment(b.training_date).unix()));
  const list_budget_monthly = _.groupBy(grouped_data, x => moment(x.list_proposal[0].training_date).format('MM/YYYY'));

  async function changeTrainingStatus() {
    try {
      const list_proposal_id: number[] = grouped_data
        .filter((item: TrainingBudgetInGroupLibrary) => selected_ids.includes(item.id))
        .map((item: TrainingBudgetInGroupLibrary) => item.list_proposal.map(p => p.id))
        .reduce((acc: number[], curr: number[]) => [...acc, ...curr], []);
      await http_training_proposal_status.put({
        ids: list_proposal_id.map(String),
        status: selected_status
      });
    } catch (err: any) {
      alert(err.response.data.toString());
    }
  }

  function init() {
    http_training_budget_organization_node.get({
      query: {
        year
      }, params: {
        id: id as string
      }
    });
  }

  useEffect(() => {
    init();
  }, [year]);

  return (
    <TemplateAuth
      admin={props.admin}
      title={`Plan & Budget Final ${http_training_budget_organization_node?.result?.organization?.name}`}>
      <Flex
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
        <Flex
          gap={'12px'}>
          <Flex>
            <YearPicker 
              setValue={(date: Date) => setYear(date.getFullYear())}
              value={moment().set('year', year).toDate()} />
          </Flex>
          <TableAction />
        </Flex>
        <GeneralContainer title={'Budget yang diajukan'}>
          <Flex
            align={'center'}
            gap={'6px'}>
            <Text
              fontSize={'.88em'}>
              Total budget yang dipakai:
            </Text>
            <Text
              color={'brand'}
              fontWeight={700}
              fontSize={'1.3em'}>
              { currencyFormatter.format(total_budget) }
            </Text>
          </Flex>
        </GeneralContainer>
        <GeneralContainer title={'Plan & Budget Final'}>
          <Flex
            gap={'12px'}>
            <XInputSelect 
              containerStyle={{
                padding: 0,
                width: 250,
              }}
              placeholder={'Status'}
              type={"dropdown"}
              value={selected_status}
              onChange={setSelecteStatus}
              loading={http_training_proposal_status.loading}
              options={Object.keys(TrainingProposalStatus).map(value => ({ value, label: value }))} />
            <Button
              variant={'outline'}
              onClick={changeTrainingStatus}>
              Update Status
            </Button>
          </Flex>
          {
            Object.keys(list_budget_monthly).sort().map((key: string) => (
              <Flex
                key={key}
                direction={'column'}
                gap={'12px'}>
                <Text>
                  { moment(key, 'MM/YYYY').format('MMMM YYYY') }
                </Text>
                <XTable 
                  selectMode={{
                    getSelectedID(t: TrainingBudgetInGroupLibrary) {
                      return t.id;
                    },
                    selected: selected_ids,
                    setSelected: setSelectedIDs
                  }}
                  data={{
                    header: [{
                      label: 'Training',
                      key: 'training-budget',
                      w: '200px',
                      normal: true,
                      renderValue(node: TrainingBudgetInGroupLibrary) {
                        return node.library?.title;
                      }
                    }, {
                      label: 'Total Peserta',
                      key: 'org-node',
                      renderValue(node: TrainingBudgetInGroupLibrary) {
                        return <Text 
                          cursor={'pointer'}
                          onClick={() => {
                            setSelectedTrainingGroup(node);
                            modal_training_participant.onOpen();
                          }}>
                          { node.list_proposal.length }
                        </Text>;
                      }
                    }, {
                      label: 'Cost',
                      key: 'cost',
                      renderValue(node: TrainingBudgetInGroupLibrary) {
                        const total_cost = node.list_proposal.reduce((acc: number, curr: TrainingProposal) => acc + +curr.proposal_budget, 0);
                        return currencyFormatter.format(total_cost);
                      }
                    }, {
                      label: 'Status',
                      key: 'status',
                      renderValue(node: TrainingBudgetInGroupLibrary) {
                        return node.list_proposal[0].status;
                      }
                    }, {
                      label: 'Training Date',
                      key: 'date',
                      renderValue(node: TrainingBudgetInGroupLibrary) {
                        return moment(node.list_proposal[0].training_date).format('DD MMMM YYYY');
                      }
                    }],
                    data: list_budget_monthly[key]
                  }} />
              </Flex>
            ))
          }
        </GeneralContainer>
      </Flex>
      <AlertDialog
        isOpen={modal_training_participant.isOpen}
        leastDestructiveRef={null as any}
        onClose={modal_training_participant.onClose}
        isCentered
        size={'lg'}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              { moment(selected_training_group?.list_proposal[0].training_date).format('DD MMMM YYYY') }: { selected_training_group?.library.title }
            </AlertDialogHeader>
            <AlertDialogBody
              mb={'24px'}>
              <XTable 
                data={{
                  header: [{
                    label: 'Karyawan',
                    key: 'karyawan',
                    normal: true,
                    renderValue(node: TrainingProposal) {
                      return node.employee?.name;
                    }
                  }, {
                    label: 'Organization Node',
                    key: 'org-node',
                    renderValue(node: TrainingProposal) {
                      return node.employee?.job_profile?.organization_node?.name;
                    }
                  }, {
                    label: 'Cost',
                    key: 'cost',
                    renderValue(node: TrainingProposal) {
                      return currencyFormatter.format(node.proposal_budget);
                    }
                  }],
                  data: selected_training_group?.list_proposal ?? []
                }} />
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </TemplateAuth>
  );
}
