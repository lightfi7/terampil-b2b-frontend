
import { useHttpOutput } from "@/hooks/useHttp";
import { Flex, Link, Text } from "@chakra-ui/react";
import { EmployeeKeyResultData } from "data-design/src/entity/EmployeeKeyResultData.entity";
import { KeyResult } from "data-design/src/entity/KeyResult.entity";
import moment from "moment";
import { useEffect } from "react";
import { XTable } from "../table/XTable";

interface ModalContentOKRSubmissionHistoryProps {
  data: KeyResult
  history?: useHttpOutput<EmployeeKeyResultData[]>
}

export function ModalContentOKRSubmissionHistory(props: ModalContentOKRSubmissionHistoryProps) {
  useEffect(() => {
    props.history && props.history.get({
      params: {
        id_key_result: props.data.id
      }
    })
  }, []);

  return (
    <Flex
      direction={'column'}
      gap={'8px'}>
      <XTable
        loading={props.history?.loading}
        data={{
          header: [{
            key: 'date',
            label: 'Date',
            renderValue(data: EmployeeKeyResultData) {
              return moment(data.created_at).format('DD-MM-YYYY');
            }
          }, {
            key: 'status',
            label: 'Status',
            renderValue(data: EmployeeKeyResultData) {
              return data.status;
            }
          }, {
            key: 'progress',
            label: 'Progress',
            renderValue(data: EmployeeKeyResultData) {
              return `${data.value} ${props.data.unit}`;
            }
          }, {
            key: 'file',
            label: 'File',
            renderValue(data: EmployeeKeyResultData) {
              return (
                <Link color={'blue'} textDecor={'underline'} href={data.evidence}>Download</Link>
              );
            }
          }, {
            key: 'feedback',
            label: 'Feedback',
            renderValue(data: EmployeeKeyResultData) {
              return data.feedback;
            }
          }],
          data: props.history?.result ?? []
        }} />
    </Flex>
  );
}
