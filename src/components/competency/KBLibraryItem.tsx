import { useHttpOutput } from "@/hooks/useHttp";
import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { Library } from "data-design/src/entity/Library.entity";
import { TrainingProposal } from "data-design/src/entity/TrainingProposal.entity";
import _ from "lodash";
import { memo, useMemo, useState } from "react";
import { EmployeeLabels } from "../employee-labels/EmployeeLabels";
import { ModalContentTrainingProgressDate } from "../modal/ModalContentTrainingProgressDate";
import { ModalInfo, OnModalReady } from "../modal/ModalInfo";

interface KBLibraryItemProps {
  checkHttp?: useHttpOutput<any>
  uncheckHttp?: useHttpOutput<any>
  employee?: Employee | undefined
  proposal: TrainingProposal[] | undefined
  library: Library
}

export function KBLibraryItem(props: KBLibraryItemProps) {
  const [modal_plan_date, setModalPlanDate] = useState<OnModalReady>();
  const in_proposal = props.proposal?.map(x => x.library?.id).includes(props.library.id);
  console.log('checked >>> ', props.library.title, in_proposal);

  return (
    <Flex 
      key={props.library.id}
      direction={'column'}>
      <Box 
        w={'100%'}
        h={'1px'}
        bg={'#C4C4C4'} />
      <Flex 
        color={'#202020'}
        pt={'8px'}
        pb={'8px'}
        align={'center'}>
        <Flex 
          flex={3}
          pl={'16px'}
          gap={'5px'}
          align={'center'}>
          <Text>
            { props.library.title }
          </Text>
          <EmployeeLabels labels={props.library.label ? [props.library.label] : []} />
          <Box w={'16px'} />
        </Flex>
        <Text 
          flex={1}>
          { props.library.type }
        </Text>
        <Text 
          flex={1}>
          Terampil
        </Text>
        <Text 
          flex={1}>
          -
        </Text>
        <Flex 
          flex={1}>
          { in_proposal && <Switch 
            isChecked={true}
            disabled={!props.checkHttp || !props.uncheckHttp}
            onChange={async (e) => {
              if (in_proposal && props.uncheckHttp) {
                await props.uncheckHttp.post({}, {
                  params: {
                    id: props.library.id,
                    id_employee: props.employee?.id ?? ''
                  }
                });
                modal_plan_date?.close();
                e.stopPropagation();
                e.preventDefault();
              }
            }} /> }
          { !in_proposal && <ModalInfo
            mdWidth={600}
            title={`Tanggal Training`}
            setOnModalReady={setModalPlanDate}
            trigger={<Switch 
              disabled={!props.checkHttp || !props.uncheckHttp}
              isChecked={false} />}>
            <ModalContentTrainingProgressDate
              initialPrice={props.library.price}
              loading={props.checkHttp?.loading}
              onSubmit={async (date: Date, price: number) => {
                if (!in_proposal && props.checkHttp) {
                  await props.checkHttp.post({
                    date,
                    price
                  }, {
                    params: {
                      id: props.library.id,
                      id_employee: props.employee?.id ?? ''
                    }
                  });
                  modal_plan_date?.close();
                }
              }}
              onCancel={() => modal_plan_date?.close()} />
          </ModalInfo> }
        </Flex>
      </Flex>
    </Flex>
  );
}

export const _KBLibraryItem = memo(
  (props: KBLibraryItemProps) => <KBLibraryItem {...props} />,
  (prev, next) => _.isEqual(_.sortBy(prev.proposal?.map(x => x.id)), _.sortBy(next.proposal?.map(x => x.id)))
);
