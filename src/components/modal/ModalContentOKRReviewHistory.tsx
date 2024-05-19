
import { useHttpOutput } from "@/hooks/useHttp";
import { Flex, Link, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { EmployeeKeyResultData, EmployeeKeyResultStatus } from "data-design/src/entity/EmployeeKeyResultData.entity";
import { KeyResult } from "data-design/src/entity/KeyResult.entity";
import moment from "moment";
import { useEffect, useState } from "react";
import { AButton } from "../button/AButton";
import { XTable } from "../table/XTable";
import { ModalContentFeedbackProgressOKR } from "./ModalContentFeedbackProgressOKR";
import { ModalInfo, OnModalReady } from "./ModalInfo";

interface ModalContentOKRReviewHistoryProps {
  employee?: Employee
  data: KeyResult
  history?: useHttpOutput<EmployeeKeyResultData[]>
  review?: useHttpOutput<void>
}

export function ModalContentOKRReviewHistory(props: ModalContentOKRReviewHistoryProps) {
  const [modal_reject, setModalReject] = useState<OnModalReady>();
  const [modal_approve, setModalApprove] = useState<OnModalReady>();

  async function onSubmit(id_key_result_data: number, approve: boolean, feedback?: string) {
    if (!props.review) {
      return;
    }
    await props.review.post({
      approve, feedback
    }, {
      params: {
        id_key_result_data
      }
    });
    if (approve) {
      modal_approve?.close();
    } else {
      modal_reject?.close();
    }
    init();
  }

  function cancel() {
    modal_approve?.close();
    modal_reject?.close();
  }

  function init() {
    props.history && props.history.get({
      params: {
        id_key_result: props.data.id
      }
    })
  }

  useEffect(() => {
    init();
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
                <Link target={'_blank'} color={'blue'} textDecor={'underline'} href={data.evidence}>Download</Link>
              );
            }
          }, {
            key: 'feedback',
            label: 'Feedback',
            renderValue(data: EmployeeKeyResultData) {
              return data.feedback;
            }
          }, {
            key: 'review',
            label: '',
            renderValue(data: EmployeeKeyResultData) {
              return (
                <Flex
                  gap={'8px'}>
                  <ModalInfo
                    mdWidth={600}
                    title={`Reject OKR`}
                    setOnModalReady={setModalReject}
                    trigger={
                      <AButton
                        p={'4px 12px'}
                        variant={'outline'}
                        h={'20px'}
                        borderRadius={999}
                        disabled={data.status !== EmployeeKeyResultStatus.PENDING}>
                        Reject
                      </AButton>
                    }>
                    <ModalContentFeedbackProgressOKR 
                      nama={props.employee?.name ?? ''}
                      type={'reject'}
                      onCancel={cancel}
                      onSubmit={(a, f) => onSubmit(data.id, a, f)} />
                  </ModalInfo>
                  <ModalInfo
                    mdWidth={600}
                    title={`Approve OKR`}
                    setOnModalReady={setModalApprove}
                    trigger={
                      <AButton
                        p={'4px 12px'}
                        h={'20px'}
                        borderRadius={999}
                        disabled={data.status !== EmployeeKeyResultStatus.PENDING}>
                        Approve
                      </AButton>
                    }>
                    <ModalContentFeedbackProgressOKR 
                      nama={props.employee?.name ?? ''}
                      type={'approve'}
                      onCancel={cancel}
                      onSubmit={(a, f) => onSubmit(data.id, a, f)} />
                  </ModalInfo>
                </Flex>
              );
            }
          }],
          data: props.history?.result ?? []
        }} />
    </Flex>
  );
}
